import { NextRequest } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { successResponse, errorResponse, commonErrors } from "@/lib/api-response";
import { createPerguntaSchema } from "@/lib/validations/perguntas";
import { hasPermission } from "@/lib/permissions";

/**
 * GET: Retorna a lista de perguntas
 * Requer permissão: perguntas.gerenciar (Assumindo que essa permissão existe, ou apenas estar logado, mas geralmente gerenciar perguntas exige uma role específica)
 */
export async function GET(request: NextRequest) {
  try {
    const session = await auth();

    // Verificação de permissão: aqui vamos assumir que apenas cadastrador/admin acessam (usuarios.gerenciar ou permissao especifica)
    // Se o seu sistema tiver "perguntas.gerenciar", mude aqui.
    if (!session?.user) {
      return commonErrors.unauthorized();
    }

    const url = new URL(request.url);
    const termo = url.searchParams.get("termo")?.toLowerCase() || "";
    
    // Suporte a paginação simples se precisar depois
    // const page = parseInt(url.searchParams.get("page") || "1");
    // const limit = parseInt(url.searchParams.get("limit") || "10");

    const perguntas = await prisma.pergunta.findMany({
      where: termo
        ? {
            OR: [
              { assunto: { contains: termo, mode: "insensitive" } },
              { enunciado: { contains: termo, mode: "insensitive" } },
            ],
          }
        : undefined,
      include: {
        alternativas: true,
      },
      orderBy: { id: "desc" },
    });

    return successResponse(perguntas, "Perguntas carregadas com sucesso");
  } catch (error) {
    console.error("Erro ao buscar perguntas:", error);
    return commonErrors.internalServerError();
  }
}

/**
 * POST: Cria uma nova pergunta
 */
export async function POST(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user) {
      return commonErrors.unauthorized();
    }

    let body;
    try {
      body = await request.json();
    } catch (e) {
      body = {};
    }

    const validation = createPerguntaSchema.safeParse(body);

    if (!validation.success) {
      return errorResponse(
        "Falha na validação dos dados",
        400,
        validation.error.flatten().fieldErrors
      );
    }

    const { assunto, tipo, enunciado, respostaCorreta, explicacao, alternativas } = validation.data;

    // Criar a pergunta com suas alternativas (se houver) usando operação aninhada
    const novaPergunta = await prisma.pergunta.create({
      data: {
        assunto,
        tipo,
        enunciado,
        respostaCorreta,
        explicacao,
        // Cria alternativas junto se o tipo for objetiva e houver alternativas
        alternativas: (tipo === "objetiva" && alternativas && alternativas.length > 0)
          ? {
              create: alternativas.map(alt => ({ texto: alt.texto })),
            }
          : undefined,
      },
      include: {
        alternativas: true,
      },
    });

    return successResponse(novaPergunta, "Pergunta criada com sucesso", 201);
  } catch (error) {
    console.error("Erro ao criar pergunta:", error);
    return commonErrors.internalServerError();
  }
}
