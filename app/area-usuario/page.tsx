import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export default async function AreaUsuarioPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const partidas = await prisma.partida.findMany({
    where: { status: { in: ["em_andamento", "pausada"] } },
    orderBy: { atualizadaEm: "desc" },
    select: {
      id: true, nome: true, equipe1: true, equipe2: true, status: true,
      perguntaAtual: true, perguntas: true, pontuacaoEquipeA: true,
      pontuacaoEquipeB: true, tempoRestante: true,
    },
  });

  const nome = session.user.nome ?? session.user.name ?? "Usuário";
  const inicial = nome.trim().charAt(0).toUpperCase() || "U";

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <header className="sticky top-0 z-20 border-b border-slate-200 bg-white">
        <div className="mx-auto flex min-h-20 max-w-7xl flex-wrap items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-500">Decatlo</p>
            <h1 className="text-xl font-semibold">Área do Usuário</h1>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Link href="/" className="rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium hover:bg-slate-50">Página inicial</Link>
            <Link href="/area-usuario/perfil" className="rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium hover:bg-slate-50">Meu perfil</Link>
            <Link href="/logout" className="rounded-lg bg-slate-900 px-3 py-2 text-sm font-semibold text-white hover:bg-slate-800">Sair</Link>
            <span className="ml-1 flex h-9 w-9 items-center justify-center rounded-full bg-slate-800 text-sm font-semibold text-white" aria-label={`Usuário ${nome}`}>{inicial}</span>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <section className="mb-8">
          <p className="text-sm text-slate-500">Bem-vindo(a),</p>
          <h2 className="mt-1 text-2xl font-bold">{nome}</h2>
          <p className="mt-2 text-sm text-slate-500">Acompanhe as partidas que estão acontecendo ou temporariamente pausadas.</p>
        </section>

        <section>
          <div className="mb-4 flex items-center justify-between gap-3">
            <h2 className="text-lg font-semibold">Partidas disponíveis</h2>
            <span className="rounded-full bg-slate-200 px-3 py-1 text-xs font-semibold text-slate-700">{partidas.length} ativa(s)</span>
          </div>
          {partidas.length === 0 ? (
            <div className="rounded-xl border border-slate-200 bg-white p-10 text-center shadow-sm">
              <h3 className="font-semibold">Nenhuma partida ativa no momento</h3>
              <p className="mt-1 text-sm text-slate-500">Quando uma partida começar, ela aparecerá aqui.</p>
            </div>
          ) : (
            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {partidas.map((partida) => {
                const pausada = partida.status === "pausada";
                return (
                  <article key={partida.id} className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
                    <div className="border-b border-slate-100 p-5">
                      <div className="flex items-start justify-between gap-3">
                        <h3 className="font-semibold">{partida.nome}</h3>
                        <span className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold ${pausada ? "bg-amber-100 text-amber-800" : "bg-emerald-100 text-emerald-800"}`}>{pausada ? "Pausada" : "Em andamento"}</span>
                      </div>
                      <p className="mt-4 text-center text-sm font-semibold text-slate-700">{partida.equipe1} <span className="mx-2 text-slate-400">{partida.pontuacaoEquipeA} × {partida.pontuacaoEquipeB}</span> {partida.equipe2}</p>
                    </div>
                    <div className="flex items-center justify-between gap-3 px-5 py-3 text-xs text-slate-500">
                      <span>Pergunta {partida.perguntaAtual} de {partida.perguntas}</span>
                      <span>{pausada ? "Cronômetro pausado" : `${partida.tempoRestante}s restantes`}</span>
                    </div>
                    <div className="px-5 pb-5">
                      <Link href={`/telao/${partida.id}`} className="inline-flex w-full items-center justify-center rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-slate-800">Acompanhar no telão</Link>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
