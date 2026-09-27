"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import {
  ArrowLeft,
  Minus,
  Monitor,
  Pause,
  Play,
  Plus,
  Radio,
  Square,
} from "lucide-react";
import { GameProvider, useGame } from "@/contexts/GameContext";

function ControleContent() {
  const params = useParams<{ id: string }>();
  const {
    partida,
    pergunta,
    estado,
    configuracao,
    sincronizado,
    carregando,
    erro,
    iniciarPartida,
    pausarPartida,
    finalizarPartida,
    iniciarCronometro,
    pausarCronometro,
    reiniciarCronometro,
    proximaPergunta,
    perguntaAnterior,
    pularPergunta,
    trocarEquipe,
    definirEquipe,
    adicionarPonto,
    removerPonto,
    selecionarResposta,
    avaliarResposta,
    mostrarResposta,
    esconderResposta,
  } = useGame();

  if (carregando) {
    return (
      <div className="flex flex-1 items-center justify-center p-8 text-sm text-slate-500">
        Carregando partida...
      </div>
    );
  }

  if (erro) {
    return (
      <div className="flex flex-1 items-center justify-center p-8">
        <div className="rounded-xl border border-red-200 bg-red-50 p-5 text-sm text-red-700">
          {erro}
        </div>
      </div>
    );
  }

  const equipeDaVez =
    estado.equipeDaVez === "A" ? partida.equipe1 : partida.equipe2;
  const progresso =
    configuracao.totalPerguntas > 0
      ? Math.round((estado.perguntaAtual / configuracao.totalPerguntas) * 100)
      : 0;

  return (
    <main className="flex-1 p-4 sm:p-6 lg:p-8">
      <div className="mx-auto w-full max-w-7xl">
        <header className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <Link
              href={`/dashboard/partidas/${params.id}`}
              className="mb-3 inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-900"
            >
              <ArrowLeft size={16} /> Voltar para partida
            </Link>
            <h1 className="text-xl font-semibold sm:text-2xl">
              Controle da partida
            </h1>
            <p className="mt-1 text-sm text-slate-500">{partida.nome}</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <div className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm">
              <Radio
                size={16}
                className={sincronizado ? "text-green-600" : "text-slate-400"}
              />
              {sincronizado ? "Telão conectado" : "Aguardando telão"}
            </div>
            <Link
              href={`/telao/${params.id}`}
              target="_blank"
              className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold hover:bg-slate-50"
            >
              <Monitor size={17} /> Abrir telão
            </Link>
          </div>
        </header>

        <section className="mb-5 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Status
              </p>
              <p className="mt-2 font-semibold">
                {estado.status === "em_andamento"
                  ? "Partida em andamento"
                  : estado.status === "pausada"
                    ? "Partida pausada"
                    : estado.status === "finalizada"
                      ? "Partida finalizada"
                      : "Aguardando início"}
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              {estado.status !== "em_andamento" &&
                estado.status !== "finalizada" && (
                  <button
                    onClick={iniciarPartida}
                    className="inline-flex items-center gap-2 rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white"
                  >
                    <Play size={16} /> Iniciar partida
                  </button>
                )}
              {estado.status === "em_andamento" && (
                <button
                  onClick={pausarPartida}
                  className="inline-flex items-center gap-2 rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-semibold"
                >
                  <Pause size={16} /> Pausar partida
                </button>
              )}
              {estado.status !== "finalizada" && (
                <button
                  onClick={finalizarPartida}
                  className="inline-flex items-center gap-2 rounded-lg border border-red-200 px-4 py-2.5 text-sm font-semibold text-red-600"
                >
                  <Square size={15} /> Finalizar
                </button>
              )}
            </div>
          </div>
        </section>

        <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-slate-500">Progresso</p>
              <p className="mt-1 text-lg font-semibold">
                Pergunta {estado.perguntaAtual} de {configuracao.totalPerguntas}
              </p>
            </div>
            <div className="w-full sm:w-72">
              <div className="mb-2 flex justify-between text-xs text-slate-500">
                <span>Progresso</span>
                <span>{progresso}%</span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-slate-200">
                <div
                  className="h-full bg-slate-900 transition-all"
                  style={{ width: `${progresso}%` }}
                />
              </div>
            </div>
          </div>
        </section>

        <section className="mt-5 grid gap-4 sm:grid-cols-2">
          {(["A", "B"] as const).map((equipe) => {
            const nome = equipe === "A" ? partida.equipe1 : partida.equipe2;
            const pontos =
              equipe === "A" ? estado.pontos.equipe1 : estado.pontos.equipe2;
            return (
              <div
                key={equipe}
                className={`rounded-xl border p-5 shadow-sm ${estado.equipeDaVez === equipe ? "border-slate-900 bg-slate-50" : "border-slate-200 bg-white"}`}
              >
                <div className="flex items-center justify-between">
                  <p className="font-semibold">{nome}</p>
                  {estado.equipeDaVez === equipe && (
                    <span className="rounded-full bg-slate-900 px-2.5 py-1 text-xs font-semibold text-white">
                      Vez
                    </span>
                  )}
                </div>
                <p className="mt-2 text-4xl font-bold">{pontos}</p>
                <div className="mt-4 flex gap-2">
                  <button
                    onClick={() => removerPonto(equipe)}
                    className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-300"
                  >
                    <Minus size={16} />
                  </button>
                  <button
                    onClick={() => adicionarPonto(equipe)}
                    className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-slate-900 text-white"
                  >
                    <Plus size={16} />
                  </button>
                  <button
                    onClick={() => definirEquipe(equipe)}
                    className="ml-2 rounded-lg border border-slate-300 px-3 text-xs font-semibold"
                  >
                    Definir vez
                  </button>
                </div>
              </div>
            );
          })}
        </section>

        <section className="mt-4 grid gap-4 lg:grid-cols-[minmax(0,1fr)_300px]">
          {/* PERGUNTA */}
          <div className="min-w-0 rounded-xl border border-slate-200 bg-white shadow-sm">
            <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3">
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold uppercase text-slate-500">
                    Pergunta {estado.perguntaAtual}
                  </span>

                  <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs">
                    {pergunta?.assunto}
                  </span>
                </div>

                <p className="mt-1 truncate text-sm font-semibold">
                  Vez: {equipeDaVez}
                </p>
              </div>

              <div className="shrink-0 rounded-lg bg-slate-900 px-4 py-2 text-center text-white">
                <span className="block text-[10px] uppercase text-slate-300">
                  Tempo
                </span>

                <span className="text-xl font-black tabular-nums">
                  {estado.tempoRestante}s
                </span>
              </div>
            </div>

            <div className="p-4">
              {pergunta ? (
                <>
                  <div className="rounded-lg bg-slate-50 p-4">
                    <p className="text-base font-semibold leading-6 sm:text-lg">
                      {pergunta.enunciado}
                    </p>
                  </div>

                  {pergunta.tipo === "objetiva" && pergunta.alternativas && (
                    <div className="mt-3 grid gap-2 sm:grid-cols-2">
                      {pergunta.alternativas.map((alternativa, index) => {
                        const letra = String.fromCharCode(65 + index);

                        const selecionada =
                          estado.respostaSelecionada === alternativa.texto;

                        return (
                          <button
                            key={alternativa.id}
                            type="button"
                            onClick={() =>
                              selecionarResposta(alternativa.texto)
                            }
                            className={`flex min-h-12 items-center gap-3 rounded-lg border px-3 py-2 text-left transition ${
                              selecionada
                                ? "border-blue-600 bg-blue-50 ring-2 ring-blue-100"
                                : "border-slate-200 bg-white hover:border-slate-400 hover:bg-slate-50"
                            }`}
                          >
                            <span
                              className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-bold ${
                                selecionada
                                  ? "bg-blue-600 text-white"
                                  : "bg-slate-100 text-slate-700"
                              }`}
                            >
                              {letra}
                            </span>

                            <span className="text-sm font-medium">
                              {alternativa.texto}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  )}

                  {/* AVALIAÇÃO */}
                  <div className="mt-4 rounded-lg border border-slate-200 bg-slate-50 p-3">
                    <div className="mb-2 flex items-center justify-between">
                      <p className="text-xs font-bold uppercase tracking-wide text-slate-500">
                        Avaliar resposta
                      </p>

                      {estado.respostaSelecionada && (
                        <span className="text-xs font-semibold text-blue-700">
                          Selecionada: {estado.respostaSelecionada}
                        </span>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        disabled={!estado.respostaSelecionada}
                        onClick={() => avaliarResposta("correta")}
                        className="rounded-lg bg-green-600 px-3 py-2.5 text-sm font-bold text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-40"
                      >
                        ✓ Correta
                      </button>

                      <button
                        type="button"
                        disabled={!estado.respostaSelecionada}
                        onClick={() => avaliarResposta("incorreta")}
                        className="rounded-lg bg-red-600 px-3 py-2.5 text-sm font-bold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-40"
                      >
                        ✕ Errada
                      </button>
                    </div>
                  </div>

                  {/* GABARITO SOMENTE NO CONTROLE */}
                  <div className="mt-3 rounded-lg border border-amber-200 bg-amber-50 p-3">
                    <div className="flex items-center justify-between gap-3">
                      <div className="min-w-0">
                        <p className="text-[10px] font-bold uppercase tracking-wide text-amber-700">
                          Gabarito
                        </p>

                        <p className="truncate text-sm font-bold text-amber-950">
                          {pergunta.respostaCorreta}
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={
                          estado.respostaVisivel
                            ? esconderResposta
                            : mostrarResposta
                        }
                        className="shrink-0 rounded-md border border-amber-300 bg-white px-3 py-1.5 text-xs font-bold text-amber-900 hover:bg-amber-100"
                      >
                        {estado.respostaVisivel
                          ? "Ocultar no telão"
                          : "Mostrar no telão"}
                      </button>
                    </div>
                  </div>

                  {estado.resultado && (
                    <div
                      className={`mt-3 rounded-lg p-3 text-center text-sm font-bold ${
                        estado.resultado === "correta"
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {estado.resultado === "correta"
                        ? `${equipeDaVez} acertou!`
                        : "Resposta errada — vez da outra equipe"}
                    </div>
                  )}
                </>
              ) : (
                <div className="p-8 text-center text-sm text-slate-500">
                  Nenhuma pergunta encontrada.
                </div>
              )}
            </div>
          </div>

          <aside className="h-fit rounded-xl border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-200 px-4 py-3">
              <h2 className="text-sm font-bold">Controles</h2>
              <p className="text-xs text-slate-500">
                Controle rápido da partida
              </p>
            </div>

            <div className="space-y-3 p-3">
              {/* CRONÔMETRO */}
              <div>
                <p className="mb-1.5 text-[10px] font-bold uppercase tracking-wide text-slate-500">
                  Cronômetro
                </p>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={
                      estado.cronometroFimEm !== null
                        ? pausarCronometro
                        : iniciarCronometro
                    }
                    disabled={estado.status === "finalizada"}
                    className="flex h-10 flex-1 items-center justify-center rounded-lg bg-slate-900 text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-40"
                    title={
                      estado.cronometroFimEm !== null
                        ? "Pausar cronômetro"
                        : "Iniciar cronômetro"
                    }
                  >
                    {estado.cronometroFimEm !== null ? (
                      // Pause
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        className="h-5 w-5"
                      >
                        <path d="M6 5h4v14H6zM14 5h4v14h-4z" />
                      </svg>
                    ) : (
                      // Play
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        className="h-5 w-5"
                      >
                        <path d="M8 5.14v13.72L19 12 8 5.14z" />
                      </svg>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={reiniciarCronometro}
                    disabled={estado.status === "finalizada"}
                    className="flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                    title="Reiniciar cronômetro"
                  >
                    ↻
                  </button>
                </div>
              </div>

              {/* NAVEGAÇÃO */}
              <div>
                <p className="mb-1.5 text-[10px] font-bold uppercase tracking-wide text-slate-500">
                  Navegação
                </p>

                <div className="grid grid-cols-2 gap-1.5">
                  <button
                    onClick={perguntaAnterior}
                    disabled={estado.perguntaAtual <= 1}
                    className="rounded-lg border px-2 py-2 text-xs font-semibold disabled:opacity-40"
                  >
                    ← Anterior
                  </button>

                  <button
                    onClick={proximaPergunta}
                    className="rounded-lg bg-slate-900 px-2 py-2 text-xs font-semibold text-white"
                  >
                    Próxima →
                  </button>
                </div>

                {configuracao.permitirPular && (
                  <button
                    onClick={pularPergunta}
                    className="mt-1.5 w-full rounded-lg border border-dashed px-2 py-2 text-xs font-semibold"
                  >
                    Pular pergunta
                  </button>
                )}
              </div>

              {/* EQUIPE */}
              <div>
                <p className="mb-1.5 text-[10px] font-bold uppercase tracking-wide text-slate-500">
                  Equipe da vez
                </p>

                <div className="grid grid-cols-2 gap-1.5">
                  {(["A", "B"] as const).map((equipe) => (
                    <button
                      key={equipe}
                      onClick={() => definirEquipe(equipe)}
                      className={`rounded-lg px-2 py-2 text-xs font-bold ${
                        estado.equipeDaVez === equipe
                          ? "bg-slate-900 text-white"
                          : "border border-slate-200 hover:bg-slate-50"
                      }`}
                    >
                      Equipe {equipe}
                    </button>
                  ))}
                </div>
              </div>

              {/* PONTUAÇÃO */}
              <div>
                <p className="mb-1.5 text-[10px] font-bold uppercase tracking-wide text-slate-500">
                  Pontuação
                </p>

                <div className="grid grid-cols-2 gap-2">
                  {(["A", "B"] as const).map((equipe) => {
                    const pontos =
                      equipe === "A"
                        ? estado.pontos.equipe1
                        : estado.pontos.equipe2;

                    return (
                      <div
                        key={equipe}
                        className="rounded-lg border border-slate-200 p-2"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold">
                            {equipe === "A" ? partida.equipe1 : partida.equipe2}
                          </span>

                          <span className="text-lg font-black">{pontos}</span>
                        </div>

                        <div className="mt-1.5 grid grid-cols-2 gap-1">
                          <button
                            onClick={() => removerPonto(equipe)}
                            className="rounded border py-1 text-xs font-bold hover:bg-slate-50"
                          >
                            −
                          </button>

                          <button
                            onClick={() => adicionarPonto(equipe)}
                            className="rounded bg-slate-900 py-1 text-xs font-bold text-white"
                          >
                            +
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* TROCAR EQUIPE */}
              <button
                onClick={trocarEquipe}
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs font-bold hover:bg-slate-50"
              >
                ⇄ Trocar equipe
              </button>
            </div>
          </aside>
        </section>
      </div>
    </main>
  );
}

export default function ControlePage() {
  const params = useParams<{ id: string }>();
  return (
    <GameProvider partidaId={params.id} role="control">
      <ControleContent />
    </GameProvider>
  );
}
