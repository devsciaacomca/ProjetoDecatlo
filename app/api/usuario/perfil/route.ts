import { NextRequest } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { successResponse, errorResponse } from "@/lib/api-response";
import { updateProfileSchema } from "@/lib/validations/usuarios";

/**
 * GET: Retorna os dados do usuário logado
 */
export async function GET() {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return errorResponse("Não autorizado", 401);
    }

    const user = await prisma.user.findUnique({
      where: { id: parseInt(session.user.id) },
      select: {
        id: true,
        nome: true,
        email: true,
        nip: true,
        idade: true,
        role: {
          select: {
            nome: true,
          }
        }
      },
    });

    if (!user) {
      return errorResponse("Usuário não encontrado", 404);
    }

    return successResponse(user, "Perfil carregado com sucesso");
  } catch (error) {
    console.error("Erro ao buscar perfil:", error);
    return errorResponse("Erro ao buscar dados do perfil", 500);
  }
}

/**
 * PATCH: Atualiza nome e email do perfil do usuário logado
 */
export async function PATCH(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return errorResponse("Não autorizado", 401);
    }

    const body = await request.json();
    const validation = updateProfileSchema.safeParse(body);

    if (!validation.success) {
      return errorResponse(
        "Falha na validação dos dados",
        400,
        validation.error.flatten().fieldErrors
      );
    }

    const { nome, email } = validation.data;

    // Verificar se o email já existe em outra conta
    const existingEmail = await prisma.user.findFirst({
      where: {
        email,
        id: { not: parseInt(session.user.id) },
      },
    });

    if (existingEmail) {
      return errorResponse("Este e-mail já está em uso por outro usuário", 400);
    }

    const updatedUser = await prisma.user.update({
      where: { id: parseInt(session.user.id) },
      data: { nome, email },
      select: {
        id: true,
        nome: true,
        email: true,
        nip: true,
        role: { select: { nome: true } },
      },
    });

    return successResponse(updatedUser, "Perfil atualizado com sucesso");
  } catch (error) {
    console.error("Erro ao atualizar perfil:", error);
    return errorResponse("Erro ao atualizar perfil", 500);
  }
}
