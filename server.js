const { createServer } = require("http");
const { parse } = require("url");
const next = require("next");
const { Server } = require("socket.io");

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

  // Configuração básica do WebSocket
  io.on("connection", (socket) => {
    console.log("Novo cliente conectado:", socket.id);

    // Quando o controle envia uma atualização, retransmite para o telão
    socket.on("sync-game-state", (gameState) => {
      // Faz o broadcast para todos os outros clientes conectados (ex: o telão)
      socket.broadcast.emit("game-state-updated", gameState);
    });

    socket.on("disconnect", () => {
      console.log("Cliente desconectado:", socket.id);
    });
  });

  const PORT = process.env.PORT || 3000;
  server.listen(PORT, (err) => {
    if (err) throw err;
    console.log(`> Servidor pronto em http://localhost:${PORT}`);
  });
});
