// @ts-check
const { EventEmitter } = require("events");

let SerialPort = null;
let ReadlineParser = null;

try {
  const serialModule = require("serialport");
  SerialPort = serialModule.SerialPort;
  ReadlineParser = serialModule.ReadlineParser;
} catch (e) {
  console.log(
    "[QuizMachine] Módulo serialport não encontrado. Operando exclusivamente em modo simulação virtual."
  );
}

class QuizMachineManager extends EventEmitter {
  constructor() {
    super();
    this.port = null;
    this.parser = null;
    this.locked = false;
    this.activePlayer = null;
    this.lastWinner = null;
    this.lastTimestamp = null;
    this.currentPortName = null;
    this.baudRate = 9600;
    this.io = null;

    // Tentar auto-conectar caso porta esteja em variável de ambiente ou detectar automaticamente
    const defaultPort = process.env.QUIZ_SERIAL_PORT;
    if (defaultPort) {
      this.connect(defaultPort).catch(() => {});
    }
  }

  setIO(io) {
    this.io = io;
  }

  getStatus() {
    return {
      connected: Boolean(this.port && this.port.isOpen),
      port: this.currentPortName,
      locked: this.locked,
      activePlayer: this.activePlayer,
      lastWinner: this.lastWinner,
      lastTimestamp: this.lastTimestamp,
      hasSerialSupport: Boolean(SerialPort),
    };
  }

  async listPorts() {
    if (!SerialPort) {
      return [];
    }
    try {
      const ports = await SerialPort.list();
      return ports.map((p) => ({
        path: p.path,
        manufacturer: p.manufacturer || "Desconhecido",
        friendlyName: p.friendlyName || p.path,
        vendorId: p.vendorId,
        productId: p.productId,
      }));
    } catch (err) {
      console.error("[QuizMachine] Erro ao listar portas seriais:", err);
      return [];
    }
  }

  async connect(path, baudRate = 9600) {
    if (!SerialPort) {
      throw new Error("Suporte a porta serial não está instalado neste sistema.");
    }

    if (this.port && this.port.isOpen) {
      await this.disconnect();
    }

    this.baudRate = baudRate;
    this.currentPortName = path;

    return new Promise((resolve, reject) => {
      try {
        console.log(`[QuizMachine] Conectando à porta serial: ${path} (${baudRate} baud)...`);
        this.port = new SerialPort({ path, baudRate: this.baudRate });
        this.parser = this.port.pipe(new ReadlineParser({ delimiter: "\r\n" }));

        this.port.on("open", () => {
          console.log(`[QuizMachine] Porta serial ${path} aberta com sucesso!`);
          this.broadcastStatus();
          resolve(this.getStatus());
        });

        this.port.on("error", (err) => {
          console.error(`[QuizMachine] Erro na porta serial ${path}:`, err.message);
          this.broadcastStatus();
          reject(err);
        });

        this.port.on("close", () => {
          console.log(`[QuizMachine] Conexão com ${path} encerrada.`);
          this.port = null;
          this.parser = null;
          this.currentPortName = null;
          this.broadcastStatus();
        });

        this.parser.on("data", (data) => {
          const raw = data.toString().trim();
          console.log(`[QuizMachine Arduino] -> ${raw}`);
          this.handleArduinoMessage(raw);
        });
      } catch (err) {
        reject(err);
      }
    });
  }

  async disconnect() {
    if (this.port && this.port.isOpen) {
      return new Promise((resolve) => {
        this.port.close(() => {
          this.port = null;
          this.parser = null;
          this.currentPortName = null;
          this.broadcastStatus();
          resolve();
        });
      });
    }
    this.port = null;
    this.currentPortName = null;
    this.broadcastStatus();
  }

  handleArduinoMessage(msg) {
    if (msg === "P1" || msg === "P2") {
      this.triggerBuzzer(msg, "hardware");
    } else if (msg === "RESETADO") {
      this.triggerReset("hardware");
    } else if (msg === "SISTEMA_PRONTO") {
      console.log("[QuizMachine] Arduino confirmou inicialização (SISTEMA_PRONTO).");
      this.broadcastStatus();
    }
  }

