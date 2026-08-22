export type PartidaStatus =
  | "configuracao"
  | "pronta"
  | "em_andamento"
  | "finalizada";

export interface Partida {
  id: string;
  nome: string;
  equipe1: string;
  equipe2: string;
  status: PartidaStatus;
  perguntas: number;
  perguntaAtual: number;
  data: string;
}
