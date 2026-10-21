"use client";

interface MascoteProps {
  nome: string;
  video: string;
  ativo: boolean;
  pontos: number;
  buzzerPressionado?: boolean;
  buzzerBloqueado?: boolean;
  corBuzzer?: "red" | "blue";
  posicao?: "left" | "right";
}

export default function Mascote({
  nome,
  video,
  ativo,
  pontos,
  buzzerPressionado = false,
  buzzerBloqueado = false,
  corBuzzer = "red",
  posicao = "left",
}: MascoteProps) {
  // Deslocamento suave para o centro sobrepondo a borda do cronômetro quando acionado
  const sobreposicaoClasse = buzzerPressionado
    ? posicao === "left"
      ? "translate-x-3 sm:translate-x-6 md:translate-x-8"
      : "-translate-x-3 sm:-translate-x-6 md:-translate-x-8"
    : "";

  return (
    <div
      className={`
        relative flex flex-col items-center transition-all duration-500
        ${
          buzzerPressionado
            ? `z-40 scale-110 sm:scale-120 md:scale-125 ${sobreposicaoClasse}`
            : buzzerBloqueado
              ? "z-10 scale-90 opacity-25 grayscale-[70%] blur-[0.5px]"
              : ativo
                ? "z-20 scale-105"
                : "z-10 scale-100 opacity-90"
        }
      `}
    >
      {/* CARD DO MASCOTE / VÍDEO COM BORDA E BRILHO NEON */}
      <div
        className={`
          relative overflow-hidden rounded-2xl sm:rounded-3xl border-2 sm:border-4
          transition-all duration-500 shadow-xl
          ${
            buzzerPressionado
              ? corBuzzer === "red"
                ? "border-red-500 shadow-[0_0_50px_rgba(239,68,68,0.9),0_0_90px_rgba(239,68,68,0.5)] ring-4 ring-red-400/80"
                : "border-blue-500 shadow-[0_0_50px_rgba(59,130,246,0.9),0_0_90px_rgba(59,130,246,0.5)] ring-4 ring-blue-400/80"
              : buzzerBloqueado
                ? "border-slate-800"
                : ativo
                  ? "border-yellow-400 shadow-[0_0_40px_rgba(250,204,21,0.35)]"
                  : "border-slate-700 hover:border-slate-600"
          }
        `}
      >
        <video
          src={video}
          autoPlay
          loop
          muted
          playsInline
          className="h-[clamp(105px,15.5vh,195px)] w-[clamp(135px,21.5vh,250px)] object-cover"
        />

        {/* OVERLAY COM NOME E PONTUAÇÃO */}
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black via-black/75 to-transparent px-2.5 pb-2 pt-6 sm:px-3 sm:pb-3 sm:pt-10 flex flex-col items-center">
          <p className="text-center text-xs sm:text-sm md:text-base font-black uppercase tracking-wide text-white drop-shadow-md truncate max-w-full">
            {nome}
          </p>
          <div className="mt-0.5 rounded-lg bg-black/60 px-2.5 py-0.5 sm:px-3.5 sm:py-0.5 backdrop-blur-sm border border-white/10">
            <p className="text-center text-lg sm:text-2xl md:text-3xl font-black text-yellow-400 drop-shadow-[0_2px_8px_rgba(250,204,21,0.5)]">
              {pontos}
            </p>
          </div>
        </div>

        {/* BADGES NO TOPO DO CARD */}
        {buzzerPressionado ? (
          <div
            className={`absolute left-2 top-2 flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] sm:text-xs font-black uppercase tracking-wider text-white shadow-lg animate-bounce ${
              corBuzzer === "red" ? "bg-red-600 ring-2 ring-red-300" : "bg-blue-600 ring-2 ring-blue-300"
            }`}
          >
            <span>⚡</span>
            <span>Bateu 1º!</span>
          </div>
        ) : buzzerBloqueado ? (
          <div className="absolute left-2 top-2 flex items-center gap-1 rounded-full bg-slate-900/90 px-2 py-0.5 text-[9px] sm:text-[10px] font-bold uppercase text-slate-400 border border-slate-700">
            <span>🔒</span>
            <span>Travado</span>
          </div>
        ) : ativo ? (
          <div className="absolute left-2 top-2 rounded-full bg-yellow-400 px-2 py-0.5 text-[9px] sm:text-[10px] font-black uppercase text-black shadow-md">
            Vez da equipe
          </div>
        ) : null}
      </div>

      {/* ALERTA DE TEXTO EM BAIXO PISCANDO */}
      <div className="min-h-[32px] sm:min-h-[38px] flex items-center justify-center mt-1.5 sm:mt-2">
        {buzzerPressionado ? (
          <div className="animate-blink-fast flex flex-col items-center">
            <div
              className={`flex items-center gap-1.5 rounded-full px-3 py-1 sm:px-4 sm:py-1 text-[11px] sm:text-xs md:text-sm font-black uppercase tracking-wider text-yellow-300 shadow-2xl ring-2 whitespace-nowrap ${
                corBuzzer === "red"
                  ? "bg-red-600 shadow-[0_0_25px_rgba(239,68,68,1)] ring-yellow-400"
                  : "bg-blue-600 shadow-[0_0_25px_rgba(59,130,246,1)] ring-yellow-400"
              }`}
            >
              <span>🚨</span>
              <span>BATEU NO BOTÃO PRIMEIRO!</span>
              <span>🚨</span>
            </div>
            <p className="mt-0.5 text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-yellow-300 animate-text-flash drop-shadow-md">
              ⚡ RESPONDE AGORA! ⚡
            </p>
          </div>
        ) : buzzerBloqueado ? (
          <div className="flex items-center gap-1 rounded-full bg-slate-900/90 border border-slate-800 px-2.5 py-0.5 text-[9px] sm:text-[10px] font-bold uppercase text-slate-500">
            <span>🔒</span>
            <span>Aguardando adversário</span>
          </div>
        ) : ativo ? (
          <div className="text-[10px] sm:text-xs font-bold text-yellow-400/80 uppercase tracking-wider">
            Equipe da vez
          </div>
        ) : (
          <div className="text-[10px] sm:text-xs font-bold text-slate-600 uppercase tracking-wider">
            Aguardando
          </div>
        )}
      </div>
    </div>
  );
}
