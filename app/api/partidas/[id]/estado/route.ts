import { NextRequest } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { errorResponse, commonErrors, successResponse } from "@/lib/api-response";

type RouteContext = { params: Promise<{ id: string }> };

type EstadoRecebido = {
  status: "aguardando" | "em_andamento" | "pausada" | "finalizada";
  perguntaAtual: number;
  pontos: { equipe1: number; equipe2: number };
  equipeDaVez: "A" | "B";
  tempoRestante: number;
  cronometroFimEm: number | null;
  respostaVisivel: boolean;
  resultado: "correta" | "incorreta" | null;
};

function statusBanco(status: EstadoRecebido["status"]) {
  if (status === "aguardando") return "pronta";
  return status;
}

export async function PATCH(
  request: NextRequest,
  { params }: RouteContext,
) {
  try {
    const session = await auth();
    if (!session?.user) return commonErrors.unauthorized();

    const permissions = session.user.permissions ?? [];
    if (!permissions.includes("jogo.gerenciar") && !permissions.includes("administrador")) {
      return errorResponse("Você não possui permissão para controlar a partida.", 403);
    }

    const { id } = await params;
    if (!id?.trim()) return errorResponse("ID da partida é obrigatório.", 400);

    const body = (await request.json()) as EstadoRecebido;

    if (!Number.isInteger(body.perguntaAtual) || body.perguntaAtual < 1) {
      return errorResponse("Pergunta atual inválida.", 400);
    }

    if (!Number.isInteger(body.tempoRestante) || body.tempoRestante < 0) {
      return errorResponse("Tempo restante inválido.", 400);
    }

    if (!body.pontos || body.pontos.equipe1 < 0 || body.pontos.equipe2 < 0) {
      return errorResponse("Pontuação inválida.", 400);
    }

    const partida = await prisma.partida.findUnique({ where: { id } });
    if (!partida) return errorResponse("Partida não encontrada.", 404);

    const atualizada = await prisma.partida.update({
      where: { id },
      data: {
        status: statusBanco(body.status),
        perguntaAtual: body.perguntaAtual,
        pontuacaoEquipeA: body.pontos.equipe1,
        pontuacaoEquipeB: body.pontos.equipe2,
        equipeDaVez: body.equipeDaVez,
        tempoRestante: body.tempoRestante,
        cronometroFimEm: body.cronometroFimEm
          ? new Date(body.cronometroFimEm)
          : null,
        respostaVisivel: Boolean(body.respostaVisivel),
        resultadoPergunta: body.resultado,
      },
    });

    return successResponse(atualizada, "Estado da partida salvo com sucesso.");
  } catch (error) {
    console.error("Erro ao salvar estado da partida:", error);
    return commonErrors.internalServerError();
  }
}