  triggerBuzzer(jogador, origem = "virtual", partidaId = null) {
    if (this.locked) {
      console.log(`[QuizMachine] Ignorando clique de ${jogador} pois a máquina já está travada.`);
      return { success: false, reason: "locked" };
    }

    this.locked = true;
    this.activePlayer = jogador;
    this.lastWinner = jogador;
    this.lastTimestamp = Date.now();
    const equipe = jogador === "P1" ? "A" : "B";

    console.log(
      `[QuizMachine] 🔔 BUZZER ACIONADO! Jogador: ${jogador} (Equipe ${equipe}) | Origem: ${origem}`
    );

    // Eventos enviados via Socket.IO
    if (this.io) {
      // 1. Compatibilidade com a documentação em integracao_site.md
      this.io.emit("botaoApertado", { jogador, equipe, timestamp: this.lastTimestamp });

      // 2. Evento específico da Máquina de Quiz para o simulador e telão
      this.io.emit("quiz-machine:buzzer", {
        jogador,
        equipe,
        origem,
        timestamp: this.lastTimestamp,
      });

      // 3. Atualização direta do estado da partida no GameContext
      const actionMessage = {
        type: "ACTION",
        action: {
          type: "BUZZER_PRESS",
          jogador,
          equipe,
          timestamp: this.lastTimestamp,
        },
      };

      if (partidaId) {
        this.io.to(`game-${partidaId}`).emit("game-state-updated", actionMessage);
      } else {
        // Envia para todas as salas ativas de jogos
        this.io.emit("game-state-updated", actionMessage);
      }

      this.broadcastStatus();
    }

    this.emit("buzzer", { jogador, equipe, timestamp: this.lastTimestamp, origem });
    return { success: true, jogador, equipe, timestamp: this.lastTimestamp };
  }

  triggerReset(origem = "virtual", partidaId = null) {
    console.log(`[QuizMachine] 🔄 Resetando máquina de quiz (Origem: ${origem})...`);

    // Enviar comando para o Arduino físico se estiver conectado
    if (this.port && this.port.isOpen) {
      try {
        this.port.write("R\n");
        console.log("[QuizMachine] Comando 'R' enviado para o Arduino via Serial.");
      } catch (err) {
        console.error("[QuizMachine] Erro ao enviar 'R' para o Arduino:", err.message);
      }
    }

    this.locked = false;
    this.activePlayer = null;

    if (this.io) {
      // 1. Compatibilidade legado com integracao_site.md
      this.io.emit("resetado", true);

      // 2. Evento padronizado da Máquina de Quiz
      this.io.emit("quiz-machine:reset", {
        origem,
        timestamp: Date.now(),
      });

      // 3. Ação para limpar o buzzer no GameContext
      const resetActionMessage = {
        type: "ACTION",
        action: {
          type: "BUZZER_RESET",
        },
      };

      if (partidaId) {
        this.io.to(`game-${partidaId}`).emit("game-state-updated", resetActionMessage);
      } else {
        this.io.emit("game-state-updated", resetActionMessage);
      }

      this.broadcastStatus();
    }

    this.emit("reset", { origem, timestamp: Date.now() });
    return { success: true };
  }

  broadcastStatus() {
    if (this.io) {
      this.io.emit("quiz-machine:status", this.getStatus());
    }
  }
}

if (!global.__quizMachineInstance) {
  global.__quizMachineInstance = new QuizMachineManager();
}
const quizMachine = global.__quizMachineInstance;

function setupQuizMachine(io) {
  quizMachine.setIO(io);

  io.on("connection", (socket) => {
    // Envia status atual ao novo cliente conectado
    socket.emit("quiz-machine:status", quizMachine.getStatus());

    // Solicitação de status sob demanda
    socket.on("quiz-machine:get-status", (callback) => {
      const status = quizMachine.getStatus();
      if (typeof callback === "function") callback(status);
    });

    // Listagem de portas seriais
    socket.on("quiz-machine:list-ports", async (callback) => {
      const ports = await quizMachine.listPorts();
      if (typeof callback === "function") callback(ports);
    });

    // Conectar a uma porta serial
    socket.on("quiz-machine:connect-port", async ({ port, baudRate }, callback) => {
      try {
        const status = await quizMachine.connect(port, baudRate || 9600);
        if (typeof callback === "function") callback({ success: true, status });
      } catch (err) {
        if (typeof callback === "function") {
          callback({ success: false, error: err.message });
        }
      }
    });

    // Desconectar porta serial
    socket.on("quiz-machine:disconnect-port", async (callback) => {
      try {
        await quizMachine.disconnect();
        if (typeof callback === "function") callback({ success: true });
      } catch (err) {
        if (typeof callback === "function") callback({ success: false, error: err.message });
      }
    });

    // Simular clique de botão (P1 ou P2)
    socket.on("quiz-machine:simulate-press", ({ jogador, partidaId }, callback) => {
      const result = quizMachine.triggerBuzzer(jogador, "simulador", partidaId);
      if (typeof callback === "function") callback(result);
    });

    // Resetar máquina
    socket.on("quiz-machine:reset", ({ partidaId }, callback) => {
      const result = quizMachine.triggerReset("simulador", partidaId);
      if (typeof callback === "function") callback(result);
    });

    // Compatibilidade com 'comandoPC' citado no integracao_site.md
    socket.on("comandoPC", (cmd) => {
      if (cmd === "RESET") {
        quizMachine.triggerReset("comandoPC");
      }
    });
  });

  return quizMachine;
}

module.exports = {
  quizMachine,
  setupQuizMachine,
};
