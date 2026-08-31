import { redirect } from "next/navigation";

import { exigirPermissao } from "@/lib/autorizacao";
import { partidas } from "@/data/partidas/partidas";

export default async function PartidaEmAndamentoPage() {
  await exigirPermissao("jogo.gerenciar");

  const partidaEmAndamento = partidas.find(
    (partida) => partida.status === "em_andamento",
  );

  if (!partidaEmAndamento) {
    redirect("/dashboard/partidas");
  }

  redirect(`/dashboard/partidas/${partidaEmAndamento.id}/controle`);
}
