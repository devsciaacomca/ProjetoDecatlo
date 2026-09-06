import { NextRequest } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { successResponse, errorResponse, commonErrors } from "@/lib/api-response";
import { hasPermission } from "@/lib/permissions";
import { registrarAuditoria } from "@/lib/auditoria";

function embaralhar<T>(items: T[]) {
  const copia = [...items];

  for (let i = copia.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copia[i], copia[j]] = [copia[j], copia[i]];
  }

  return copia;
}

export async function GET(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user) return commonErrors.unauthorized();

    if (!hasPermission(session, "jogo.configurar") &&
        !hasPermission(session, "jogo.gerenciar")) {
      return errorResponse("Você não tem permissão para consultar partidas.", 403);
    }

    const url = new URL(request.url);
    const status = url.searchParams.get("status");

    const partidas = await prisma.partida.findMany({
      where: status ? { status } : undefined,
      include: {
        perguntasSelecionadas: {
          orderBy: { ordem: "asc" },
          include: {
            pergunta: {
              include: { alternativas: true },
            },
          },
        },
      },
      orderBy: { data: "desc" },
    });

    return successResponse(partidas, "Partidas carregadas com sucesso.");
  } catch (error) {
    console.error("Erro ao buscar partidas:", error);
    return commonErrors.internalServerError();
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user) return commonErrors.unauthorized();

    if (!hasPermission(session, "jogo.configurar")) {
      return errorResponse("Você não tem permissão para criar partidas.", 403);
    }

    const body = await request.json();

    const nome = String(body?.nome ?? "").trim();
    const equipe1 = String(body?.equipe1 ?? "").trim();
    const equipe2 = String(body?.equipe2 ?? "").trim();
    const totalPerguntas = Number(body?.perguntas);
    const tempoResposta = Number(body?.tempoResposta ?? 30);
    const embaralharPerguntas = Boolean(body?.embaralharPerguntas ?? false);
    const mostrarExplicacao = Boolean(body?.mostrarExplicacao ?? true);
    const permitirPular = Boolean(body?.permitirPular ?? true);
    const perguntaIds = Array.isArray(body?.perguntaIds)
      ? body.perguntaIds.map(Number).filter(Number.isInteger)
      : [];

    if (!nome || !equipe1 || !equipe2) {
      return errorResponse("Nome e equipes são obrigatórios.", 400);
    }

    if (!Number.isInteger(totalPerguntas) || totalPerguntas < 1) {
      return errorResponse("A quantidade de perguntas deve ser um inteiro maior que zero.", 400);
    }

    if (!Number.isInteger(tempoResposta) || tempoResposta < 5) {
      return errorResponse("O tempo de resposta deve ser um inteiro de pelo menos 5 segundos.", 400);
    }

    if (equipe1 === equipe2) {
      return errorResponse("As equipes da partida devem ser diferentes.", 400);
    }

    let selecionadas: number[] = perguntaIds;

    if (selecionadas.length === 0) {
      const disponiveis = await prisma.pergunta.findMany({
        where: body?.tipoPergunta
          ? { tipo: String(body.tipoPergunta) }
          : undefined,
        select: { id: true },
      });

      if (disponiveis.length < totalPerguntas) {
        return errorResponse(
          `Não existem perguntas suficientes no banco. Disponíveis: ${disponiveis.length}. Necessárias: ${totalPerguntas}.`,
          400,
        );
      }

      selecionadas = disponiveis.slice(0, totalPerguntas).map((item) => item.id);
    }

    selecionadas = [...new Set(selecionadas)];

    if (selecionadas.length !== totalPerguntas) {
      return errorResponse(
        `A partida precisa ter exatamente ${totalPerguntas} perguntas selecionadas.`,
        400,
      );
    }

    const existentes = await prisma.pergunta.findMany({
      where: { id: { in: selecionadas } },
      select: { id: true },
    });

    if (existentes.length !== selecionadas.length) {
      return errorResponse("Uma ou mais perguntas selecionadas não existem.", 400);
    }

    if (embaralharPerguntas) {
      selecionadas = embaralhar(selecionadas);
    }

    const novaPartida = await prisma.partida.create({
      data: {
        nome,
        equipe1,
        equipe2,
        status: "configuracao",
        perguntas: selecionadas.length,
        perguntaAtual: 0,
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
          create: selecionadas.map((perguntaId, index) => ({
            perguntaId,
            ordem: index + 1,
          })),
        },
      },
      include: {
        perguntasSelecionadas: {
          orderBy: { ordem: "asc" },
          include: {
            pergunta: {
              include: { alternativas: true },
            },
          },
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
        equipe1,
        equipe2,
        perguntas: selecionadas.length,
        tempoResposta,
        embaralharPerguntas,
        mostrarExplicacao,
        permitirPular,
      },
    });

    return successResponse(novaPartida, "Partida criada com sucesso.", 201);
  } catch (error) {
    console.error("Erro ao criar partida:", error);
    return commonErrors.internalServerError();
  }
}
