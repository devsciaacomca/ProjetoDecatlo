import { z } from "zod";

export const createUserSchema = z.object({
  nome: z.string().min(3, "O nome deve ter pelo menos 3 caracteres"),
  email: z.string().email("Formato de e-mail inválido"),
  nip: z.string().length(8, "O NIP deve ter exatamente 8 dígitos"),
  idade: z.number().int().min(1, "A idade deve ser um número válido").optional().default(18),
  senha: z.string().min(6, "A senha deve ter pelo menos 6 caracteres"),
  role: z.string().min(1, "Nível de acesso inválido"),
});

export const updateUserSchema = z.object({
  nome: z.string().min(3, "O nome deve ter pelo menos 3 caracteres").optional(),
  email: z.string().email("Formato de e-mail inválido").optional(),
  nip: z.string().length(8, "O NIP deve ter exatamente 8 dígitos").optional(),
  idade: z.number().int().min(1, "A idade deve ser um número válido").optional(),
  senha: z.string().min(6, "A senha deve ter pelo menos 6 caracteres").optional(),
  role: z.string().min(1, "Nível de acesso inválido").optional(),
});

export const updateProfileSchema = z.object({
  nome: z.string().min(3, "O nome deve ter pelo menos 3 caracteres"),
  email: z.string().email("Formato de e-mail inválido"),
});

export const updatePasswordSchema = z.object({
  senhaAtual: z.string().min(1, "A senha atual é obrigatória"),
  novaSenha: z.string().min(6, "A nova senha deve ter pelo menos 6 caracteres"),
});
