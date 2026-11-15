export default function Cronometro({ timeLeft }: { timeLeft: number }) {
  const danger = timeLeft <= 3;
  const warning = timeLeft <= 5;

  return (
    <div
      className={`
        flex h-[11vh] w-[11vh] shrink-0 items-center justify-center
        rounded-full border-4 bg-slate-950
        ${
          danger
            ? "animate-pulse border-red-500"
            : warning
              ? "border-orange-500"
              : "border-yellow-400"
        }
      `}
    >
      <div className="text-center leading-none">
        <p
          className={`
            text-[3.8vh] font-black tabular-nums
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

        <p className="mt-[0.3vh] text-[1vh] font-bold uppercase tracking-[0.2em] text-slate-500">
          segundos
        </p>
      </div>
    </div>
  );
}
