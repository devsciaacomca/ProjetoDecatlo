import { NextRequest } from "next/server";
import bcrypt from "bcryptjs";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { successResponse, errorResponse, commonErrors } from "@/lib/api-response";
import { createUserSchema } from "@/lib/validations/usuarios";
import { hasPermission } from "@/lib/permissions";

/**
 * GET: Retorna a lista de usuários
 * Requer permissão: usuarios.gerenciar
 */
export async function GET(request: NextRequest) {
  try {
    const session = await auth();

    if (!hasPermission(session, "usuarios.gerenciar")) {
      return commonErrors.forbidden();
    }

    const url = new URL(request.url);
    const termo = url.searchParams.get("termo")?.toLowerCase() || "";

    const usuarios = await prisma.user.findMany({
      where: termo
        ? {
            OR: [
              { nome: { contains: termo, mode: "insensitive" } },
              { email: { contains: termo, mode: "insensitive" } },
              { nip: { contains: termo } },
            ],
          }
        : undefined,
      select: {
        id: true,
        nome: true,
        email: true,
        nip: true,
        idade: true,
        roleId: true,
        role: {
          select: {
            nome: true,
          },
        },
        createdAt: true,
      },
      orderBy: { id: "asc" },
    });

    // Adaptando para o formato que o frontend espera no momento, como "ativo" que pode ser derivado da role ou uma coluna nova (por enquanto simulamos ativo=true)
    const usuariosFormatados = usuarios.map(u => ({
      ...u,
      role: u.role.nome,
      ativo: true, // TODO: caso adicione status de inativo no banco depois
    }));

    return successResponse(usuariosFormatados, "Usuários carregados com sucesso");
  } catch (error) {
    console.error("Erro ao buscar usuários:", error);
    return commonErrors.internalServerError();
  }
}

/**
 * POST: Cadastra um novo usuário
 * Requer permissão: usuarios.gerenciar
 */
export async function POST(request: NextRequest) {
  try {
    const session = await auth();

    if (!hasPermission(session, "usuarios.gerenciar")) {
      return commonErrors.forbidden();
    }

    let body;
    try {
      body = await request.json();
    } catch (e) {
      body = {};
    }

    const validation = createUserSchema.safeParse(body);

    if (!validation.success) {
      return errorResponse(
        "Falha na validação dos dados",
        400,
        validation.error.flatten().fieldErrors
      );
    }

    const { nome, email, nip, idade, senha, roleId } = validation.data;

    // Verificar se já existe usuário com mesmo NIP ou E-mail
    const usuarioExistente = await prisma.user.findFirst({
      where: {
        OR: [{ nip }, { email }],
      },
    });

    if (usuarioExistente) {
      const conflito = usuarioExistente.nip === nip ? "NIP" : "E-mail";
      return errorResponse(`Já existe um usuário cadastrado com este ${conflito}`, 400);
    }

    // Verificar se a role existe
    const roleExistente = await prisma.role.findUnique({ where: { id: roleId } });
    if (!roleExistente) {
      return errorResponse("O nível de acesso (role) selecionado não existe", 400);
    }

    // Hash da senha
    const salt = await bcrypt.genSalt(10);
    const senhaHash = await bcrypt.hash(senha, salt);

    // Criar o usuário
    const novoUsuario = await prisma.user.create({
      data: {
        nome,
        email,
        nip,
        idade,
        senhaHash,
        roleId,
      },
      select: {
        id: true,
        nome: true,
        email: true,
        nip: true,
        role: { select: { nome: true } },
      }
    });

    return successResponse(
      { ...novoUsuario, role: novoUsuario.role.nome, ativo: true }, 
      "Usuário criado com sucesso", 
      201
    );
  } catch (error) {
    console.error("Erro ao criar usuário:", error);
    return commonErrors.internalServerError();
  }
}
