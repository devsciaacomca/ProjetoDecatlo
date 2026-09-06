import { NextRequest } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { successResponse, errorResponse } from "@/lib/api-response";

const PAGE_SIZE = 20;

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    const permissions = session?.user?.permissions ?? [];

    if (!session?.user) {
      return errorResponse("Não autorizado.", 401);
    }

    if (!permissions.includes("auditoria.visualizar")) {
      return errorResponse("Você não tem permissão para consultar a auditoria.", 403);
    }

    const url = new URL(request.url);
    const busca = url.searchParams.get("busca")?.trim() ?? "";
    const acao = url.searchParams.get("acao")?.trim() ?? "";
    const pagina = Math.max(Number(url.searchParams.get("pagina") ?? "1") || 1, 1);

    const skip = (pagina - 1) * PAGE_SIZE;

    const where = {
      ...(acao ? { acao } : {}),
      ...(busca
        ? {
            OR: [
              { acao: { contains: busca, mode: "insensitive" as const } },
              { entidade: { contains: busca, mode: "insensitive" as const } },
              { entidadeId: { contains: busca, mode: "insensitive" as const } },
              { descricao: { contains: busca, mode: "insensitive" as const } },
              { usuario: { nome: { contains: busca, mode: "insensitive" as const } } },
              { usuario: { nip: { contains: busca, mode: "insensitive" as const } } },
            ],
          }
        : {}),
    };

    const [total, logs] = await Promise.all([
      prisma.auditLog.count({ where }),
      prisma.auditLog.findMany({
        where,
        skip,
        take: PAGE_SIZE,
        orderBy: { criadoEm: "desc" },
        include: {
          usuario: {
            select: {
              id: true,
              nome: true,
              nip: true,
            },
          },
        },
      }),
    ]);

    const totalPaginas = Math.max(Math.ceil(total / PAGE_SIZE), 1);

    return successResponse({
      registros: logs.map((log) => ({
        id: String(log.id),
        usuario: log.usuario?.nome ?? "Usuário removido",
        nip: log.usuario?.nip ?? "—",
        acao: log.acao,
        entidade: log.entidade,
        entidadeId: log.entidadeId ?? undefined,
        descricao: log.descricao,
        detalhes: log.detalhes ?? undefined,
        data: log.criadoEm.toISOString(),
      })),
      paginacao: {
        pagina,
        porPagina: PAGE_SIZE,
        total,
        totalPaginas,
      },
    });
  } catch (error) {
    console.error("Erro ao buscar auditoria:", error);
    return errorResponse("Erro ao buscar histórico de auditoria.", 500);
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user) {
      return errorResponse("Não autorizado.", 401);
    }

    const userId = Number(session.user.id);

    if (!Number.isInteger(userId)) {
      return errorResponse("Sessão inválida.", 401);
    }

    const body = await request.json();

    const acao = String(body.acao ?? "").trim();
    const entidade = String(body.entidade ?? "").trim();
    const entidadeId = body.entidadeId
      ? String(body.entidadeId).trim()
      : null;
    const descricao = String(body.descricao ?? "").trim();
    const detalhes = body.detalhes
      ? String(body.detalhes).trim()
      : null;

    if (!acao || !entidade || !descricao) {
      return errorResponse(
        "Ação, entidade e descrição são obrigatórias.",
        400,
      );
    }

    const log = await prisma.auditLog.create({
      data: {
        usuarioId: userId,
        acao,
        entidade,
        entidadeId,
        descricao,
        detalhes,
      },
    });

    return successResponse(
      {
        id: log.id,
      },
      "Log de auditoria registrado.",
      201,
    );
  } catch (error) {
    console.error("Erro ao registrar auditoria:", error);
    return errorResponse("Erro ao registrar log de auditoria.", 500);
  }
}
