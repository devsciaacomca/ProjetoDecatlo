import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { successResponse, errorResponse } from "@/lib/api-response";

export async function GET() {
  try {
    const session = await auth();

    if (!session?.user) {
      return errorResponse("Não autorizado.", 401);
    }

    const [
      totalPerguntas,
      totalPartidas,
      partidasEmAndamento,
      partidasFinalizadas,
      totalUsuarios,
      ultimaPartida,
      partidaEmAndamento,
    ] = await Promise.all([
      prisma.pergunta.count(),
      prisma.partida.count(),
      prisma.partida.count({ where: { status: "em_andamento" } }),
      prisma.partida.count({ where: { status: "finalizada" } }),
      prisma.user.count({ where: { ativo: true } }),
      prisma.partida.findFirst({
        orderBy: { data: "desc" },
        select: {
          id: true,
          nome: true,
          equipe1: true,
          equipe2: true,
          status: true,
          perguntaAtual: true,
          perguntas: true,
          data: true,
        },
      }),
      prisma.partida.findFirst({
        where: { status: "em_andamento" },
        orderBy: { atualizadaEm: "desc" },
        select: {
          id: true,
          nome: true,
          equipe1: true,
          equipe2: true,
          status: true,
          perguntaAtual: true,
          perguntas: true,
          pontuacaoEquipeA: true,
          pontuacaoEquipeB: true,
          tempoRestante: true,
          equipeDaVez: true,
          data: true,
        },
      }),
    ]);

    return successResponse({
      estatisticas: {
        totalPerguntas,
        totalPartidas,
        partidasEmAndamento,
        partidasFinalizadas,
        totalUsuarios,
      },
      ultimaPartida,
      partidaEmAndamento,
    });
  } catch (error) {
    console.error("Erro ao carregar dashboard:", error);
    return errorResponse("Erro ao carregar dados do dashboard.", 500);
  }
}
