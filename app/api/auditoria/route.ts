import { NextRequest } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { errorResponse, successResponse, commonErrors } from "@/lib/api-response";
import { hasPermission } from "@/lib/permissions";
import { registrarAuditoria } from "@/lib/auditoria";

export async function GET(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user) {
      return commonErrors.unauthorized();
    }

    if (!hasPermission(session, "auditoria.visualizar")) {
      return errorResponse("Você não tem permissão para consultar a auditoria.", 403);
    }

    const url = new URL(request.url);
    const acao = url.searchParams.get("acao");
    const termo = url.searchParams.get("termo")?.trim();

    const logs = await prisma.auditLog.findMany({
      where: {
        ...(acao ? { acao } : {}),
        ...(termo
          ? {
              OR: [
                { descricao: { contains: termo, mode: "insensitive" } },
                { entidade: { contains: termo, mode: "insensitive" } },
                { acao: { contains: termo, mode: "insensitive" } },
                {
                  usuario: {
                    is: {
                      nome: { contains: termo, mode: "insensitive" },
                    },
                  },
                },
                {
                  usuario: {
                    is: {
                      nip: { contains: termo, mode: "insensitive" },
                    },
                  },
                },
              ],
            }
          : {}),
      },
      include: {
        usuario: {
          select: {
            id: true,
            nome: true,
            nip: true,
          },
        },
      },
      orderBy: { criadoEm: "desc" },
      take: 200,
    });

    return successResponse(logs, "Logs de auditoria carregados com sucesso.");
  } catch (error) {
    console.error("Erro ao buscar logs de auditoria:", error);
    return commonErrors.internalServerError();
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user) {
      return commonErrors.unauthorized();
    }

    if (!hasPermission(session, "auditoria.visualizar")) {
      return errorResponse("Você não tem permissão para registrar auditoria manualmente.", 403);
    }

    const body = await request.json();

    if (!body?.acao || !body?.entidade || !body?.descricao) {
      return errorResponse(
        "Ação, entidade e descrição são obrigatórias.",
        400,
      );
    }

    const log = await registrarAuditoria({
      session,
      acao: String(body.acao),
      entidade: String(body.entidade),
      entidadeId: body.entidadeId,
      descricao: String(body.descricao),
      detalhes: body.detalhes,
    });

    return successResponse(log, "Log registrado com sucesso.", 201);
  } catch (error) {
    console.error("Erro ao salvar log de auditoria:", error);
    return commonErrors.internalServerError();
  }
}
