"use client";

import { useEffect, useState } from "react";
import {
  Bell,
  Cpu,
  RefreshCw,
  RotateCcw,
  Volume2,
  VolumeX,
  Zap,
  CheckCircle2,
  AlertTriangle,
  Radio,
  Sliders,
} from "lucide-react";
import { useQuizMachine } from "@/hooks/useQuizMachine";

interface QuizMachineSimulatorProps {
  partidaId?: string;
  equipe1Nome?: string;
  equipe2Nome?: string;
  compact?: boolean;
}

export default function QuizMachineSimulator({
  partidaId,
  equipe1Nome = "Equipe Alfa 1",
  equipe2Nome = "Equipe Alfa 2",
  compact = false,
}: QuizMachineSimulatorProps) {
  const {
    conectado,
    status,
    portasDisponiveis,
    carregandoPortas,
    audioHabilitado,
    setAudioHabilitado,
    simularClique,
    resetar,
    atualizarPortas,
    conectarPorta,
    desconectarPorta,
  } = useQuizMachine(partidaId);

  const [portaSelecionada, setPortaSelecionada] = useState<string>("");
  const [conexoesAbertas, setConexoesAbertas] = useState(false);
  const [mensagemConexao, setMensagemConexao] = useState<string | null>(null);

  // Efeito de clique visual nos botões
  const [p1PressedAnim, setP1PressedAnim] = useState(false);
  const [p2PressedAnim, setP2PressedAnim] = useState(false);
  const [resetPressedAnim, setResetPressedAnim] = useState(false);

  // Atalhos de teclado para teste rápido
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      // Ignora se estiver digitando em input ou textarea
      if (
        document.activeElement?.tagName === "INPUT" ||
        document.activeElement?.tagName === "TEXTAREA"
      ) {
        return;
      }

      if (e.key === "1" || e.key.toLowerCase() === "a") {
        setP1PressedAnim(true);
        setTimeout(() => setP1PressedAnim(false), 200);
        simularClique("P1");
      } else if (e.key === "2" || e.key.toLowerCase() === "l") {
        setP2PressedAnim(true);
        setTimeout(() => setP2PressedAnim(false), 200);
        simularClique("P2");
      } else if (e.key.toLowerCase() === "r" || e.key === " ") {
        if (e.key === " ") e.preventDefault();
        setResetPressedAnim(true);
        setTimeout(() => setResetPressedAnim(false), 200);
        resetar();
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [simularClique, resetar]);

  const handleConectar = async () => {
    if (!portaSelecionada) return;
    setMensagemConexao("Conectando...");
    const res = await conectarPorta(portaSelecionada);
    if (res.success) {
      setMensagemConexao("Porta serial conectada com sucesso!");
    } else {
      setMensagemConexao(`Erro: ${res.error || "Não foi possível abrir porta"}`);
    }
  };

  const handleDesconectar = async () => {
    await desconectarPorta();
    setMensagemConexao("Porta serial desconectada.");
  };

  const vencedorFormatado =
    status.lastWinner === "P1"
      ? equipe1Nome
      : status.lastWinner === "P2"
        ? equipe2Nome
        : null;

  return (
    <div className="w-full overflow-hidden rounded-2xl border border-slate-700 bg-gradient-to-b from-slate-900 via-slate-950 to-black p-4 text-white shadow-2xl sm:p-6">
      {/* PAINEL SUPERIOR: STATUS E HARDWARE */}
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-yellow-500/10 text-yellow-400 ring-1 ring-yellow-500/30">
            <Cpu size={18} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-black tracking-wide uppercase sm:text-base">
                Máquina de Quiz
              </h3>
              <span
                className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                  status.connected
                    ? "bg-green-500/20 text-green-300 ring-1 ring-green-500/40"
                    : "bg-blue-500/20 text-blue-300 ring-1 ring-blue-500/40"
                }`}
              >
                <Radio
                  size={10}
                  className={status.connected ? "animate-pulse" : ""}
                />
                {status.connected
                  ? `USB Hardware: ${status.port}`
                  : "Modo Simulação Virtual"}
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              {status.connected
                ? "Lendo botões físicos do Arduino via cabo USB serial"
                : "Simulador de hardware pronto. Clique nos botões ou use o teclado."}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Som Buzzer Toggle */}
          <button
            type="button"
            onClick={() => setAudioHabilitado(!audioHabilitado)}
            className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-semibold transition ${
              audioHabilitado
                ? "border-slate-700 bg-slate-800 text-slate-200 hover:bg-slate-700"
                : "border-slate-800 bg-slate-900 text-slate-500 hover:bg-slate-800"
            }`}
            title={audioHabilitado ? "Som do Buzzer Ativo" : "Som Desativado"}
          >
            {audioHabilitado ? <Volume2 size={14} /> : <VolumeX size={14} />}
            <span className="hidden sm:inline">
              {audioHabilitado ? "Buzzer On" : "Mudo"}
            </span>
          </button>

          {/* Configuração de Portas */}
          <button
            type="button"
            onClick={() => {
              setConexoesAbertas(!conexoesAbertas);
              if (!conexoesAbertas) atualizarPortas();
            }}
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-800 px-3 py-1.5 text-xs font-semibold text-slate-200 transition hover:bg-slate-700"
          >
            <Sliders size={14} />
            <span className="hidden sm:inline">Portas USB</span>
          </button>
        </div>
      </div>

      {/* ABA DE CONFIGURAÇÃO SERIAL */}
      {conexoesAbertas && (
        <div className="mb-4 rounded-xl border border-slate-800 bg-slate-900/80 p-3 text-xs sm:p-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-1 flex-wrap items-center gap-2">
              <label htmlFor="select-porta" className="font-semibold text-slate-300">
                Porta Serial (Arduino):
              </label>
              <select
                id="select-porta"
                value={portaSelecionada}
                onChange={(e) => setPortaSelecionada(e.target.value)}
                className="rounded-lg border border-slate-700 bg-slate-950 px-3 py-1.5 text-xs text-white focus:border-yellow-500 focus:outline-none"
              >
                <option value="">Selecione uma porta...</option>
                {portasDisponiveis.map((p) => (
                  <option key={p.path} value={p.path}>
                    {p.path} ({p.friendlyName || p.manufacturer})
                  </option>
                ))}
              </select>

              <button
                type="button"
                onClick={atualizarPortas}
                disabled={carregandoPortas}
                className="inline-flex items-center gap-1 rounded-lg border border-slate-700 bg-slate-800 px-2.5 py-1.5 text-slate-300 hover:bg-slate-700 disabled:opacity-50"
                title="Escanear portas seriais"
              >
                <RefreshCw
                  size={12}
                  className={carregandoPortas ? "animate-spin" : ""}
                />
                Escanear
              </button>

              {status.connected ? (
                <button
                  type="button"
                  onClick={handleDesconectar}
                  className="rounded-lg bg-red-600 px-3 py-1.5 font-bold text-white hover:bg-red-500"
                >
                  Desconectar USB
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleConectar}
                  disabled={!portaSelecionada}
                  className="rounded-lg bg-green-600 px-3 py-1.5 font-bold text-white hover:bg-green-500 disabled:opacity-40"
                >
                  Conectar ao Arduino
                </button>
              )}
            </div>

            <div className="text-[11px] text-slate-400">
              Ubuntu: <code className="text-yellow-400">/dev/ttyACM0</code> •
              Windows: <code className="text-yellow-400">COM3</code>
            </div>
          </div>

          {mensagemConexao && (
            <p className="mt-2 text-xs font-semibold text-yellow-300">
              {mensagemConexao}
            </p>
          )}
        </div>
      )}

      {/* DISPLAY DE STATUS CENTRAL */}
      <div className="relative mb-5 flex flex-col items-center justify-center rounded-xl border border-slate-800 bg-slate-950/90 p-4 text-center">
        {/* LED INDICADOR DE STATUS FÍSICO (PIN 8 NO ARDUINO) */}
        <div className="flex items-center gap-2">
          <div
            className={`h-3.5 w-3.5 rounded-full transition-all duration-300 ${
              status.locked
                ? "bg-red-500 shadow-[0_0_12px_#ef4444]"
                : "bg-emerald-400 shadow-[0_0_12px_#10b981]"
            }`}
          />
          <span className="text-[11px] font-bold uppercase tracking-widest text-slate-400">
            {status.locked ? "MÁQUINA TRAVADA (BLOQUEADA)" : "SISTEMA PRONTO (LIBERADO)"}
          </span>
        </div>

        {/* FEEDBACK DO VENCEDOR DA RODADA */}
        <div className="mt-2 min-h-[38px] flex items-center justify-center">
          {status.locked && status.activePlayer ? (
            <div className="flex items-center gap-2 animate-bounce">
              <Zap
                size={20}
                className={
                  status.activePlayer === "P1"
                    ? "text-red-400"
                    : "text-blue-400"
                }
              />
              <span
                className={`text-base font-black tracking-wide sm:text-xl ${
                  status.activePlayer === "P1"
                    ? "text-red-400"
                    : "text-blue-400"
                }`}
              >
                {vencedorFormatado} BATEU PRIMEIRO!
              </span>
            </div>
          ) : (
            <p className="text-xs text-slate-500">
              Aguardando os competidores apertarem o botão...
            </p>
          )}
        </div>
      </div>

      {/* PAINEL FÍSICO COM OS BOTÕES DO QUIZ */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {/* BOTÃO JOGADOR 1 (P1 - EQUIPE A) */}
        <div className="flex flex-col items-center justify-between rounded-2xl border border-red-500/20 bg-gradient-to-b from-red-950/30 to-slate-950 p-4">
          <div className="mb-2 text-center">
            <span className="rounded-full bg-red-500/20 px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider text-red-300">
              Jogador 1 (Pino 2)
            </span>
            <h4 className="mt-1 text-sm font-black text-red-400 sm:text-base">
              {equipe1Nome}
            </h4>
          </div>

          {/* BOTÃO COGUMELO VERMELHO 3D */}
          <button
            type="button"
            onClick={() => simularClique("P1")}
            disabled={status.locked}
            className={`group relative flex h-24 w-24 sm:h-28 sm:w-28 items-center justify-center rounded-full transition-all duration-150 ${
              p1PressedAnim ? "scale-95" : ""
            } ${
              status.activePlayer === "P1"
                ? "bg-red-500 ring-4 ring-red-400 shadow-[0_0_35px_rgba(239,68,68,0.8)]"
                : status.locked
                  ? "cursor-not-allowed opacity-30 bg-red-950 border-2 border-red-900"
                  : "bg-gradient-to-b from-red-500 via-red-600 to-red-800 shadow-[0_8px_0_#991b1b,0_15px_20px_rgba(0,0,0,0.6)] hover:brightness-110 active:translate-y-2 active:shadow-[0_2px_0_#991b1b]"
            }`}
          >
            <div className="flex flex-col items-center justify-center text-white">
              <Bell size={28} className="drop-shadow-md" />
              <span className="mt-1 text-xs font-black uppercase tracking-widest drop-shadow-md">
                P1
              </span>
            </div>
          </button>

          <p className="mt-3 text-[10px] font-semibold text-slate-400">
            Atalho: <kbd className="rounded bg-slate-800 px-1.5 py-0.5 text-white">1</kbd> ou{" "}
            <kbd className="rounded bg-slate-800 px-1.5 py-0.5 text-white">A</kbd>
          </p>
        </div>

        {/* BOTÃO CENTRAL DE RESET (APRESENTADOR) */}
        <div className="flex flex-col items-center justify-between rounded-2xl border border-yellow-500/20 bg-gradient-to-b from-yellow-950/20 to-slate-950 p-4">
          <div className="mb-2 text-center">
            <span className="rounded-full bg-yellow-500/20 px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider text-yellow-300">
              Apresentador (Pino 4)
            </span>
            <h4 className="mt-1 text-sm font-black text-yellow-400 sm:text-base">
              Reset Físico
            </h4>
          </div>

          {/* BOTÃO DE RESET INDUSTRIAL */}
          <button
            type="button"
            onClick={resetar}
            className={`group relative flex h-20 w-20 sm:h-24 sm:w-24 items-center justify-center rounded-2xl transition-all duration-150 ${
              resetPressedAnim ? "scale-95" : ""
            } bg-gradient-to-b from-amber-400 via-amber-500 to-amber-700 shadow-[0_6px_0_#b45309,0_12px_18px_rgba(0,0,0,0.6)] hover:brightness-110 active:translate-y-1.5 active:shadow-[0_2px_0_#b45309]`}
          >
            <div className="flex flex-col items-center justify-center text-slate-950">
              <RotateCcw size={26} className="font-black drop-shadow-sm" />
              <span className="mt-1 text-[11px] font-black uppercase tracking-widest">
                RESET
              </span>
            </div>
          </button>

          <p className="mt-3 text-[10px] font-semibold text-slate-400">
            Atalho: <kbd className="rounded bg-slate-800 px-1.5 py-0.5 text-white">Espaço</kbd> ou{" "}
            <kbd className="rounded bg-slate-800 px-1.5 py-0.5 text-white">R</kbd>
          </p>
        </div>

        {/* BOTÃO JOGADOR 2 (P2 - EQUIPE B) */}
        <div className="flex flex-col items-center justify-between rounded-2xl border border-blue-500/20 bg-gradient-to-b from-blue-950/30 to-slate-950 p-4">
          <div className="mb-2 text-center">
            <span className="rounded-full bg-blue-500/20 px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider text-blue-300">
              Jogador 2 (Pino 3)
            </span>
            <h4 className="mt-1 text-sm font-black text-blue-400 sm:text-base">
              {equipe2Nome}
            </h4>
          </div>

          {/* BOTÃO COGUMELO AZUL 3D */}
          <button
            type="button"
            onClick={() => simularClique("P2")}
            disabled={status.locked}
            className={`group relative flex h-24 w-24 sm:h-28 sm:w-28 items-center justify-center rounded-full transition-all duration-150 ${
              p2PressedAnim ? "scale-95" : ""
            } ${
              status.activePlayer === "P2"
                ? "bg-blue-500 ring-4 ring-blue-400 shadow-[0_0_35px_rgba(59,130,246,0.8)]"
                : status.locked
                  ? "cursor-not-allowed opacity-30 bg-blue-950 border-2 border-blue-900"
                  : "bg-gradient-to-b from-blue-500 via-blue-600 to-blue-800 shadow-[0_8px_0_#1d4ed8,0_15px_20px_rgba(0,0,0,0.6)] hover:brightness-110 active:translate-y-2 active:shadow-[0_2px_0_#1d4ed8]"
            }`}
          >
            <div className="flex flex-col items-center justify-center text-white">
              <Bell size={28} className="drop-shadow-md" />
              <span className="mt-1 text-xs font-black uppercase tracking-widest drop-shadow-md">
                P2
              </span>
            </div>
          </button>

          <p className="mt-3 text-[10px] font-semibold text-slate-400">
            Atalho: <kbd className="rounded bg-slate-800 px-1.5 py-0.5 text-white">2</kbd> ou{" "}
            <kbd className="rounded bg-slate-800 px-1.5 py-0.5 text-white">L</kbd>
          </p>
        </div>
      </div>
    </div>
  );
}
