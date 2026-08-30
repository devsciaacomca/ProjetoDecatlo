import { z } from "zod";

export const alternativaSchema = z.object({
  texto: z.string().min(1, "O texto da alternativa é obrigatório"),
});

export const createPerguntaSchema = z.object({
  assunto: z.string().min(1, "O assunto é obrigatório"),
  tipo: z.enum(["aberta", "objetiva"], { required_error: "Tipo inválido" }),
  enunciado: z.string().min(1, "O enunciado é obrigatório"),
  respostaCorreta: z.string().min(1, "A resposta correta é obrigatória"),
  explicacao: z.string().optional().default(""),
  alternativas: z.array(alternativaSchema).optional(),
}).superRefine((data, ctx) => {
  if (data.tipo === "objetiva") {
    if (!data.alternativas || data.alternativas.length < 2) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Perguntas objetivas precisam de pelo menos 2 alternativas",
        path: ["alternativas"],
      });
    }
  }
});

export const updatePerguntaSchema = createPerguntaSchema.partial();
