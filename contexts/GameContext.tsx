"use client";

import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import { useGameSync, type GameAction } from "@/hooks/useGameSync";

import type {
  ConfiguracaoJogo,
  EstadoJogo,
  EquipeDaVez,
  ResultadoPergunta,
} from "@/types/partida-jogo";

import type { Pergunta } from "@/types/perguntas";

type PartidaBanco = {
  id: string;
  nome: string;
  equipe1: string;
  equipe2: string;
  status: string;
  perguntas: number;
  perguntaAtual: number;
  pontuacaoEquipeA: number;
  pontuacaoEquipeB: number;
  tempoResposta: number;
  embaralharPerguntas: boolean;
  mostrarExplicacao: boolean;
  permitirPular: boolean;
  equipeDaVez: string;
  tempoRestante: number;
  respostaVisivel: boolean;
  resultadoPergunta: string | null;

  /**
   * O Prisma retorna Date.
   * A API JSON normalmente entrega string.
   */
  cronometroFimEm: string | Date | null;

  data: string | Date;

  perguntasSelecionadas: Array<{
    ordem: number;
    perguntaId: number;
    pergunta: Pergunta;
  }>;
};

interface GameContextValue {
  partida: PartidaBanco;
  pergunta: Pergunta | null;
  estado: EstadoJogo;
  configuracao: ConfiguracaoJogo;
  sincronizado: boolean;
  carregando: boolean;
  erro: string | null;

  iniciarPartida: () => void;
  pausarPartida: () => void;
  finalizarPartida: () => void;

  iniciarCronometro: () => void;
  pausarCronometro: () => void;
  reiniciarCronometro: () => void;

  proximaPergunta: () => void;
  perguntaAnterior: () => void;
  pularPergunta: () => void;

  trocarEquipe: () => void;
  definirEquipe: (equipe: EquipeDaVez) => void;

  responder: (resultado: Exclude<ResultadoPergunta, null>) => void;

  adicionarPonto: (equipe: EquipeDaVez, quantidade?: number) => void;

  removerPonto: (equipe: EquipeDaVez, quantidade?: number) => void;

  mostrarResposta: () => void;
  esconderResposta: () => void;

  resetarPartida: () => void;
}

interface GameProviderProps {
  children: ReactNode;
  partidaId: string;
  role: "control" | "display";
}

const GameContext = createContext<GameContextValue | null>(null);

function mapStatus(status: string): EstadoJogo["status"] {
  if (status === "finalizada") {
    return "finalizada";
  }

  if (status === "em_andamento") {
    return "em_andamento";
  }

  if (status === "pausada") {
    return "pausada";
  }

  return "aguardando";
}

function criarEstado(partida: PartidaBanco): EstadoJogo {
  return {
    partidaId: partida.id,

    status: mapStatus(partida.status),

    perguntaAtual: Math.max(partida.perguntaAtual || 1, 1),

    pontos: {
      equipe1: partida.pontuacaoEquipeA ?? 0,
      equipe2: partida.pontuacaoEquipeB ?? 0,
    },

    equipeDaVez: partida.equipeDaVez === "B" ? "B" : "A",

    tempoRestante: partida.tempoRestante ?? partida.tempoResposta ?? 30,

    cronometroFimEm: partida.cronometroFimEm
      ? new Date(partida.cronometroFimEm).getTime()
      : null,

    respostaVisivel: partida.respostaVisivel ?? false,

    resultado:
      partida.resultadoPergunta === "correta" ||
      partida.resultadoPergunta === "incorreta"
        ? partida.resultadoPergunta
        : null,
  };
}

