export default function Cronometro({ timeLeft }: { timeLeft: number }) {
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
