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
    <main className="flex h-screen w-screen min-h-0 flex-col overflow-hidden bg-slate-950 text-white">
      {/* HEADER */}
      <header className="flex shrink-0 items-center justify-center border-b border-slate-800 px-[2vw] py-[1vh]">
        <div className="text-center leading-tight">
          <p className="text-[1.1vh] font-bold uppercase tracking-[0.3em] text-yellow-400">
            Decatlo
          </p>

          <h1 className="text-[2.2vh] font-black">
            {partida.nome}
          </h1>
        </div>
      </header>

      {/* CONTEÚDO DIVIDIDO EM 3 COLUNAS PROPORCIONAIS À TELA (ESQUERDA, CENTRO, DIREITA) SEM SCROLL */}
      <section className="flex min-h-0 flex-1 items-stretch justify-between gap-[1.5vw] overflow-hidden px-[1.5vw] py-[1.2vh]">
        {/* DIV DA ESQUERDA — MASCOTE EQUIPE 1 (18% DA LARGURA DA TELA) */}
        <div className="flex w-[18vw] shrink-0 items-center justify-start">
          <Mascote
            nome={partida.equipe1}
            video="/videos/mascote-alfa1.mp4"
            ativo={estado.equipeDaVez === "A"}
            pontos={estado.pontos.equipe1}
          />
        </div>

        {/* DIV DO MEIO — CONTEÚDO PRINCIPAL CENTRALIZADO E SEM SCROLL */}
        <div className="flex min-h-0 min-w-0 flex-1 flex-col items-center justify-between gap-[1vh] overflow-hidden">
          {/* CRONÔMETRO + EQUIPE DA VEZ */}
          <div className="flex shrink-0 flex-col items-center justify-center gap-[0.5vh]">
            <Cronometro timeLeft={estado.tempoRestante} />

            {/* Espaço permanente para evitar deslocamento */}
            <div className="flex h-[1.5vh] items-center justify-center">
              <span
                className={`text-[1vh] font-bold uppercase tracking-widest transition-opacity ${
                  cronometroPausado ? "opacity-60" : "opacity-0"
                }`}
              >
                Pausado
              </span>
            </div>

            <div className="rounded-full border border-slate-700 bg-slate-900 px-[1.2vw] py-[0.5vh] text-[1.3vh] font-black uppercase tracking-widest text-yellow-400">
              {equipeDaVez} responde
            </div>
          </div>

          {/* ÁREA PRINCIPAL DA PERGUNTA (SEM SCROLL) */}
          <div className="flex min-h-0 w-full flex-1 items-stretch justify-center overflow-hidden">
            <Question
              pergunta={pergunta}
              numero={estado.perguntaAtual}
              total={configuracao.totalPerguntas}
              respostaVisivel={estado.respostaVisivel}
            />
          </div>

          {/* RESULTADO — ALTURA RESERVADA */}
          <div className="flex h-[6vh] w-full shrink-0 items-center justify-center">
            <div
              className={`w-full max-w-xl rounded-lg px-[1.5vw] py-[0.6vh] text-center transition-opacity duration-200 ${
                estado.resultado
                  ? estado.resultado === "correta"
                    ? "bg-green-500/10 text-green-300 ring-1 ring-green-500/30 opacity-100"
                    : "bg-red-500/10 text-red-300 ring-1 ring-red-500/30 opacity-100"
                  : "pointer-events-none opacity-0"
              }`}
            >
              <p className="text-[1vh] font-black uppercase tracking-widest">
                Resultado
              </p>

              <p className="text-[2vh] font-black">
                {estado.resultado === "correta"
                  ? "Resposta correta!"
                  : "Resposta incorreta"}
              </p>
            </div>
          </div>
        </div>

        {/* DIV DA DIREITA — MASCOTE EQUIPE 2 (18% DA LARGURA DA TELA) */}
        <div className="flex w-[18vw] shrink-0 items-center justify-end">
          <Mascote
            nome={partida.equipe2}
            video="/videos/mascote-alfa2.mp4"
            ativo={estado.equipeDaVez === "B"}
            pontos={estado.pontos.equipe2}
          />
        </div>
      </section>

      {/* FOOTER */}
      <footer className="flex h-[3.5vh] shrink-0 items-center justify-center border-t border-slate-800 px-[2vw]">
        <p className="text-[1.1vh] font-bold uppercase tracking-[0.2em] text-slate-600">
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
