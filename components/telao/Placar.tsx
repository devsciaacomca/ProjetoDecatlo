export default function Placar({
  equipe1,
  equipe2,
  score1,
  score2,
}: {
  equipe1: string;
  equipe2: string;
  score1: number;
  score2: number;
}) {
  return (
    <div className="flex items-center rounded-2xl border border-slate-700 bg-slate-900 px-5 py-3 shadow-xl">
      <div className="flex items-center gap-4 text-xl font-black">
        <div className="text-center">
          <p className="text-xs uppercase tracking-widest text-slate-400">
            {equipe1}
          </p>

          <p className="text-3xl text-white">{score1}</p>
        </div>

        <span className="text-slate-600">×</span>

        <div className="text-center">
          <p className="text-xs uppercase tracking-widest text-slate-400">
            {equipe2}
          </p>

          <p className="text-3xl text-white">{score2}</p>
        </div>
      </div>
    </div>
  );
}
