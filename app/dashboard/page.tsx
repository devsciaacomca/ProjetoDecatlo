"use client";

import Link from "next/link";
import { Plus, Gamepad2, List, Monitor, ClipboardList } from "lucide-react";
import { useUser } from "@/contexts/UserContext";

// Data
import { partidas } from "@/data/partidas/partidas";
import { dashboardStats } from "@/data/dashboard/stats";

export default function DashboardPage() {
  const { user } = useUser();

  const permissions = user?.permissions ?? [];

  const podeGerenciarPartidas = permissions.includes("jogo.configurar");

  const podeControlarPartida = permissions.includes("jogo.gerenciar");

  const podeGerenciarPerguntas = permissions.includes("perguntas.gerenciar");

  const podeAbrirTelao = permissions.includes("telao.abrir");

  const partidaEmAndamento = partidas.find(
    (partida) => partida.status === "em_andamento",
  );

  return (
    <main className="flex-1 p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl">
        {/* Cabeçalho */}
        <div>
          <h1 className="text-2xl font-bold">Visão geral</h1>

          <p className="mt-1 text-sm text-slate-500">
            Acompanhe as partidas e gerencie as principais atividades do
            sistema.
          </p>
        </div>

        {/* Ação principal */}
        {podeGerenciarPartidas && (
          <section className="mt-6 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-slate-100">
                  <Gamepad2 size={24} />
                </div>

                <div>
                  <h2 className="text-lg font-semibold">Partidas</h2>

                  <p className="mt-1 max-w-xl text-sm leading-6 text-slate-500">
                    Crie e configure uma nova partida, defina as equipes,
                    perguntas e regras antes de iniciar o jogo.
                  </p>
                </div>
              </div>

              <Link
                href="/dashboard/partidas/nova"
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
              >
                <Plus size={18} />
                Nova partida
              </Link>
            </div>
          </section>
        )}

        {/* Partida em andamento */}
        <section className="mt-6 rounded-xl border border-slate-200 bg-white shadow-sm">
          {partidaEmAndamento ? (
            <div className="px-6 py-6">
              <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-full bg-green-500" />

                    <span className="text-xs font-semibold uppercase tracking-wide text-green-700">
                      Em andamento
                    </span>
                  </div>

                  <h3 className="mt-2 text-lg font-semibold">
                    {partidaEmAndamento.nome}
                  </h3>

                  <p className="mt-1 text-sm text-slate-500">
                    {partidaEmAndamento.equipe1} <span className="mx-1">×</span>{" "}
                    {partidaEmAndamento.equipe2}
                  </p>

                  <p className="mt-2 text-xs text-slate-400">
                    Pergunta {partidaEmAndamento.perguntaAtual} de{" "}
                    {partidaEmAndamento.perguntas}
                  </p>
                </div>

                <div className="flex flex-col gap-2 sm:flex-row">
                  {podeControlarPartida && (
                    <Link
                      href={`/dashboard/partidas/${partidaEmAndamento.id}/controle`}
                      className="inline-flex items-center justify-center gap-2 rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800"
                    >
                      <Gamepad2 size={17} />
                      Controlar partida
                    </Link>
                  )}

                  {podeAbrirTelao && partidaEmAndamento && (
                    <Link
                      href={`/telao/${partidaEmAndamento.id}`}
                      target="_blank"
                      className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                    >
                      <Monitor size={17} />
                      Abrir telão
                    </Link>
                  )}
                </div>
              </div>
            </div>
          ) : (
            /* Estado sem partida */
            <div className="px-6 py-8">
              <div className="flex flex-col items-center justify-center text-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-100">
                  <Gamepad2 size={22} className="text-slate-400" />
                </div>

                <p className="mt-4 text-sm font-medium">
                  Nenhuma partida em andamento
                </p>

                <p className="mt-1 max-w-md text-sm text-slate-500">
                  Quando uma partida for iniciada, ela aparecerá aqui para
                  acesso rápido ao controle e ao telão.
                </p>

                <Link
                  href="/dashboard/partidas"
                  className="mt-4 inline-flex items-center gap-2 text-sm font-semibold hover:underline"
                >
                  <List size={16} />
                  Ver partidas
                </Link>
              </div>
            </div>
          )}
        </section>

        {/* Acesso rápido */}
        <section className="mt-8">
          <div className="mb-4">
            <h2 className="text-lg font-semibold">Acesso rápido</h2>

            <p className="mt-1 text-sm text-slate-500">
              Acesse rapidamente as principais áreas do sistema.
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-3">
            {/* Partidas */}
            {podeGerenciarPartidas && (
              <Link
                href="/dashboard/partidas"
                className="group rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md"
              >
                <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-lg bg-slate-100">
                  <List size={21} />
                </div>

                <h3 className="font-semibold">Partidas</h3>

                <p className="mt-2 text-sm leading-6 text-slate-500">
                  Consulte partidas criadas, em andamento e finalizadas.
                </p>

                <p className="mt-5 text-sm font-semibold">Ver partidas →</p>
              </Link>
            )}

            {/* Perguntas */}
            {podeGerenciarPerguntas && (
              <Link
                href="/dashboard/gerenciamento-perguntas"
                className="group rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md"
              >
                <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-lg bg-slate-100">
                  <ClipboardList size={21} />
                </div>

                <h3 className="font-semibold">Banco de perguntas</h3>

                <p className="mt-2 text-sm leading-6 text-slate-500">
                  Cadastre, consulte e gerencie as perguntas utilizadas nas
                  partidas.
                </p>

                <p className="mt-5 text-sm font-semibold">
                  Gerenciar perguntas →
                </p>
              </Link>
            )}
            {/* Telão */}
            {podeAbrirTelao && partidaEmAndamento && (
              <Link
                href={`/telao/${partidaEmAndamento.id}`}
                target="_blank"
                className="group rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md"
              >
                <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-lg bg-slate-100">
                  <Monitor size={21} />
                </div>

                <h3 className="font-semibold">Telão</h3>

                <p className="mt-2 text-sm leading-6 text-slate-500">
                  Abra a apresentação da partida para exibição ao público.
                </p>

                <p className="mt-5 text-sm font-semibold">Abrir telão →</p>
              </Link>
            )}
          </div>
        </section>

        {/* Estatísticas 
              conteúdo estático, futuramente será dinâmico com base em dados reais do sistema
              */}
        <section className="mt-8">
          <div className="mb-4">
            <h2 className="text-lg font-semibold">Estatísticas</h2>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {dashboardStats.map((stat) => (
              <div
                key={stat.label}
                className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
              >
                <p className="text-sm text-slate-500">{stat.label}</p>

                <p className="mt-2 text-3xl font-bold">{stat.value}</p>

                <p className="mt-2 text-xs text-slate-400">
                  {stat.description}
                </p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
