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
    <section className="flex min-h-0 w-full max-w-6xl flex-1 flex-col overflow-hidden rounded-3xl bg-white text-slate-900 shadow-2xl">
      {/* CABEÇALHO */}
      <header className="flex h-[70px] shrink-0 items-center justify-between gap-4 border-b border-slate-200 px-5 sm:px-7">
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-slate-950 text-lg font-black text-white">
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

        <span className="max-w-[35%] truncate rounded-full bg-slate-100 px-4 py-2 text-sm font-bold text-slate-600">
          {pergunta.assunto}
        </span>
      </header>

      {/* CONTEÚDO */}
      <div className="flex min-h-0 flex-1 flex-col px-5 py-4 sm:px-8">
        {/* ENUNCIADO */}
        <div className="flex min-h-[150px] shrink-0 items-center justify-center">
          <h1 className="max-w-5xl text-center text-[clamp(1.25rem,2.5vw,2.5rem)] font-black leading-tight">
            {pergunta.enunciado}
          </h1>
        </div>

        {/* ALTERNATIVAS */}
        {pergunta.tipo === "objetiva" && pergunta.alternativas ? (
          <div className="grid min-h-0 flex-1 grid-cols-1 gap-3 py-3 md:grid-cols-2 lg:grid-cols-3">
            {pergunta.alternativas.map((alternativa, index) => {
              const correta =
                respostaVisivel &&
                alternativa.texto === pergunta.respostaCorreta;

              return (
                <div
                  key={alternativa.id}
                  className={`flex min-h-[72px] items-center gap-4 rounded-2xl border-2 px-5 py-4 transition-colors duration-300 ${
                    correta
                      ? "border-green-500 bg-green-50"
                      : "border-slate-200 bg-slate-50"
                  }`}
                >
                  <div
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-lg font-black ${
                      correta
                        ? "bg-green-500 text-white"
                        : "bg-slate-950 text-white"
                    }`}
                  >
                    {String.fromCharCode(65 + index)}
                  </div>

                  <span className="min-w-0 text-lg font-bold leading-snug">
                    {alternativa.texto}
                  </span>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="flex min-h-0 flex-1 items-center justify-center">
            <div className="rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50 px-8 py-6 text-center">
              <p className="font-bold text-slate-400">Pergunta aberta</p>
            </div>
          </div>
        )}

        {/* ÁREA RESERVADA PARA RESPOSTA */}
        <div className="mt-3 flex h-[115px] shrink-0 items-center justify-center">
          <div
            className={`w-full max-w-5xl rounded-2xl px-5 py-3 text-center transition-opacity duration-300 ${
              respostaVisivel
                ? "bg-green-100 opacity-100"
                : "pointer-events-none opacity-0"
            }`}
          >
            <p className="text-xs font-black uppercase tracking-widest text-green-700">
              Resposta correta
            </p>

            <p className="mt-1 text-lg font-black text-green-900">
              {pergunta.respostaCorreta}
            </p>

            {/* Espaço permanente para explicação */}
            <div className="mt-1 min-h-[28px]">
              <p className="mx-auto max-w-4xl text-sm leading-relaxed text-green-900">
                {pergunta.explicacao || "\u00A0"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
