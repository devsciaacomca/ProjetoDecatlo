"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Plus, Gamepad2, PlayCircle, Search, ArrowRight } from "lucide-react";

type Partida = {
  id: string;
  nome: string;
  equipe1: string;
  equipe2: string;
  status: "configuracao" | "pronta" | "em_andamento" | "finalizada";
  perguntas: number;
  perguntaAtual: number;
  data: string;
};

const statusConfig = {
  configuracao: { label: "Em configuração", className: "bg-slate-100 text-slate-700" },
  pronta: { label: "Pronta", className: "bg-blue-100 text-blue-700" },
  em_andamento: { label: "Ao vivo", className: "bg-green-100 text-green-700" },
  finalizada: { label: "Finalizada", className: "bg-slate-100 text-slate-600" },
} as const;

export default function PartidasPage() {
  const [partidas, setPartidas] = useState<Partida[]>([]);
  const [busca, setBusca] = useState("");
  const [filtroStatus, setFiltroStatus] =
    useState<"todas" | Partida["status"]>("todas");
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");

  useEffect(() => {
    async function carregarPartidas() {
      try {
        const response = await fetch("/api/partidas");
        const resultado = await response.json();

        if (!response.ok || !resultado.success) {
          throw new Error(resultado.error || "Erro ao carregar partidas.");
        }

        setPartidas(resultado.data ?? []);
      } catch (error) {
        setErro(
          error instanceof Error ? error.message : "Erro ao carregar partidas.",
        );
      } finally {
        setCarregando(false);
      }
    }

    carregarPartidas();
  }, []);

  const partidasFiltradas = useMemo(() => {
    return partidas.filter((partida) => {
      const termo = busca.toLowerCase();

      const correspondeBusca =
        partida.nome.toLowerCase().includes(termo) ||
        partida.equipe1.toLowerCase().includes(termo) ||
        partida.equipe2.toLowerCase().includes(termo);

      const correspondeStatus =
        filtroStatus === "todas" || partida.status === filtroStatus;

      return correspondeBusca && correspondeStatus;
    });
  }, [partidas, busca, filtroStatus]);

  const partidaEmAndamento = partidas.find(
    (partida) => partida.status === "em_andamento",
  );

  return (
    <main className="flex-1 p-4 sm:p-6 lg:p-8">
      <div className="mx-auto w-full max-w-7xl">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-xl font-semibold sm:text-2xl">Partidas</h1>
            <p className="mt-1 text-sm text-slate-500">
              Crie, acompanhe e gerencie as partidas do Decatlo.
            </p>
          </div>

          <Link
            href="/dashboard/partidas/nova"
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-slate-900 px-5 py-3 text-sm font-semibold text-white hover:bg-slate-800"
          >
            <Plus size={18} />
            Nova partida
          </Link>
        </div>

        {partidaEmAndamento && (
          <section className="mt-6 rounded-xl border border-green-200 bg-white shadow-sm">
            <div className="flex flex-col gap-5 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
              <div className="flex items-start gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-green-100 text-green-700">
                  <PlayCircle size={22} />
                </div>
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="font-semibold">Partida em andamento</h2>
                    <span className="rounded-full bg-green-100 px-2.5 py-1 text-xs font-semibold text-green-700">
                      Ao vivo
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-slate-500">
                    {partidaEmAndamento.nome}
                  </p>
                  <p className="mt-2 text-xs text-slate-400">
                    {partidaEmAndamento.equipe1} × {partidaEmAndamento.equipe2}
                    {" • "}Pergunta {partidaEmAndamento.perguntaAtual} de{" "}
                    {partidaEmAndamento.perguntas}
                  </p>
                </div>
              </div>

              <Link
                href={`/dashboard/partidas/${partidaEmAndamento.id}/controle`}
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-slate-800"
              >
                Continuar partida
                <ArrowRight size={17} />
              </Link>
            </div>
          </section>
        )}

        <section className="mt-6 rounded-xl border border-slate-200 bg-white shadow-sm">
          <div className="flex flex-col gap-4 p-5 lg:flex-row lg:items-center lg:justify-between">
            <div className="relative w-full lg:max-w-md">
              <Search
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                type="search"
                value={busca}
                onChange={(event) => setBusca(event.target.value)}
                placeholder="Buscar partida ou equipe..."
                className="w-full rounded-lg border border-slate-300 py-2.5 pl-10 pr-4 text-sm outline-none focus:border-slate-700"
              />
            </div>

            <div className="flex flex-wrap gap-2">
              {[
                ["todas", "Todas"],
                ["em_andamento", "Em andamento"],
                ["pronta", "Prontas"],
                ["configuracao", "Em configuração"],
                ["finalizada", "Finalizadas"],
              ].map(([value, label]) => (
                <button
                  key={value}
                  type="button"
                  onClick={() =>
                    setFiltroStatus(value as "todas" | Partida["status"])
                  }
                  className={`rounded-lg px-3 py-2 text-xs font-semibold ${
                    filtroStatus === value
                      ? "bg-slate-900 text-white"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        </section>

        <section className="mt-6">
          <div className="mb-4">
            <h2 className="text-lg font-semibold">Todas as partidas</h2>
            <p className="mt-1 text-sm text-slate-500">
              {partidasFiltradas.length}{" "}
              {partidasFiltradas.length === 1
                ? "partida encontrada"
                : "partidas encontradas"}
            </p>
          </div>

          {carregando ? (
            <div className="rounded-xl border border-slate-200 bg-white p-10 text-center text-sm text-slate-500">
              Carregando partidas...
            </div>
          ) : erro ? (
            <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-center text-sm text-red-700">
              {erro}
            </div>
          ) : (
            <div className="space-y-4">
              {partidasFiltradas.map((partida) => {
                const status = statusConfig[partida.status];

                return (
                  <div
                    key={partida.id}
                    className="rounded-xl border border-slate-200 bg-white shadow-sm"
                  >
                    <div className="p-5 sm:p-6">
                      <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                        <div className="flex min-w-0 items-start gap-4">
                          <div className="hidden h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-slate-100 sm:flex">
                            <Gamepad2 size={21} />
                          </div>
                          <div className="min-w-0">
                            <div className="flex flex-wrap items-center gap-2">
                              <h3 className="font-semibold">{partida.nome}</h3>
                              <span
                                className={`rounded-full px-2.5 py-1 text-xs font-semibold ${status.className}`}
                              >
                                {status.label}
                              </span>
                            </div>
                            <p className="mt-2 text-sm text-slate-600">
                              {partida.equipe1} × {partida.equipe2}
                            </p>
                            <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-400">
                              <span>
                                {new Date(partida.data).toLocaleDateString(
                                  "pt-BR",
                                )}
                              </span>
                              <span>{partida.perguntas} perguntas</span>
                              {partida.status === "em_andamento" && (
                                <span>
                                  Pergunta {partida.perguntaAtual} de{" "}
                                  {partida.perguntas}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>

                        <Link
                          href={`/dashboard/partidas/${partida.id}`}
                          className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                        >
                          Ver partida
                          <ArrowRight size={16} />
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              })}

              {partidasFiltradas.length === 0 && (
                <div className="rounded-xl border border-dashed border-slate-300 bg-white px-6 py-12 text-center">
                  <Gamepad2 size={32} className="mx-auto text-slate-300" />
                  <h3 className="mt-4 font-semibold">
                    Nenhuma partida encontrada
                  </h3>
                  <p className="mt-1 text-sm text-slate-500">
                    Tente alterar os filtros ou criar uma nova partida.
                  </p>
                </div>
              )}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
