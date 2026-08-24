export default function LoginBrand() {
  return (
    <div className="mb-6 text-center">
      <div className="mb-3 inline-flex items-center gap-3 rounded-full border border-cyan-400/20 bg-cyan-400/5 px-4 py-2 text-[10px] font-medium uppercase tracking-[0.25em] text-cyan-300">
        <span className="relative flex h-2.5 w-2.5">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-cyan-400 opacity-50" />
          <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-cyan-400" />
        </span>
        Sistema de Arguição
      </div>
      <h1 className="text-4xl font-black tracking-tight text-white sm:text-5xl">DECAtlo</h1>
      <div className="mx-auto mt-4 h-px w-20 bg-cyan-400/50" />
    </div>
  );
}