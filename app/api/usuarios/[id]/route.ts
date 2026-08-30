import { NextRequest } from "next/server";
import bcrypt from "bcryptjs";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { successResponse, errorResponse, commonErrors } from "@/lib/api-response";
import { updateUserSchema } from "@/lib/validations/usuarios";
import { hasPermission } from "@/lib/permissions";

/**
 * GET: Busca detalhes de um usuário específico
 */
export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth();
    const { id } = await params;

    if (!hasPermission(session, "usuarios.gerenciar") && session?.user?.id !== id) {
      return commonErrors.forbidden();
    }

    const usuario = await prisma.user.findUnique({
      where: { id: parseInt(id) },
      select: {
        id: true,
        nome: true,
        email: true,
        nip: true,
        idade: true,
        roleId: true,
        role: {
          select: { nome: true },
        },
        createdAt: true,
      }
    });

    if (!usuario) {
      return commonErrors.notFound("Usuário");
    }

    return successResponse(usuario, "Usuário encontrado");
  } catch (error) {
    console.error("Erro ao buscar usuário:", error);
    return commonErrors.internalServerError();
  }
}

/**
 * PUT: Atualiza dados de um usuário específico
 */
export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth();
    const { id } = await params;

    // Apenas quem tem permissão ou é o próprio usuário pode editar
    if (!hasPermission(session, "usuarios.gerenciar") && session?.user?.id !== id) {
      return commonErrors.forbidden();
    }

    let body;
    try {
      body = await request.json();
    } catch (e) {
      body = {};
    }

    const validation = updateUserSchema.safeParse(body);

    if (!validation.success) {
      return errorResponse("Falha na validação dos dados", 400, validation.error.flatten().fieldErrors);
    }

    const dadosAtualizacao = validation.data;
    const updateData: any = {};

    if (dadosAtualizacao.nome) updateData.nome = dadosAtualizacao.nome;
    if (dadosAtualizacao.idade) updateData.idade = dadosAtualizacao.idade;

    // Apenas quem tem a permissão gerenciar pode alterar o E-mail ou a Role de outro usuário de forma livre
    // Um usuário comum só altera e-mail pelo /api/usuario/perfil
    if (hasPermission(session, "usuarios.gerenciar")) {
      if (dadosAtualizacao.email) updateData.email = dadosAtualizacao.email;
      if (dadosAtualizacao.role) {
        const roleExistente = await prisma.role.findUnique({ where: { nome: dadosAtualizacao.role } });
        if (!roleExistente) {
          return errorResponse("O nível de acesso (role) selecionado não existe", 400);
        }
        updateData.roleId = roleExistente.id;
      }
    }

    // Se forneceu uma senha nova na atualização do CRUD
    if (dadosAtualizacao.senha) {
      const salt = await bcrypt.genSalt(10);
      updateData.senhaHash = await bcrypt.hash(dadosAtualizacao.senha, salt);
    }

    // Validar conflitos de email se estiver sendo alterado
    if (updateData.email) {
      const conflito = await prisma.user.findFirst({
        where: {
          email: updateData.email,
          id: { not: parseInt(id) }
        }
      });

      if (conflito) {
        return errorResponse("Já existe outro usuário com este E-mail", 400);
      }
    }

    const usuarioAtualizado = await prisma.user.update({
      where: { id: parseInt(id) },
      data: updateData,
      select: {
        id: true,
        nome: true,
        email: true,
        nip: true,
        role: { select: { nome: true } },
      }
    });

    return successResponse(
      { ...usuarioAtualizado, role: usuarioAtualizado.role.nome, ativo: true }, 
      "Usuário atualizado com sucesso"
    );
  } catch (error) {
    console.error("Erro ao atualizar usuário:", error);
    return commonErrors.internalServerError();
  }
}

/**
 * DELETE: Exclui um usuário
 */
export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth();
    const { id } = await params;

    // Apenas administradores/cadastradores com permissão podem excluir
    if (!hasPermission(session, "usuarios.gerenciar")) {
      return commonErrors.forbidden();
    }

    // Prevenir auto-exclusão por segurança
    if (session?.user?.id === id) {
      return errorResponse("Não é possível excluir o próprio usuário que está logado.", 400);
    }

    await prisma.user.delete({
      where: { id: parseInt(id) }
    });

    return successResponse(null, "Usuário excluído com sucesso");
  } catch (error) {
    console.error("Erro ao excluir usuário:", error);
    return commonErrors.internalServerError();
  }
}
