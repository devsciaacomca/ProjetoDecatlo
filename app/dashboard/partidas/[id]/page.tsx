"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Gamepad2,
  Monitor,
  Settings,
  Play,
  Clock3,
  ListChecks,
  Users,
} from "lucide-react";

import Footer from "@/components/Footer";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import { PartidaStatus } from "@/types/partidas";
import { statusConfig } from "@/data/partidas/partidas";
export default function PartidaPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Temporário.
  // Mudar para buscar pelo ID dos dados partidas.
  const partida = {
    id: "123",
    nome: "Decatlo 2026",
    equipe1: "Alfa 1",
    equipe2: "Alfa 2",
    status: "pronta" as PartidaStatus,
    totalPerguntas: 20,
    perguntaAtual: 0,
    tempoResposta: 30,
    tipoPergunta: "Objetiva",
  };

  const status = statusConfig[partida.status];

  return (
    <main className="min-h-screen bg-slate-100 text-slate-900">
      <div className="flex min-h-screen">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

        <section className="flex min-w-0 flex-1 flex-col">
          <Header onMenuClick={() => setSidebarOpen(true)} />

          <main className="flex-1 p-4 sm:p-6 lg:p-8">
            <div className="mx-auto w-full max-w-6xl">
              {/* Cabeçalho */}
              <div className="mb-6">
                <Link
                  href="/dashboard/partidas"
                  className="mb-4 inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-900"
                >
                  <ArrowLeft size={16} />
                  Voltar para partidas
                </Link>

                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <div className="flex items-center gap-3">
                      <h1 className="text-xl font-semibold sm:text-2xl">
                        {partida.nome}
                      </h1>

                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${status.className}`}
                      >
                        {status.label}
                      </span>
                    </div>

                    <p className="mt-1 text-sm text-slate-500">
                      Gerencie e acompanhe esta partida.
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <Link
                      href={`/dashboard/partidas/${partida.id}/controle`}
                      className="inline-flex items-center gap-2 rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-slate-800"
                    >
                      <Gamepad2 size={17} />
                      Controle
                    </Link>

                    <Link
                      href={`/dashboard/telao/${partida.id}`}
                      target="_blank"
                      className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                    >
                      <Monitor size={17} />
                      Abrir telão
                    </Link>
                  </div>
                </div>
              </div>

              {/* Placar */}
              <section className="rounded-xl border border-slate-200 bg-white shadow-sm">
                <div className="border-b border-slate-200 px-6 py-5">
                  <h2 className="font-semibold">Placar</h2>

                  <p className="mt-1 text-sm text-slate-500">
                    Pontuação atual das equipes.
                  </p>
                </div>

                <div className="grid divide-y sm:grid-cols-2 sm:divide-x sm:divide-y-0">
                  <div className="p-8 text-center">
                    <p className="text-sm text-slate-500">{partida.equipe1}</p>

                    <p className="mt-2 text-5xl font-bold">0</p>

                    <p className="mt-2 text-xs text-slate-400">pontos</p>
                  </div>

                  <div className="p-8 text-center">
                    <p className="text-sm text-slate-500">{partida.equipe2}</p>

                    <p className="mt-2 text-5xl font-bold">0</p>

                    <p className="mt-2 text-xs text-slate-400">pontos</p>
                  </div>
                </div>
              </section>

              {/* Informações */}
              <section className="mt-6">
                <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                  <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                    <div className="flex items-center gap-2 text-slate-500">
                      <Users size={18} />

                      <span className="text-sm">Equipes</span>
                    </div>

                    <p className="mt-3 font-semibold">
                      {partida.equipe1} × {partida.equipe2}
                    </p>
                  </div>

                  <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                    <div className="flex items-center gap-2 text-slate-500">
                      <ListChecks size={18} />

                      <span className="text-sm">Perguntas</span>
                    </div>

                    <p className="mt-3 font-semibold">
                      {partida.perguntaAtual} / {partida.totalPerguntas}
                    </p>
                  </div>

                  <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                    <div className="flex items-center gap-2 text-slate-500">
                      <Clock3 size={18} />

                      <span className="text-sm">Tempo</span>
                    </div>

                    <p className="mt-3 font-semibold">
                      {partida.tempoResposta} segundos
                    </p>
                  </div>

                  <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                    <div className="flex items-center gap-2 text-slate-500">
                      <Settings size={18} />

                      <span className="text-sm">Tipo</span>
                    </div>

                    <p className="mt-3 font-semibold">{partida.tipoPergunta}</p>
                  </div>
                </div>
              </section>

              {/* Ações */}
              <section className="mt-6 rounded-xl border border-slate-200 bg-white shadow-sm">
                <div className="border-b border-slate-200 px-6 py-5">
                  <h2 className="font-semibold">Ações da partida</h2>

                  <p className="mt-1 text-sm text-slate-500">
                    Acesse as ferramentas necessárias para executar a partida.
                  </p>
                </div>

                <div className="grid gap-4 p-6 sm:grid-cols-2">
                  <Link
                    href={`/dashboard/partidas/${partida.id}/controle`}
                    className="group rounded-lg border border-slate-200 p-5 transition hover:border-slate-400 hover:bg-slate-50"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100">
                        <Gamepad2 size={20} />
                      </div>

                      <div>
                        <h3 className="font-semibold">Controle da partida</h3>

                        <p className="mt-1 text-sm text-slate-500">
                          Controle perguntas, tempo, respostas e pontuação.
                        </p>
                      </div>
                    </div>
                  </Link>

                  <Link
                    href={`/telao/${partida.id}`}
                    target="_blank"
                    className="group rounded-lg border border-slate-200 p-5 transition hover:border-slate-400 hover:bg-slate-50"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100">
                        <Monitor size={20} />
                      </div>

                      <div>
                        <h3 className="font-semibold">Telão</h3>

                        <p className="mt-1 text-sm text-slate-500">
                          Abra a apresentação pública da partida.
                        </p>
                      </div>
                    </div>
                  </Link>
                </div>
              </section>

              {/* Iniciar */}
              {partida.status === "pronta" && (
                <section className="mt-6 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                  <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <h2 className="font-semibold">Partida pronta</h2>

                      <p className="mt-1 text-sm text-slate-500">
                        Todas as configurações foram definidas. Quando estiver
                        pronto, inicie a partida.
                      </p>
                    </div>

                    <Link
                      href={`/dashboard/partidas/${partida.id}/controle`}
                      className="inline-flex items-center justify-center gap-2 rounded-lg bg-slate-900 px-5 py-3 text-sm font-semibold text-white hover:bg-slate-800"
                    >
                      <Play size={18} />
                      Iniciar partida
                    </Link>
                  </div>
                </section>
              )}
            </div>
          </main>

          <Footer />
        </section>
      </div>
    </main>
  );
}
