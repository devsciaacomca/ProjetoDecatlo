import type { Session } from "next-auth";
import { prisma } from "@/lib/prisma";

type RegistrarAuditoriaInput = {
  session?: Session | null;
  usuarioId?: number | null;
  acao: string;
  entidade: string;
  entidadeId?: string | number | null;
  descricao: string;
  detalhes?: unknown;
};

export async function registrarAuditoria({
  session,
  usuarioId,
  acao,
  entidade,
  entidadeId,
  descricao,
  detalhes,
}: RegistrarAuditoriaInput) {
  const id =
    usuarioId ??
    (session?.user?.id ? Number.parseInt(session.user.id, 10) : null);

  return prisma.auditLog.create({
    data: {
      usuarioId: Number.isInteger(id) ? id : null,
      acao,
      entidade,
      entidadeId:
        entidadeId === undefined || entidadeId === null
          ? null
          : String(entidadeId),
      descricao,
      detalhes:
        detalhes === undefined
          ? null
          : typeof detalhes === "string"
            ? detalhes
            : JSON.stringify(detalhes),
    },
  });
}
