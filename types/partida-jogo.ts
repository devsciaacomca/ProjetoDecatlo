import type { Partida } from "@/types/partidas";

export type EquipeDaVez = "A" | "B";

export type StatusJogo =
  | "aguardando"
  | "em_andamento"
  | "pausada"
  | "finalizada";

export type ResultadoPergunta =
  | "correta"
  | "incorreta"
  | null;

export interface Pontuacao {
  equipe1: number;
  equipe2: number;
}

export interface EstadoJogo {
  partidaId: string;

  status: StatusJogo;

  /**
   * Índice humano da pergunta.
   * A primeira pergunta é 1.
   */
  perguntaAtual: number;

  pontos: Pontuacao;

  equipeDaVez: EquipeDaVez;

  /**
   * Tempo restante exibido.
   */
  tempoRestante: number;

  /**
   * Timestamp absoluto de quando o cronômetro termina.
   *
   * Isso permite que Controle e Telão
   * tenham o mesmo cronômetro.
   */
  cronometroFimEm: number | null;

  respostaVisivel: boolean;

  resultado: ResultadoPergunta;
}

export interface ConfiguracaoJogo {
  tempoResposta: number;

  totalPerguntas: number;

  permitirPular: boolean;

  mostrarExplicacao: boolean;
}

export interface EstadoInicialJogo {
  partida: Partida;

  estado: EstadoJogo;

  configuracao: ConfiguracaoJogo;
}