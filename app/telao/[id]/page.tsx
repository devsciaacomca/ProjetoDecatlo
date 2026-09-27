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
      <main className="flex min-h-screen items-center justify-center bg-slate-950 text-white">
        <p className="text-sm text-slate-300">Carregando partida...</p>
      </main>
    );
  }

  if (erro) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-950 text-white">
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
      <main className="flex min-h-screen items-center justify-center bg-slate-950 px-4 text-white">
        <div className="text-center">
          <h1 className="text-2xl font-black sm:text-3xl">
            Aguardando pergunta
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
    <main className="flex min-h-screen flex-col overflow-hidden bg-slate-950 text-white">
      {/* HEADER */}
      <header className="flex shrink-0 items-center justify-between gap-4 border-b border-slate-800 px-4 py-3 sm:px-6 lg:px-8">
        <div className="min-w-0">
          <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-yellow-400 sm:text-xs">
            Decatlo
          </p>

          <h1 className="truncate text-lg font-black sm:text-xl lg:text-2xl">
            {partida.nome}
          </h1>
        </div>

        <div className="shrink-0">
          <Placar
            equipe1={partida.equipe1}
            equipe2={partida.equipe2}
            score1={estado.pontos.equipe1}
            score2={estado.pontos.equipe2}
          />
        </div>
      </header>

      {/* CONTEÚDO PRINCIPAL */}
      <section className="flex min-h-0 flex-1 flex-col px-3 py-3 sm:px-5 sm:py-4 lg:px-8">
        {/* MASCOTES + CRONÔMETRO */}
        <div className="flex shrink-0 items-center justify-center gap-3 sm:gap-6 lg:gap-12">
          <Mascote
            nome={partida.equipe1}
            video="/videos/mascote-alfa1.mp4"
            ativo={estado.equipeDaVez === "A"}
          />

          {/* CRONÔMETRO */}
          <div className="flex min-w-[90px] flex-col items-center justify-center">
            <Cronometro timeLeft={estado.tempoRestante} />

            {/* Espaço permanente para indicar pausa.
            A mensagem fica invisível quando não está pausado,
            evitando que o layout se mova. */}
            <div className="mt-1 flex h-4 items-center justify-center">
              <span
                className={`text-[9px] font-bold uppercase tracking-widest transition-opacity duration-200 ${
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
          />
        </div>

        {/* EQUIPE DA VEZ */}
        <div className="flex h-10 shrink-0 items-center justify-center">
          <div className="rounded-full border border-slate-700 bg-slate-900 px-5 py-1.5 text-xs font-black uppercase tracking-widest text-yellow-400">
            {equipeDaVez} responde
          </div>
        </div>

        {/* ÁREA DA PERGUNTA
        flex-1 + min-h-0 impede que os elementos de baixo
        empurrem o conteúdo para fora da tela. */}
        <div className="flex min-h-0 flex-1 justify-center">
          <Question
            pergunta={pergunta}
            numero={estado.perguntaAtual}
            total={configuracao.totalPerguntas}
            respostaVisivel={estado.respostaVisivel}
          />
        </div>

        {/* RESULTADO
        O espaço existe sempre.
        Quando não existe resultado, apenas fica invisível. */}
        <div className="flex h-[76px] shrink-0 items-center justify-center">
          <div
            className={`w-full max-w-2xl rounded-xl px-6 py-3 text-center transition-all duration-300 ${
              estado.resultado
                ? estado.resultado === "correta"
                  ? "bg-green-500/10 text-green-300 ring-1 ring-green-500/30 opacity-100"
                  : "bg-red-500/10 text-red-300 ring-1 ring-red-500/30 opacity-100"
                : "pointer-events-none opacity-0"
            }`}
          >
            <p className="text-[9px] font-black uppercase tracking-widest">
              Resultado
            </p>

            <p className="mt-0.5 text-lg font-black sm:text-xl">
              {estado.resultado === "correta"
                ? "Resposta correta!"
                : "Resposta incorreta"}
            </p>
          </div>
        </div>
      </section>

      {/* FOOTER */}
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
