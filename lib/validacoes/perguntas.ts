import { z } from 'zod';

/**
 * Esquemas de validação para a Criação e Edição de Perguntas.
 * 
 * Baseado na interface Pergunta existente, criamos regras estritas para 
 * quando a API for receber os dados de uma nova pergunta.
 */

// Como alternativas são opcionais ou só usadas em "objetivas", criamos um esquema para elas:
const alternativaSchema = z.object({
  texto: z.string().min(1, 'O texto da alternativa não pode ser vazio.'),
});

// Esquema principal para criar/editar uma pergunta
export const questionSchema = z.object({
  assunto: z
    .string({ required_error: 'O assunto é obrigatório.' })
    .min(3, 'O assunto deve ter pelo menos 3 caracteres.'),
    
  tipo: z.enum(['objetiva', 'aberta'], {
    required_error: 'O tipo da pergunta é obrigatório.',
    invalid_type_error: 'O tipo deve ser "objetiva" ou "aberta".',
  }),

  enunciado: z
    .string({ required_error: 'O enunciado é obrigatório.' })
    .min(10, 'O enunciado deve ser mais descritivo (mínimo de 10 caracteres).'),

  // Para perguntas objetivas, precisamos de alternativas
  // Opcional por padrão, mas podemos validar a dependência mais pra frente no código
  alternativas: z.array(alternativaSchema).optional(),

  respostaCorreta: z.string().optional(),
}).refine((data) => {
  // Regra de Negócio: Se for objetiva, TEM QUE TER alternativas
  if (data.tipo === 'objetiva' && (!data.alternativas || data.alternativas.length < 2)) {
    return false; // Falhou na validação
  }
  return true; // Passou
}, {
  message: 'Perguntas objetivas precisam de pelo menos 2 alternativas.',
  path: ['alternativas'], // Onde o erro será "pendurado" para o Frontend
});

// Tipo gerado automaticamente pelo Zod
export type QuestionRequest = z.infer<typeof questionSchema>;
