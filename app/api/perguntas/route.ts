import { NextRequest } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import {
  successResponse,
  errorResponse,
  commonErrors,
} from "@/lib/api-response";
import { createPerguntaSchema } from "@/lib/validations/perguntas";
import { registrarAuditoria } from "@/lib/auditoria";

/**
 * GET:
 * Retorna perguntas ou os assuntos já cadastrados.
 */
export async function GET(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user) {
      return commonErrors.unauthorized();
    }

    const url = new URL(request.url);

    const termo = url.searchParams.get("termo")?.trim() || "";

    const somenteAssuntos = url.searchParams.get("assuntos") === "true";

    if (somenteAssuntos) {
      const assuntos = await prisma.pergunta.findMany({
        where: {
          assunto: {
            not: "",
          },
        },
        select: {
          assunto: true,
        },
        distinct: ["assunto"],
        orderBy: {
          assunto: "asc",
        },
      });

      return successResponse(
        assuntos.map((item) => item.assunto),
        "Assuntos carregados com sucesso",
      );
    }

    const perguntas = await prisma.pergunta.findMany({
      where: termo
        ? {
            OR: [
              {
                assunto: {
                  contains: termo,
                  mode: "insensitive",
                },
              },
              {
                enunciado: {
                  contains: termo,
                  mode: "insensitive",
                },
              },
            ],
          }
        : undefined,

      include: {
        alternativas: true,
      },

      orderBy: {
        id: "desc",
      },
    });

    return successResponse(perguntas, "Perguntas carregadas com sucesso");
  } catch (error) {
    console.error("Erro ao buscar perguntas:", error);

    return commonErrors.internalServerError();
  }
}

/**
 * POST:
 * Cria uma nova pergunta.
 */
export async function POST(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user) {
      return commonErrors.unauthorized();
    }

    let body: unknown;

    try {
      body = await request.json();
    } catch {
      body = {};
    }

    const validation = createPerguntaSchema.safeParse(body);

    if (!validation.success) {
      return errorResponse(
        "Falha na validação dos dados",
        400,
        validation.error.flatten().fieldErrors,
      );
    }

    const {
      assunto: assuntoRecebido,
      tipo,
      enunciado,
      respostaCorreta,
      explicacao,
      alternativas,
    } = validation.data;

    const assuntoInformado = assuntoRecebido.trim();

    if (!assuntoInformado) {
      return errorResponse("O assunto é obrigatório.", 400);
    }

    const assuntoExistente = await prisma.pergunta.findFirst({
      where: {
        assunto: {
          equals: assuntoInformado,
          mode: "insensitive",
        },
      },
      select: {
        assunto: true,
      },
    });

    const assunto = assuntoExistente?.assunto ?? assuntoInformado;

    const novaPergunta = await prisma.pergunta.create({
      data: {
        assunto,
        tipo,
        enunciado,
        respostaCorreta,
        explicacao,

        alternativas:
          tipo === "objetiva" && alternativas && alternativas.length > 0
            ? {
                create: alternativas.map((alternativa) => ({
                  texto: alternativa.texto,
                })),
              }
            : undefined,
      },

      include: {
        alternativas: true,
      },
    });

    await registrarAuditoria({
      session,
      acao: "CRIACAO_PERGUNTA",
      entidade: "Pergunta",
      entidadeId: novaPergunta.id,
      descricao: `Criou uma nova pergunta do assunto "${novaPergunta.assunto}".`,
      detalhes: {
        assunto: novaPergunta.assunto,
        tipo: novaPergunta.tipo,
        enunciado: novaPergunta.enunciado,
        quantidadeAlternativas: novaPergunta.alternativas.length,
      },
    });

    return successResponse(novaPergunta, "Pergunta criada com sucesso", 201);
  } catch (error) {
    console.error("Erro ao criar pergunta:", error);

    return commonErrors.internalServerError();
  }
}
