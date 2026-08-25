export default function Mascote({
  nome,
  video,
  ativo,
}: {
  nome: string;
  video: string;
  ativo: boolean;
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
        className="h-48 w-60 object-cover sm:h-56 sm:w-72 lg:h-64 lg:w-80"
      />

      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/95 via-black/50 to-transparent px-4 pb-4 pt-12">
        <p className="text-center text-xl font-black uppercase tracking-wide text-white sm:text-2xl">
          {nome}
        </p>
      </div>

      {ativo && (
        <div className="absolute left-3 top-3 rounded-full bg-yellow-400 px-3 py-1 text-xs font-black uppercase text-black">
          Vez da equipe
        </div>
      )}
    </div>
  );
}
