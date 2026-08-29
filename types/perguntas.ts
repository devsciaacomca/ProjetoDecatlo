
export type PerguntaTipo = "objetiva" | "aberta";

export type Alternativa = {
  id: number;
  texto: string;
};

export type Pergunta = {
  id: number;
  assunto: string;
  tipo: PerguntaTipo;
  enunciado: string;
  alternativas?: Alternativa[];
  respostaCorreta: string;
  explicacao: string;
  criadaEm: string;
};
