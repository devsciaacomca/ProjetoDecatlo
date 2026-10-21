"use client";

export default function Cronometro({ timeLeft }: { timeLeft: number }) {
  const danger = timeLeft <= 3;
  const warning = timeLeft <= 5;

  return (
    <div
      className={`
        relative z-20 flex shrink-0 items-center justify-center
        rounded-full border-4 sm:border-[5px] md:border-[6px] bg-slate-950 shadow-2xl transition-all duration-300
        h-[clamp(80px,13vh,145px)] w-[clamp(80px,13vh,145px)]
        ${
          danger
            ? "animate-pulse border-red-500 shadow-[0_0_40px_rgba(239,68,68,0.6)]"
            : warning
              ? "border-orange-500 shadow-[0_0_30px_rgba(249,115,22,0.4)]"
              : "border-yellow-400 shadow-[0_0_30px_rgba(250,204,21,0.25)]"
        }
      `}
    >
      <div className="text-center">
        <p
          className={`
            text-[clamp(1.75rem,4.5vh,3.5rem)] font-black tabular-nums leading-none
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

        <p className="mt-0.5 text-[8px] sm:text-[9px] font-bold uppercase tracking-[0.2em] text-slate-400">
          segundos
        </p>
      </div>
    </div>
  );
}
