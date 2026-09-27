import type { Partida } from "@/types/partidas";

export type EquipeDaVez = "A" | "B";

export type StatusJogo =
  | "aguardando"
  | "em_andamento"
  | "pausada"
  | "finalizada";

export type ResultadoPergunta = "correta" | "incorreta" | null;

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

  tempoRestante: number;

  cronometroFimEm: number | null;

  /**
   * Resposta escolhida pelo controlador.
   * Não significa que foi considerada correta.
   */
  respostaSelecionada: string | null;

  /**
   * Equipe que realizou a tentativa atual.
   */
  equipeQueRespondeu: EquipeDaVez | null;

  /**
   * Resultado da tentativa.
   */
  resultado: ResultadoPergunta;

  /**
   * Só fica true quando o controlador
   * decidir revelar o gabarito.
   */
  respostaVisivel: boolean;
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
