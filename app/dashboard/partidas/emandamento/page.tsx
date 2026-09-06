import { redirect } from "next/navigation";

import { prisma } from "@/lib/prisma";
import { exigirPermissao } from "@/lib/autorizacao";

export default async function PartidaEmAndamentoPage() {
  await exigirPermissao("jogo.gerenciar");

  const partidaEmAndamento = await prisma.partida.findFirst({
    where: {
      status: "em_andamento",
    },
    orderBy: {
      atualizadaEm: "desc",
    },
    select: {
      id: true,
    },
  });

  if (!partidaEmAndamento) {
    redirect("/dashboard/partidas");
  }

  redirect(`/dashboard/partidas/${partidaEmAndamento.id}/controle`);
}
