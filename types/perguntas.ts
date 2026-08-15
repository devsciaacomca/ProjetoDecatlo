export type TipoPergunta = "objetiva" | "aberta";
export interface Alternativa {
  id: number;
  texto: string;
}
export interface Pergunta {
  id: number;
  assunto: string;
  tipo: TipoPergunta;
  enunciado: string;
  alternativas?: Alternativa[];
  respostaCorreta?: string;
  criadaEm: string;
}
