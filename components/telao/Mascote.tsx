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
        relative h-[52vh] w-full overflow-hidden rounded-3xl
        border-4 transition-all duration-500
        ${
          ativo
            ? "border-yellow-400 shadow-[0_0_40px_rgba(250,204,21,0.3)]"
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
        className="h-full w-full object-fill"
      />

      <div className="absolute inset-x-0 bottom-0 flex flex-col items-center bg-gradient-to-t from-black via-black/80 to-transparent px-[1vw] pb-[2vh] pt-[5vh]">
        <p className="w-full truncate text-center text-[clamp(0.75rem,1.3vw,1.5rem)] font-black uppercase tracking-wide text-white drop-shadow-md">
          {nome}
        </p>
        <div className="mt-[0.8vh] rounded-xl border border-white/10 bg-black/60 px-[1.5vw] py-[0.5vh] backdrop-blur-sm">
          <p className="text-center text-[clamp(1.25rem,2.4vw,3rem)] font-black leading-none text-yellow-400 drop-shadow-[0_2px_10px_rgba(250,204,21,0.5)]">
            {pontos}
          </p>
        </div>
      </div>

      {ativo && (
        <div className="absolute left-[0.8vw] top-[1.2vh] rounded-full bg-yellow-400 px-[0.8vw] py-[0.4vh] text-[clamp(0.55rem,0.7vw,0.75rem)] font-black uppercase text-black">
          Vez da equipe
        </div>
      )}
    </div>
  );
}
