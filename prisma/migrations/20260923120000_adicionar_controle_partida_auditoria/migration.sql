ALTER TABLE "User"
ADD COLUMN "ativo" BOOLEAN NOT NULL DEFAULT true;

CREATE INDEX "User_ativo_idx" ON "User"("ativo");

ALTER TABLE "Partida"
ADD COLUMN "atualizadaEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN "cronometroFimEm" TIMESTAMP(3),
ADD COLUMN "embaralharPerguntas" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN "equipeDaVez" TEXT NOT NULL DEFAULT 'A',
ADD COLUMN "mostrarExplicacao" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN "permitirPular" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN "respostaVisivel" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN "resultadoPergunta" TEXT,
ADD COLUMN "tempoResposta" INTEGER NOT NULL DEFAULT 30,
ADD COLUMN "tempoRestante" INTEGER NOT NULL DEFAULT 30;

ALTER TABLE "Partida"
ALTER COLUMN "perguntaAtual" SET DEFAULT 0;

CREATE INDEX "Partida_status_idx" ON "Partida"("status");

CREATE INDEX "Partida_data_idx" ON "Partida"("data");

CREATE TABLE "PartidaPergunta" (
    "partidaId" TEXT NOT NULL,
    "perguntaId" INTEGER NOT NULL,
    "ordem" INTEGER NOT NULL,

    CONSTRAINT "PartidaPergunta_pkey"
        PRIMARY KEY ("partidaId", "perguntaId")
);

CREATE INDEX "PartidaPergunta_perguntaId_idx"
ON "PartidaPergunta"("perguntaId");

CREATE UNIQUE INDEX "PartidaPergunta_partidaId_ordem_key"
ON "PartidaPergunta"("partidaId", "ordem");

CREATE TABLE "PartidaResposta" (
    "id" SERIAL NOT NULL,
    "partidaId" TEXT NOT NULL,
    "perguntaId" INTEGER NOT NULL,
    "equipe" TEXT NOT NULL,
    "resultado" TEXT NOT NULL,
    "resposta" TEXT,
    "pontos" INTEGER NOT NULL DEFAULT 0,
    "respondidaEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PartidaResposta_pkey"
        PRIMARY KEY ("id")
);

CREATE INDEX "PartidaResposta_partidaId_idx"
ON "PartidaResposta"("partidaId");

CREATE INDEX "PartidaResposta_perguntaId_idx"
ON "PartidaResposta"("perguntaId");

CREATE UNIQUE INDEX "PartidaResposta_partidaId_perguntaId_key"
ON "PartidaResposta"("partidaId", "perguntaId");

CREATE TABLE "AuditLog" (
    "id" SERIAL NOT NULL,
    "usuarioId" INTEGER,
    "acao" TEXT NOT NULL,
    "entidade" TEXT NOT NULL,
    "entidadeId" TEXT,
    "descricao" TEXT NOT NULL,
    "detalhes" TEXT,
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AuditLog_pkey"
        PRIMARY KEY ("id")
);

CREATE INDEX "AuditLog_usuarioId_idx"
ON "AuditLog"("usuarioId");

CREATE INDEX "AuditLog_acao_idx"
ON "AuditLog"("acao");

CREATE INDEX "AuditLog_entidade_idx"
ON "AuditLog"("entidade");

CREATE INDEX "AuditLog_criadoEm_idx"
ON "AuditLog"("criadoEm");

ALTER TABLE "PartidaPergunta"
ADD CONSTRAINT "PartidaPergunta_partidaId_fkey"
FOREIGN KEY ("partidaId")
REFERENCES "Partida"("id")
ON DELETE CASCADE
ON UPDATE CASCADE;

ALTER TABLE "PartidaPergunta"
ADD CONSTRAINT "PartidaPergunta_perguntaId_fkey"
FOREIGN KEY ("perguntaId")
REFERENCES "Pergunta"("id")
ON DELETE RESTRICT
ON UPDATE CASCADE;

ALTER TABLE "PartidaResposta"
ADD CONSTRAINT "PartidaResposta_partidaId_fkey"
FOREIGN KEY ("partidaId")
REFERENCES "Partida"("id")
ON DELETE CASCADE
ON UPDATE CASCADE;

ALTER TABLE "PartidaResposta"
ADD CONSTRAINT "PartidaResposta_perguntaId_fkey"
FOREIGN KEY ("perguntaId")
REFERENCES "Pergunta"("id")
ON DELETE RESTRICT
ON UPDATE CASCADE;

ALTER TABLE "AuditLog"
ADD CONSTRAINT "AuditLog_usuarioId_fkey"
FOREIGN KEY ("usuarioId")
REFERENCES "User"("id")
ON DELETE SET NULL
ON UPDATE CASCADE;