"use client";

import { Pergunta } from "@/types/perguntas";

interface QuestionProps {
  pergunta: Pergunta;
  numero: number;
  total: number;
  respostaVisivel: boolean;
}

export default function Question({
  pergunta,
  numero,
  total,
  respostaVisivel,
}: QuestionProps) {
  return (
    <section className="flex h-full min-h-0 w-full flex-1 flex-col overflow-hidden rounded-3xl bg-white text-slate-900 shadow-2xl">
      {/* CABEÇALHO */}
      <header className="flex h-[6.5vh] shrink-0 items-center justify-between gap-3 border-b border-slate-200 px-[1.5vw]">
        <div className="flex min-w-0 items-center gap-[0.8vw]">
          <div className="flex h-[4.2vh] w-[4.2vh] shrink-0 items-center justify-center rounded-xl bg-slate-950 text-[2vh] font-black text-white">
            {numero}
          </div>

          <div className="leading-tight">
            <p className="text-[1.1vh] font-bold uppercase tracking-widest text-slate-400">
              Pergunta
            </p>

            <p className="text-[1.8vh] font-bold">
              {numero} de {total}
            </p>
          </div>
        </div>

        <span className="max-w-[45%] truncate rounded-full bg-slate-100 px-[1.2vw] py-[0.6vh] text-[1.6vh] font-bold text-slate-600">
          {pergunta.assunto}
        </span>
      </header>

      {/* CONTEÚDO */}
      <div className="flex min-h-0 flex-1 flex-col justify-between overflow-hidden px-[2vw] py-[1.5vh]">
        {/* ENUNCIADO */}
        <div className="flex min-h-0 flex-1 items-center justify-center overflow-hidden py-[0.5vh]">
          <h1 className="max-w-5xl text-center text-[clamp(0.95rem,2.6vh,2.25rem)] font-black leading-snug">
            {pergunta.enunciado}
          </h1>
        </div>

        {/* ALTERNATIVAS */}
        {pergunta.tipo === "objetiva" && pergunta.alternativas ? (
          <div className="grid shrink-0 grid-cols-1 gap-[1.2vh] py-[1vh] md:grid-cols-2 lg:grid-cols-3">
            {pergunta.alternativas.map((alternativa, index) => {
              const correta =
                respostaVisivel &&
                alternativa.texto === pergunta.respostaCorreta;

              return (
                <div
                  key={alternativa.id}
                  className={`flex min-h-[6.5vh] items-center gap-[0.8vw] rounded-2xl border-2 px-[1.2vw] py-[1vh] transition-colors duration-300 ${
                    correta
                      ? "border-green-500 bg-green-50"
                      : "border-slate-200 bg-slate-50"
                  }`}
                >
                  <div
                    className={`flex h-[3.8vh] w-[3.8vh] shrink-0 items-center justify-center rounded-full text-[1.8vh] font-black ${
                      correta
                        ? "bg-green-500 text-white"
                        : "bg-slate-950 text-white"
                    }`}
                  >
                    {String.fromCharCode(65 + index)}
                  </div>

                  <span className="min-w-0 text-[clamp(0.8rem,1.9vh,1.25rem)] font-bold leading-snug">
                    {alternativa.texto}
                  </span>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="flex min-h-0 flex-1 items-center justify-center">
            <div className="rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50 px-[2vw] py-[2vh] text-center">
              <p className="text-[2vh] font-bold text-slate-400">Pergunta aberta</p>
            </div>
          </div>
        )}

        {/* ÁREA RESERVADA PARA RESPOSTA */}
        <div className="mt-[0.5vh] flex min-h-[8.5vh] shrink-0 items-center justify-center">
          <div
            className={`w-full max-w-5xl rounded-2xl px-[1.5vw] py-[1vh] text-center transition-opacity duration-300 ${
              respostaVisivel
                ? "bg-green-100 opacity-100"
                : "pointer-events-none opacity-0"
            }`}
          >
            <p className="text-[1.1vh] font-black uppercase tracking-widest text-green-700">
              Resposta correta
            </p>

            <p className="mt-[0.2vh] text-[1.9vh] font-black text-green-900">
              {pergunta.respostaCorreta}
            </p>

            {/* Espaço permanente para explicação */}
            <div className="mt-[0.2vh] min-h-[2vh]">
              <p className="mx-auto max-w-4xl truncate text-[1.5vh] leading-relaxed text-green-900">
                {pergunta.explicacao || "\u00A0"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
