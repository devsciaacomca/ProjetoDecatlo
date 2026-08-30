import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { successResponse, errorResponse, commonErrors } from "@/lib/api-response";

/**
 * GET: Retorna o histórico de partidas finalizadas (ou todas as partidas)
 */
export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const status = url.searchParams.get("status");
    
    const partidas = await prisma.partida.findMany({
      where: status ? { status } : undefined,
      orderBy: { data: "desc" },
    });

    return successResponse(partidas, "Partidas carregadas com sucesso");
  } catch (error) {
    console.error("Erro ao buscar partidas:", error);
    return commonErrors.internalServerError();
  }
}

/**
 * POST: Cria o registro inicial de uma nova partida
 */
export async function POST(request: NextRequest) {
  try {
    let body;
    try {
      body = await request.json();
    } catch (e) {
      body = {};
    }

    const { nome, equipe1, equipe2, perguntas } = body;

    if (!nome || !equipe1 || !equipe2 || !perguntas) {
      return errorResponse("Dados incompletos para iniciar a partida", 400);
    }

    const novaPartida = await prisma.partida.create({
      data: {
        nome,
        equipe1,
        equipe2,
        status: "configuracao",
        perguntas: parseInt(perguntas),
        perguntaAtual: 0,
        pontuacaoEquipeA: 0,
        pontuacaoEquipeB: 0,
        data: new Date(),
      },
    });

    return successResponse(novaPartida, "Partida criada com sucesso", 201);
  } catch (error) {
    console.error("Erro ao criar partida:", error);
    return commonErrors.internalServerError();
  }
}
