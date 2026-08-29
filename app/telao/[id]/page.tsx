"use client";

import { notFound, useParams } from "next/navigation";

import {
  perguntas,
} from "@/data/perguntas/perguntas";

import Mascote from "@/components/telao/Mascote";
import Placar from "@/components/telao/Placar";
import Cronometro from "@/components/telao/Cronometro";
import Question from "@/components/telao/Question";
import TelaFinal from "@/components/telao/TelaFinal";

import {
  GameProvider,
  useGame,
} from "@/contexts/GameContext";

function TelaoContent() {
  const {
    partida,
    estado,
    configuracao,
    sincronizado,
    resetarPartida,
  } = useGame();

  /*
   * Quando a partida terminar,
   * o telão inteiro muda para a tela final.
   */
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

  const pergunta =
    perguntas[
      estado.perguntaAtual - 1
    ];

  const equipeDaVez =
    estado.equipeDaVez === "A"
      ? partida.equipe1
      : partida.equipe2;

  if (!pergunta) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-950 text-white">
        <div className="text-center">
          <h1 className="text-3xl font-black">
            Aguardando pergunta
          </h1>

          <p className="mt-2 text-slate-400">
            O apresentador ainda não
            selecionou uma pergunta.
          </p>

          <p className="mt-4 text-xs text-slate-600">
            {sincronizado
              ? "Sincronizado"
              : "Aguardando controlador"}
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen flex-col bg-slate-950 text-white">
      {/* CABEÇALHO */}

      <header className="flex items-center justify-between border-b border-slate-800 px-5 py-3 sm:px-8">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.3em] text-yellow-400">
            Decatlo
          </p>

          <h1 className="text-xl font-black sm:text-2xl">
            {partida.nome}
          </h1>
        </div>

        <Placar
          equipe1={partida.equipe1}
          equipe2={partida.equipe2}
          score1={
            estado.pontos.equipe1
          }
          score2={
            estado.pontos.equipe2
          }
        />
      </header>

      {/* CONTEÚDO */}

      <section className="flex flex-1 flex-col gap-5 px-4 py-5 sm:px-6 lg:px-10">
        {/* MASCOTES + CRONÔMETRO */}

        <div className="flex items-center justify-center gap-3 sm:gap-6 lg:gap-12">
          <Mascote
            nome={partida.equipe1}
            video="/videos/mascote-alfa1.mp4"
            ativo={
              estado.equipeDaVez ===
              "A"
            }
          />

          <Cronometro
            timeLeft={
              estado.tempoRestante
            }
          />

          <Mascote
            nome={partida.equipe2}
            video="/videos/mascote-alfa2.mp4"
            ativo={
              estado.equipeDaVez ===
              "B"
            }
          />
        </div>

        {/* EQUIPE DA VEZ */}

        <div className="flex justify-center">
          <div className="rounded-full border border-slate-700 bg-slate-900 px-5 py-1.5 text-xs font-black uppercase tracking-widest text-yellow-400">
            {equipeDaVez} responde
          </div>
        </div>

        {/* STATUS */}

        {estado.status ===
          "pausada" &&
          estado.tempoRestante >
            0 && (
            <div className="flex justify-center">
              <div className="rounded-full border border-yellow-500/30 bg-yellow-500/10 px-5 py-2 text-sm font-bold text-yellow-300">
                Pausado
              </div>
            </div>
          )}

        {/* PERGUNTA */}

        <div className="flex justify-center">
          <Question
            pergunta={pergunta}
            numero={
              estado.perguntaAtual
            }
            total={
              configuracao.totalPerguntas
            }
            respostaVisivel={
              estado.respostaVisivel
            }
          />
        </div>

        {/* RESULTADO */}

        {estado.resultado && (
          <div className="flex justify-center">
            <div
              className={`rounded-xl px-8 py-4 text-center ${
                estado.resultado ===
                "correta"
                  ? "bg-green-500/10 text-green-300 ring-1 ring-green-500/30"
                  : "bg-red-500/10 text-red-300 ring-1 ring-red-500/30"
              }`}
            >
              <p className="text-xs font-black uppercase tracking-widest">
                Resultado
              </p>

              <p className="mt-1 text-2xl font-black">
                {estado.resultado ===
                "correta"
                  ? "Resposta correta!"
                  : "Resposta incorreta"}
              </p>
            </div>
          </div>
        )}
      </section>

      {/* RODAPÉ */}

      <footer className="border-t border-slate-800 px-5 py-3 text-center">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-600">
          {partida.nome} •{" "}
          {partida.data}
        </p>
      </footer>
    </main>
  );
}

export default function TelaoPage() {
  const params =
    useParams<{ id: string }>();

  if (!params.id) {
    notFound();
  }

  return (
    <GameProvider
      partidaId={params.id}
      role="display"
    >
      <TelaoContent />
    </GameProvider>
  );
}