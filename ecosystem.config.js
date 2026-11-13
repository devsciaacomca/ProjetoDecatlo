/* eslint-disable @typescript-eslint/no-require-imports -- Arquivo CommonJS executado diretamente pelo Node/PM2. */
// Configuração do PM2 para a aplicação Next.js + WebSocket (Socket.IO).
//
// Uso:
//   pm2 start ecosystem.config.js        -> sobe a aplicação
//   pm2 reload ecosystem.config.js       -> reinicia
//   pm2 logs decatlo                     -> acompanha os logs
//
// A aplicação é iniciada através do script `npm run start:ws`
// (server.js em modo produção). Rode `npm run build` antes do primeiro start.

const path = require("path");

const isWindows = process.platform === "win32";

// No Windows o "npm" é um .cmd e o PM2 não consegue executá-lo diretamente,
// então apontamos para o npm-cli.js que acompanha a instalação do Node.
const npmScript = isWindows
  ? path.join(path.dirname(process.execPath), "node_modules", "npm", "bin", "npm-cli.js")
  : "npm";

module.exports = {
  apps: [
    {
      name: "decatlo",
      cwd: __dirname,
      script: npmScript,
      args: "run start:ws",
      interpreter: isWindows ? "node" : "none",

      // Socket.IO guarda as salas em memória: manter uma única instância
      // para que controle e telão fiquem conectados ao mesmo processo.
      exec_mode: "fork",
      instances: 1,

      autorestart: true,
      watch: false,
      max_memory_restart: "1G",
      restart_delay: 3000,
      kill_timeout: 5000,
      time: true,

      env: {
        NODE_ENV: "production",
        PORT: 3000,
      },
    },
  ],
};
