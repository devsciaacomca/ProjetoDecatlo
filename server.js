const { createServer } = require("http");
const { parse } = require("url");
const next = require("next");
const { Server } = require("socket.io");

const { setupQuizMachine } = require("./lib/quiz-machine-backend");

const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = createServer((req, res) => {
    const parsedUrl = parse(req.url, true);
    handle(req, res, parsedUrl);
  });

  const io = new Server(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });

  // Configura a Máquina de Quiz (Hardware Serial + Simulador Virtual)
  setupQuizMachine(io);

  io.on("connection", (socket) => {
    console.log("Novo cliente conectado:", socket.id);
    // Cliente (Controle ou Telão) entra na sala específica daquela partida
    socket.on("join-game", (partidaId) => {
      socket.join(`game-${partidaId}`);
      console.log(`Cliente ${socket.id} entrou na partida: ${partidaId}`);
    });
    // Quando o controle ou telão envia ação ou solicitação de estado
    socket.on("sync-game-state", ({ partidaId, message }) => {
      if (partidaId) {
        socket.to(`game-${partidaId}`).emit("game-state-updated", message);
      } else {
        socket.broadcast.emit("game-state-updated", message);
      }
    });
    socket.on("disconnect", () => {
      console.log("Cliente desconectado:", socket.id);
    });
  });

  const PORT = process.env.PORT || 3000;
  server.listen(PORT, (err) => {
    if (err) throw err;
    console.log(`> Servidor pronto em http://localhost:${PORT}`);
    console.log(`> Máquina de Quiz pronta (Hardware & Simulação Virtual ativa)`);
  });
});