function aplicarAcao(estado: EstadoJogo, action: GameAction): EstadoJogo {
  switch (action.type) {
    case "INICIAR_PARTIDA":
      return {
        ...estado,
        status: "em_andamento",
        cronometroFimEm: action.cronometroFimEm,
      };

    case "PAUSAR_PARTIDA":
      return {
        ...estado,
        status: "pausada",
        cronometroFimEm: null,
      };

    case "FINALIZAR_PARTIDA":
      return {
        ...estado,
        status: "finalizada",
        cronometroFimEm: null,
      };

    case "INICIAR_CRONOMETRO":
      return {
        ...estado,
        status: "em_andamento",
        cronometroFimEm: action.cronometroFimEm,
      };

    case "PAUSAR_CRONOMETRO":
      return {
        ...estado,
        status: "pausada",
        tempoRestante: action.tempoRestante,
        cronometroFimEm: null,
      };

    case "REINICIAR_CRONOMETRO":
      return {
        ...estado,
        status: "pausada",
        tempoRestante: action.tempoRestante,
        cronometroFimEm: null,
      };

    case "PROXIMA_PERGUNTA":
    case "PERGUNTA_ANTERIOR":
      return {
        ...estado,
        perguntaAtual: action.perguntaAtual,
        tempoRestante: action.tempoRestante,
        cronometroFimEm: null,
        status: "pausada",
        respostaVisivel: false,
        resultado: null,
      };

    case "TROCAR_EQUIPE":
    case "DEFINIR_EQUIPE":
      return {
        ...estado,
        equipeDaVez: action.equipeDaVez,
      };

    case "RESPONDER":
      return {
        ...estado,
        pontos: action.pontos,
        resultado: action.resultado,
        respostaVisivel: true,
        cronometroFimEm: null,
        status: "pausada",
      };

    case "ADICIONAR_PONTO":
    case "REMOVER_PONTO":
      return {
        ...estado,
        pontos: action.pontos,
      };

    case "MOSTRAR_RESPOSTA":
      return {
        ...estado,
        respostaVisivel: true,
      };

    case "ESCONDER_RESPOSTA":
      return {
        ...estado,
        respostaVisivel: false,
        resultado: null,
      };

    case "RESETAR_PARTIDA":
      return action.estado;

    default:
      return estado;
  }
}

