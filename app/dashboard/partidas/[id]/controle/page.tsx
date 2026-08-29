"use client";

import Link from "next/link";
import { useParams } from "next/navigation";

import {
  ArrowLeft,
  Check,
  X,
  SkipForward,
  Play,
  Pause,
  RotateCcw,
  Monitor,
  Plus,
  Minus,
  ArrowRight,
  ArrowLeftCircle,
  Radio,
  Trophy,
  Eye,
  EyeOff,
  Square,
} from "lucide-react";

import {
  perguntas,
} from "@/data/perguntas/perguntas";

import {
  GameProvider,
  useGame,
} from "@/contexts/GameContext";

function ControleContent() {
  const params =
    useParams<{ id: string }>();

  const {
    partida,
    estado,
    configuracao,
    sincronizado,

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

    responder,

    adicionarPonto,
    removerPonto,

    mostrarResposta,
    esconderResposta,
  } = useGame();

  const pergunta =
    perguntas[
      estado.perguntaAtual - 1
    ];

  const progresso =
    configuracao.totalPerguntas >
    0
      ? Math.round(
          (estado.perguntaAtual /
            configuracao.totalPerguntas) *
            100,
        )
      : 0;

  const equipeDaVez =
    estado.equipeDaVez === "A"
      ? partida.equipe1
      : partida.equipe2;

  return (
    <main className="flex-1 p-4 sm:p-6 lg:p-8">
      <div className="mx-auto w-full max-w-7xl">
        {/* CABEÇALHO */}

        <div className="mb-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <Link
                href={`/dashboard/partidas/${params.id}`}
                className="mb-3 inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-900"
              >
                <ArrowLeft size={16} />

                Voltar para partida
              </Link>

              <h1 className="text-xl font-semibold sm:text-2xl">
                Controle da partida
              </h1>

              <p className="mt-1 text-sm text-slate-500">
                {partida.nome}
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              <div className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm">
                <Radio
                  size={16}
                  className={
                    sincronizado
                      ? "text-green-600"
                      : "text-slate-400"
                  }
                />

                <span>
                  {sincronizado
                    ? "Telão conectado"
                    : "Aguardando telão"}
                </span>
              </div>

              <Link
                href={`/telao/${params.id}`}
                target="_blank"
                className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold hover:bg-slate-50"
              >
                <Monitor size={17} />

                Abrir telão
              </Link>
            </div>
          </div>
        </div>

        {/* STATUS */}

        <section className="mb-5 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Status
              </p>

              <div className="mt-2 flex items-center gap-3">
                <span
                  className={`h-3 w-3 rounded-full ${
                    estado.status ===
                    "em_andamento"
                      ? "bg-green-500"
                      : estado.status ===
                          "finalizada"
                        ? "bg-blue-500"
                        : "bg-amber-500"
                  }`}
                />

                <span className="font-semibold">
                  {estado.status ===
                    "em_andamento" &&
                    "Partida em andamento"}

                  {estado.status ===
                    "pausada" &&
                    "Partida pausada"}

                  {estado.status ===
                    "aguardando" &&
                    "Aguardando início"}

                  {estado.status ===
                    "finalizada" &&
                    "Partida finalizada"}
                </span>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              {estado.status !==
                "em_andamento" &&
                estado.status !==
                  "finalizada" && (
                  <button
                    type="button"
                    onClick={
                      iniciarPartida
                    }
                    className="inline-flex items-center justify-center gap-2 rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-slate-800"
                  >
                    <Play size={16} />

                    Iniciar partida
                  </button>
                )}

              {estado.status ===
                "em_andamento" && (
                <button
                  type="button"
                  onClick={
                    pausarPartida
                  }
                  className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-semibold hover:bg-slate-50"
                >
                  <Pause size={16} />

                  Pausar partida
                </button>
              )}

              {estado.status !==
                "finalizada" && (
                <button
                  type="button"
                  onClick={
                    finalizarPartida
                  }
                  className="inline-flex items-center justify-center gap-2 rounded-lg border border-red-200 px-4 py-2.5 text-sm font-semibold text-red-600 hover:bg-red-50"
                >
                  <Square size={15} />

                  Finalizar
                </button>
              )}
            </div>
          </div>
        </section>

        {/* PROGRESSO */}

        <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-slate-500">
                Progresso da partida
              </p>

              <p className="mt-1 text-lg font-semibold">
                Pergunta{" "}
                {estado.perguntaAtual}{" "}
                de{" "}
                {configuracao.totalPerguntas}
              </p>
            </div>

            <div className="w-full sm:w-72">
              <div className="mb-2 flex justify-between text-xs text-slate-500">
                <span>Progresso</span>

                <span>
                  {progresso}%
                </span>
              </div>

              <div className="h-2 overflow-hidden rounded-full bg-slate-200">
                <div
                  className="h-full bg-slate-900 transition-all"
                  style={{
                    width: `${progresso}%`,
                  }}
                />
              </div>
            </div>
          </div>
        </section>

        {/* PLACAR */}

        <section className="mt-5 grid gap-4 sm:grid-cols-2">
          <div
            className={`rounded-xl border p-5 shadow-sm ${
              estado.equipeDaVez ===
              "A"
                ? "border-slate-900 bg-slate-50"
                : "border-slate-200 bg-white"
            }`}
          >
            <div className="flex items-center justify-between">
              <p className="text-sm text-slate-500">
                {partida.equipe1}
              </p>

              {estado.equipeDaVez ===
                "A" && (
                <span className="rounded-full bg-slate-900 px-2.5 py-1 text-xs font-semibold text-white">
                  Vez
                </span>
              )}
            </div>

            <p className="mt-1 text-4xl font-bold">
              {estado.pontos.equipe1}
            </p>

            <p className="mt-1 text-xs text-slate-400">
              pontos
            </p>

            <div className="mt-4 flex gap-2">
              <button
                type="button"
                onClick={() =>
                  removerPonto("A")
                }
                className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-300 hover:bg-slate-100"
              >
                <Minus
                  size={16}
                />
              </button>

              <button
                type="button"
                onClick={() =>
                  adicionarPonto("A")
                }
                className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-slate-900 text-white hover:bg-slate-800"
              >
                <Plus
                  size={16}
                />
              </button>
            </div>
          </div>

          <div
            className={`rounded-xl border p-5 shadow-sm ${
              estado.equipeDaVez ===
              "B"
                ? "border-slate-900 bg-slate-50"
                : "border-slate-200 bg-white"
            }`}
          >
            <div className="flex items-center justify-between">
              <p className="text-sm text-slate-500">
                {partida.equipe2}
              </p>

              {estado.equipeDaVez ===
                "B" && (
                <span className="rounded-full bg-slate-900 px-2.5 py-1 text-xs font-semibold text-white">
                  Vez
                </span>
              )}
            </div>

            <p className="mt-1 text-4xl font-bold">
              {estado.pontos.equipe2}
            </p>

            <p className="mt-1 text-xs text-slate-400">
              pontos
            </p>

            <div className="mt-4 flex gap-2">
              <button
                type="button"
                onClick={() =>
                  removerPonto("B")
                }
                className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-300 hover:bg-slate-100"
              >
                <Minus
                  size={16}
                />
              </button>

              <button
                type="button"
                onClick={() =>
                  adicionarPonto("B")
                }
                className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-slate-900 text-white hover:bg-slate-800"
              >
                <Plus
                  size={16}
                />
              </button>
            </div>
          </div>
        </section>

        {/* ÁREA PRINCIPAL */}

        <section className="mt-5 grid gap-5 lg:grid-cols-3">
          {/* PERGUNTA */}

          <div className="rounded-xl border border-slate-200 bg-white shadow-sm lg:col-span-2">
            <div className="border-b border-slate-200 px-6 py-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Pergunta{" "}
                    {estado.perguntaAtual}
                  </p>

                  <p className="mt-1 text-sm font-semibold">
                    Equipe da vez:{" "}
                    {equipeDaVez}
                  </p>
                </div>

                <div className="rounded-lg bg-slate-100 px-4 py-2 text-center">
                  <p className="text-xs text-slate-500">
                    Tempo
                  </p>

                  <p className="text-2xl font-bold tabular-nums">
                    {estado.tempoRestante}
                    s
                  </p>
                </div>
              </div>
            </div>

            <div className="p-6">
              {pergunta ? (
                <>
                  <div className="rounded-xl bg-slate-50 p-6">
                    <div className="mb-3 flex items-center gap-2">
                      <span className="rounded-full bg-slate-200 px-2.5 py-1 text-xs font-semibold text-slate-600">
                        {pergunta.assunto}
                      </span>

                      <span className="rounded-full bg-slate-200 px-2.5 py-1 text-xs font-semibold text-slate-600">
                        {pergunta.tipo}
                      </span>
                    </div>

                    <p className="text-lg font-semibold leading-8">
                      {pergunta.enunciado}
                    </p>
                  </div>

                  {pergunta.alternativas &&
                    pergunta.alternativas.length >
                      0 && (
                      <div className="mt-6 grid gap-3 sm:grid-cols-2">
                        {pergunta.alternativas.map(
                          (
                            alternativa,
                            index,
                          ) => (
                            <div
                              key={
                                alternativa.id
                              }
                              className="rounded-lg border border-slate-200 bg-white p-4"
                            >
                              <div className="flex items-center gap-3">
                                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-sm font-semibold">
                                  {String.fromCharCode(
                                    65 +
                                      index,
                                  )}
                                </span>

                                <span className="text-sm font-medium">
                                  {
                                    alternativa.texto
                                  }
                                </span>
                              </div>
                            </div>
                          ),
                        )}
                      </div>
                    )}

                  {estado.respostaVisivel &&
                    pergunta.respostaCorreta && (
                      <div className="mt-6 rounded-xl border border-green-200 bg-green-50 p-5">
                        <p className="text-xs font-bold uppercase tracking-wide text-green-700">
                          Resposta correta
                        </p>

                        <p className="mt-1 text-lg font-bold text-green-900">
                          {
                            pergunta.respostaCorreta
                          }
                        </p>
                      </div>
                    )}
                </>
              ) : (
                <div className="rounded-xl bg-slate-50 p-8 text-center">
                  <p className="font-semibold">
                    Pergunta não encontrada.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* CONTROLES */}

          <aside className="rounded-xl border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-200 px-5 py-5">
              <h2 className="font-semibold">
                Controles
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Ações do apresentador.
              </p>
            </div>

            <div className="space-y-3 p-5">
              {/* CRONÔMETRO */}

              <div>
                <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Cronômetro
                </p>

                <div className="grid grid-cols-2 gap-2">
                  {estado.status !==
                    "em_andamento" ? (
                    <button
                      type="button"
                      onClick={
                        iniciarCronometro
                      }
                      disabled={
                        estado.status ===
                        "finalizada"
                      }
                      className="inline-flex items-center justify-center gap-2 rounded-lg bg-slate-900 px-4 py-3 text-sm font-semibold text-white hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <Play
                        size={16}
                      />

                      Iniciar
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={
                        pausarCronometro
                      }
                      className="inline-flex items-center justify-center gap-2 rounded-lg bg-slate-900 px-4 py-3 text-sm font-semibold text-white hover:bg-slate-800"
                    >
                      <Pause
                        size={16}
                      />

                      Pausar
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={
                      reiniciarCronometro
                    }
                    disabled={
                      estado.status ===
                      "finalizada"
                    }
                    className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-300 px-4 py-3 text-sm font-semibold hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <RotateCcw
                      size={16}
                    />

                    Reiniciar
                  </button>
                </div>
              </div>

              {/* EQUIPE */}

              <div className="border-t border-slate-100 pt-3">
                <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Equipe da vez
                </p>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() =>
                      definirEquipe(
                        "A",
                      )
                    }
                    className={`rounded-lg border px-3 py-3 text-sm font-semibold ${
                      estado.equipeDaVez ===
                      "A"
                        ? "border-slate-900 bg-slate-900 text-white"
                        : "border-slate-300 hover:bg-slate-50"
                    }`}
                  >
                    {partida.equipe1}
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      definirEquipe(
                        "B",
                      )
                    }
                    className={`rounded-lg border px-3 py-3 text-sm font-semibold ${
                      estado.equipeDaVez ===
                      "B"
                        ? "border-slate-900 bg-slate-900 text-white"
                        : "border-slate-300 hover:bg-slate-50"
                    }`}
                  >
                    {partida.equipe2}
                  </button>
                </div>

                <button
                  type="button"
                  onClick={
                    trocarEquipe
                  }
                  className="mt-2 inline-flex w-full items-center justify-center gap-2 rounded-lg border border-slate-300 px-4 py-3 text-sm font-semibold hover:bg-slate-50"
                >
                  <ArrowRight
                    size={16}
                  />

                  Trocar vez
                </button>
              </div>

              {/* RESULTADO */}

              <div className="border-t border-slate-100 pt-3">
                <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Resultado
                </p>

                <div className="grid gap-2">
                  <button
                    type="button"
                    onClick={() =>
                      responder(
                        "correta",
                      )
                    }
                    disabled={
                      estado.status ===
                      "finalizada"
                    }
                    className="inline-flex items-center justify-center gap-2 rounded-lg bg-green-600 px-4 py-3 text-sm font-semibold text-white hover:bg-green-700 disabled:opacity-50"
                  >
                    <Check
                      size={17}
                    />

                    Resposta correta
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      responder(
                        "incorreta",
                      )
                    }
                    disabled={
                      estado.status ===
                      "finalizada"
                    }
                    className="inline-flex items-center justify-center gap-2 rounded-lg bg-red-600 px-4 py-3 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-50"
                  >
                    <X
                      size={17}
                    />

                    Resposta incorreta
                  </button>
                </div>
              </div>

              {/* RESPOSTA */}

              <div className="border-t border-slate-100 pt-3">
                {!estado.respostaVisivel ? (
                  <button
                    type="button"
                    onClick={
                      mostrarResposta
                    }
                    className="inline-flex w-full items-center justify-center gap-2 rounded-lg border border-slate-300 px-4 py-3 text-sm font-semibold hover:bg-slate-50"
                  >
                    <Eye size={16} />

                    Mostrar resposta
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={
                      esconderResposta
                    }
                    className="inline-flex w-full items-center justify-center gap-2 rounded-lg border border-slate-300 px-4 py-3 text-sm font-semibold hover:bg-slate-50"
                  >
                    <EyeOff size={16} />

                    Esconder resposta
                  </button>
                )}
              </div>

              {/* NAVEGAÇÃO */}

              <div className="border-t border-slate-100 pt-3">
                <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Pergunta
                </p>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={
                      perguntaAnterior
                    }
                    disabled={
                      estado.perguntaAtual <=
                        1 ||
                      estado.status ===
                        "finalizada"
                    }
                    className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-300 px-3 py-3 text-sm font-semibold hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <ArrowLeftCircle
                      size={16}
                    />

                    Anterior
                  </button>

                  <button
  type="button"
  onClick={proximaPergunta}
  disabled={
    estado.status ===
    "finalizada"
  }
  className="inline-flex items-center justify-center gap-2 rounded-lg bg-slate-900 px-3 py-3 text-sm font-semibold text-white hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
>
  {estado.perguntaAtual >=
  configuracao.totalPerguntas ? (
    <>
      Finalizar

      <Trophy size={16} />
    </>
  ) : (
    <>
      Próxima

      <ArrowRight size={16} />
    </>
  )}
</button>
                </div>

                <button
                  type="button"
                  onClick={
                    pularPergunta
                  }
                  disabled={
  !configuracao.permitirPular ||
  estado.perguntaAtual >=
    configuracao.totalPerguntas ||
  estado.status ===
    "finalizada"
}
                  className="mt-2 inline-flex w-full items-center justify-center gap-2 rounded-lg border border-slate-300 px-4 py-3 text-sm font-semibold hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <SkipForward
                    size={17}
                  />

                  Pular pergunta
                </button>
              </div>
            </div>
          </aside>
        </section>

        {/* RODAPÉ */}

        <section className="mt-5 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-semibold">
                {estado.resultado ===
                  "correta" &&
                  "Resposta marcada como correta."}

                {estado.resultado ===
                  "incorreta" &&
                  "Resposta marcada como incorreta."}

                {!estado.resultado &&
                  "Nenhum resultado registrado."}
              </p>

              <p className="mt-1 text-xs text-slate-500">
                As alterações são sincronizadas
                automaticamente com o telão.
              </p>
            </div>

            <div className="flex items-center gap-2 text-sm text-slate-500">
              <Trophy size={16} />

              {partida.equipe1}:{" "}
              {estado.pontos.equipe1}

              <span>×</span>

              {partida.equipe2}:{" "}
              {estado.pontos.equipe2}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

export default function ControlePartidaPage() {
  const params =
    useParams<{ id: string }>();

  return (
    <GameProvider
      partidaId={params.id}
      role="control"
    >
      <ControleContent />
    </GameProvider>
  );
}