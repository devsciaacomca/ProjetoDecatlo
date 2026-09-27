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
    <section className="flex min-h-0 w-full max-w-[1400px] flex-1 flex-col overflow-hidden rounded-2xl bg-white text-slate-900 shadow-2xl">
      {/* CABEÇALHO FIXO */}{" "}
      <header className="flex h-[58px] shrink-0 items-center justify-between gap-4 border-b border-slate-200 px-4 sm:px-6">
        {" "}
        <div className="flex min-w-0 items-center gap-3">
          {" "}
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-950 text-sm font-black text-white">
            {numero}{" "}
          </div>
          <div className="min-w-0">
            <p className="text-[9px] font-bold uppercase tracking-widest text-slate-400">
              Pergunta
            </p>

            <p className="text-sm font-bold">
              {numero} de {total}
            </p>
          </div>
        </div>
        <span className="max-w-[35%] truncate rounded-full bg-slate-100 px-3 py-1.5 text-xs font-bold text-slate-600">
          {pergunta.assunto}
        </span>
      </header>
      {/* ÁREA CENTRAL */}
      <div className="flex min-h-0 flex-1 flex-col px-4 py-4 sm:px-7">
        {/* ENUNCIADO
        Altura reservada para que as alternativas
        não mudem de posição. */}
        <div className="flex h-[25%] min-h-[100px] shrink-0 items-center justify-center">
          <h1 className="max-w-5xl text-center text-[clamp(1.15rem,2.5vw,2.3rem)] font-black leading-tight">
            {pergunta.enunciado}
          </h1>
        </div>

        {/* ALTERNATIVAS
        Sempre ocupam a mesma área. */}
        {pergunta.tipo === "objetiva" && pergunta.alternativas ? (
          <div className="grid min-h-0 flex-1 grid-cols-1 grid-rows-4 gap-2.5 py-2 sm:grid-cols-2 sm:grid-rows-2">
            {pergunta.alternativas.map((alternativa, index) => {
              const correta =
                respostaVisivel &&
                alternativa.texto === pergunta.respostaCorreta;

              return (
                <div
                  key={alternativa.id}
                  className={`flex min-h-0 items-center gap-3 overflow-hidden rounded-xl border-2 px-4 py-3 transition-colors duration-300 ${
                    correta
                      ? "border-green-500 bg-green-50"
                      : "border-slate-200 bg-slate-50"
                  }`}
                >
                  <div
                    className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-black ${
                      correta
                        ? "bg-green-500 text-white"
                        : "bg-slate-950 text-white"
                    }`}
                  >
                    {String.fromCharCode(65 + index)}
                  </div>

                  <span className="min-w-0 overflow-hidden text-ellipsis text-[clamp(.75rem,1.35vw,1.1rem)] font-bold leading-snug">
                    {alternativa.texto}
                  </span>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="flex min-h-0 flex-1 items-center justify-center">
            <div className="rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 px-8 py-6 text-center">
              <p className="font-bold text-slate-400">Pergunta aberta</p>
            </div>
          </div>
        )}

        {/* ÁREA INFERIOR FIXA
        Sempre ocupa espaço mesmo quando a resposta
        ainda não foi revelada. */}
        <div className="mt-2 flex h-[110px] shrink-0 items-center justify-center">
          <div
            className={`w-full max-w-5xl rounded-xl px-4 py-3 text-center transition-all duration-300 ${
              respostaVisivel
                ? "bg-green-100 opacity-100"
                : "pointer-events-none opacity-0"
            }`}
          >
            <p className="text-[9px] font-bold uppercase tracking-widest text-green-700">
              Resposta correta
            </p>

            <p className="mt-1 text-[clamp(.85rem,1.4vw,1.15rem)] font-black text-green-900">
              {pergunta.respostaCorreta}
            </p>

            <div className="mt-1 min-h-[24px]">
              <p className="mx-auto max-w-4xl text-xs leading-relaxed text-green-900 sm:text-sm">
                {pergunta.explicacao || "\u00A0"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
