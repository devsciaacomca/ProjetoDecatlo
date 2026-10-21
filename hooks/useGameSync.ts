"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";
import type { EstadoJogo } from "@/types/partida-jogo";

export type GameAction =
  | {
      type: "INICIAR_PARTIDA";
      cronometroFimEm: number;
    }
  | {
      type: "PAUSAR_PARTIDA";
    }
  | {
      type: "FINALIZAR_PARTIDA";
    }
  | {
      type: "INICIAR_CRONOMETRO";
      cronometroFimEm: number;
    }
  | {
      type: "PAUSAR_CRONOMETRO";
      tempoRestante: number;
    }
  | {
      type: "REINICIAR_CRONOMETRO";
      tempoRestante: number;
    }
  | {
      type: "PROXIMA_PERGUNTA";
      perguntaAtual: number;
      tempoRestante: number;
    }
  | {
      type: "PERGUNTA_ANTERIOR";
      perguntaAtual: number;
      tempoRestante: number;
    }
  | {
      type: "TROCAR_EQUIPE";
      equipeDaVez: "A" | "B";
    }
  | {
      type: "DEFINIR_EQUIPE";
      equipeDaVez: "A" | "B";
    }
  | {
      type: "SELECIONAR_RESPOSTA";
      resposta: string;
      equipe: "A" | "B";
    }
  | {
      type: "AVALIAR_RESPOSTA";
      resultado: "correta" | "incorreta";
      pontos: EstadoJogo["pontos"];
      proximaEquipe: "A" | "B";
      cronometroFimEm: number | null;
      tempoRestante: number;
    }
  | {
      type: "ADICIONAR_PONTO";
      equipe: "A" | "B";
      quantidade: number;
      pontos: EstadoJogo["pontos"];
    }
  | {
      type: "REMOVER_PONTO";
      equipe: "A" | "B";
      quantidade: number;
      pontos: EstadoJogo["pontos"];
    }
  | {
      type: "MOSTRAR_RESPOSTA";
    }
  | {
      type: "ESCONDER_RESPOSTA";
    }
  | {
      type: "RESETAR_PARTIDA";
      estado: EstadoJogo;
    }
  | {
      type: "BUZZER_PRESS";
      jogador: "P1" | "P2";
      equipe: "A" | "B";
      timestamp: number;
    }
  | {
      type: "BUZZER_RESET";
    };

type GameMessage =
  | {
      type: "ACTION";
      action: GameAction;
    }
  | {
      type: "STATE_REQUEST";
    }
  | {
      type: "STATE_RESPONSE";
      state: EstadoJogo;
    };

interface UseGameSyncProps {
  partidaId: string;

  role: "control" | "display";

  estadoAtual: EstadoJogo;

  onAction: (action: GameAction) => void;

  onStateReceived: (state: EstadoJogo) => void;
}

const CHANNEL_PREFIX = "decatlo-game";

export function useGameSync({
  partidaId,
  role,
  estadoAtual,
  onAction,
  onStateReceived,
}: UseGameSyncProps) {
  const socketRef = useRef<Socket | null>(null);

  const estadoRef = useRef<EstadoJogo>(estadoAtual);

  const [conectado, setConectado] = useState(false);

  useEffect(() => {
    estadoRef.current = estadoAtual;
  }, [estadoAtual]);

  const enviarAcao = useCallback(
    (action: GameAction) => {
      const message: GameMessage = {
        type: "ACTION",
        action,
      };

      socketRef.current?.emit("sync-game-state", { partidaId, message });
    },
    [partidaId],
  );

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const socket: Socket = io();
    socketRef.current = socket;
    socket.on("connect", () => {
      setConectado(true);
      // Entra na sala da partida ao conectar
      socket.emit("join-game", partidaId);
      // Se for o Telão conectando, pede o estado atual ao Controle
      if (role === "display") {
        socket.emit("sync-game-state", {
          partidaId,
          message: { type: "STATE_REQUEST" } satisfies GameMessage,
        });
      }
    });

    socket.on("disconnect", () => setConectado(false));

    const handleMessage = (message: GameMessage) => {
      switch (message.type) {
        case "ACTION": {
          /**
           * O Telão apenas recebe comandos.
           *
           * O Controle não reaplica a própria
           * ação que acabou de enviar.
           */
          if (role === "display") {
            onAction(message.action);
          }

          break;
        }

        case "STATE_REQUEST": {
          /**
           * Somente o Controle responde
           * ao pedido de estado.
           */
          if (role !== "control") {
            break;
          }

          socket.emit("sync-game-state", {
            partidaId,
            message: {
              type: "STATE_RESPONSE",
              state: estadoRef.current,
            } satisfies GameMessage,
          });
          break;
        }

        case "STATE_RESPONSE": {
          /**
           * Somente o Telão aceita o estado
           * inicial enviado pelo Controle.
           */
          if (role !== "display") {
            break;
          }

          onStateReceived(message.state);

          break;
        }
      }
    };

    socket.on("game-state-updated", handleMessage);

    // Escuta eventos vindos diretamente da Máquina de Quiz (Arduino USB ou Simulador)
    const handleQuizBuzzer = (data: {
      jogador: "P1" | "P2";
      equipe: "A" | "B";
      timestamp: number;
    }) => {
      onAction({
        type: "BUZZER_PRESS",
        jogador: data.jogador,
        equipe: data.equipe,
        timestamp: data.timestamp,
      });
    };

    const handleQuizReset = () => {
      onAction({ type: "BUZZER_RESET" });
    };

    socket.on("quiz-machine:buzzer", handleQuizBuzzer);
    socket.on("quiz-machine:reset", handleQuizReset);

    const handleQuizStatus = (statusData: {
      locked?: boolean;
      activePlayer?: "P1" | "P2" | null;
      lastTimestamp?: number | null;
    }) => {
      if (statusData && statusData.locked && statusData.activePlayer) {
        onAction({
          type: "BUZZER_PRESS",
          jogador: statusData.activePlayer,
          equipe: statusData.activePlayer === "P1" ? "A" : "B",
          timestamp: statusData.lastTimestamp || Date.now(),
        });
      } else if (statusData && !statusData.locked) {
        onAction({ type: "BUZZER_RESET" });
      }
    };

    socket.on("quiz-machine:status", handleQuizStatus);
    socket.emit("quiz-machine:get-status", handleQuizStatus);

    return () => {
      socket.off("game-state-updated", handleMessage);
      socket.off("quiz-machine:buzzer", handleQuizBuzzer);
      socket.off("quiz-machine:reset", handleQuizReset);
      socket.off("quiz-machine:status", handleQuizStatus);
      socket.disconnect();
      socketRef.current = null;
      setConectado(false);
    };
  }, [partidaId, role, onAction, onStateReceived]);

  return {
    conectado,
    enviarAcao,
  };
}
