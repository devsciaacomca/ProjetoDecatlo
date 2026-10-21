"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";

export interface QuizMachineStatus {
  connected: boolean;
  port: string | null;
  locked: boolean;
  activePlayer: "P1" | "P2" | null;
  lastWinner: "P1" | "P2" | null;
  lastTimestamp: number | null;
  hasSerialSupport: boolean;
}

export interface SerialPortInfo {
  path: string;
  manufacturer: string;
  friendlyName: string;
  vendorId?: string;
  productId?: string;
}

/**
 * Toca o som característico do Buzzer físico do Arduino
 * P1 = 1000Hz (agudo)
 * P2 = 500Hz (grave)
 */
export function playBuzzerSound(jogador: "P1" | "P2") {
  if (typeof window === "undefined") return;

  try {
    const AudioContextClass =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext })
        .webkitAudioContext;

    if (!AudioContextClass) return;

    const ctx = new AudioContextClass();
    if (ctx.state === "suspended") {
      ctx.resume().catch(() => {});
    }

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    // 1000 Hz para P1 e 500 Hz para P2 (igual ao código arduino_quiz.ino)
    const freq = jogador === "P1" ? 1000 : 500;
    osc.type = "square"; // onda quadrada como buzzer piezoelétrico
    osc.frequency.setValueAtTime(freq, ctx.currentTime);

    // Fade-in rápido e sustentação por 400ms
    gain.gain.setValueAtTime(0.01, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.35, ctx.currentTime + 0.05);
    gain.gain.setValueAtTime(0.35, ctx.currentTime + 0.35);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.45);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.46);
  } catch (err) {
    console.warn("Não foi possível sintetizar som de buzzer:", err);
  }
}

/**
 * Toca uma SIRENE DE BUZZER dramática e impactante para o TELÃO
 * Efeito de sirene de gincana/quiz show com varredura oscilante (Wee-Woo)
 */
export function playSirenBuzzer(jogador: "P1" | "P2" = "P1") {
  if (typeof window === "undefined") return;

  try {
    const AudioContextClass =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext })
        .webkitAudioContext;

    if (!AudioContextClass) return;

    const ctx = new AudioContextClass();
    if (ctx.state === "suspended") {
      ctx.resume().catch(() => {});
    }

    const now = ctx.currentTime;
    const baseFreq = jogador === "P1" ? 850 : 650;
    const peakFreq = jogador === "P1" ? 1400 : 1100;

    // Ganho geral da sirene
    const masterGain = ctx.createGain();
    masterGain.gain.setValueAtTime(0.01, now);
    masterGain.gain.linearRampToValueAtTime(0.45, now + 0.04);
    masterGain.gain.setValueAtTime(0.45, now + 1.1);
    masterGain.gain.exponentialRampToValueAtTime(0.001, now + 1.4);

    // Oscilador 1: Onda dente de serra para brilho e presença
    const osc1 = ctx.createOscillator();
    osc1.type = "sawtooth";

    // Oscilador 2: Onda quadrada com leve desafinação (+12 cents) para espessura de sirene mecânica/eletrônica
    const osc2 = ctx.createOscillator();
    osc2.type = "square";
    osc2.detune.setValueAtTime(14, now);

    // Efeito de oscilação rápida da sirene (3 ciclos de varredura u-i-u-i)
    const cycles = 3;
    const cycleDuration = 0.38;
    for (let i = 0; i < cycles; i++) {
      const t = now + i * cycleDuration;
      osc1.frequency.setValueAtTime(baseFreq, t);
      osc1.frequency.exponentialRampToValueAtTime(peakFreq, t + cycleDuration * 0.5);
      osc1.frequency.exponentialRampToValueAtTime(baseFreq, t + cycleDuration);

      osc2.frequency.setValueAtTime(baseFreq * 0.99, t);
      osc2.frequency.exponentialRampToValueAtTime(peakFreq * 0.99, t + cycleDuration * 0.5);
      osc2.frequency.exponentialRampToValueAtTime(baseFreq * 0.99, t + cycleDuration);
    }

    // Impacto de grave inicial simulando o tapa forte no botão
    const thumpOsc = ctx.createOscillator();
    const thumpGain = ctx.createGain();
    thumpOsc.type = "sine";
    thumpOsc.frequency.setValueAtTime(220, now);
    thumpOsc.frequency.exponentialRampToValueAtTime(45, now + 0.18);
    thumpGain.gain.setValueAtTime(0.7, now);
    thumpGain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);
    thumpOsc.connect(thumpGain);
    thumpGain.connect(ctx.destination);
    thumpOsc.start(now);
    thumpOsc.stop(now + 0.19);

    osc1.connect(masterGain);
    osc2.connect(masterGain);
    masterGain.connect(ctx.destination);

    osc1.start(now);
    osc2.start(now);
    osc1.stop(now + 1.45);
    osc2.stop(now + 1.45);
  } catch (err) {
    console.warn("Não foi possível sintetizar sirene:", err);
  }
}

