/* eslint-disable @typescript-eslint/no-require-imports -- Arquivo CommonJS executado diretamente pelo Node/PM2. */
// Script de deploy: `npm run deploy`
//
// 1. Instala as dependências (inclui devDependencies, necessárias para o build)
// 2. Executa as migrations do Prisma
// 3. Gera o build de produção do Next.js
// 4. Inicia/reinicia o serviço no PM2 usando o ecosystem.config.js
//
// As variáveis de ambiente (ex.: DATABASE_URL) devem estar configuradas
// na máquina (arquivo .env local ou variáveis do sistema).

const { execSync } = require("child_process");
const path = require("path");

const root = path.resolve(__dirname, "..");

function run(label, command) {
  console.log(`\n=== ${label} ===`);
  console.log(`> ${command}\n`);
  execSync(command, { cwd: root, stdio: "inherit" });
}

function hasGlobalPm2() {
  try {
    execSync("pm2 -v", { cwd: root, stdio: "ignore" });
    return true;
  } catch {
    return false;
  }
}

const startedAt = Date.now();

try {
  run("1/4 Instalando dependências", "npm ci --include=dev");
  run("2/4 Executando migrations", "npm run db:migrate");
  run("3/4 Gerando build", "npm run build");

  const pm2 = hasGlobalPm2() ? "pm2" : "npx --yes pm2";
  run(
    "4/4 Reiniciando serviço no PM2",
    `${pm2} startOrReload ecosystem.config.js --update-env`
  );
  run("Salvando lista de processos do PM2", `${pm2} save`);

  const seconds = ((Date.now() - startedAt) / 1000).toFixed(1);
  console.log(`\nDeploy concluído com sucesso em ${seconds}s.`);
} catch (error) {
  console.error("\nDeploy falhou. Verifique o erro acima.");
  process.exit(typeof error.status === "number" ? error.status : 1);
}
