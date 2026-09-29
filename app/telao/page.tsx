import { redirect } from "next/navigation";
import Link from "next/link";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export default async function TelaoPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  if (!session.user.permissions?.includes("telao.abrir")) {
    redirect("/logout");
  }

  const partidas = await prisma.partida.findMany({
    where: {
      status: {
        not: "finalizada",
      },
    },
    orderBy: {
      atualizadaEm: "desc",
    },
  });

  return (
    <main className="flex h-full overflow-y-auto flex-col bg-slate-950 text-white p-8 lg:p-16">
      <div className="mx-auto w-full max-w-5xl text-center">
        <h1 className="text-4xl font-black mb-2 uppercase tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-yellow-200">
          Decatlo
        </h1>
        <p className="text-slate-400 mb-12">Selecione uma partida para exibir no telão</p>

        {partidas.length === 0 ? (
          <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-12">
            <p className="text-lg text-slate-400">Nenhuma partida pronta ou em andamento no momento.</p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 text-left">
            {partidas.map((partida) => (
              <Link 
                key={partida.id} 
                href={`/telao/${partida.id}`} 
                className="group relative block overflow-hidden rounded-2xl border border-slate-800 bg-slate-900 p-6 transition hover:border-cyan-500 hover:shadow-2xl hover:shadow-cyan-500/10"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-transparent opacity-0 transition group-hover:opacity-100" />
                <div className="relative z-10">
                  <p className="text-xs font-black uppercase tracking-widest text-cyan-400 mb-3">
                    {partida.status.replace("_", " ")}
                  </p>
                  <h2 className="text-xl font-bold mb-6 line-clamp-2 leading-tight">
                    {partida.nome}
                  </h2>
                  <div className="flex items-center justify-between text-sm font-semibold">
                    <span className="truncate flex-1 text-slate-300">{partida.equipe1}</span>
                    <span className="mx-3 text-xs text-slate-600">VS</span>
                    <span className="truncate flex-1 text-right text-slate-300">{partida.equipe2}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
