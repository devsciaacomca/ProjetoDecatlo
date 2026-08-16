import { z } from 'zod';

/**
 * Esquema de validação para Login.
 * 
 * O Zod vai garantir que a requisição do frontend tenha exatamente 
 * esses campos. Caso o email seja inválido ou a senha muito curta, 
 * o Zod gera a mensagem de erro automaticamente para nós.
 */
export const loginSchema = z.object({
  email: z
    .string({ required_error: 'O e-mail é obrigatório.' })
    .email('Por favor, informe um e-mail válido.'),
  
  password: z
    .string({ required_error: 'A senha é obrigatória.' })
    .min(6, 'A senha deve ter pelo menos 6 caracteres.'),
});

/**
 * Podemos extrair o "tipo" do TypeScript a partir do esquema do Zod, 
 * o que nos poupa de ter que escrever a mesma interface de novo!
 */
export type LoginRequest = z.infer<typeof loginSchema>;
