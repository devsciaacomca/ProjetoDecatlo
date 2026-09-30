"use client";

import { useParams } from "next/navigation";

import Mascote from "@/components/telao/Mascote";
import Placar from "@/components/telao/Placar";
import Cronometro from "@/components/telao/Cronometro";
import Question from "@/components/telao/Question";
import TelaFinal from "@/components/telao/TelaFinal";

import { GameProvider, useGame } from "@/contexts/GameContext";

function TelaoContent() {
  const {
    partida,
    pergunta,
    estado,
    configuracao,
    sincronizado,
    carregando,
    erro,
    resetarPartida,
  } = useGame();

  if (carregando) {
    return (
      <main className="flex h-screen items-center justify-center overflow-hidden bg-slate-950 text-white">
        {" "}
        <p className="text-sm text-slate-300">Carregando partida... </p>{" "}
      </main>
    );
  }

  if (erro) {
    return (
      <main className="flex h-screen items-center justify-center overflow-hidden bg-slate-950 text-white">
        {" "}
        <p className="text-red-300">{erro}</p>{" "}
      </main>
    );
  }

  if (estado.status === "finalizada") {
    return (
      <TelaFinal
        equipe1={partida.equipe1}
        equipe2={partida.equipe2}
        pontos1={estado.pontos.equipe1}
        pontos2={estado.pontos.equipe2}
        videoEquipe1="/videos/mascote-alfa1-vitoria.mp4"
        videoEquipe2="/videos/mascote-alfa2-vitoria.mp4"
        onJogarNovamente={resetarPartida}
      />
    );
  }

  const equipeDaVez =
    estado.equipeDaVez === "A" ? partida.equipe1 : partida.equipe2;

  if (!pergunta) {
    return (
      <main className="flex h-screen items-center justify-center overflow-hidden bg-slate-950 px-4 text-white">
        {" "}
        <div className="text-center">
          {" "}
          <h1 className="text-2xl font-black sm:text-3xl">
            Aguardando pergunta{" "}
          </h1>
          <p className="mt-2 text-sm text-slate-400">
            O apresentador ainda não selecionou uma pergunta.
          </p>
          <p className="mt-4 text-xs text-slate-600">
            {sincronizado ? "Sincronizado" : "Aguardando controlador"}
          </p>
        </div>
      </main>
    );
  }

  const cronometroPausado =
    estado.status === "pausada" && estado.tempoRestante > 0;

  return (
    <main className="flex h-screen min-h-0 flex-col overflow-hidden bg-slate-950 text-white">
      {/* HEADER */}
      <header className="flex shrink-0 items-center justify-center border-b border-slate-800 px-4 py-2 sm:px-6 lg:py-3">
        <div className="text-center leading-tight">
          <p className="text-[9px] font-bold uppercase tracking-[0.3em] text-yellow-400 sm:text-[10px]">
            Decatlo
          </p>

          <h1 className="text-base font-black sm:text-lg lg:text-xl">
            {partida.nome}
          </h1>
        </div>
      </header>

      {/* CONTEÚDO */}
      <section className="flex min-h-0 flex-1 flex-col overflow-hidden px-3 py-2 sm:px-5 sm:py-3 lg:px-8">
        {/* MASCOTES / CRONÔMETRO */}
        <div className="flex shrink-0 items-center justify-center gap-2 sm:gap-5 lg:gap-10">
          <Mascote
            nome={partida.equipe1}
            video="/videos/mascote-alfa1.mp4"
            ativo={estado.equipeDaVez === "A"}
            pontos={estado.pontos.equipe1}
          />

          <div className="flex shrink-0 flex-col items-center justify-center">
            <Cronometro timeLeft={estado.tempoRestante} />

            {/* Espaço permanente para evitar deslocamento */}
            <div className="flex h-3 items-center justify-center">
              <span
                className={`text-[8px] font-bold uppercase tracking-widest transition-opacity ${
                  cronometroPausado ? "opacity-60" : "opacity-0"
                }`}
              >
                Pausado
              </span>
            </div>
          </div>

          <Mascote
            nome={partida.equipe2}
            video="/videos/mascote-alfa2.mp4"
            ativo={estado.equipeDaVez === "B"}
            pontos={estado.pontos.equipe2}
          />
        </div>

        {/* EQUIPE DA VEZ */}
        <div className="flex h-8 shrink-0 items-center justify-center sm:h-9">
          <div className="rounded-full border border-slate-700 bg-slate-900 px-4 py-1 text-[10px] font-black uppercase tracking-widest text-yellow-400 sm:text-xs">
            {equipeDaVez} responde
          </div>
        </div>

        {/* ÁREA PRINCIPAL */}
        <div className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden px-1 py-1 [scrollbar-width:thin]">
          <div className="mx-auto flex min-h-full w-full max-w-5xl items-start justify-center">
            <Question
              pergunta={pergunta}
              numero={estado.perguntaAtual}
              total={configuracao.totalPerguntas}
              respostaVisivel={estado.respostaVisivel}
            />
          </div>
        </div>

        {/* RESULTADO — ALTURA RESERVADA */}
        <div className="flex h-12 shrink-0 items-center justify-center sm:h-14">
          <div
            className={`w-full max-w-xl rounded-lg px-4 py-2 text-center transition-opacity duration-200 ${
              estado.resultado
                ? estado.resultado === "correta"
                  ? "bg-green-500/10 text-green-300 ring-1 ring-green-500/30 opacity-100"
                  : "bg-red-500/10 text-red-300 ring-1 ring-red-500/30 opacity-100"
                : "pointer-events-none opacity-0"
            }`}
          >
            <p className="text-[8px] font-black uppercase tracking-widest">
              Resultado
            </p>

            <p className="text-base font-black sm:text-lg">
              {estado.resultado === "correta"
                ? "Resposta correta!"
                : "Resposta incorreta"}
            </p>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="flex h-7 shrink-0 items-center justify-center border-t border-slate-800 px-4 sm:h-8">
        <p className="text-[8px] font-bold uppercase tracking-[0.2em] text-slate-600 sm:text-[9px]">
          {partida.nome} • {new Date(partida.data).toLocaleDateString("pt-BR")}
        </p>
      </footer>
    </main>
  );
}

export default function TelaoPage() {
  const params = useParams<{ id: string }>();

  return (
    <GameProvider partidaId={params.id} role="display">
      {" "}
      <TelaoContent />{" "}
    </GameProvider>
  );
}
