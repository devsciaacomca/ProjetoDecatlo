import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { successResponse, errorResponse, commonErrors } from "@/lib/api-response";

/**
 * PUT: Finaliza uma partida e salva o placar final
 */
export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;

    let body;
    try {
      body = await request.json();
    } catch (e) {
      body = {};
    }

    const { pontuacaoEquipeA, pontuacaoEquipeB } = body;

    if (pontuacaoEquipeA === undefined || pontuacaoEquipeB === undefined) {
      return errorResponse("Pontuações finais são obrigatórias", 400);
    }

    const partidaFinalizada = await prisma.partida.update({
      where: { id },
      data: {
        status: "finalizada",
        pontuacaoEquipeA: parseInt(pontuacaoEquipeA),
        pontuacaoEquipeB: parseInt(pontuacaoEquipeB),
      },
    });

    return successResponse(partidaFinalizada, "Partida finalizada e salva com sucesso");
  } catch (error) {
    console.error("Erro ao finalizar partida:", error);
    return commonErrors.internalServerError();
  }
}