export function GameProvider({ children, partidaId, role }: GameProviderProps) {
  const [partida, setPartida] = useState<PartidaBanco | null>(null);

  const [estado, setEstado] = useState<EstadoJogo | null>(null);

  const [carregando, setCarregando] = useState(true);

  const [erro, setErro] = useState<string | null>(null);

  useEffect(() => {
    let ativo = true;

    async function carregar() {
      try {
        setCarregando(true);
        setErro(null);

        const response = await fetch(`/api/partidas/${partidaId}`, {
          cache: "no-store",
        });

        const resultado = await response.json();

        if (!response.ok || !resultado.success) {
          throw new Error(
            resultado.error || "Não foi possível carregar a partida.",
          );
        }

        if (!ativo) return;

        const dados = resultado.data as PartidaBanco;

        setPartida(dados);
        setEstado(criarEstado(dados));
      } catch (error) {
        if (ativo) {
          setErro(
            error instanceof Error
              ? error.message
              : "Não foi possível carregar a partida.",
          );
        }
      } finally {
        if (ativo) {
          setCarregando(false);
        }
      }
    }

    carregar();

    return () => {
      ativo = false;
    };
  }, [partidaId]);

  const aplicarAcaoRemota = useCallback((action: GameAction) => {
    setEstado((atual) => (atual ? aplicarAcao(atual, action) : atual));
  }, []);

  const receberEstado = useCallback((novoEstado: EstadoJogo) => {
    setEstado(novoEstado);
  }, []);

  const estadoSeguro = estado ?? {
    partidaId,
    status: "aguardando" as const,
    perguntaAtual: 1,

    pontos: {
      equipe1: 0,
      equipe2: 0,
    },

    equipeDaVez: "A" as const,

    tempoRestante: 0,

    cronometroFimEm: partida?.cronometroFimEm
      ? new Date(partida.cronometroFimEm).getTime()
      : null,

    respostaVisivel: false,
    resultado: null,
  };

  const { conectado, enviarAcao } = useGameSync({
    partidaId,
    role,
    estadoAtual: estadoSeguro,
    onAction: aplicarAcaoRemota,
    onStateReceived: receberEstado,
  });

  const persistirEstado = useCallback(
    async (novoEstado: EstadoJogo) => {
      try {
        const response = await fetch(`/api/partidas/${partidaId}/estado`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(novoEstado),
        });

        if (!response.ok) {
          console.error("Não foi possível persistir o estado da partida.");
        }
      } catch (error) {
        console.error("Erro ao persistir estado da partida:", error);
      }
    },
    [partidaId],
  );

  const executarAcao = useCallback(
    (action: GameAction) => {
      if (role !== "control") {
        return;
      }

      setEstado((atual) => {
        if (!atual) {
          return atual;
        }

        const novoEstado = aplicarAcao(atual, action);

        void persistirEstado(novoEstado);

        return novoEstado;
      });

      enviarAcao(action);
    },
    [role, persistirEstado, enviarAcao],
  );

  /**
   * Cronômetro.
   */
  useEffect(() => {
    if (
      !estado ||
      estado.status !== "em_andamento" ||
      estado.cronometroFimEm === null
    ) {
      return;
    }

    const atualizar = () => {
      setEstado((atual) => {
        if (!atual || atual.cronometroFimEm === null) {
          return atual;
        }

        const restante = Math.max(
          0,
          Math.ceil((atual.cronometroFimEm - Date.now()) / 1000),
        );

        if (restante <= 0) {
          const novo = {
            ...atual,
            tempoRestante: 0,
            cronometroFimEm: null,
            status: "pausada" as const,
          };

          if (role === "control") {
            void persistirEstado(novo);
          }

          return novo;
        }

        return {
          ...atual,
          tempoRestante: restante,
        };
      });
    };

    atualizar();

    const interval = window.setInterval(atualizar, 200);

    return () => window.clearInterval(interval);
  }, [estado?.status, estado?.cronometroFimEm, role, persistirEstado]);

  const iniciarPartida = useCallback(() => {
    const fim = Date.now() + estadoSeguro.tempoRestante * 1000;

    executarAcao({
      type: "INICIAR_PARTIDA",
      cronometroFimEm: fim,
    });
  }, [estadoSeguro.tempoRestante, executarAcao]);

  const pausarPartida = useCallback(
    () =>
      executarAcao({
        type: "PAUSAR_PARTIDA",
      }),
    [executarAcao],
  );

  const finalizarPartida = useCallback(
    () =>
      executarAcao({
        type: "FINALIZAR_PARTIDA",
      }),
    [executarAcao],
  );

  const iniciarCronometro = useCallback(() => {
    const tempo =
      estadoSeguro.tempoRestante > 0
        ? estadoSeguro.tempoRestante
        : (partida?.tempoResposta ?? 30);

    executarAcao({
      type: "INICIAR_CRONOMETRO",
      cronometroFimEm: Date.now() + tempo * 1000,
    });
  }, [estadoSeguro.tempoRestante, partida?.tempoResposta, executarAcao]);

  const pausarCronometro = useCallback(() => {
    let tempo = estadoSeguro.tempoRestante;

    if (estadoSeguro.cronometroFimEm !== null) {
      tempo = Math.max(
        0,
        Math.ceil((estadoSeguro.cronometroFimEm - Date.now()) / 1000),
      );
    }

    executarAcao({
      type: "PAUSAR_CRONOMETRO",
      tempoRestante: tempo,
    });
  }, [estadoSeguro, executarAcao]);

  const reiniciarCronometro = useCallback(() => {
    executarAcao({
      type: "REINICIAR_CRONOMETRO",
      tempoRestante: partida?.tempoResposta ?? 30,
    });
  }, [partida?.tempoResposta, executarAcao]);

  const proximaPergunta = useCallback(() => {
    if (!partida) {
      return;
    }

    if (estadoSeguro.perguntaAtual >= partida.perguntas) {
      executarAcao({
        type: "FINALIZAR_PARTIDA",
      });

      return;
    }

    executarAcao({
      type: "PROXIMA_PERGUNTA",

      perguntaAtual: estadoSeguro.perguntaAtual + 1,

      tempoRestante: partida.tempoResposta,
    });
  }, [partida, estadoSeguro.perguntaAtual, executarAcao]);

  const perguntaAnterior = useCallback(() => {
    if (estadoSeguro.perguntaAtual <= 1 || !partida) {
      return;
    }

    executarAcao({
      type: "PERGUNTA_ANTERIOR",

      perguntaAtual: estadoSeguro.perguntaAtual - 1,

      tempoRestante: partida.tempoResposta,
    });
  }, [estadoSeguro.perguntaAtual, partida, executarAcao]);

  const pularPergunta = useCallback(() => {
    if (partida?.permitirPular) {
      proximaPergunta();
    }
  }, [partida?.permitirPular, proximaPergunta]);

  const trocarEquipe = useCallback(() => {
    executarAcao({
      type: "TROCAR_EQUIPE",

      equipeDaVez: estadoSeguro.equipeDaVez === "A" ? "B" : "A",
    });
  }, [estadoSeguro.equipeDaVez, executarAcao]);

  const definirEquipe = useCallback(
    (equipe: EquipeDaVez) =>
      executarAcao({
        type: "DEFINIR_EQUIPE",
        equipeDaVez: equipe,
      }),
    [executarAcao],
  );

  const responder = useCallback(
    (resultado: Exclude<ResultadoPergunta, null>) => {
      const pontos = {
        ...estadoSeguro.pontos,
      };

      if (resultado === "correta") {
        if (estadoSeguro.equipeDaVez === "A") {
          pontos.equipe1 += 1;
        } else {
          pontos.equipe2 += 1;
        }
      }

      executarAcao({
        type: "RESPONDER",
        resultado,
        pontos,
      });
    },
    [estadoSeguro, executarAcao],
  );

  const adicionarPonto = useCallback(
    (equipe: EquipeDaVez, quantidade = 1) => {
      const pontos = {
        ...estadoSeguro.pontos,
      };

      if (equipe === "A") {
        pontos.equipe1 += quantidade;
      } else {
        pontos.equipe2 += quantidade;
      }

      executarAcao({
        type: "ADICIONAR_PONTO",
        equipe,
        quantidade,
        pontos,
      });
    },
    [estadoSeguro.pontos, executarAcao],
  );

  const removerPonto = useCallback(
    (equipe: EquipeDaVez, quantidade = 1) => {
      const pontos = {
        ...estadoSeguro.pontos,
      };

      if (equipe === "A") {
        pontos.equipe1 = Math.max(0, pontos.equipe1 - quantidade);
      } else {
        pontos.equipe2 = Math.max(0, pontos.equipe2 - quantidade);
      }

      executarAcao({
        type: "REMOVER_PONTO",
        equipe,
        quantidade,
        pontos,
      });
    },
    [estadoSeguro.pontos, executarAcao],
  );

  const mostrarResposta = useCallback(
    () =>
      executarAcao({
        type: "MOSTRAR_RESPOSTA",
      }),
    [executarAcao],
  );

  const esconderResposta = useCallback(
    () =>
      executarAcao({
        type: "ESCONDER_RESPOSTA",
      }),
    [executarAcao],
  );

  const resetarPartida = useCallback(() => {
    if (!partida) {
      return;
    }

    const inicial = criarEstado(partida);

    inicial.status = "aguardando";

    inicial.perguntaAtual = 1;

    inicial.pontos = {
      equipe1: 0,
      equipe2: 0,
    };

    inicial.equipeDaVez = "A";

    inicial.tempoRestante = partida.tempoResposta;

    inicial.cronometroFimEm = null;

    inicial.respostaVisivel = false;

    inicial.resultado = null;

    executarAcao({
      type: "RESETAR_PARTIDA",
      estado: inicial,
    });
  }, [partida, executarAcao]);

  const configuracao = useMemo<ConfiguracaoJogo>(
    () => ({
      tempoResposta: partida?.tempoResposta ?? 30,

      totalPerguntas: partida?.perguntas ?? 0,

      permitirPular: partida?.permitirPular ?? true,

      mostrarExplicacao: partida?.mostrarExplicacao ?? true,
    }),
    [partida],
  );

  /**
   * Fallback usado enquanto a partida
   * ainda está sendo carregada.
   *
   * IMPORTANTE:
   * cronometroFimEm também precisa
   * existir aqui para satisfazer
   * PartidaBanco.
   */
  const partidaSegura: PartidaBanco = partida ?? {
    id: partidaId,
    nome: "Carregando partida...",
    equipe1: "Equipe 1",
    equipe2: "Equipe 2",
    status: "configuracao",
    perguntas: 0,
    perguntaAtual: 1,

    pontuacaoEquipeA: 0,
    pontuacaoEquipeB: 0,

    tempoResposta: 30,

    embaralharPerguntas: false,

    mostrarExplicacao: true,

    permitirPular: true,

    equipeDaVez: "A",

    tempoRestante: 30,

    respostaVisivel: false,

    resultadoPergunta: null,

    /**
     * Campo obrigatório do tipo
     * PartidaBanco.
     */
    cronometroFimEm: null,

    data: new Date(),

    perguntasSelecionadas: [],
  };

  const pergunta =
    partidaSegura.perguntasSelecionadas.find(
      (item) => item.ordem === estadoSeguro.perguntaAtual,
    )?.pergunta ?? null;

  return (
    <GameContext.Provider
      value={{
        partida: partidaSegura,
        pergunta,
        estado: estadoSeguro,
        configuracao,

        sincronizado: conectado,

        carregando,
        erro,

        iniciarPartida,
        pausarPartida,
        finalizarPartida,

        iniciarCronometro,
        pausarCronometro,
        reiniciarCronometro,

        proximaPergunta,
        perguntaAnterior,
        pularPergunta,

        trocarEquipe,
        definirEquipe,

        responder,

        adicionarPonto,
        removerPonto,

        mostrarResposta,
        esconderResposta,

        resetarPartida,
      }}
    >
      {children}
    </GameContext.Provider>
  );
}

export function useGame() {
  const context = useContext(GameContext);

  if (!context) {
    throw new Error("useGame deve ser usado dentro de GameProvider.");
  }

  return context;
}
