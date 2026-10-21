"use client";

import { useEffect, useState } from "react";
import { Bell, Flame, Lock, Radio, ShieldAlert, Volume2, Zap } from "lucide-react";
import { playSirenBuzzer } from "@/hooks/useQuizMachine";

interface BuzzerAlertProps {
  buzzerAtivo?: {
    jogador: "P1" | "P2";
    equipe: "A" | "B";
    timestamp: number;
  } | null;
  equipe1Nome: string;
  equipe2Nome: string;
}

export default function BuzzerAlert({
  buzzerAtivo,
  equipe1Nome,
  equipe2Nome,
}: BuzzerAlertProps) {
  const [visivel, setVisivel] = useState(false);

  useEffect(() => {
    if (buzzerAtivo) {
      setVisivel(true);
      // Dispara a sirene ao receber o evento
      playSirenBuzzer(buzzerAtivo.jogador);
    } else {
      setVisivel(false);
    }
  }, [buzzerAtivo]);

  if (!visivel || !buzzerAtivo) {
    return null;
  }

  const isP1 = buzzerAtivo.jogador === "P1";
  const equipeVencedora = isP1 ? equipe1Nome : equipe2Nome;
  const equipeBloqueada = isP1 ? equipe2Nome : equipe1Nome;

  return (
    <div className="relative z-50 w-full animate-in fade-in zoom-in-95 duration-300">
      {/* LUZES ESTROBOSCÓPICAS DE SIRENE NO TOPO */}
      <div className="pointer-events-none fixed inset-x-0 top-0 h-32 overflow-hidden">
        <div
          className={`absolute -top-12 left-1/4 h-36 w-72 rounded-full blur-3xl opacity-80 animate-pulse ${
            isP1 ? "bg-red-600" : "bg-blue-600"
          }`}
        />
        <div
          className={`absolute -top-12 right-1/4 h-36 w-72 rounded-full blur-3xl opacity-80 animate-pulse delay-150 ${
            isP1 ? "bg-red-500" : "bg-blue-500"
          }`}
        />
      </div>

      {/* CONTAINER DO ALERTA DE SIRENE E BOTÃO */}
      <div
        className={`mx-auto max-w-4xl overflow-hidden rounded-3xl border-2 p-4 sm:p-6 shadow-2xl backdrop-blur-xl transition-all duration-300 ${
          isP1
            ? "border-red-500 bg-gradient-to-b from-red-950/90 via-slate-950/95 to-slate-950 shadow-[0_0_60px_rgba(239,68,68,0.4)]"
            : "border-blue-500 bg-gradient-to-b from-blue-950/90 via-slate-950/95 to-slate-950 shadow-[0_0_60px_rgba(59,130,246,0.4)]"
        }`}
      >
        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          {/* LADO ESQUERDO: BOTÃO 3D ILUMINADO COM ONDAS DE PULSO */}
          <div className="relative flex shrink-0 items-center justify-center">
            {/* ONDAS DE CHOQUE EXPANSIVAS (PULSE RINGS) */}
            <div
              className={`absolute h-24 w-24 rounded-full opacity-75 animate-ping ${
                isP1 ? "bg-red-500" : "bg-blue-500"
              }`}
            />
            <div
              className={`absolute h-32 w-32 rounded-full opacity-40 animate-pulse ${
                isP1 ? "bg-red-600" : "bg-blue-600"
              }`}
            />

            {/* O BOTÃO FÍSICO COGUMELO ARCADE */}
            <div
              className={`relative flex h-20 w-20 sm:h-24 sm:w-24 items-center justify-center rounded-full border-4 shadow-2xl ${
                isP1
                  ? "border-red-300 bg-gradient-to-b from-red-400 via-red-600 to-red-800 shadow-[0_0_35px_rgba(239,68,68,0.9)]"
                  : "border-blue-300 bg-gradient-to-b from-blue-400 via-blue-600 to-blue-800 shadow-[0_0_35px_rgba(59,130,246,0.9)]"
              }`}
            >
              <div className="flex flex-col items-center justify-center text-white drop-shadow-md">
                <Bell size={30} className="animate-bounce" />
                <span className="text-[11px] font-black uppercase tracking-widest">
                  {buzzerAtivo.jogador}
                </span>
              </div>
            </div>
          </div>

          {/* CENTRO: MENSAGEM IMPACTANTE DA SIRENE */}
          <div className="flex-1 text-center sm:text-left">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
              <span
                className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-black uppercase tracking-widest ${
                  isP1
                    ? "bg-red-500 text-white shadow-[0_0_15px_rgba(239,68,68,0.6)]"
                    : "bg-blue-500 text-white shadow-[0_0_15px_rgba(59,130,246,0.6)]"
                }`}
              >
                <ShieldAlert size={14} className="animate-spin" />
                🚨 SIRENE ACIONADA! 🚨
              </span>

              <span className="rounded-full bg-slate-800/80 px-2.5 py-0.5 text-[11px] font-bold text-slate-300 border border-slate-700">
                Máquina Travada
              </span>
            </div>

            <h2 className="mt-2 text-2xl font-black uppercase tracking-tight text-white sm:text-3xl lg:text-4xl drop-shadow-lg">
              {equipeVencedora}
            </h2>

            <p className="mt-1 flex items-center justify-center sm:justify-start gap-1.5 text-xs sm:text-sm font-bold text-yellow-400">
              <Zap size={16} /> BATEU NO BOTÃO PRIMEIRO E TEM A VEZ DE RESPOSTA!
            </p>
          </div>

          {/* LADO DIREITO: STATUS DO ADVERSÁRIO TRAVADO E BOTÃO TOCAR SIRENE */}
          <div className="flex shrink-0 flex-col items-center sm:items-end gap-2">
            <div className="flex items-center gap-1.5 rounded-xl border border-slate-800 bg-slate-900/90 px-3 py-1.5 text-xs text-slate-400">
              <Lock size={13} className="text-red-400" />
              <span>{equipeBloqueada}: Bloqueado</span>
            </div>

            <button
              type="button"
              onClick={() => playSirenBuzzer(buzzerAtivo.jogador)}
              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-800/80 px-3 py-1.5 text-xs font-semibold text-slate-200 transition hover:bg-slate-700 active:scale-95"
              title="Tocar Sirene novamente"
            >
              <Volume2 size={14} className="text-yellow-400" />
              <span>Repetir Sirene</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
