"use client";

import { useEffect, useRef } from "react";
import { signOut, useSession } from "next-auth/react";

const IDLE_TIMEOUT = 30 * 60 * 1000; // 30 minutos
const ACTIVITY_THROTTLE = 60 * 1000; // atualiza no máximo 1x por minuto

export function useSessionTimeout() {
  const { data: session, status } = useSession();

  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastActivityRef = useRef<number>(Date.now());
  const lastUpdateRef = useRef<number>(0);

  useEffect(() => {
    if (status !== "authenticated" || !session?.user) {
      return;
    }

    // O usuário do telão não deve ser
    // desconectado por falta de interação.
    if (session.user.role === "Usuário") {
      return;
    }

    const logout = async () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      await signOut({
        callbackUrl: "/login?motivo=inatividade",
      });
    };

    const resetTimeout = () => {
      const now = Date.now();

      lastActivityRef.current = now;

      // Evita ficar executando lógica a cada movimento do mouse
      if (now - lastUpdateRef.current < ACTIVITY_THROTTLE) {
        return;
      }

      lastUpdateRef.current = now;

      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(() => {
        const idleTime = Date.now() - lastActivityRef.current;

        if (idleTime >= IDLE_TIMEOUT) {
          logout();
          return;
        }

        resetTimeout();
      }, IDLE_TIMEOUT);
    };

    const events = [
      "mousedown",
      "mousemove",
      "keydown",
      "scroll",
      "touchstart",
      "click",
    ];

    events.forEach((event) => {
      window.addEventListener(event, resetTimeout);
    });

    // Começa o contador
    resetTimeout();

    return () => {
      events.forEach((event) => {
        window.removeEventListener(event, resetTimeout);
      });

      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [session, status]);
}
