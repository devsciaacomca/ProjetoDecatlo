"use client";

import { notFound, useParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

/* =========================================================
   TIPOS
========================================================= */

type PartidaStatus = "configuracao" | "pronta" | "em_andamento" | "finalizada";

type Alternativa = {
  id: number;
  texto: string;
};

type Pergunta = {
  id: number;
  assunto: string;
  tipo: "objetiva" | "aberta";
  enunciado: string;
  alternativas?: Alternativa[];
  respostaCorreta?: string;
  criadaEm: string;
};

type Partida = {
  id: string;
  nome: string;
  equipe1: string;
  equipe2: string;
  status: PartidaStatus;
  perguntas: number;
  perguntaAtual: number;
  data: string;
};

/* =========================================================
   DADOS TEMPORÁRIOS
========================================================= */

const partidas: Partida[] = [
  {
    id: "123",
    nome: "Decatlo 2026",
    equipe1: "Alfa 1",
    equipe2: "Alfa 2",
    status: "em_andamento",
    perguntas: 20,
    perguntaAtual: 8,
    data: "21/08/2026",
  },
  {
    id: "122",
    nome: "Decatlo - Treinamento",
    equipe1: "Alfa 3",
    equipe2: "Bravo 1",
    status: "finalizada",
    perguntas: 15,
    perguntaAtual: 15,
    data: "20/08/2026",
  },
  {
    id: "121",
    nome: "Decatlo - História",
    equipe1: "Alfa 1",
    equipe2: "Alfa 4",
    status: "pronta",
    perguntas: 20,
    perguntaAtual: 0,
    data: "20/08/2026",
  },
  {
    id: "120",
    nome: "Decatlo - Simulado",
    equipe1: "Bravo 1",
    equipe2: "Bravo 2",
    status: "configuracao",
    perguntas: 10,
    perguntaAtual: 0,
    data: "19/08/2026",
  },
];

const perguntas: Pergunta[] = [
  {
    id: 128,
    assunto: "História",
    tipo: "objetiva",
    enunciado: "Em que ano ocorreu a Proclamação da República no Brasil?",
    alternativas: [
      { id: 1, texto: "1822" },
      { id: 2, texto: "1888" },
      { id: 3, texto: "1889" },
    ],
    respostaCorreta: "1889",
    criadaEm: "14/08/2026",
  },

  {
    id: 127,
    assunto: "Geografia",
    tipo: "objetiva",
    enunciado: "Qual é o maior país da América do Sul em território?",
    alternativas: [
      { id: 1, texto: "Argentina" },
      { id: 2, texto: "Brasil" },
      { id: 3, texto: "Colômbia" },
    ],
    respostaCorreta: "Brasil",
    criadaEm: "14/08/2026",
  },

  {
    id: 126,
    assunto: "Matemática",
    tipo: "aberta",
    enunciado: "Explique o conceito de média aritmética.",
    criadaEm: "13/08/2026",
  },

  {
    id: 125,
    assunto: "Português",
    tipo: "objetiva",
    enunciado: "Qual das alternativas apresenta um substantivo?",
    alternativas: [
      { id: 1, texto: "Correr" },
      { id: 2, texto: "Casa" },
      { id: 3, texto: "Bonito" },
    ],
    respostaCorreta: "Casa",
    criadaEm: "13/08/2026",
  },

  {
    id: 124,
    assunto: "Atualidades",
    tipo: "aberta",
    enunciado: "Explique a importância da preservação ambiental.",
    criadaEm: "12/08/2026",
  },

  {
    id: 123,
    assunto: "História",
    tipo: "objetiva",
    enunciado: "Quem proclamou a Independência do Brasil?",
    alternativas: [
      { id: 1, texto: "Tiradentes" },
      { id: 2, texto: "Dom Pedro I" },
      { id: 3, texto: "Dom João VI" },
    ],
    respostaCorreta: "Dom Pedro I",
    criadaEm: "12/08/2026",
  },

  {
    id: 122,
    assunto: "Geografia",
    tipo: "objetiva",
    enunciado: "Qual é a capital do Brasil?",
    alternativas: [
      { id: 1, texto: "Rio de Janeiro" },
      { id: 2, texto: "São Paulo" },
      { id: 3, texto: "Brasília" },
    ],
    respostaCorreta: "Brasília",
    criadaEm: "11/08/2026",
  },

  {
    id: 121,
    assunto: "Matemática",
    tipo: "objetiva",
    enunciado: "Quanto é 10 × 5?",
    alternativas: [
      { id: 1, texto: "40" },
      { id: 2, texto: "50" },
      { id: 3, texto: "60" },
    ],
    respostaCorreta: "50",
    criadaEm: "11/08/2026",
  },

  {
    id: 120,
    assunto: "Português",
    tipo: "aberta",
    enunciado: "Explique o que é um verbo.",
    criadaEm: "10/08/2026",
  },

  {
    id: 119,
    assunto: "História",
    tipo: "objetiva",
    enunciado: "Em que ano foi assinada a Lei Áurea?",
    alternativas: [
      { id: 1, texto: "1822" },
      { id: 2, texto: "1888" },
      { id: 3, texto: "1889" },
    ],
    respostaCorreta: "1888",
    criadaEm: "10/08/2026",
  },

  {
    id: 118,
    assunto: "Geografia",
    tipo: "objetiva",
    enunciado: "Qual é o maior oceano do planeta?",
    alternativas: [
      { id: 1, texto: "Oceano Atlântico" },
      { id: 2, texto: "Oceano Índico" },
      { id: 3, texto: "Oceano Pacífico" },
    ],
    respostaCorreta: "Oceano Pacífico",
    criadaEm: "09/08/2026",
  },

  {
    id: 117,
    assunto: "Atualidades",
    tipo: "aberta",
    enunciado: "Explique o conceito de desenvolvimento sustentável.",
    criadaEm: "09/08/2026",
  },
];

/* =========================================================
   MASCOTE
========================================================= */

function Mascote({
  nome,
  video,
  ativo,
}: {
  nome: string;
  video: string;
  ativo: boolean;
}) {
  return (
    <div
      className={`
        relative overflow-hidden rounded-3xl
        border-4 transition-all duration-500
        ${
          ativo
            ? "scale-105 border-yellow-400 shadow-[0_0_60px_rgba(250,204,21,0.3)]"
            : "border-slate-700"
        }
      `}
    >
      <video
        src={video}
        autoPlay
        loop
        muted
        playsInline
        className="h-48 w-60 object-cover sm:h-56 sm:w-72 lg:h-64 lg:w-80"
      />

      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/95 via-black/50 to-transparent px-4 pb-4 pt-12">
        <p className="text-center text-xl font-black uppercase tracking-wide text-white sm:text-2xl">
          {nome}
        </p>
      </div>

      {ativo && (
        <div className="absolute left-3 top-3 rounded-full bg-yellow-400 px-3 py-1 text-xs font-black uppercase text-black">
          Vez da equipe
        </div>
      )}
    </div>
  );
}

/* =========================================================
   PLACAR
========================================================= */

function Placar({
  equipe1,
  equipe2,
  score1,
  score2,
}: {
  equipe1: string;
  equipe2: string;
  score1: number;
  score2: number;
}) {
  return (
    <div className="flex items-center rounded-2xl border border-slate-700 bg-slate-900 px-5 py-3 shadow-xl">
      <div className="flex items-center gap-4 text-xl font-black">
        <div className="text-center">
          <p className="text-xs uppercase tracking-widest text-slate-400">
            {equipe1}
          </p>

          <p className="text-3xl text-white">{score1}</p>
        </div>

        <span className="text-slate-600">×</span>

        <div className="text-center">
          <p className="text-xs uppercase tracking-widest text-slate-400">
            {equipe2}
          </p>

          <p className="text-3xl text-white">{score2}</p>
        </div>
      </div>
    </div>
  );
}

/* =========================================================
   CRONÔMETRO
========================================================= */

function Cronometro({ timeLeft }: { timeLeft: number }) {
  const danger = timeLeft <= 3;
  const warning = timeLeft <= 5;

  return (
    <div
      className={`
        flex h-32 w-32 shrink-0 items-center justify-center
        rounded-full border-[6px] bg-slate-950
        sm:h-40 sm:w-40 lg:h-48 lg:w-48
        ${
          danger
            ? "animate-pulse border-red-500"
            : warning
              ? "border-orange-500"
              : "border-yellow-400"
        }
      `}
    >
      <div className="text-center">
        <p
          className={`
            text-5xl font-black tabular-nums sm:text-6xl
            ${
              danger
                ? "text-red-500"
                : warning
                  ? "text-orange-400"
                  : "text-white"
            }
          `}
        >
          {timeLeft}
        </p>

        <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-slate-500">
          segundos
        </p>
      </div>
    </div>
  );
}

/* =========================================================
   PERGUNTA
========================================================= */

function Question({
  pergunta,
  numero,
  total,
  respostaVisivel,
}: {
  pergunta: Pergunta;
  numero: number;
  total: number;
  respostaVisivel: boolean;
}) {
  return (
    <section className="w-full max-w-6xl rounded-3xl bg-white p-5 text-slate-900 shadow-2xl sm:p-8 lg:p-10">
      <div className="mb-6 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-950 text-lg font-black text-white">
            {numero}
          </div>

          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-slate-400">
              Pergunta
            </p>

            <p className="font-bold">
              {numero} de {total}
            </p>
          </div>
        </div>

        <span className="rounded-full bg-slate-100 px-4 py-2 text-sm font-bold text-slate-600">
          {pergunta.assunto}
        </span>
      </div>

      <h1 className="mb-8 text-center text-2xl font-black leading-tight sm:text-3xl lg:text-4xl">
        {pergunta.enunciado}
      </h1>

      {pergunta.tipo === "objetiva" && pergunta.alternativas ? (
        <div className="grid gap-3 md:grid-cols-3">
          {pergunta.alternativas.map((alternativa, index) => {
            const correta =
              respostaVisivel && alternativa.texto === pergunta.respostaCorreta;

            return (
              <div
                key={alternativa.id}
                className={`
                  flex min-h-20 items-center gap-4 rounded-2xl border-2
                  px-5 py-4
                  ${
                    correta
                      ? "border-green-500 bg-green-50"
                      : "border-slate-200 bg-slate-50"
                  }
                `}
              >
                <div
                  className={`
                    flex h-10 w-10 shrink-0 items-center justify-center
                    rounded-full text-lg font-black
                    ${
                      correta
                        ? "bg-green-500 text-white"
                        : "bg-slate-950 text-white"
                    }
                  `}
                >
                  {String.fromCharCode(65 + index)}
                </div>

                <span className="text-lg font-bold">{alternativa.texto}</span>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="flex min-h-32 items-center justify-center rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50">
          <p className="font-bold text-slate-400">Pergunta aberta</p>
        </div>
      )}

      {respostaVisivel && pergunta.respostaCorreta && (
        <div className="mt-5 rounded-2xl bg-green-100 p-4 text-center font-black text-green-700">
          Resposta correta: {pergunta.respostaCorreta}
        </div>
      )}
    </section>
  );
}

/* =========================================================
   TELÃO
========================================================= */

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
