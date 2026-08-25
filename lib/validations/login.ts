import { z } from "zod";

export const NIP_REGEX = /^\d{8}$/;
export const NIP_DIGITOS_REGEX = /^\d{1,8}$/;

export function normalizarIdentificador(valor: string) {
  const identifier = valor.trim();

  if (NIP_DIGITOS_REGEX.test(identifier)) {
    return {
      tipo: "nip" as const,
      valor: identifier.padStart(8, "0"),
    };
  }

  return {
    tipo: "email" as const,
    valor: identifier.toLowerCase(),
  };
}

export const loginSchema = z.object({
  identifier: z.string().trim().min(1, "NIP ou e-mail é obrigatório"),
  password: z.string().min(1, "Senha é obrigatória"),
});

export type LoginInput = z.infer<typeof loginSchema>;
