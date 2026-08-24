"use client";

import { useState } from "react";
import Link from "next/link";
import { Plus, Gamepad2, PlayCircle, Search, ArrowRight } from "lucide-react";

import Footer from "@/components/Footer";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import { PartidaStatus } from "@/types/partidas";
import { partidas, statusConfig } from "@/data/partidas/partidas";

export default function PartidasPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [busca, setBusca] = useState("");

  const [filtroStatus, setFiltroStatus] = useState<"todas" | PartidaStatus>(
    "todas",
  );

  const partidasFiltradas = partidas.filter((partida) => {
    const correspondeBusca =
      partida.nome.toLowerCase().includes(busca.toLowerCase()) ||
      partida.equipe1.toLowerCase().includes(busca.toLowerCase()) ||
      partida.equipe2.toLowerCase().includes(busca.toLowerCase());

    const correspondeStatus =
      filtroStatus === "todas" || partida.status === filtroStatus;

    return correspondeBusca && correspondeStatus;
  });

  const partidaEmAndamento = partidas.find(
    (partida) => partida.status === "em_andamento",
  );

  return (
    <main className="min-h-screen bg-slate-100 text-slate-900">
      <div className="flex min-h-screen">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

        <section className="flex min-w-0 flex-1 flex-col">
          <Header onMenuClick={() => setSidebarOpen(true)} />

          <main className="flex-1 p-4 sm:p-6 lg:p-8">
            <div className="mx-auto w-full max-w-7xl">
              {/* Cabeçalho */}
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h1 className="text-xl font-semibold sm:text-2xl">
                    Partidas
                  </h1>

                  <p className="mt-1 text-sm text-slate-500">
                    Crie, acompanhe e gerencie as partidas do Decatlo.
                  </p>
                </div>

                <Link
                  href="/dashboard/partidas/nova"
                  className="inline-flex items-center justify-center gap-2 rounded-lg bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
                >
                  <Plus size={18} />
                  Nova partida
                </Link>
              </div>

              {/* Partida em andamento */}
              {partidaEmAndamento && (
                <section className="mt-6 rounded-xl border border-green-200 bg-white shadow-sm">
                  <div className="flex flex-col gap-5 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
                    <div className="flex items-start gap-4">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-green-100 text-green-700">
                        <PlayCircle size={22} />
                      </div>

                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <h2 className="font-semibold">
                            Partida em andamento
                          </h2>

                          <span className="rounded-full bg-green-100 px-2.5 py-1 text-xs font-semibold text-green-700">
                            Ao vivo
                          </span>
                        </div>

                        <p className="mt-1 text-sm text-slate-500">
                          {partidaEmAndamento.nome}
                        </p>

                        <p className="mt-2 text-xs text-slate-400">
                          {partidaEmAndamento.equipe1} ×{" "}
                          {partidaEmAndamento.equipe2}
                          {" • "}
                          Pergunta {partidaEmAndamento.perguntaAtual} de{" "}
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

              {/* Filtros */}
              <section className="mt-6 rounded-xl border border-slate-200 bg-white shadow-sm">
                <div className="flex flex-col gap-4 p-5 lg:flex-row lg:items-center lg:justify-between">
                  {/* Busca */}
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
                      className="w-full rounded-lg border border-slate-300 py-2.5 pl-10 pr-4 text-sm outline-none placeholder:text-slate-400 focus:border-slate-700 focus:ring-2 focus:ring-slate-200"
                    />
                  </div>

                  {/* Status */}
                  <div className="flex flex-wrap gap-2">
                    {[
                      {
                        value: "todas",
                        label: "Todas",
                      },
                      {
                        value: "em_andamento",
                        label: "Em andamento",
                      },
                      {
                        value: "pronta",
                        label: "Prontas",
                      },
                      {
                        value: "configuracao",
                        label: "Em configuração",
                      },
                      {
                        value: "finalizada",
                        label: "Finalizadas",
                      },
                    ].map((filtro) => (
                      <button
                        key={filtro.value}
                        type="button"
                        onClick={() =>
                          setFiltroStatus(
                            filtro.value as "todas" | PartidaStatus,
                          )
                        }
                        className={`rounded-lg px-3 py-2 text-xs font-semibold transition ${
                          filtroStatus === filtro.value
                            ? "bg-slate-900 text-white"
                            : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                        }`}
                      >
                        {filtro.label}
                      </button>
                    ))}
                  </div>
                </div>
              </section>

              {/* Lista */}
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

                <div className="space-y-4">
                  {partidasFiltradas.map((partida) => {
                    const status = statusConfig[partida.status];

                    const StatusIcon = status.icon;

                    return (
                      <div
                        key={partida.id}
                        className="rounded-xl border border-slate-200 bg-white shadow-sm transition hover:border-slate-300 hover:shadow-md"
                      >
                        <div className="p-5 sm:p-6">
                          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                            {/* Informações */}
                            <div className="flex min-w-0 items-start gap-4">
                              <div className="hidden h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-slate-100 sm:flex">
                                <Gamepad2 size={21} />
                              </div>

                              <div className="min-w-0">
                                <div className="flex flex-wrap items-center gap-2">
                                  <h3 className="font-semibold">
                                    {partida.nome}
                                  </h3>

                                  <span
                                    className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${status.className}`}
                                  >
                                    <StatusIcon size={13} />

                                    {status.label}
                                  </span>
                                </div>

                                <p className="mt-2 text-sm text-slate-600">
                                  {partida.equipe1}
                                  {" × "}
                                  {partida.equipe2}
                                </p>

                                <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-400">
                                  <span>{partida.data}</span>

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

                            {/* Ação */}
                            <div className="flex shrink-0">
                              <Link
                                href={`/dashboard/partidas/${partida.id}`}
                                className="inline-flex w-full items-center justify-center gap-2 rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 sm:w-auto"
                              >
                                Ver partida
                                <ArrowRight size={16} />
                              </Link>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Nenhum resultado */}
                {partidasFiltradas.length === 0 && (
                  <div className="rounded-xl border border-dashed border-slate-300 bg-white px-6 py-12 text-center">
                    <Gamepad2 size={32} className="mx-auto text-slate-300" />

                    <h3 className="mt-4 font-semibold">
                      Nenhuma partida encontrada
                    </h3>

                    <p className="mt-1 text-sm text-slate-500">
                      Tente alterar os filtros ou criar uma nova partida.
                    </p>

                    <Link
                      href="/dashboard/partidas/nova"
                      className="mt-5 inline-flex items-center gap-2 rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-slate-800"
                    >
                      <Plus size={17} />
                      Nova partida
                    </Link>
                  </div>
                )}
              </section>
            </div>
          </main>

          <Footer />
        </section>
      </div>
    </main>
  );
}
