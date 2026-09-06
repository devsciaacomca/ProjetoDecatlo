import { NextRequest } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { successResponse, errorResponse, commonErrors } from "@/lib/api-response";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function GET(
  _request: NextRequest,
  { params }: RouteContext,
) {
  try {
    const session = await auth();

    if (!session?.user) {
      return commonErrors.unauthorized();
    }

    const { id } = await params;

    if (!id?.trim()) {
      return errorResponse("ID da partida é obrigatório.", 400);
    }

    const partida = await prisma.partida.findUnique({
      where: { id },
      include: {
        perguntasSelecionadas: {
          orderBy: { ordem: "asc" },
          include: {
            pergunta: {
              include: {
                alternativas: true,
              },
            },
          },
        },
        respostas: {
          orderBy: { respondidaEm: "asc" },
        },
      },
    });

    if (!partida) {
      return errorResponse("Partida não encontrada.", 404);
    }

    return successResponse(partida, "Partida carregada com sucesso");
  } catch (error) {
    console.error("Erro ao buscar partida:", error);
    return commonErrors.internalServerError();
  }
}
