"use client";

import { useParams } from "next/navigation";

import Mascote from "@/components/telao/Mascote";
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
      <main className="flex h-full min-h-screen items-center justify-center overflow-y-auto bg-slate-950 text-white">
        <p>Carregando partida...</p>
      </main>
    );
  }

  if (erro) {
    return (
      <main className="flex h-full min-h-screen items-center justify-center overflow-y-auto bg-slate-950 text-white">
        <p className="text-red-300">{erro}</p>
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
      <main className="flex h-full min-h-screen items-center justify-center overflow-y-auto bg-slate-950 text-white">
        <div className="text-center">
          <h1 className="text-3xl font-black">Aguardando pergunta</h1>

          <p className="mt-2 text-slate-400">
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
    <main className="flex h-full min-h-screen flex-col overflow-hidden bg-slate-950 text-white">
      {/* HEADER */}
      <header className="flex shrink-0 items-center justify-center border-b border-slate-800 px-5 py-4 sm:px-8">
        <div className="text-center">
          <p className="text-xs font-bold uppercase tracking-[0.3em] text-yellow-400">
            Decatlo
          </p>

          <h1 className="text-xl font-black sm:text-2xl">{partida.nome}</h1>
        </div>
      </header>

      <section className="flex min-h-0 flex-1 flex-col gap-3 px-4 py-4 sm:px-6 lg:px-10">
        {/* MASCOTES + CRONÔMETRO */}
        <div className="flex shrink-0 items-center justify-center gap-3 sm:gap-6 lg:gap-12">
          <Mascote
            nome={partida.equipe1}
            video="/videos/mascote-alfa1.mp4"
            ativo={estado.equipeDaVez === "A"}
            pontos={estado.pontos.equipe1}
          />

          <div className="flex min-w-[90px] flex-col items-center justify-center">
            <Cronometro timeLeft={estado.tempoRestante} />

            {/* Espaço permanente */}
            <div className="mt-1 flex h-4 items-center justify-center">
              <span
                className={`text-[9px] font-bold uppercase tracking-widest transition-opacity ${
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
        <div className="flex h-9 shrink-0 items-center justify-center">
          <div className="rounded-full border border-slate-700 bg-slate-900 px-5 py-1.5 text-xs font-black uppercase tracking-widest text-yellow-400">
            {equipeDaVez} responde
          </div>
        </div>

        {/* PERGUNTA */}
        <div className="flex min-h-0 flex-1 justify-center">
          <Question
            pergunta={pergunta}
            numero={estado.perguntaAtual}
            total={configuracao.totalPerguntas}
            respostaVisivel={estado.respostaVisivel}
          />
        </div>
      </section>

      <footer className="flex h-9 shrink-0 items-center justify-center border-t border-slate-800 px-5">
        <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-slate-600 sm:text-[10px]">
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
      <TelaoContent />
    </GameProvider>
  );
}
