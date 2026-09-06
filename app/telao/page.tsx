import { redirect } from "next/navigation";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export default async function TelaoPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  if (!session.user.permissions?.includes("telao.abrir")) {
    redirect("/sem-permissao");
  }

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

  if (partidaEmAndamento) {
    redirect(`/telao/${partidaEmAndamento.id}`);
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-950 text-white">
      <div className="text-center">
        <h1 className="text-3xl font-bold">DECATLO</h1>

        <p className="mt-3 text-slate-400">Nenhuma partida em andamento.</p>

        <p className="mt-2 text-sm text-slate-500">
          Aguardando o início da partida...
        </p>
      </div>
    </main>
  );
}
