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

import {
  partidas,
} from "@/data/partidas/partidas";

import {
  useGameSync,
  type GameAction,
} from "@/hooks/useGameSync";

import type {
  ConfiguracaoJogo,
  EstadoJogo,
  EquipeDaVez,
  ResultadoPergunta,
} from "@/types/partida-jogo";

interface GameContextValue {
  partida: (typeof partidas)[number];

  estado: EstadoJogo;

  configuracao: ConfiguracaoJogo;

  sincronizado: boolean;

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

  definirEquipe: (
    equipe: EquipeDaVez,
  ) => void;

  responder: (
    resultado: Exclude<
      ResultadoPergunta,
      null
    >,
  ) => void;

  adicionarPonto: (
    equipe: EquipeDaVez,
    quantidade?: number,
  ) => void;

  removerPonto: (
    equipe: EquipeDaVez,
    quantidade?: number,
  ) => void;

  mostrarResposta: () => void;

  esconderResposta: () => void;

  resetarPartida: () => void;
}

interface GameProviderProps {
  children: ReactNode;

  partidaId: string;

  role: "control" | "display";
}

const CONFIGURACAO_PADRAO: ConfiguracaoJogo =
  {
    tempoResposta: 30,

    totalPerguntas: 12,

    permitirPular: true,

    mostrarExplicacao: true,
  };

function encontrarPartida(
  partidaId: string,
) {
  return partidas.find(
    (partida) =>
      partida.id === partidaId,
  );
}

function criarEstadoInicial(
  partidaId: string,
  configuracao: ConfiguracaoJogo,
): EstadoJogo {
  const partida =
    encontrarPartida(partidaId);

  /**
   * Caso exista uma partida no mock,
   * usamos a pergunta atual dela.
   *
   * Caso contrário começamos na 1.
   */
  const perguntaInicial = Math.max(
    partida?.perguntaAtual ?? 1,
    1,
  );

  return {
    partidaId,

    status:
      partida?.status ===
      "finalizada"
        ? "finalizada"
        : "pausada",

    perguntaAtual:
      perguntaInicial,

    pontos: {
      equipe1: 0,
      equipe2: 0,
    },

    equipeDaVez: "A",

    tempoRestante:
      configuracao.tempoResposta,

    cronometroFimEm: null,

    respostaVisivel: false,

    resultado: null,
  };
}

