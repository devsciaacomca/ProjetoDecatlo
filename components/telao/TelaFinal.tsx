
"use client";

import { Trophy } from "lucide-react";

type TelaFinalProps = {
  equipe1: string;
  equipe2: string;

  score1: number;
  score2: number;

  videoVencedor?: string;
};

export default function TelaFinal({
  equipe1,
  equipe2,
  score1,
  score2,
  videoVencedor,
}: TelaFinalProps) {
  const empate = score1 === score2;

  const vencedor =
    score1 > score2
      ? equipe1
      : score2 > score1
        ? equipe2
        : null;

  const video =
    videoVencedor ??
    (score1 > score2
      ? "/videos/mascote-alfa1-vence.mp4"
      : score2 > score1
        ? "/videos/mascote-alfa2-vence.mp4"
        : null);

  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-slate-950 px-6 text-white">
      {/* Fundo */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(234,179,8,0.15),transparent_50%)]" />

      <div className="relative z-10 w-full max-w-6xl text-center">
        {/* Título */}
        <div className="mb-8">
          <Trophy
            className="mx-auto mb-4 text-yellow-400"
            size={72}
          />

          <p className="text-sm font-black uppercase tracking-[0.4em] text-yellow-400">
            Partida finalizada
          </p>

          {empate ? (
            <h1 className="mt-3 text-5xl font-black sm:text-7xl">
              EMPATE!
            </h1>
          ) : (
            <>
              <h1 className="mt-3 text-4xl font-black sm:text-6xl">
                TEMOS UM VENCEDOR!
              </h1>

              <p className="mt-3 text-2xl font-bold text-yellow-400 sm:text-4xl">
                {vencedor}
              </p>
            </>
          )}
        </div>

        {/* Mascote */}
        {video && (
          <div className="mx-auto mb-8 max-w-2xl overflow-hidden rounded-3xl border border-slate-800 bg-black shadow-2xl">
            <video
              src={video}
              autoPlay
              muted
              playsInline
              controls={false}
              className="aspect-video w-full object-cover"
            />
          </div>
        )}

        {/* Placar */}
        <div className="mx-auto grid max-w-3xl grid-cols-2 overflow-hidden rounded-2xl border border-slate-800 bg-slate-900">
          <div
            className={`p-8 ${
              score1 > score2
                ? "bg-yellow-400/10"
                : ""
            }`}
          >
            <p className="text-sm font-bold uppercase tracking-widest text-slate-400">
              {equipe1}
            </p>

            <p className="mt-2 text-6xl font-black">
              {score1}
            </p>

            {score1 > score2 && (
              <p className="mt-2 text-sm font-black uppercase text-yellow-400">
                Vencedor
              </p>
            )}
          </div>

          <div
            className={`border-l border-slate-800 p-8 ${
              score2 > score1
                ? "bg-yellow-400/10"
                : ""
            }`}
          >
            <p className="text-sm font-bold uppercase tracking-widest text-slate-400">
              {equipe2}
            </p>

            <p className="mt-2 text-6xl font-black">
              {score2}
            </p>

            {score2 > score1 && (
              <p className="mt-2 text-sm font-black uppercase text-yellow-400">
                Vencedor
              </p>
            )}
          </div>
        </div>

        <p className="mt-8 text-sm font-bold uppercase tracking-[0.3em] text-slate-600">
          Aguardando próxima partida
        </p>
      </div>
    </main>
  );
}