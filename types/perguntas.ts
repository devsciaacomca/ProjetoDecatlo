export type TipoPergunta = "objetiva" | "aberta";

export interface Pergunta {
  id: number;
  assunto: string;
  tipo: TipoPergunta;
  enunciado: string;
  respostaCorreta?: string;
  criadaEm: string;
}
