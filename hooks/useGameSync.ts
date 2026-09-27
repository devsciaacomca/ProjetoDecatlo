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
      type: "RESPONDER";
      resultado: "correta" | "incorreta";
      pontos: EstadoJogo["pontos"];
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
            type: "STATE_RESPONSE",
            state: estadoRef.current,
          } satisfies GameMessage);
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

    return () => {
      socket.off("game-state-updated", handleMessage);
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