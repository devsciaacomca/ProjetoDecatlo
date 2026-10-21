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
    <section className="flex min-h-0 w-full max-w-5xl flex-col overflow-hidden rounded-2xl sm:rounded-3xl bg-white text-slate-900 shadow-2xl transition-all">
      {/* CABEÇALHO DA PERGUNTA */}
      <header className="flex h-11 sm:h-13 md:h-14 shrink-0 items-center justify-between gap-3 border-b border-slate-200 px-4 sm:px-6">
        <div className="flex min-w-0 items-center gap-2.5">
          <div className="flex h-7 w-7 sm:h-8 sm:w-8 md:h-9 md:w-9 shrink-0 items-center justify-center rounded-lg bg-slate-950 text-xs sm:text-sm md:text-base font-black text-white">
            {numero}
          </div>

          <div>
            <p className="text-[9px] sm:text-[10px] font-bold uppercase tracking-wider text-slate-400 leading-none">
              Pergunta
            </p>
            <p className="text-xs sm:text-sm font-bold text-slate-800 leading-tight">
              {numero} de {total}
            </p>
          </div>
        </div>

        <span className="max-w-[45%] truncate rounded-full bg-slate-100 px-3 py-1 text-xs sm:text-sm font-bold text-slate-600">
          {pergunta.assunto}
        </span>
      </header>

      {/* CONTEÚDO */}
      <div className="flex min-h-0 flex-1 flex-col justify-between px-4 py-2.5 sm:px-6 sm:py-3.5 md:py-4">
        {/* ENUNCIADO */}
        <div className="flex min-h-[55px] sm:min-h-[75px] md:min-h-[85px] items-center justify-center py-1 sm:py-2">
          <h1 className="max-w-4xl text-center text-[clamp(1rem,1.6vw+0.6vh,1.8rem)] font-black leading-snug tracking-tight text-slate-900">
            {pergunta.enunciado}
          </h1>
        </div>

        {/* ALTERNATIVAS */}
        {pergunta.tipo === "objetiva" && pergunta.alternativas ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 sm:gap-2.5 md:gap-3 py-1 sm:py-2">
            {pergunta.alternativas.map((alternativa, index) => {
              const correta =
                respostaVisivel &&
                alternativa.texto === pergunta.respostaCorreta;

              return (
                <div
                  key={alternativa.id}
                  className={`flex min-h-[44px] sm:min-h-[50px] md:min-h-[56px] items-center gap-2.5 sm:gap-3 rounded-xl sm:rounded-2xl border-2 px-3 sm:px-4 py-1.5 sm:py-2 transition-all duration-300 ${
                    correta
                      ? "border-green-500 bg-green-50 shadow-md ring-2 ring-green-400/50"
                      : "border-slate-200 bg-slate-50/80 hover:bg-slate-100/80"
                  }`}
                >
                  <div
                    className={`flex h-7 w-7 sm:h-8 sm:w-8 md:h-9 md:w-9 shrink-0 items-center justify-center rounded-full text-xs sm:text-sm font-black transition-colors ${
                      correta
                        ? "bg-green-500 text-white"
                        : "bg-slate-950 text-white"
                    }`}
                  >
                    {String.fromCharCode(65 + index)}
                  </div>

                  <span className="min-w-0 text-xs sm:text-sm md:text-base font-bold leading-snug text-slate-800">
                    {alternativa.texto}
                  </span>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="flex min-h-[60px] items-center justify-center py-2">
            <div className="rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 px-6 py-3 text-center">
              <p className="text-xs sm:text-sm font-bold text-slate-400">
                Pergunta discursiva / aberta
              </p>
            </div>
          </div>
        )}

        {/* ÁREA DE RESPOSTA REVELADA */}
        {respostaVisivel && (
          <div className="mt-2 shrink-0 animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div className="w-full rounded-xl bg-green-100 border border-green-300 px-4 py-2 text-center shadow-sm">
              <p className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-green-700">
                Resposta Correta
              </p>
              <p className="text-xs sm:text-sm md:text-base font-black text-green-950 mt-0.5">
                {pergunta.respostaCorreta}
              </p>
              {pergunta.explicacao && (
                <p className="mx-auto mt-0.5 max-w-3xl text-[11px] sm:text-xs text-green-800 leading-snug">
                  {pergunta.explicacao}
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
