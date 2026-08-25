import { z } from 'zod';

/**
 * Esquemas de validação (Zod) para a Criação e Edição de Perguntas.
 * 
 * Por que usar Zod?
 * Ele garante que os dados que a nossa API recebe do frontend estão
 * no formato exato que esperamos. Isso evita que o banco de dados
 * tente salvar informações incompletas ou inválidas.
 */

// Como alternativas são opcionais ou só usadas em "objetivas", criamos um esquema separado para elas:
const alternativaSchema = z.object({
  texto: z.string().min(1, 'O texto da alternativa não pode ser vazio.'),
});

// Esquema principal para criar/editar uma pergunta
export const questionSchema = z.object({
  assunto: z
    .string({ message: 'O assunto é obrigatório.' })
    .min(3, 'O assunto deve ter pelo menos 3 caracteres.'),
    
  tipo: z.enum(['objetiva', 'aberta'] as const, {
    message: 'O tipo da pergunta é obrigatório.',
  }),

  enunciado: z
    .string({ message: 'O enunciado é obrigatório.' })
    .min(10, 'O enunciado deve ser mais descritivo (mínimo de 10 caracteres).'),

  // Para perguntas objetivas, precisamos de alternativas
  // Declaramos como opcional por padrão, mas validamos a obrigatoriedade logo abaixo no `.refine()`
  alternativas: z.array(alternativaSchema).optional(),

  respostaCorreta: z.string().optional(),
}).refine((data) => {
  // Regra de Negócio: Se a pergunta for do tipo 'objetiva', TEM QUE TER pelo menos 2 alternativas cadastradas.
  if (data.tipo === 'objetiva' && (!data.alternativas || data.alternativas.length < 2)) {
    return false; // Falhou na validação
  }
  return true; // Passou na validação
}, {
  message: 'Perguntas objetivas precisam de pelo menos 2 alternativas.',
  path: ['alternativas'], // Indica para o Frontend em qual campo o erro deve ser mostrado
});

// Tipo TypeScript gerado automaticamente a partir do nosso esquema Zod
export type QuestionRequest = z.infer<typeof questionSchema>;
