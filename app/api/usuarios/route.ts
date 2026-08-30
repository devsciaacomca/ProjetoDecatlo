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
    const termo = url.searchParams.get("search")?.toLowerCase() || url.searchParams.get("termo")?.toLowerCase() || "";
    const page = parseInt(url.searchParams.get("page") || "1");
    const limit = parseInt(url.searchParams.get("limit") || "10");
    const skip = (page - 1) * limit;

    const where = termo
      ? {
          OR: [
            { nome: { contains: termo, mode: "insensitive" } as const },
            { email: { contains: termo, mode: "insensitive" } as const },
            { nip: { contains: termo } },
          ],
        }
      : {};

    const [usuarios, totalCount] = await Promise.all([
      prisma.user.findMany({
        where,
        skip,
        take: limit,
        select: {
          id: true,
          nome: true,
          email: true,
          nip: true,
          idade: true,
          roleId: true,
          role: { select: { nome: true } },
          createdAt: true,
        },
        orderBy: { id: "asc" },
      }),
      prisma.user.count({ where }),
    ]);

    const usuariosFormatados = usuarios.map((u) => ({
      ...u,
      role: u.role.nome,
      ativo: true,
    }));

    const totalPages = Math.ceil(totalCount / limit);

    return Response.json({
      success: true,
      message: "Usuários carregados com sucesso",
      data: usuariosFormatados,
      meta: {
        totalCount,
        totalPages,
        currentPage: page,
        limit,
      },
    });
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

    const { nome, email, nip, idade, senha, role } = validation.data;

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
    const roleExistente = await prisma.role.findUnique({ where: { nome: role } });
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
        roleId: roleExistente.id,
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