export function useQuizMachine(partidaId?: string) {
  const socketRef = useRef<Socket | null>(null);
  const [conectado, setConectado] = useState(false);
  const [audioHabilitado, setAudioHabilitado] = useState(true);

  const [status, setStatus] = useState<QuizMachineStatus>({
    connected: false,
    port: null,
    locked: false,
    activePlayer: null,
    lastWinner: null,
    lastTimestamp: null,
    hasSerialSupport: true,
  });

  const [portasDisponiveis, setPortasDisponiveis] = useState<SerialPortInfo[]>([]);
  const [carregandoPortas, setCarregandoPortas] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const socket: Socket = io();
    socketRef.current = socket;

    socket.on("connect", () => {
      setConectado(true);
      if (partidaId) {
        socket.emit("join-game", partidaId);
      }
      socket.emit("quiz-machine:get-status", (st: QuizMachineStatus) => {
        if (st) setStatus(st);
      });
    });

    socket.on("disconnect", () => {
      setConectado(false);
    });

    socket.on("quiz-machine:status", (novoStatus: QuizMachineStatus) => {
      setStatus(novoStatus);
    });

    socket.on(
      "quiz-machine:buzzer",
      (data: { jogador: "P1" | "P2"; equipe: "A" | "B"; timestamp: number }) => {
        if (audioHabilitado) {
          playBuzzerSound(data.jogador);
        }
      }
    );

    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
  }, [partidaId, audioHabilitado]);

  const simularClique = useCallback(
    (jogador: "P1" | "P2") => {
      if (status.locked) return;
      socketRef.current?.emit("quiz-machine:simulate-press", {
        jogador,
        partidaId,
      });
      if (audioHabilitado) {
        playBuzzerSound(jogador);
      }
    },
    [partidaId, status.locked, audioHabilitado]
  );

  const resetar = useCallback(() => {
    socketRef.current?.emit("quiz-machine:reset", { partidaId });
  }, [partidaId]);

  const atualizarPortas = useCallback(async () => {
    setCarregandoPortas(true);
    socketRef.current?.emit(
      "quiz-machine:list-ports",
      (ports: SerialPortInfo[]) => {
        setPortasDisponiveis(ports || []);
        setCarregandoPortas(false);
      }
    );
  }, []);

  const conectarPorta = useCallback((port: string, baudRate = 9600) => {
    return new Promise<{ success: boolean; error?: string }>((resolve) => {
      socketRef.current?.emit(
        "quiz-machine:connect-port",
        { port, baudRate },
        (res: { success: boolean; error?: string }) => {
          resolve(res);
        }
      );
    });
  }, []);

  const desconectarPorta = useCallback(() => {
    return new Promise<{ success: boolean; error?: string }>((resolve) => {
      socketRef.current?.emit("quiz-machine:disconnect-port", (res: any) => {
        resolve(res);
      });
    });
  }, []);

  return {
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
  };
}
