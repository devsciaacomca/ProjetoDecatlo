const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const { SerialPort, ReadlineParser } = require('serialport');
const cors = require('cors');

const app = express();
app.use(cors()); // Permite que o seu site faça a conexão

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*", // Permite conexões de qualquer origem (seu HTML local)
    methods: ["GET", "POST"]
  }
});

// ============================================
// CONFIGURAÇÃO DA PORTA SERIAL (AJUSTE AQUI!)
// No Ubuntu, costuma ser '/dev/ttyUSB0' ou '/dev/ttyACM0'
// Se der problema no Ubuntu, rode "ls /dev/tty*" no terminal para ver qual é.
// ============================================
const PORTA_SERIAL_NOME = '/dev/ttyACM0'; 
const BAUD_RATE = 9600;

let port;
try {
    port = new SerialPort({ path: PORTA_SERIAL_NOME, baudRate: BAUD_RATE });
    const parser = port.pipe(new ReadlineParser({ delimiter: '\r\n' }));

    console.log(`Tentando conectar ao Arduino na porta: ${PORTA_SERIAL_NOME}`);

    port.on('open', () => {
        console.log(`Conexão Serial aberta com sucesso na porta ${PORTA_SERIAL_NOME}!`);
    });

    port.on('error', function(err) {
        console.error('\n[ERRO NA PORTA SERIAL]:', err.message);
        console.error('=> DICA PARA UBUNTU: Se for um erro de "Access Denied" (Permissão negada), você precisa adicionar seu usuário ao grupo dialout.');
        console.error('=> Execute no terminal: sudo usermod -a -G dialout $USER');
        console.error('=> Depois, feche a sessão (faça logout) e entre novamente no Ubuntu para aplicar a permissão.\n');
    });

    // Quando o Arduino enviar uma mensagem
    parser.on('data', (data) => {
        const mensagem = data.trim();
        console.log(`[Arduino] -> ${mensagem}`);
        
        // Repassa a mensagem via WebSocket para o Site
        if(mensagem === 'P1' || mensagem === 'P2') {
            io.emit('botaoApertado', { jogador: mensagem });
        } else if (mensagem === 'RESETADO') {
            io.emit('resetado', true);
        }
    });

} catch (e) {
    console.error("Não foi possível inicializar a porta serial:", e);
}


// Quando o Site conectar no servidor Node.js
io.on('connection', (socket) => {
  console.log('Site (Frontend) conectado via WebSocket! ID:', socket.id);

  // Escuta comandos vindos do site (ex: botão de Reset virtual na tela)
  socket.on('comandoPC', (comando) => {
      console.log(`Comando recebido do Site: ${comando}`);
      if (comando === 'RESET' && port && port.isOpen) {
          port.write('R'); // Envia o caractere 'R' para o Arduino resetar
          console.log("Comando de Reset enviado para o Arduino.");
      }
  });

  socket.on('disconnect', () => {
    console.log('Site (Frontend) desconectou.');
  });
});

const PORT = 3000;
server.listen(PORT, () => {
  console.log(`\n=================================================`);
  console.log(`Servidor rodando em http://localhost:${PORT}`);
  console.log(`Abra o seu site para que ele possa se conectar.`);
  console.log(`=================================================\n`);
});
