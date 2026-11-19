export default function Mascote({
  nome,
  video,
  ativo,
  pontos,
}: {
  nome: string;
  video: string;
  ativo: boolean;
  pontos: number;
}) {
  return (
    <div
      className={`
        relative overflow-hidden rounded-3xl
        border-4 transition-all duration-500
        ${
          ativo
            ? "scale-105 border-yellow-400 shadow-[0_0_60px_rgba(250,204,21,0.3)]"
            : "border-slate-700"
        }
      `}
    >
      <video
        src={video}
        autoPlay
        loop
        muted
        playsInline
        className="aspect-[9/16] h-44 w-auto object-cover sm:h-56 lg:h-64"
      />

      <div className="absolute inset-x-0 bottom-0 flex flex-col items-center bg-gradient-to-t from-black via-black/80 to-transparent px-2 pb-2.5 pt-8 sm:px-2.5 sm:pb-3 sm:pt-10">
        <p className="max-w-full truncate text-center text-xs font-black uppercase tracking-wide text-white drop-shadow-md sm:text-sm lg:text-base">
          {nome}
        </p>
        <div className="mt-1 rounded-lg border border-white/10 bg-black/60 px-3 py-0.5 backdrop-blur-sm sm:px-3.5 sm:py-1">
          <p className="text-center text-xl font-black text-yellow-400 drop-shadow-[0_2px_10px_rgba(250,204,21,0.5)] sm:text-2xl lg:text-3xl">
            {pontos}
          </p>
        </div>
      </div>

      {ativo && (
        <div className="absolute inset-x-2 top-2 rounded-full bg-yellow-400 px-2 py-0.5 text-center text-[9px] font-black uppercase text-black sm:text-[10px] lg:text-xs">
          Vez da equipe
        </div>
      )}
    </div>
  );
}