function aplicarAcao(
  estado: EstadoJogo,
  action: GameAction,
): EstadoJogo {
  switch (action.type) {
    case "INICIAR_PARTIDA":
      return {
        ...estado,

        status: "em_andamento",

        cronometroFimEm:
          action.cronometroFimEm,
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

        cronometroFimEm:
          action.cronometroFimEm,
      };

    case "PAUSAR_CRONOMETRO":
      return {
        ...estado,

        status: "pausada",

        tempoRestante:
          action.tempoRestante,

        cronometroFimEm: null,
      };

    case "REINICIAR_CRONOMETRO":
      return {
        ...estado,

        status: "pausada",

        tempoRestante:
          action.tempoRestante,

        cronometroFimEm: null,
      };

    case "PROXIMA_PERGUNTA":
      return {
        ...estado,

        perguntaAtual:
          action.perguntaAtual,

        tempoRestante:
          action.tempoRestante,

        cronometroFimEm: null,

        status: "pausada",

        respostaVisivel: false,

        resultado: null,
      };

    case "PERGUNTA_ANTERIOR":
      return {
        ...estado,

        perguntaAtual:
          action.perguntaAtual,

        tempoRestante:
          action.tempoRestante,

        cronometroFimEm: null,

        status: "pausada",

        respostaVisivel: false,

        resultado: null,
      };

    case "TROCAR_EQUIPE":
      return {
        ...estado,

        equipeDaVez:
          action.equipeDaVez,
      };

    case "DEFINIR_EQUIPE":
      return {
        ...estado,

        equipeDaVez:
          action.equipeDaVez,
      };

    case "RESPONDER":
      return {
        ...estado,

        pontos: action.pontos,

        resultado:
          action.resultado,

        respostaVisivel: true,

        cronometroFimEm: null,

        status: "pausada",
      };

    case "ADICIONAR_PONTO":
      return {
        ...estado,

        pontos: action.pontos,
      };

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

const GameContext =
  createContext<GameContextValue | null>(
    null,
  );

export function GameProvider({
  children,
  partidaId,
  role,
}: GameProviderProps) {
  const partida = useMemo(() => {
    return encontrarPartida(partidaId);
  }, [partidaId]);

  if (!partida) {
    throw new Error(
      `Partida "${partidaId}" não encontrada.`,
    );
  }

  const configuracao =
    useMemo<ConfiguracaoJogo>(() => {
      return {
        ...CONFIGURACAO_PADRAO,

        /**
         * No futuro esses valores virão
         * da configuração salva no banco.
         */
        totalPerguntas:
          partida.perguntas ||
          CONFIGURACAO_PADRAO.totalPerguntas,
      };
    }, [partida]);

  const [estado, setEstado] =
    useState<EstadoJogo>(() =>
      criarEstadoInicial(
        partidaId,
        configuracao,
      ),
    );

  /**
   * Atualiza o estado local sem enviar
   * nada para o outro lado.
   *
   * É utilizado quando o Telão recebe
   * um comando do Controle.
   */
  const aplicarAcaoRemota =
    useCallback(
      (action: GameAction) => {
        setEstado((atual) =>
          aplicarAcao(
            atual,
            action,
          ),
        );
      },
      [],
    );

  /**
   * Quando o Telão recebe o estado
   * inicial do Controle.
   */
  const receberEstado =
    useCallback(
      (novoEstado: EstadoJogo) => {
        setEstado(novoEstado);
      },
      [],
    );

  const {
    conectado,
    enviarAcao,
  } = useGameSync({
    partidaId,

    role,

    estadoAtual: estado,

    onAction: aplicarAcaoRemota,

    onStateReceived:
      receberEstado,
  });

  /**
   * Executa uma ação local.
   *
   * Apenas o Controle pode alterar
   * o estado da partida.
   */
  const executarAcao =
    useCallback(
      (action: GameAction) => {
        if (role !== "control") {
          return;
        }

        setEstado((atual) =>
          aplicarAcao(
            atual,
            action,
          ),
        );

        enviarAcao(action);
      },
      [
        role,
        enviarAcao,
      ],
    );

  /**
   * Cronômetro.
   *
   * IMPORTANTE:
   * não sincronizamos cada segundo.
   *
   * Sincronizamos o timestamp final.
   */
  useEffect(() => {
    if (
      estado.status !==
        "em_andamento" ||
      estado.cronometroFimEm === null
    ) {
      return;
    }

    const atualizarTempo =
      () => {
        setEstado((atual) => {
          if (
            atual.cronometroFimEm ===
            null
          ) {
            return atual;
          }

          const restante =
            Math.max(
              0,
              Math.ceil(
                (atual.cronometroFimEm -
                  Date.now()) /
                  1000,
              ),
            );

          if (restante <= 0) {
            return {
              ...atual,

              tempoRestante: 0,

              cronometroFimEm:
                null,

              status: "pausada",
            };
          }

          return {
            ...atual,

            tempoRestante:
              restante,
          };
        });
      };

    atualizarTempo();

    const interval =
      window.setInterval(
        atualizarTempo,
        200,
      );

    return () => {
      window.clearInterval(
        interval,
      );
    };
  }, [
    estado.status,
    estado.cronometroFimEm,
  ]);

  const iniciarPartida =
    useCallback(() => {
      const fim =
        Date.now() +
        estado.tempoRestante *
          1000;

      executarAcao({
        type: "INICIAR_PARTIDA",

        cronometroFimEm: fim,
      });
    }, [
      estado.tempoRestante,
      executarAcao,
    ]);

  const pausarPartida =
    useCallback(() => {
      executarAcao({
        type: "PAUSAR_PARTIDA",
      });
    }, [executarAcao]);

  const finalizarPartida =
    useCallback(() => {
      executarAcao({
        type: "FINALIZAR_PARTIDA",
      });
    }, [executarAcao]);

  const iniciarCronometro =
    useCallback(() => {
      const tempo =
        estado.tempoRestante >
        0
          ? estado.tempoRestante
          : configuracao.tempoResposta;

      const fim =
        Date.now() +
        tempo * 1000;

      executarAcao({
        type: "INICIAR_CRONOMETRO",

        cronometroFimEm: fim,
      });
    }, [
      estado.tempoRestante,
      configuracao.tempoResposta,
      executarAcao,
    ]);

  const pausarCronometro =
    useCallback(() => {
      let tempoAtual =
        estado.tempoRestante;

      if (
        estado.cronometroFimEm !==
        null
      ) {
        tempoAtual =
          Math.max(
            0,
            Math.ceil(
              (estado.cronometroFimEm -
                Date.now()) /
                1000,
            ),
          );
      }

      executarAcao({
        type: "PAUSAR_CRONOMETRO",

        tempoRestante:
          tempoAtual,
      });
    }, [
      estado.tempoRestante,
      estado.cronometroFimEm,
      executarAcao,
    ]);

  const reiniciarCronometro =
    useCallback(() => {
      executarAcao({
        type: "REINICIAR_CRONOMETRO",

        tempoRestante:
          configuracao.tempoResposta,
      });
    }, [
      configuracao.tempoResposta,
      executarAcao,
    ]);

const proximaPergunta =
  useCallback(() => {
    if (
      estado.perguntaAtual >=
      configuracao.totalPerguntas
    ) {
      executarAcao({
        type: "FINALIZAR_PARTIDA",
      });

      return;
    }

    executarAcao({
      type: "PROXIMA_PERGUNTA",

      perguntaAtual:
        estado.perguntaAtual + 1,

      tempoRestante:
        configuracao.tempoResposta,
    });
  }, [
    estado.perguntaAtual,
    configuracao.totalPerguntas,
    configuracao.tempoResposta,
    executarAcao,
  ]);

  const perguntaAnterior =
    useCallback(() => {
      if (
        estado.perguntaAtual <= 1
      ) {
        return;
      }

      executarAcao({
        type: "PERGUNTA_ANTERIOR",

        perguntaAtual:
          estado.perguntaAtual - 1,

        tempoRestante:
          configuracao.tempoResposta,
      });
    }, [
      estado.perguntaAtual,
      configuracao,
      executarAcao,
    ]);

  const pularPergunta =
    useCallback(() => {
      if (
        !configuracao.permitirPular
      ) {
        return;
      }

      proximaPergunta();
    }, [
      configuracao.permitirPular,
      proximaPergunta,
    ]);

  const trocarEquipe =
    useCallback(() => {
      executarAcao({
        type: "TROCAR_EQUIPE",

        equipeDaVez:
          estado.equipeDaVez === "A"
            ? "B"
            : "A",
      });
    }, [
      estado.equipeDaVez,
      executarAcao,
    ]);

  const definirEquipe =
    useCallback(
      (equipe: EquipeDaVez) => {
        executarAcao({
          type: "DEFINIR_EQUIPE",

          equipeDaVez: equipe,
        });
      },
      [executarAcao],
    );

  const responder =
    useCallback(
      (
        resultado: Exclude<
          ResultadoPergunta,
          null
        >,
      ) => {
        const pontos = {
          ...estado.pontos,
        };

        if (resultado === "correta") {
          if (
            estado.equipeDaVez ===
            "A"
          ) {
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
      [
        estado.pontos,
        estado.equipeDaVez,
        executarAcao,
      ],
    );

  const adicionarPonto =
    useCallback(
      (
        equipe: EquipeDaVez,
        quantidade = 1,
      ) => {
        const pontos = {
          ...estado.pontos,
        };

        if (equipe === "A") {
          pontos.equipe1 +=
            quantidade;
        } else {
          pontos.equipe2 +=
            quantidade;
        }

        executarAcao({
          type: "ADICIONAR_PONTO",

          equipe,

          quantidade,

          pontos,
        });
      },
      [
        estado.pontos,
        executarAcao,
      ],
    );

  const removerPonto =
    useCallback(
      (
        equipe: EquipeDaVez,
        quantidade = 1,
      ) => {
        const pontos = {
          ...estado.pontos,
        };

        if (equipe === "A") {
          pontos.equipe1 =
            Math.max(
              0,
              pontos.equipe1 -
                quantidade,
            );
        } else {
          pontos.equipe2 =
            Math.max(
              0,
              pontos.equipe2 -
                quantidade,
            );
        }

        executarAcao({
          type: "REMOVER_PONTO",

          equipe,

          quantidade,

          pontos,
        });
      },
      [
        estado.pontos,
        executarAcao,
      ],
    );

  const mostrarResposta =
    useCallback(() => {
      executarAcao({
        type: "MOSTRAR_RESPOSTA",
      });
    }, [executarAcao]);

  const esconderResposta =
    useCallback(() => {
      executarAcao({
        type: "ESCONDER_RESPOSTA",
      });
    }, [executarAcao]);

  const resetarPartida =
    useCallback(() => {
      const novoEstado =
        criarEstadoInicial(
          partidaId,
          configuracao,
        );

      executarAcao({
        type: "RESETAR_PARTIDA",

        estado: novoEstado,
      });
    }, [
      partidaId,
      configuracao,
      executarAcao,
    ]);

  const value =
    useMemo<GameContextValue>(
      () => ({
        partida,

        estado,

        configuracao,

        sincronizado: conectado,

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
      }),
      [
        partida,
        estado,
        configuracao,
        conectado,
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
      ],
    );

  return (
    <GameContext.Provider
      value={value}
    >
      {children}
    </GameContext.Provider>
  );
}

export function useGame() {
  const context =
    useContext(GameContext);

  if (!context) {
    throw new Error(
      "useGame deve ser utilizado dentro de GameProvider.",
    );
  }

  return context;
}