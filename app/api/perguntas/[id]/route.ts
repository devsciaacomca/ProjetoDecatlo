import { NextRequest } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { successResponse, errorResponse, commonErrors } from "@/lib/api-response";
import { updatePerguntaSchema } from "@/lib/validations/perguntas";

/**
 * GET: Retorna os detalhes de uma pergunta
 */
export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth();
    if (!session?.user) {
      return commonErrors.unauthorized();
    }

    const { id } = await params;
    const pergunta = await prisma.pergunta.findUnique({
      where: { id: parseInt(id) },
      include: {
        alternativas: true,
      },
    });

    if (!pergunta) {
      return commonErrors.notFound("Pergunta");
    }

    return successResponse(pergunta, "Pergunta carregada com sucesso");
  } catch (error) {
    console.error("Erro ao buscar pergunta:", error);
    return commonErrors.internalServerError();
  }
}

/**
 * PUT: Atualiza uma pergunta
 */
export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth();
    if (!session?.user) {
      return commonErrors.unauthorized();
    }

    const { id } = await params;
    const perguntaId = parseInt(id);

    // Verifica se a pergunta existe
    const perguntaExistente = await prisma.pergunta.findUnique({
      where: { id: perguntaId },
    });

    if (!perguntaExistente) {
      return commonErrors.notFound("Pergunta");
    }

    let body;
    try {
      body = await request.json();
    } catch (e) {
      body = {};
    }

    const validation = updatePerguntaSchema.safeParse(body);

    if (!validation.success) {
      return errorResponse(
        "Falha na validação dos dados",
        400,
        validation.error.flatten().fieldErrors
      );
    }

    const { assunto, tipo, enunciado, respostaCorreta, explicacao, alternativas } = validation.data;

    // Se mudou para aberta, não deve ter alternativas. Se mudou/manteve objetiva, atualiza as alternativas.
    // A melhor abordagem é deletar todas as alternativas antigas e recriar, para simplificar o sync.
    const hasAlternativasToUpdate = alternativas !== undefined;

    const perguntaAtualizada = await prisma.pergunta.update({
      where: { id: perguntaId },
      data: {
        assunto,
        tipo,
        enunciado,
        respostaCorreta,
        explicacao,
        ...(hasAlternativasToUpdate && {
          alternativas: {
            deleteMany: {}, // Limpa as antigas
            create: alternativas?.map((alt) => ({ texto: alt.texto })) || [], // Cria as novas
          },
        }),
      },
      include: {
        alternativas: true,
      },
    });

    return successResponse(perguntaAtualizada, "Pergunta atualizada com sucesso");
  } catch (error) {
    console.error("Erro ao atualizar pergunta:", error);
    return commonErrors.internalServerError();
  }
}

/**
 * DELETE: Exclui uma pergunta
 */
export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth();
    if (!session?.user) {
      return commonErrors.unauthorized();
    }

    const { id } = await params;
    const perguntaId = parseInt(id);

    // O Prisma cuidará de deletar as alternativas em cascata (onDelete: Cascade)
    await prisma.pergunta.delete({
      where: { id: perguntaId },
    });

    return successResponse(null, "Pergunta excluída com sucesso");
  } catch (error) {
    // Se não encontrou para deletar, o prisma joga erro (P2025)
    console.error("Erro ao excluir pergunta:", error);
    return commonErrors.internalServerError();
  }
}
