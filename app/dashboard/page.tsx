"use client";

import { useState } from "react";

import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import Footer from "@/components/Footer";

export default function Dashboard() {
    // este estado está se repetindo em todas paginas que usam o header e sidebar, podemos criar um contexto para ele.
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <main className="min-h-screen bg-slate-100 text-slate-900">
      <div className="flex min-h-screen">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

        <section className="flex min-w-0 flex-1 flex-col">
          <Header onMenuClick={() => setSidebarOpen(true)} />

          <main className="flex-1 p-4 sm:p-6 lg:p-8">
            <div className="mx-auto max-w-7xl">
              {/* Estatísticas */}
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                  <p className="text-sm text-slate-500">
                    Perguntas cadastradas
                  </p>

                  <p className="mt-2 text-3xl font-bold">128</p>

                  <p className="mt-2 text-xs text-slate-400">
                    Total de perguntas
                  </p>
                </div>

                <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                  <p className="text-sm text-slate-500">Usuários</p>

                  <p className="mt-2 text-3xl font-bold">12</p>

                  <p className="mt-2 text-xs text-slate-400">
                    Usuários cadastrados
                  </p>
                </div>

                <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                  <p className="text-sm text-slate-500">Partidas realizadas</p>

                  <p className="mt-2 text-3xl font-bold">8</p>

                  <p className="mt-2 text-xs text-slate-400">
                    Histórico de partidas
                  </p>
                </div>

                <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                  <p className="text-sm text-slate-500">Partida atual</p>

                  <p className="mt-2 text-xl font-bold">Nenhuma</p>

                  <p className="mt-2 text-xs text-slate-400">
                    Nenhuma partida em andamento
                  </p>
                </div>
              </div>

              {/* Ações principais */}
              <div className="mt-8">
                <div className="mb-4">
                  <h3 className="text-lg font-semibold">Funcionalidades</h3>

                  <p className="mt-1 text-sm text-slate-500">
                    Acesse as principais áreas do sistema.
                  </p>
                </div>

                <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                  <a
                    href="/gerenciamento-perguntas"
                    className="group rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md"
                  >
                    <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-lg bg-slate-100 text-xl">
                      ▤
                    </div>

                    <h4 className="font-semibold">
                      Gerenciamento de perguntas
                    </h4>

                    <p className="mt-2 text-sm leading-6 text-slate-500">
                      Cadastre, visualize, edite e exclua perguntas e respostas.
                    </p>

                    <p className="mt-5 text-sm font-semibold">Acessar →</p>
                  </a>

                  <a
                    href="/configuracao-jogo"
                    className="group rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md"
                  >
                    <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-lg bg-slate-100 text-xl">
                      ⚙
                    </div>

                    <h4 className="font-semibold">Configuração do jogo</h4>

                    <p className="mt-2 text-sm leading-6 text-slate-500">
                      Configure equipes, perguntas, matérias e tempo de
                      resposta.
                    </p>

                    <p className="mt-5 text-sm font-semibold">Acessar →</p>
                  </a>

                  <a
                    href="/gerenciamento-jogo"
                    className="group rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md"
                  >
                    <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-lg bg-slate-100 text-xl">
                      ▶
                    </div>

                    <h4 className="font-semibold">Painel do apresentador</h4>

                    <p className="mt-2 text-sm leading-6 text-slate-500">
                      Controle uma partida, cronômetro, respostas e pontuação.
                    </p>

                    <p className="mt-5 text-sm font-semibold">Abrir →</p>
                  </a>

                  <a
                    href="/usuarios"
                    className="group rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md"
                  >
                    <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-lg bg-slate-100 text-xl">
                      ♙
                    </div>

                    <h4 className="font-semibold">Usuários</h4>

                    <p className="mt-2 text-sm leading-6 text-slate-500">
                      Cadastre e gerencie os usuários do sistema.
                    </p>

                    <p className="mt-5 text-sm font-semibold">Acessar →</p>
                  </a>

                  <a
                    href="/auditoria"
                    className="group rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md"
                  >
                    <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-lg bg-slate-100 text-xl">
                      ▥
                    </div>

                    <h4 className="font-semibold">Auditoria</h4>

                    <p className="mt-2 text-sm leading-6 text-slate-500">
                      Consulte o histórico de alterações realizadas no sistema.
                    </p>

                    <p className="mt-5 text-sm font-semibold">Acessar →</p>
                  </a>

                  <a
                    href="/telao"
                    target="_blank"
                    className="group rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md"
                  >
                    <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-lg bg-slate-100 text-xl">
                      ▣
                    </div>

                    <h4 className="font-semibold">Tela de apresentação</h4>

                    <p className="mt-2 text-sm leading-6 text-slate-500">
                      Abrir a tela que será utilizada no telão da apresentação.
                    </p>

                    <p className="mt-5 text-sm font-semibold">Abrir telão ↗</p>
                  </a>
                </div>
              </div>

              {/* Atividade recente */}
              <div className="mt-8 rounded-xl border border-slate-200 bg-white shadow-sm">
                <div className="border-b border-slate-200 px-6 py-5">
                  <h3 className="font-semibold">Atividade recente</h3>

                  <p className="mt-1 text-sm text-slate-500">
                    Últimas ações realizadas no sistema.
                  </p>
                </div>

                <div className="divide-y divide-slate-100">
                  <div className="flex items-center justify-between px-6 py-4">
                    <div>
                      <p className="text-sm font-medium">Pergunta cadastrada</p>

                      <p className="mt-1 text-xs text-slate-500">
                        História — Pergunta #128
                      </p>
                    </div>

                    <span className="text-xs text-slate-400">Hoje, 13:42</span>
                  </div>

                  <div className="flex items-center justify-between px-6 py-4">
                    <div>
                      <p className="text-sm font-medium">Pergunta editada</p>

                      <p className="mt-1 text-xs text-slate-500">
                        Geografia — Pergunta #102
                      </p>
                    </div>

                    <span className="text-xs text-slate-400">Hoje, 13:35</span>
                  </div>

                  <div className="flex items-center justify-between px-6 py-4">
                    <div>
                      <p className="text-sm font-medium">
                        Nova partida configurada
                      </p>

                      <p className="mt-1 text-xs text-slate-500">
                        Alfa 1 × Alfa 2
                      </p>
                    </div>

                    <span className="text-xs text-slate-400">Hoje, 12:20</span>
                  </div>
                </div>
              </div>
            </div>
          </main>

          <Footer />
        </section>
      </div>
    </main>
  );
}
