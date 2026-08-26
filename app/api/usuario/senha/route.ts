import { NextRequest } from "next/server";
import bcrypt from "bcryptjs";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { successResponse, errorResponse } from "@/lib/api-response";
import { updatePasswordSchema } from "@/lib/validations/usuarios";

/**
 * PATCH: Atualiza a senha do perfil do usuário logado
 */
export async function PATCH(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return errorResponse("Não autorizado", 401);
    }

    const body = await request.json();
    const validation = updatePasswordSchema.safeParse(body);

    if (!validation.success) {
      return errorResponse(
        "Falha na validação dos dados",
        400,
        validation.error.flatten().fieldErrors
      );
    }

    const { senhaAtual, novaSenha } = validation.data;

    // Buscar usuário para verificar a senha atual
    const user = await prisma.user.findUnique({
      where: { id: parseInt(session.user.id) },
    });

    if (!user) {
      return errorResponse("Usuário não encontrado", 404);
    }

    // Verificar se a senha atual está correta
    const senhaValida = await bcrypt.compare(senhaAtual, user.senhaHash);
    
    if (!senhaValida) {
      return errorResponse("A senha atual está incorreta", 400);
    }

    // Hash da nova senha
    const salt = await bcrypt.genSalt(10);
    const novaSenhaHash = await bcrypt.hash(novaSenha, salt);

    // Atualizar a senha
    await prisma.user.update({
      where: { id: user.id },
      data: { senhaHash: novaSenhaHash },
    });

    return successResponse(null, "Senha atualizada com sucesso");
  } catch (error) {
    console.error("Erro ao atualizar senha:", error);
    return errorResponse("Erro inesperado ao atualizar a senha", 500);
  }
}
