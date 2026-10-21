"use client";

import { useEffect, useRef } from "react";
import { useParams } from "next/navigation";

import Mascote from "@/components/telao/Mascote";
import Cronometro from "@/components/telao/Cronometro";
import Question from "@/components/telao/Question";
import TelaFinal from "@/components/telao/TelaFinal";

import { GameProvider, useGame } from "@/contexts/GameContext";
import { playSirenBuzzer } from "@/hooks/useQuizMachine";
import { Volume2, ShieldAlert } from "lucide-react";

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

  const ultimoBuzzerRef = useRef<number | null>(null);

  // Toca a sirene audível de buzzer de palco no Telão
  useEffect(() => {
    if (
      estado.buzzerAtivo &&
      estado.buzzerAtivo.timestamp !== ultimoBuzzerRef.current
    ) {
      ultimoBuzzerRef.current = estado.buzzerAtivo.timestamp;
      playSirenBuzzer(estado.buzzerAtivo.jogador);
    }
  }, [estado.buzzerAtivo]);

  if (carregando) {
    return (
      <main className="flex h-screen items-center justify-center overflow-hidden bg-slate-950 text-white">
        <p className="text-sm text-slate-300">Carregando partida...</p>
      </main>
    );
  }

  if (erro) {
    return (
      <main className="flex h-screen items-center justify-center overflow-hidden bg-slate-950 text-white">
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
      <main className="flex h-screen items-center justify-center overflow-hidden bg-slate-950 px-4 text-white">
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

  const isP1Buzzer = estado.buzzerAtivo?.jogador === "P1";
  const isP2Buzzer = estado.buzzerAtivo?.jogador === "P2";

  return (
    <main className="relative flex h-screen min-h-0 flex-col overflow-hidden bg-slate-950 text-white select-none">
      {/* LUZES ESTROBOSCÓPICAS DE PALCO (FIXAS NO TOPO, NÃO DESLOCAM O LAYOUT) */}
      {estado.buzzerAtivo && (
        <div className="pointer-events-none fixed inset-x-0 top-0 h-40 overflow-hidden z-50">
          <div
            className={`absolute -top-16 left-1/4 h-48 w-96 rounded-full blur-3xl opacity-80 animate-pulse ${
              isP1Buzzer ? "bg-red-600" : "bg-blue-600"
            }`}
          />
          <div
            className={`absolute -top-16 right-1/4 h-48 w-96 rounded-full blur-3xl opacity-80 animate-pulse delay-100 ${
              isP1Buzzer ? "bg-red-500" : "bg-blue-500"
            }`}
          />
        </div>
      )}

      {/* HEADER COMPACTO E RESPONSIVO */}
      <header className="relative flex h-9 sm:h-11 md:h-12 shrink-0 items-center justify-center border-b border-slate-800 px-4">
        <div className="text-center leading-tight">
          <p className="text-[8px] sm:text-[9px] font-bold uppercase tracking-[0.25em] text-yellow-400">
            Decatlo
          </p>
          <h1 className="text-xs sm:text-sm md:text-base font-black tracking-wide text-white truncate max-w-[80vw]">
            {partida.nome}
          </h1>
        </div>

        {/* BOTÃO TESTE DE SIRENE */}
        <button
          type="button"
          onClick={() => playSirenBuzzer(estado.buzzerAtivo?.jogador || "P1")}
          className="absolute right-3 inline-flex items-center gap-1.5 rounded-full border border-slate-700 bg-slate-900/90 px-2.5 py-1 text-[9px] sm:text-[10px] font-bold uppercase tracking-wider text-yellow-400 hover:bg-slate-800 hover:border-yellow-500/50 transition active:scale-95"
          title="Testar sirene do telão"
        >
          <Volume2 size={12} className="text-yellow-400" />
          <span className="hidden sm:inline">Sirene</span>
        </button>
      </header>

      {/* CONTEÚDO PRINCIPAL (FLEX COM 100% DE APROVEITAMENTO DE ALTURA SEM SCROLLBAR) */}
      <section className="flex min-h-0 flex-1 flex-col justify-between overflow-hidden px-2 py-1.5 sm:px-4 sm:py-2 md:px-6">
        {/* MASCOTES / CRONÔMETRO COM SUPORTE A ZOOM E SOBREPOSIÇÃO 3D */}
        <div className="relative flex shrink-0 items-center justify-center gap-2 sm:gap-4 md:gap-8 lg:gap-12 py-1">
          {/* MASCOTE EQUIPE 1 (ALFA 1) */}
          <Mascote
            nome={partida.equipe1}
            video="/videos/mascote-alfa1.mp4"
            ativo={estado.equipeDaVez === "A"}
            pontos={estado.pontos.equipe1}
            buzzerPressionado={isP1Buzzer}
            buzzerBloqueado={isP2Buzzer}
            corBuzzer="red"
            posicao="left"
          />

          {/* CRONÔMETRO CENTRAL */}
          <div className="flex shrink-0 flex-col items-center justify-center">
            <Cronometro timeLeft={estado.tempoRestante} />

            <div className="flex h-3 items-center justify-center mt-0.5">
              <span
                className={`text-[7px] sm:text-[8px] font-bold uppercase tracking-widest transition-opacity ${
                  cronometroPausado ? "opacity-75 text-yellow-400" : "opacity-0"
                }`}
              >
                Pausado
              </span>
            </div>
          </div>

          {/* MASCOTE EQUIPE 2 (ALFA 2) */}
          <Mascote
            nome={partida.equipe2}
            video="/videos/mascote-alfa2.mp4"
            ativo={estado.equipeDaVez === "B"}
            pontos={estado.pontos.equipe2}
            buzzerPressionado={isP2Buzzer}
            buzzerBloqueado={isP1Buzzer}
            corBuzzer="blue"
            posicao="right"
          />
        </div>

        {/* EQUIPE DA VEZ / BADGE CENTRAL */}
        <div className="flex h-6 sm:h-7 shrink-0 items-center justify-center">
          {!estado.buzzerAtivo ? (
            <div className="rounded-full border border-slate-700 bg-slate-900/90 px-3.5 py-0.5 text-[9px] sm:text-[11px] font-black uppercase tracking-wider text-yellow-400 shadow-sm">
              {equipeDaVez} responde
            </div>
          ) : (
            <div className="flex items-center gap-1.5 rounded-full bg-slate-900/80 border border-slate-800 px-3 py-0.5 text-[9px] sm:text-[10px] font-bold uppercase tracking-widest text-slate-400">
              <span className="h-2 w-2 rounded-full bg-red-500 animate-ping" />
              <span>Rodada com Buzzer Acionado</span>
            </div>
          )}
        </div>

        {/* ÁREA DA PERGUNTA (FLEX-1 CENTRALIZADO) */}
        <div className="min-h-0 flex-1 flex items-center justify-center overflow-y-auto overflow-x-hidden px-1 py-1 [scrollbar-width:none]">
          <div className="mx-auto flex w-full max-w-5xl items-center justify-center">
            <Question
              pergunta={pergunta}
              numero={estado.perguntaAtual}
              total={configuracao.totalPerguntas}
              respostaVisivel={estado.respostaVisivel}
            />
          </div>
        </div>

        {/* RESULTADO (EXIBIDO CONDICIONALMENTE, SEM OCUPAR ESPAÇO QUANDO AUSENTE) */}
        {estado.resultado && (
          <div className="flex shrink-0 items-center justify-center py-1">
            <div
              className={`w-full max-w-md rounded-xl px-4 py-1.5 text-center shadow-lg animate-in fade-in zoom-in-95 duration-200 ${
                estado.resultado === "correta"
                  ? "bg-green-600 text-white ring-2 ring-green-300 shadow-[0_0_20px_rgba(34,197,94,0.6)]"
                  : "bg-red-600 text-white ring-2 ring-red-300 shadow-[0_0_20px_rgba(239,68,68,0.6)]"
              }`}
            >
              <p className="text-xs sm:text-sm font-black uppercase tracking-wider">
                {estado.resultado === "correta"
                  ? "🎉 Resposta Correta!"
                  : "❌ Resposta Incorreta"}
              </p>
            </div>
          </div>
        )}
      </section>

      {/* FOOTER DISCRETO */}
      <footer className="flex h-5 sm:h-6 shrink-0 items-center justify-center border-t border-slate-800/80 px-4">
        <p className="text-[8px] font-bold uppercase tracking-[0.2em] text-slate-500">
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
