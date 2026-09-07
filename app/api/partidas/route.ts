import { NextRequest } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import {
  successResponse,
  errorResponse,
  commonErrors,
} from "@/lib/api-response";
import { registrarAuditoria } from "@/lib/auditoria";

function embaralhar<T>(itens: T[]) {
  const copia = [...itens];

  for (let i = copia.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copia[i], copia[j]] = [copia[j], copia[i]];
  }

  return copia;
}

export async function GET(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user) {
      return commonErrors.unauthorized();
    }

    const url = new URL(request.url);
    const status = url.searchParams.get("status");

    const partidas = await prisma.partida.findMany({
      where: status ? { status } : undefined,
      include: {
        perguntasSelecionadas: {
          orderBy: { ordem: "asc" },
          select: {
            ordem: true,
            perguntaId: true,
          },
        },
      },
      orderBy: { data: "desc" },
    });

    return successResponse(partidas, "Partidas carregadas com sucesso");
  } catch (error) {
    console.error("Erro ao buscar partidas:", error);
    return commonErrors.internalServerError();
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user) {
      return commonErrors.unauthorized();
    }

    const body = await request.json();

    const nome = String(body.nome ?? "").trim();
    const equipe1 = String(body.equipe1 ?? "").trim();
    const equipe2 = String(body.equipe2 ?? "").trim();
    const tipo = String(body.tipoPergunta ?? "objetiva");
    const totalPerguntas = Number(body.totalPerguntas);
    const tempoResposta = Number(body.tempoResposta);
    const embaralharPerguntas = Boolean(body.embaralharPerguntas);
    const mostrarExplicacao = Boolean(body.mostrarExplicacao);
    const permitirPular = Boolean(body.permitirPular);
    const assuntos = Array.isArray(body.assuntos)
      ? body.assuntos.filter(
          (item: unknown): item is string => typeof item === "string",
        )
      : [];

    if (!nome || !equipe1 || !equipe2) {
      return errorResponse("Nome e equipes são obrigatórios.", 400);
    }

    if (equipe1 === equipe2) {
      return errorResponse("As equipes da partida devem ser diferentes.", 400);
    }

    if (!Number.isInteger(totalPerguntas) || totalPerguntas < 1) {
      return errorResponse(
        "A quantidade de perguntas deve ser maior que zero.",
        400,
      );
    }

    if (!Number.isInteger(tempoResposta) || tempoResposta < 5) {
      return errorResponse(
        "O tempo de resposta deve ser de pelo menos 5 segundos.",
        400,
      );
    }

    if (tipo !== "objetiva" && tipo !== "aberta") {
      return errorResponse("Tipo de pergunta inválido.", 400);
    }

    if (assuntos.length === 0) {
      return errorResponse("Selecione pelo menos um assunto.", 400);
    }

    const perguntasDisponiveis = await prisma.pergunta.findMany({
      where: {
        tipo,
        assunto: {
          in: assuntos,
        },
      },
      select: {
        id: true,
      },
    });

    if (perguntasDisponiveis.length < totalPerguntas) {
      return errorResponse(
        `Não existem perguntas suficientes para esta configuração. Disponíveis: ${perguntasDisponiveis.length}. Necessárias: ${totalPerguntas}.`,
        400,
      );
    }

    const selecionadas = embaralhar(perguntasDisponiveis)
      .slice(0, totalPerguntas)
      .map((pergunta, index) => ({
        perguntaId: pergunta.id,
        ordem: index + 1,
      }));

    const novaPartida = await prisma.partida.create({
      data: {
        nome,
        equipe1,
        equipe2,
        status: "pronta",
        perguntas: totalPerguntas,
        perguntaAtual: 1,
        pontuacaoEquipeA: 0,
        pontuacaoEquipeB: 0,
        tempoResposta,
        embaralharPerguntas,
        mostrarExplicacao,
        permitirPular,
        equipeDaVez: "A",
        tempoRestante: tempoResposta,
        respostaVisivel: false,
        data: new Date(),
        perguntasSelecionadas: {
          create: selecionadas,
        },
      },
      include: {
        perguntasSelecionadas: {
          orderBy: { ordem: "asc" },
        },
      },
    });
    await registrarAuditoria({
      session,
      acao: "CRIACAO_PARTIDA",
      entidade: "Partida",
      entidadeId: novaPartida.id,
      descricao: `Criou a partida "${novaPartida.nome}".`,
      detalhes: {
        nome: novaPartida.nome,
        equipe1: novaPartida.equipe1,
        equipe2: novaPartida.equipe2,
        perguntas: novaPartida.perguntas,
        tempoResposta: novaPartida.tempoResposta,
      },
    });
    return successResponse(
      novaPartida,
      "Partida criada com perguntas selecionadas do banco.",
      201,
    );
  } catch (error) {
    console.error("Erro ao criar partida:", error);
    return commonErrors.internalServerError();
  }
}
