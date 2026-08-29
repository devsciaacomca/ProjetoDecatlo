"use client";

import { RotateCcw, Trophy } from "lucide-react";

type TelaFinalProps = {
  equipe1: string;
  equipe2: string;
  pontos1: number;
  pontos2: number;
  videoEquipe1: string;
  videoEquipe2: string;
  onJogarNovamente?: () => void;
};

export default function TelaFinal({
  equipe1,
  equipe2,
  pontos1,
  pontos2,
  videoEquipe1,
  videoEquipe2,
  onJogarNovamente,
}: TelaFinalProps) {
  const vencedor =
    pontos1 > pontos2
      ? "A"
      : pontos2 > pontos1
        ? "B"
        : "EMPATE";

  const equipeVencedora =
    vencedor === "A"
      ? equipe1
      : vencedor === "B"
        ? equipe2
        : null;

  const pontosVencedor =
    vencedor === "A"
      ? pontos1
      : vencedor === "B"
        ? pontos2
        : 0;

  const videoVencedor =
    vencedor === "A"
      ? videoEquipe1
      : vencedor === "B"
        ? videoEquipe2
        : null;

  if (vencedor === "EMPATE") {
    return (
      <main className="flex min-h-screen items-center justify-center overflow-hidden bg-slate-950 px-4 py-8 text-white">
        <div className="w-full max-w-5xl text-center">
          <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-yellow-400/10 ring-1 ring-yellow-400/30">
            <Trophy
              size={48}
              className="text-yellow-400"
            />
          </div>

          <p className="mt-8 text-sm font-black uppercase tracking-[0.4em] text-yellow-400">
            Resultado final
          </p>

          <h1 className="mt-3 text-6xl font-black uppercase sm:text-8xl">
            Empate!
          </h1>

          <p className="mx-auto mt-4 max-w-xl text-lg text-slate-400">
            As duas equipes terminaram a partida com
            a mesma pontuação.
          </p>

          <div className="mx-auto mt-10 grid max-w-2xl grid-cols-2 gap-4">
            <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
              <p className="text-sm font-bold uppercase tracking-wider text-slate-400">
                {equipe1}
              </p>

              <p className="mt-2 text-5xl font-black">
                {pontos1}
              </p>

              <p className="mt-1 text-sm text-slate-500">
                pontos
              </p>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
              <p className="text-sm font-bold uppercase tracking-wider text-slate-400">
                {equipe2}
              </p>

              <p className="mt-2 text-5xl font-black">
                {pontos2}
              </p>

              <p className="mt-1 text-sm text-slate-500">
                pontos
              </p>
            </div>
          </div>

          {onJogarNovamente && (
            <button
              type="button"
              onClick={onJogarNovamente}
              className="mt-10 inline-flex items-center gap-2 rounded-xl bg-white px-7 py-4 text-sm font-black text-slate-950 transition hover:scale-105 hover:bg-slate-100"
            >
              <RotateCcw size={18} />
              Jogar novamente
            </button>
          )}
        </div>
      </main>
    );
  }

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-slate-950 px-4 py-6 text-white">
      {/* Efeito de fundo */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-yellow-400/10 blur-[120px]" />
      </div>

      <div className="relative z-10 w-full max-w-6xl text-center">
        {/* Título */}

        <div className="flex items-center justify-center gap-3">
          <Trophy
            size={32}
            className="text-yellow-400"
          />

          <p className="text-sm font-black uppercase tracking-[0.4em] text-yellow-400">
            Resultado final
          </p>

          <Trophy
            size={32}
            className="text-yellow-400"
          />
        </div>

        <h1 className="mt-4 text-5xl font-black uppercase sm:text-7xl">
          {equipeVencedora}
        </h1>

        <p className="mt-2 text-xl font-bold uppercase tracking-widest text-slate-400 sm:text-2xl">
          Venceu a partida!
        </p>

        {/* Vídeo */}

        <div className="mx-auto mt-8 w-full max-w-4xl overflow-hidden rounded-3xl border border-yellow-400/20 bg-black shadow-2xl shadow-black/50">
          {videoVencedor && (
            <video
              key={videoVencedor}
              src={videoVencedor}
              autoPlay
              playsInline
              muted
              controls={false}
              className="aspect-video w-full object-cover"
              onEnded={(event) => {
                const video = event.currentTarget;

                video.currentTime = 0;
                video.play().catch(() => {});
              }}
            />
          )}
        </div>

        {/* Placar */}

        <div className="mx-auto mt-8 grid max-w-3xl grid-cols-[1fr_auto_1fr] items-center gap-4">
          <div
            className={`rounded-2xl border p-5 ${
              vencedor === "A"
                ? "border-yellow-400/50 bg-yellow-400/10"
                : "border-slate-800 bg-slate-900"
            }`}
          >
            <p className="text-sm font-black uppercase tracking-wider text-slate-400">
              {equipe1}
            </p>

            <p className="mt-2 text-5xl font-black">
              {pontos1}
            </p>

            {vencedor === "A" && (
              <p className="mt-2 text-xs font-black uppercase tracking-widest text-yellow-400">
                Campeã
              </p>
            )}
          </div>

          <div className="text-2xl font-black text-slate-600">
            ×
          </div>

          <div
            className={`rounded-2xl border p-5 ${
              vencedor === "B"
                ? "border-yellow-400/50 bg-yellow-400/10"
                : "border-slate-800 bg-slate-900"
            }`}
          >
            <p className="text-sm font-black uppercase tracking-wider text-slate-400">
              {equipe2}
            </p>

            <p className="mt-2 text-5xl font-black">
              {pontos2}
            </p>

            {vencedor === "B" && (
              <p className="mt-2 text-xs font-black uppercase tracking-widest text-yellow-400">
                Campeã
              </p>
            )}
          </div>
        </div>


        <p className="mt-6 text-xs font-bold uppercase tracking-[0.25em] text-slate-700">
          Decatlo • Resultado final
        </p>
      </div>
    </main>
  );
}