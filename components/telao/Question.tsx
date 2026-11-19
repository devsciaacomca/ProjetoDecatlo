"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { Pergunta } from "@/types/perguntas";

interface QuestionProps {
  pergunta: Pergunta;
  numero: number;
  total: number;
  respostaVisivel: boolean;
  resultado?: "correta" | "incorreta" | null;
  resultadoChave?: string | null;
}

export default function Question({
  pergunta,
  numero,
  total,
  respostaVisivel,
  resultado = null,
  resultadoChave = null,
}: QuestionProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const chaveAtual = resultado ? (resultadoChave ?? resultado) : null;
  const [prevChave, setPrevChave] = useState(chaveAtual);
  const [gifVisivel, setGifVisivel] = useState(Boolean(chaveAtual));

  if (chaveAtual !== prevChave) {
    setPrevChave(chaveAtual);
    setGifVisivel(Boolean(chaveAtual));
  }

  useEffect(() => {
    if (!gifVisivel || !resultado) return;

    const duracao = resultado === "correta" ? 3000 : 1800;
    const timer = window.setTimeout(() => {
      setGifVisivel(false);
    }, duracao);

    return () => window.clearTimeout(timer);
  }, [gifVisivel, resultado, chaveAtual]);

  useLayoutEffect(() => {
    const container = containerRef.current;
    const content = contentRef.current;
    if (!container || !content) return;

    const fitText = () => {
      const availableHeight = container.clientHeight;
      const availableWidth = container.clientWidth;
      if (availableHeight <= 0 || availableWidth <= 0) return;

      const style = window.getComputedStyle(container);
      const padY =
        parseFloat(style.paddingTop) + parseFloat(style.paddingBottom);
      const padX =
        parseFloat(style.paddingLeft) + parseFloat(style.paddingRight);
      const maxH = availableHeight - padY;
      const maxW = availableWidth - padX;

      if (maxH <= 0 || maxW <= 0) return;

      let low = 0.35;
      let high = 1.45;
      let best = low;

      for (let i = 0; i < 14; i++) {
        const mid = (low + high) / 2;
        container.style.setProperty("--q-scale", mid.toFixed(4));

        const fits =
          content.scrollHeight <= maxH + 1 &&
          content.scrollWidth <= maxW + 1;

        if (fits) {
          best = mid;
          low = mid;
        } else {
          high = mid;
        }
      }

      container.style.setProperty("--q-scale", best.toFixed(4));
    };

    fitText();

    const observer = new ResizeObserver(() => {
      fitText();
    });
    observer.observe(container);

    return () => observer.disconnect();
  }, [pergunta, respostaVisivel]);

  return (
    <section className="relative flex h-full min-h-0 w-full max-w-6xl flex-1 flex-col overflow-hidden rounded-3xl bg-white text-slate-900 shadow-2xl">
      {gifVisivel && resultado && (
        <div className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center bg-white/40 backdrop-blur-[1px]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            key={chaveAtual}
            src={resultado === "correta" ? "/gif/acertar.gif" : "/gif/errar.gif"}
            alt={
              resultado === "correta"
                ? "Resposta correta"
                : "Resposta incorreta"
            }
            className="max-h-[65%] max-w-[65%] object-contain drop-shadow-xl"
          />
        </div>
      )}

      {/* CABEÇALHO */}
      <header className="flex h-14 shrink-0 items-center justify-between gap-4 border-b border-slate-200 px-5 sm:h-16 sm:px-7">
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-950 text-base font-black text-white sm:h-11 sm:w-11 sm:text-lg">
            {numero}
          </div>

          <div>
            <p className="text-[11px] font-bold uppercase tracking-widest text-slate-400 sm:text-xs">
              Pergunta
            </p>

            <p className="text-sm font-bold sm:text-base">
              {numero} de {total}
            </p>
          </div>
        </div>

        <span className="max-w-[35%] truncate rounded-full bg-slate-100 px-4 py-1.5 text-xs font-bold text-slate-600 sm:py-2 sm:text-sm">
          {pergunta.assunto}
        </span>
      </header>

      {/* CONTEÚDO ADAPTÁVEL */}
      <div
        ref={containerRef}
        className="flex min-h-0 flex-1 flex-col justify-center overflow-hidden px-5 py-3 sm:px-8 sm:py-4"
      >
        <div
          ref={contentRef}
          className="flex w-full flex-col"
          style={{ gap: "calc(12px * var(--q-scale, 1))" }}
        >
          {/* ENUNCIADO */}
          <div className="flex items-center justify-center">
            <h1
              className="max-w-5xl break-words text-center font-black leading-tight"
              style={{ fontSize: "calc(32px * var(--q-scale, 1))" }}
            >
              {pergunta.enunciado}
            </h1>
          </div>

          {/* ALTERNATIVAS */}
          {pergunta.tipo === "objetiva" && pergunta.alternativas ? (
            <div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
              style={{ gap: "calc(10px * var(--q-scale, 1))" }}
            >
              {pergunta.alternativas.map((alternativa, index) => {
                const correta =
                  respostaVisivel &&
                  alternativa.texto === pergunta.respostaCorreta;

                return (
                  <div
                    key={alternativa.id}
                    className={`flex items-center rounded-2xl border-2 transition-colors duration-300 ${
                      correta
                        ? "border-green-500 bg-green-50"
                        : "border-slate-200 bg-slate-50"
                    }`}
                    style={{
                      gap: "calc(12px * var(--q-scale, 1))",
                      padding:
                        "calc(10px * var(--q-scale, 1)) calc(16px * var(--q-scale, 1))",
                    }}
                  >
                    <div
                      className={`flex shrink-0 items-center justify-center rounded-full font-black ${
                        correta
                          ? "bg-green-500 text-white"
                          : "bg-slate-950 text-white"
                      }`}
                      style={{
                        width: "calc(36px * var(--q-scale, 1))",
                        height: "calc(36px * var(--q-scale, 1))",
                        fontSize: "calc(15px * var(--q-scale, 1))",
                      }}
                    >
                      {String.fromCharCode(65 + index)}
                    </div>

                    <span
                      className="min-w-0 break-words font-bold leading-snug"
                      style={{ fontSize: "calc(17px * var(--q-scale, 1))" }}
                    >
                      {alternativa.texto}
                    </span>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="flex items-center justify-center">
              <div
                className="rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50 text-center"
                style={{
                  padding:
                    "calc(16px * var(--q-scale, 1)) calc(28px * var(--q-scale, 1))",
                }}
              >
                <p
                  className="font-bold text-slate-400"
                  style={{ fontSize: "calc(16px * var(--q-scale, 1))" }}
                >
                  Pergunta aberta
                </p>
              </div>
            </div>
          )}

          {/* ÁREA RESERVADA PARA RESPOSTA */}
          <div className="flex items-center justify-center">
            <div
              className={`w-full max-w-5xl rounded-2xl text-center transition-opacity duration-300 ${
                respostaVisivel
                  ? "bg-green-100 opacity-100"
                  : "pointer-events-none opacity-0"
              }`}
              style={{
                padding:
                  "calc(10px * var(--q-scale, 1)) calc(18px * var(--q-scale, 1))",
              }}
            >
              <p
                className="font-black uppercase tracking-widest text-green-700"
                style={{ fontSize: "calc(11px * var(--q-scale, 1))" }}
              >
                Resposta correta
              </p>

              <p
                className="mt-1 break-words font-black text-green-900"
                style={{ fontSize: "calc(17px * var(--q-scale, 1))" }}
              >
                {pergunta.respostaCorreta}
              </p>

              {/* Espaço permanente para explicação */}
              <div className="mt-1">
                <p
                  className="mx-auto max-w-4xl break-words leading-snug text-green-900"
                  style={{ fontSize: "calc(13px * var(--q-scale, 1))" }}
                >
                  {pergunta.explicacao || "\u00A0"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
