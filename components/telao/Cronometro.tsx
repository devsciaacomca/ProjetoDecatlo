export default function Cronometro({ timeLeft }: { timeLeft: number }) {
  const danger = timeLeft <= 3;
  const warning = timeLeft <= 5;

  return (
    <div
      className={`
        flex h-24 w-24 shrink-0 items-center justify-center
        rounded-full border-[5px] bg-slate-950
        sm:h-32 sm:w-32 sm:border-[6px] lg:h-36 lg:w-36
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
            text-4xl font-black tabular-nums sm:text-5xl
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

        <p className="text-[9px] font-bold uppercase tracking-[0.25em] text-slate-500 sm:text-[10px]">
          segundos
        </p>
      </div>
    </div>
  );
}
