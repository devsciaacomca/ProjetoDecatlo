"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Check,
  X,
  SkipForward,
  Play,
  Pause,
  RotateCcw,
  Monitor,
} from "lucide-react";

import Footer from "@/components/Footer";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";

export default function ControlePartidaPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [rodando, setRodando] = useState(false);

  const [tempo, setTempo] = useState(30);

  const [perguntaAtual, setPerguntaAtual] = useState(1);

  const totalPerguntas = 20;

  const equipeDaVez = "Alfa 1";

  const pergunta = {
    enunciado: "Em que ano ocorreu a Proclamação da República no Brasil?",

    alternativas: ["1822", "1889", "1891", "1930"],
  };

  const iniciarCronometro = () => {
    setRodando(true);
  };

  const pausarCronometro = () => {
    setRodando(false);
  };

  const reiniciarCronometro = () => {
    setTempo(30);
    setRodando(false);
  };

  const responder = (correta: boolean) => {
    console.log(correta ? "Resposta correta" : "Resposta incorreta");
  };

  const pularPergunta = () => {
    if (perguntaAtual < totalPerguntas) {
      setPerguntaAtual((valor) => valor + 1);
      setTempo(30);
      setRodando(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-100 text-slate-900">
      <div className="flex min-h-screen">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

        <section className="flex min-w-0 flex-1 flex-col">
          <Header onMenuClick={() => setSidebarOpen(true)} />

          <main className="flex-1 p-4 sm:p-6 lg:p-8">
            <div className="mx-auto w-full max-w-7xl">
              {/* Cabeçalho */}
              <div className="mb-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <Link
                      href="/dashboard/partidas/123"
                      className="mb-3 inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-900"
                    >
                      <ArrowLeft size={16} />
                      Voltar para partida
                    </Link>

                    <h1 className="text-xl font-semibold sm:text-2xl">
                      Controle da partida
                    </h1>

                    <p className="mt-1 text-sm text-slate-500">Decatlo 2026</p>
                  </div>

                  <Link
                    href="/dashboard/telao/123"
                    target="_blank"
                    className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold hover:bg-slate-50"
                  >
                    <Monitor size={17} />
                    Abrir telão
                  </Link>
                </div>
              </div>

              {/* Progresso */}
              <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm text-slate-500">
                      Progresso da partida
                    </p>

                    <p className="mt-1 text-lg font-semibold">
                      Pergunta {perguntaAtual} de {totalPerguntas}
                    </p>
                  </div>

                  <div className="w-full sm:w-72">
                    <div className="mb-2 flex justify-between text-xs text-slate-500">
                      <span>Progresso</span>

                      <span>
                        {Math.round((perguntaAtual / totalPerguntas) * 100)}%
                      </span>
                    </div>

                    <div className="h-2 overflow-hidden rounded-full bg-slate-200">
                      <div
                        className="h-full bg-slate-900 transition-all"
                        style={{
                          width: `${(perguntaAtual / totalPerguntas) * 100}%`,
                        }}
                      />
                    </div>
                  </div>
                </div>
              </section>

              {/* Placar */}
              <section className="mt-5 grid gap-4 sm:grid-cols-2">
                <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                  <p className="text-sm text-slate-500">Alfa 1</p>

                  <p className="mt-1 text-3xl font-bold">0</p>

                  <p className="mt-1 text-xs text-slate-400">pontos</p>
                </div>

                <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                  <p className="text-sm text-slate-500">Alfa 2</p>

                  <p className="mt-1 text-3xl font-bold">0</p>

                  <p className="mt-1 text-xs text-slate-400">pontos</p>
                </div>
              </section>

              {/* Área principal */}
              <section className="mt-5 grid gap-5 lg:grid-cols-3">
                {/* Pergunta */}
                <div className="rounded-xl border border-slate-200 bg-white shadow-sm lg:col-span-2">
                  <div className="border-b border-slate-200 px-6 py-5">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                          Pergunta {perguntaAtual}
                        </p>

                        <p className="mt-1 text-sm font-semibold">
                          Equipe da vez: {equipeDaVez}
                        </p>
                      </div>

                      <div className="rounded-lg bg-slate-100 px-4 py-2 text-center">
                        <p className="text-xs text-slate-500">Tempo</p>

                        <p className="text-2xl font-bold tabular-nums">
                          {tempo}s
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="p-6">
                    <div className="rounded-xl bg-slate-50 p-6">
                      <p className="text-lg font-semibold leading-8">
                        {pergunta.enunciado}
                      </p>
                    </div>

                    <div className="mt-6 grid gap-3 sm:grid-cols-2">
                      {pergunta.alternativas.map((alternativa, index) => (
                        <button
                          key={alternativa}
                          type="button"
                          className="rounded-lg border border-slate-200 bg-white p-4 text-left transition hover:border-slate-400 hover:bg-slate-50"
                        >
                          <div className="flex items-center gap-3">
                            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-sm font-semibold">
                              {String.fromCharCode(65 + index)}
                            </span>

                            <span className="text-sm font-medium">
                              {alternativa}
                            </span>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Controles */}
                <aside className="rounded-xl border border-slate-200 bg-white shadow-sm">
                  <div className="border-b border-slate-200 px-5 py-5">
                    <h2 className="font-semibold">Controles</h2>

                    <p className="mt-1 text-sm text-slate-500">
                      Ações do apresentador.
                    </p>
                  </div>

                  <div className="space-y-3 p-5">
                    {/* Cronômetro */}
                    <div className="grid grid-cols-2 gap-2">
                      {!rodando ? (
                        <button
                          type="button"
                          onClick={iniciarCronometro}
                          className="inline-flex items-center justify-center gap-2 rounded-lg bg-slate-900 px-4 py-3 text-sm font-semibold text-white hover:bg-slate-800"
                        >
                          <Play size={16} />
                          Iniciar
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={pausarCronometro}
                          className="inline-flex items-center justify-center gap-2 rounded-lg bg-slate-900 px-4 py-3 text-sm font-semibold text-white hover:bg-slate-800"
                        >
                          <Pause size={16} />
                          Pausar
                        </button>
                      )}

                      <button
                        type="button"
                        onClick={reiniciarCronometro}
                        className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-300 px-4 py-3 text-sm font-semibold hover:bg-slate-50"
                      >
                        <RotateCcw size={16} />
                        Reiniciar
                      </button>
                    </div>

                    <div className="border-t border-slate-100 pt-3">
                      <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Resultado
                      </p>

                      <div className="grid gap-2">
                        <button
                          type="button"
                          onClick={() => responder(true)}
                          className="inline-flex items-center justify-center gap-2 rounded-lg bg-green-600 px-4 py-3 text-sm font-semibold text-white hover:bg-green-700"
                        >
                          <Check size={17} />
                          Resposta correta
                        </button>

                        <button
                          type="button"
                          onClick={() => responder(false)}
                          className="inline-flex items-center justify-center gap-2 rounded-lg bg-red-600 px-4 py-3 text-sm font-semibold text-white hover:bg-red-700"
                        >
                          <X size={17} />
                          Resposta incorreta
                        </button>
                      </div>
                    </div>

                    <div className="border-t border-slate-100 pt-3">
                      <button
                        type="button"
                        onClick={pularPergunta}
                        disabled={perguntaAtual >= totalPerguntas}
                        className="inline-flex w-full items-center justify-center gap-2 rounded-lg border border-slate-300 px-4 py-3 text-sm font-semibold hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        <SkipForward size={17} />
                        Pular pergunta
                      </button>
                    </div>
                  </div>
                </aside>
              </section>
            </div>
          </main>

          <Footer />
        </section>
      </div>
    </main>
  );
}
