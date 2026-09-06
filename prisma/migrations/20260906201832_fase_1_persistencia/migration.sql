/*
  Warnings:

  - Added the required column `atualizadaEm` to the `Partida` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Partida" ADD COLUMN     "atualizadaEm" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "cronometroFimEm" TIMESTAMP(3),
ADD COLUMN     "embaralharPerguntas" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "equipeDaVez" TEXT NOT NULL DEFAULT 'A',
ADD COLUMN     "mostrarExplicacao" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "permitirPular" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "respostaVisivel" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "resultadoPergunta" TEXT,
ADD COLUMN     "tempoResposta" INTEGER NOT NULL DEFAULT 30,
ADD COLUMN     "tempoRestante" INTEGER NOT NULL DEFAULT 30,
ALTER COLUMN "perguntaAtual" SET DEFAULT 0;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "ativo" BOOLEAN NOT NULL DEFAULT true;

-- CreateTable
CREATE TABLE "PartidaPergunta" (
    "partidaId" TEXT NOT NULL,
    "perguntaId" INTEGER NOT NULL,
    "ordem" INTEGER NOT NULL,

    CONSTRAINT "PartidaPergunta_pkey" PRIMARY KEY ("partidaId","perguntaId")
);

-- CreateTable
CREATE TABLE "PartidaResposta" (
    "id" SERIAL NOT NULL,
    "partidaId" TEXT NOT NULL,
    "perguntaId" INTEGER NOT NULL,
    "equipe" TEXT NOT NULL,
    "resultado" TEXT NOT NULL,
    "resposta" TEXT,
    "pontos" INTEGER NOT NULL DEFAULT 0,
    "respondidaEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PartidaResposta_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AuditLog" (
    "id" SERIAL NOT NULL,
    "usuarioId" INTEGER,
    "acao" TEXT NOT NULL,
    "entidade" TEXT NOT NULL,
    "entidadeId" TEXT,
    "descricao" TEXT NOT NULL,
    "detalhes" TEXT,
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AuditLog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "PartidaPergunta_perguntaId_idx" ON "PartidaPergunta"("perguntaId");

-- CreateIndex
CREATE UNIQUE INDEX "PartidaPergunta_partidaId_ordem_key" ON "PartidaPergunta"("partidaId", "ordem");

-- CreateIndex
CREATE INDEX "PartidaResposta_partidaId_idx" ON "PartidaResposta"("partidaId");

-- CreateIndex
CREATE INDEX "PartidaResposta_perguntaId_idx" ON "PartidaResposta"("perguntaId");

-- CreateIndex
CREATE UNIQUE INDEX "PartidaResposta_partidaId_perguntaId_key" ON "PartidaResposta"("partidaId", "perguntaId");

-- CreateIndex
CREATE INDEX "AuditLog_usuarioId_idx" ON "AuditLog"("usuarioId");

-- CreateIndex
CREATE INDEX "AuditLog_acao_idx" ON "AuditLog"("acao");

-- CreateIndex
CREATE INDEX "AuditLog_entidade_idx" ON "AuditLog"("entidade");

-- CreateIndex
CREATE INDEX "AuditLog_criadoEm_idx" ON "AuditLog"("criadoEm");

-- CreateIndex
CREATE INDEX "Partida_status_idx" ON "Partida"("status");

-- CreateIndex
CREATE INDEX "Partida_data_idx" ON "Partida"("data");

-- CreateIndex
CREATE INDEX "Pergunta_assunto_idx" ON "Pergunta"("assunto");

-- CreateIndex
CREATE INDEX "Pergunta_tipo_idx" ON "Pergunta"("tipo");

-- CreateIndex
CREATE INDEX "User_ativo_idx" ON "User"("ativo");

-- AddForeignKey
ALTER TABLE "PartidaPergunta" ADD CONSTRAINT "PartidaPergunta_partidaId_fkey" FOREIGN KEY ("partidaId") REFERENCES "Partida"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PartidaPergunta" ADD CONSTRAINT "PartidaPergunta_perguntaId_fkey" FOREIGN KEY ("perguntaId") REFERENCES "Pergunta"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PartidaResposta" ADD CONSTRAINT "PartidaResposta_partidaId_fkey" FOREIGN KEY ("partidaId") REFERENCES "Partida"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PartidaResposta" ADD CONSTRAINT "PartidaResposta_perguntaId_fkey" FOREIGN KEY ("perguntaId") REFERENCES "Pergunta"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AuditLog" ADD CONSTRAINT "AuditLog_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
