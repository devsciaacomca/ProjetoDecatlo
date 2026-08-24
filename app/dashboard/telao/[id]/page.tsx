"use client";

import { notFound, useParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
// Data
import { partidas } from "@/data/partidas/partidas";
import { perguntas } from "@/data/perguntas/perguntas";
// Components
import Mascote from "@/components/telao/Mascote";
import Placar from "@/components/telao/Placar";
import Cronometro from "@/components/telao/Cronometro";
import Question from "@/components/telao/Question";

export default function TelaoPage() {
  const params = useParams<{ id: string }>();

  const partida = useMemo(
    () => partidas.find((item) => item.id === params.id),
    [params.id],
  );

  if (!partida) {
    notFound();
  }

  /*
   * Estado temporário.
   *
   * Posteriormente esses dados serão recebidos
   * da página de controle através de WebSocket,
   * banco ou outra forma de sincronização.
   */
  const [score1] = useState(0);
  const [score2] = useState(0);

  const [perguntaAtual] = useState(partida.perguntaAtual);

  const [timeLeft] = useState(10);

  const [activeTeam] = useState<"A" | "B">("A");

  const [respostaVisivel] = useState(false);

  /*
   * A partida informa qual pergunta está sendo exibida.
   *
   * Como o banco de perguntas atual ainda é um mock,
   * usamos a posição correspondente.
   */
  const pergunta = useMemo(() => {
    const indice = Math.max(perguntaAtual - 1, 0);

    return perguntas[indice];
  }, [perguntaAtual]);

  /*
   * Futuramente esses dados virão do estado da partida.
   * Neste momento fazemos apenas uma animação visual
   * do cronômetro para demonstrar o funcionamento.
   */
  const [displayTime, setDisplayTime] = useState(timeLeft);

  useEffect(() => {
    if (partida.status !== "em_andamento") {
      return;
    }

    const timer = setInterval(() => {
      setDisplayTime((value) => {
        if (value <= 0) {
          return 10;
        }

        return value - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [partida.status]);

  if (!pergunta) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-950 text-white">
        <div className="text-center">
          <h1 className="text-3xl font-black">Aguardando pergunta</h1>

          <p className="mt-2 text-slate-400">
            O apresentador ainda não selecionou uma pergunta.
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen flex-col bg-slate-950 text-white">
      {/* ===================================================
          CABEÇALHO
      =================================================== */}

      <header className="flex items-center justify-between border-b border-slate-800 px-5 py-3 sm:px-8">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.3em] text-yellow-400">
            Decatlo
          </p>

          <h1 className="text-xl font-black sm:text-2xl">{partida.nome}</h1>
        </div>

        <Placar
          equipe1={partida.equipe1}
          equipe2={partida.equipe2}
          score1={score1}
          score2={score2}
        />
      </header>

      {/* ===================================================
          ÁREA PRINCIPAL
      =================================================== */}

      <section className="flex flex-1 flex-col gap-5 px-4 py-5 sm:px-6 lg:px-10">
        {/* MASCOTES + CRONÔMETRO */}

        <div className="flex items-center justify-center gap-3 sm:gap-6 lg:gap-12">
          <Mascote
            nome={partida.equipe1}
            video="/videos/mascote-alfa1.mp4"
            ativo={activeTeam === "A"}
          />

          <Cronometro timeLeft={displayTime} />

          <Mascote
            nome={partida.equipe2}
            video="/videos/mascote-alfa2.mp4"
            ativo={activeTeam === "B"}
          />
        </div>

        {/* INDICADOR */}

        <div className="flex justify-center">
          <div className="rounded-full border border-slate-700 bg-slate-900 px-5 py-1.5 text-xs font-black uppercase tracking-widest text-yellow-400">
            {activeTeam === "A" ? partida.equipe1 : partida.equipe2} responde
          </div>
        </div>

        {/* PERGUNTA */}

        <div className="flex justify-center">
          <Question
            pergunta={pergunta}
            numero={perguntaAtual}
            total={partida.perguntas}
            respostaVisivel={respostaVisivel}
          />
        </div>
      </section>

      {/* ===================================================
          RODAPÉ DO TELÃO
      =================================================== */}

      <footer className="border-t border-slate-800 px-5 py-3 text-center">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-600">
          {partida.nome} • {partida.data}
        </p>
      </footer>
    </main>
  );
}
