import { NextRequest } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { successResponse, errorResponse, commonErrors } from "@/lib/api-response";
import { updatePerguntaSchema } from "@/lib/validations/perguntas";
import { hasPermission } from "@/lib/permissions";
import { registrarAuditoria } from "@/lib/auditoria";

function parseId(value: string) {
  const id = Number.parseInt(value, 10);
  return Number.isInteger(id) && id > 0 ? id : null;
}

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const session = await auth();
    if (!session?.user) return commonErrors.unauthorized();

    if (!hasPermission(session, "perguntas.gerenciar") &&
        !hasPermission(session, "jogo.configurar")) {
      return errorResponse("Você não tem permissão para consultar perguntas.", 403);
    }

    const { id } = await params;
    const perguntaId = parseId(id);
    if (!perguntaId) return errorResponse("ID de pergunta inválido.", 400);

    const pergunta = await prisma.pergunta.findUnique({
      where: { id: perguntaId },
      include: { alternativas: true },
    });

    if (!pergunta) return commonErrors.notFound("Pergunta");

    return successResponse(pergunta, "Pergunta carregada com sucesso.");
  } catch (error) {
    console.error("Erro ao buscar pergunta:", error);
    return commonErrors.internalServerError();
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const session = await auth();
    if (!session?.user) return commonErrors.unauthorized();

    if (!hasPermission(session, "perguntas.gerenciar")) {
      return errorResponse("Você não tem permissão para editar perguntas.", 403);
    }

    const { id } = await params;
    const perguntaId = parseId(id);
    if (!perguntaId) return errorResponse("ID de pergunta inválido.", 400);

    const existente = await prisma.pergunta.findUnique({
      where: { id: perguntaId },
      include: { alternativas: true },
    });

    if (!existente) return commonErrors.notFound("Pergunta");

    const validation = updatePerguntaSchema.safeParse(await request.json());

    if (!validation.success) {
      return errorResponse(
        "Falha na validação dos dados.",
        400,
        validation.error.flatten().fieldErrors,
      );
    }

    const {
      assunto,
      tipo,
      enunciado,
      respostaCorreta,
      explicacao,
      alternativas,
    } = validation.data;

    const atualizada = await prisma.$transaction(async (tx) => {
      return tx.pergunta.update({
        where: { id: perguntaId },
        data: {
          assunto,
          tipo,
          enunciado,
          respostaCorreta,
          explicacao,
          alternativas:
            alternativas !== undefined
              ? {
                  deleteMany: {},
                  create: alternativas.map((alternativa) => ({
                    texto: alternativa.texto,
                  })),
                }
              : undefined,
        },
        include: { alternativas: true },
      });
    });

    await registrarAuditoria({
      session,
      acao: "EDICAO_PERGUNTA",
      entidade: "Pergunta",
      entidadeId: perguntaId,
      descricao: `Editou a pergunta #${perguntaId}.`,
      detalhes: {
        antes: {
          assunto: existente.assunto,
          tipo: existente.tipo,
          enunciado: existente.enunciado,
        },
        depois: {
          assunto: atualizada.assunto,
          tipo: atualizada.tipo,
          enunciado: atualizada.enunciado,
        },
      },
    });

    return successResponse(atualizada, "Pergunta atualizada com sucesso.");
  } catch (error) {
    console.error("Erro ao atualizar pergunta:", error);
    return commonErrors.internalServerError();
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const session = await auth();
    if (!session?.user) return commonErrors.unauthorized();

    if (!hasPermission(session, "perguntas.gerenciar")) {
      return errorResponse("Você não tem permissão para excluir perguntas.", 403);
    }

    const { id } = await params;
    const perguntaId = parseId(id);
    if (!perguntaId) return errorResponse("ID de pergunta inválido.", 400);

    const existente = await prisma.pergunta.findUnique({
      where: { id: perguntaId },
      include: { alternativas: true },
    });

    if (!existente) return commonErrors.notFound("Pergunta");

    await prisma.pergunta.delete({ where: { id: perguntaId } });

    await registrarAuditoria({
      session,
      acao: "EXCLUSAO_PERGUNTA",
      entidade: "Pergunta",
      entidadeId: perguntaId,
      descricao: `Excluiu a pergunta #${perguntaId}.`,
      detalhes: {
        assunto: existente.assunto,
        tipo: existente.tipo,
        enunciado: existente.enunciado,
      },
    });

    return successResponse(null, "Pergunta excluída com sucesso.");
  } catch (error) {
    console.error("Erro ao excluir pergunta:", error);

    if (error && typeof error === "object" && "code" in error && error.code === "P2003") {
      return errorResponse(
        "A pergunta já está vinculada a uma partida e não pode ser excluída.",
        409,
      );
    }

    return commonErrors.internalServerError();
  }
}
