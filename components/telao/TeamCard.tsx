"use client";

interface TeamCardProps {
  team: "A" | "B";
  name: string;
  score: number;
  video: string;
  activeTeam: "A" | "B";
}

export default function TeamCard({
  team,
  name,
  score,
  video,
  activeTeam,
}: TeamCardProps) {
  const isActive = team === activeTeam;

  return (
    <div
      className={`
        flex w-full max-w-sm flex-col items-center
        rounded-2xl border p-4 transition-all duration-300
        sm:p-6
        ${
          isActive
            ? "border-white/40 bg-white/10 shadow-2xl shadow-white/5"
            : "border-white/10 bg-white/5 opacity-70"
        }
      `}
    >
      {/* Mascote */}
      <div className="relative aspect-video w-full overflow-hidden rounded-xl bg-slate-900">
        <video
          src={video}
          autoPlay
          loop
          muted
          playsInline
          className="h-full w-full object-cover"
        />
      </div>

      {/* Nome */}
      <p className="mt-4 text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
        Equipe {team}
      </p>

      <h2 className="mt-1 text-xl font-bold sm:text-2xl">{name}</h2>

      {/* Pontuação */}
      <p className="mt-2 text-4xl font-black tabular-nums sm:text-5xl">
        {score}
      </p>

      {isActive && (
        <span className="mt-2 rounded-full bg-white px-3 py-1 text-xs font-bold uppercase tracking-wider text-slate-900">
          Sua vez
        </span>
      )}
    </div>
  );
}
