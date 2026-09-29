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
        className="h-56 w-64 object-cover sm:h-64 sm:w-80 lg:h-72 lg:w-96"
      />

      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black via-black/80 to-transparent px-4 pb-6 pt-16 flex flex-col items-center">
        <p className="text-center text-xl font-black uppercase tracking-wide text-white sm:text-2xl drop-shadow-md">
          {nome}
        </p>
        <div className="mt-2 rounded-xl bg-black/60 px-6 py-2 backdrop-blur-sm border border-white/10">
          <p className="text-center text-4xl font-black text-yellow-400 sm:text-5xl drop-shadow-[0_2px_10px_rgba(250,204,21,0.5)]">{pontos}</p>
        </div>
      </div>

      {ativo && (
        <div className="absolute left-3 top-3 rounded-full bg-yellow-400 px-3 py-1 text-xs font-black uppercase text-black">
          Vez da equipe
        </div>
      )}
    </div>
  );
}
