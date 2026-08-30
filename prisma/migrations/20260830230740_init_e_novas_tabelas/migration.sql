-- DropIndex
DROP INDEX "RolePermission_permissionId_idx";

-- CreateTable
CREATE TABLE "Pergunta" (
    "id" SERIAL NOT NULL,
    "assunto" TEXT NOT NULL,
    "tipo" TEXT NOT NULL,
    "enunciado" TEXT NOT NULL,
    "respostaCorreta" TEXT NOT NULL,
    "explicacao" TEXT NOT NULL,
    "criadaEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Pergunta_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Alternativa" (
    "id" SERIAL NOT NULL,
    "texto" TEXT NOT NULL,
    "perguntaId" INTEGER NOT NULL,

    CONSTRAINT "Alternativa_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Partida" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "equipe1" TEXT NOT NULL,
    "equipe2" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "perguntas" INTEGER NOT NULL,
    "perguntaAtual" INTEGER NOT NULL,
    "pontuacaoEquipeA" INTEGER NOT NULL DEFAULT 0,
    "pontuacaoEquipeB" INTEGER NOT NULL DEFAULT 0,
    "data" TIMESTAMP(3) NOT NULL,
    "criadaEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Partida_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Alternativa" ADD CONSTRAINT "Alternativa_perguntaId_fkey" FOREIGN KEY ("perguntaId") REFERENCES "Pergunta"("id") ON DELETE CASCADE ON UPDATE CASCADE;
