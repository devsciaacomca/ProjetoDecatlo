"use client";

import Link from "next/link";
import { useParams } from "next/navigation";

import {
  ArrowLeft,
  ArrowLeftCircle,
  ArrowRight,
  Check,
  Eye,
  EyeOff,
  Minus,
  Monitor,
  Pause,
  Play,
  Plus,
  Radio,
  RotateCcw,
  SkipForward,
  Square,
  X,
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

  const cronometroRodando =
    estado.cronometroFimEm !== null && estado.status === "em_andamento";

  return (
    <main className="flex-1 p-4 sm:p-6 lg:p-8">
      <div className="mx-auto w-full max-w-7xl">
        {/* HEADER */}
        <header className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <Link
              href={`/dashboard/partidas/${params.id}`}
              className="mb-2 inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-900"
            >
              <ArrowLeft size={16} />
              Voltar para partida
            </Link>

            <h1 className="text-xl font-semibold sm:text-2xl">
              Controle da partida
            </h1>

            <p className="mt-1 text-sm text-slate-500">{partida.nome}</p>
          </div>

          <div className="flex flex-wrap gap-2">
            {/* STATUS SOCKET */}
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
              <Monitor size={17} />
              Abrir telão
            </Link>
          </div>
        </header>

        {/* STATUS DA PARTIDA */}
        <section className="mb-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Status
              </p>

              <p className="mt-1 font-semibold">
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
                    type="button"
                    onClick={iniciarPartida}
                    className="inline-flex items-center gap-2 rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-slate-800"
                  >
                    <Play size={16} />
                    Iniciar partida
                  </button>
                )}

              {estado.status === "em_andamento" && (
                <button
                  type="button"
                  onClick={pausarPartida}
                  className="inline-flex items-center gap-2 rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-semibold hover:bg-slate-50"
                >
                  <Pause size={16} />
                  Pausar partida
                </button>
              )}

              {estado.status !== "finalizada" && (
                <button
                  type="button"
                  onClick={finalizarPartida}
                  className="inline-flex items-center gap-2 rounded-lg border border-red-200 px-4 py-2.5 text-sm font-semibold text-red-600 hover:bg-red-50"
                >
                  <Square size={15} />
                  Finalizar
                </button>
              )}
            </div>
          </div>
        </section>

        {/* PROGRESSO */}
        <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
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
                  className="h-full bg-slate-900 transition-all duration-300"
                  style={{
                    width: `${progresso}%`,
                  }}
                />
              </div>
            </div>
          </div>
        </section>

        {/* EQUIPES */}
        <section className="mt-4 grid gap-3 sm:grid-cols-2">
          {(["A", "B"] as const).map((equipe) => {
            const nome = equipe === "A" ? partida.equipe1 : partida.equipe2;

            const pontos =
              equipe === "A" ? estado.pontos.equipe1 : estado.pontos.equipe2;

            const equipeAtiva = estado.equipeDaVez === equipe;

            return (
              <div
                key={equipe}
                className={`rounded-xl border p-4 shadow-sm transition ${
                  equipeAtiva
                    ? "border-slate-900 bg-slate-50"
                    : "border-slate-200 bg-white"
                }`}
              >
                <div className="flex items-center justify-between">
                  <p className="font-semibold">{nome}</p>

                  {equipeAtiva && (
                    <span className="rounded-full bg-slate-900 px-2.5 py-1 text-xs font-semibold text-white">
                      Vez
                    </span>
                  )}
                </div>

                <p className="mt-2 text-3xl font-bold">{pontos}</p>

                <div className="mt-3 flex gap-2">
                  <button
                    type="button"
                    onClick={() => removerPonto(equipe)}
                    disabled={estado.status === "finalizada"}
                    className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-300 hover:bg-slate-50 disabled:opacity-40"
                    title="Remover ponto"
                  >
                    <Minus size={16} />
                  </button>

                  <button
                    type="button"
                    onClick={() => adicionarPonto(equipe)}
                    disabled={estado.status === "finalizada"}
                    className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-slate-900 text-white hover:bg-slate-800 disabled:opacity-40"
                    title="Adicionar ponto"
                  >
                    <Plus size={16} />
                  </button>

                  <button
                    type="button"
                    onClick={() => definirEquipe(equipe)}
                    disabled={estado.status === "finalizada"}
                    className="ml-2 rounded-lg border border-slate-300 px-3 text-xs font-semibold hover:bg-slate-50 disabled:opacity-40"
                  >
                    Definir vez
                  </button>
                </div>
              </div>
            );
          })}
        </section>

        {/* PERGUNTA + CONTROLES */}
        <section className="mt-4 grid gap-4 lg:grid-cols-[minmax(0,1fr)_300px]">
          {/* PERGUNTA */}
          <div className="min-w-0 rounded-xl border border-slate-200 bg-white shadow-sm">
            {/* CABEÇALHO DA PERGUNTA */}
            <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs font-bold uppercase text-slate-500">
                    Pergunta {estado.perguntaAtual}
                  </span>

                  {pergunta && (
                    <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs">
                      {pergunta.assunto}
                    </span>
                  )}
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
              {!pergunta ? (
                <div className="p-8 text-center text-sm text-slate-500">
                  Nenhuma pergunta encontrada.
                </div>
              ) : (
                <>
                  {/* ENUNCIADO */}
                  <div className="rounded-lg bg-slate-50 p-4">
                    <p className="text-base font-semibold leading-6 sm:text-lg">
                      {pergunta.enunciado}
                    </p>
                  </div>

                  {/* ALTERNATIVAS */}
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
                            disabled={estado.status === "finalizada"}
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

                  {/* RESPOSTA SELECIONADA */}
                  <div className="mt-4 rounded-lg border border-slate-200 bg-slate-50 p-3">
                    <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
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
                        disabled={
                          !estado.respostaSelecionada ||
                          estado.status === "finalizada"
                        }
                        onClick={() => avaliarResposta("correta")}
                        className="inline-flex items-center justify-center gap-2 rounded-lg bg-green-600 px-3 py-2.5 text-sm font-bold text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-40"
                      >
                        <Check size={16} />
                        Correta
                      </button>

                      <button
                        type="button"
                        disabled={
                          !estado.respostaSelecionada ||
                          estado.status === "finalizada"
                        }
                        onClick={() => avaliarResposta("incorreta")}
                        className="inline-flex items-center justify-center gap-2 rounded-lg bg-red-600 px-3 py-2.5 text-sm font-bold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-40"
                      >
                        <X size={16} />
                        Errada
                      </button>
                    </div>
                  </div>

                  {/* GABARITO */}
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
                        disabled={estado.status === "finalizada"}
                        className="shrink-0 rounded-md border border-amber-300 bg-white px-3 py-1.5 text-xs font-bold text-amber-900 hover:bg-amber-100 disabled:opacity-40"
                      >
                        {estado.respostaVisivel
                          ? "Ocultar no telão"
                          : "Mostrar no telão"}
                      </button>
                    </div>
                  </div>

                  {/* RESULTADO */}
                  <div className="mt-3 min-h-[44px]">
                    {estado.resultado && (
                      <div
                        className={`rounded-lg p-3 text-center text-sm font-bold ${
                          estado.resultado === "correta"
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {estado.resultado === "correta"
                          ? "Resposta correta!"
                          : "Resposta errada — vez da outra equipe"}
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>

          {/* CONTROLES */}
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

                <div className="flex gap-2">
                  {/* PLAY / PAUSE */}
                  <button
                    type="button"
                    onClick={
                      cronometroRodando ? pausarCronometro : iniciarCronometro
                    }
                    disabled={estado.status === "finalizada"}
                    className="flex h-10 flex-1 items-center justify-center rounded-lg bg-slate-900 text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-40"
                    title={
                      cronometroRodando
                        ? "Pausar cronômetro"
                        : "Iniciar cronômetro"
                    }
                  >
                    {cronometroRodando ? (
                      <Pause size={17} />
                    ) : (
                      <Play size={17} />
                    )}
                  </button>

                  {/* RESET */}
                  <button
                    type="button"
                    onClick={reiniciarCronometro}
                    disabled={estado.status === "finalizada"}
                    className="flex h-10 w-10 items-center justify-center rounded-lg border border-slate-300 hover:bg-slate-50 disabled:opacity-40"
                    title="Reiniciar cronômetro"
                  >
                    <RotateCcw size={16} />
                  </button>
                </div>
              </div>

              {/* TELÃO */}
              <div>
                <p className="mb-1.5 text-[10px] font-bold uppercase tracking-wide text-slate-500">
                  Exibição
                </p>

                <button
                  type="button"
                  onClick={
                    estado.respostaVisivel ? esconderResposta : mostrarResposta
                  }
                  disabled={estado.status === "finalizada"}
                  className="flex w-full items-center justify-center gap-2 rounded-lg border px-3 py-2.5 text-xs font-semibold hover:bg-slate-50 disabled:opacity-40"
                >
                  {estado.respostaVisivel ? (
                    <>
                      <EyeOff size={15} />
                      Esconder resposta
                    </>
                  ) : (
                    <>
                      <Eye size={15} />
                      Mostrar resposta
                    </>
                  )}
                </button>
              </div>

              {/* NAVEGAÇÃO */}
              <div>
                <p className="mb-1.5 text-[10px] font-bold uppercase tracking-wide text-slate-500">
                  Perguntas
                </p>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={perguntaAnterior}
                    disabled={
                      estado.perguntaAtual <= 1 ||
                      estado.status === "finalizada"
                    }
                    className="rounded-lg border px-3 py-2.5 text-xs font-semibold hover:bg-slate-50 disabled:opacity-40"
                  >
                    <ArrowLeftCircle size={15} className="mx-auto mb-1" />
                    Anterior
                  </button>

                  <button
                    type="button"
                    onClick={proximaPergunta}
                    disabled={estado.status === "finalizada"}
                    className="rounded-lg border px-3 py-2.5 text-xs font-semibold hover:bg-slate-50 disabled:opacity-40"
                  >
                    <ArrowRight size={15} className="mx-auto mb-1" />
                    Próxima
                  </button>
                </div>

                {configuracao.permitirPular && (
                  <button
                    type="button"
                    onClick={pularPergunta}
                    disabled={estado.status === "finalizada"}
                    className="mt-2 w-full rounded-lg border border-dashed px-3 py-2.5 text-xs font-semibold hover:bg-slate-50 disabled:opacity-40"
                  >
                    <SkipForward size={15} className="mr-1 inline" />
                    Pular pergunta
                  </button>
                )}
              </div>

              {/* EQUIPE */}
              <button
                type="button"
                onClick={trocarEquipe}
                disabled={estado.status === "finalizada"}
                className="w-full rounded-lg bg-slate-100 px-3 py-2.5 text-xs font-semibold hover:bg-slate-200 disabled:opacity-40"
              >
                Trocar equipe da vez
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
