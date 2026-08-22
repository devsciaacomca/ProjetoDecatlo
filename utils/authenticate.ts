import { testAuthentication } from "@/data/autenticação/authentication";

export type LoginResult = {
  success: boolean;
  message: string;
};

// Demonstração local. Em produção, esta verificação deve ocorrer no servidor.
export function authenticateLogin(usuario: string, senha: string): LoginResult {
  const success =
    usuario === testAuthentication.usuario && senha === testAuthentication.senha;

  return success
    ? {
        success: true,
        message: `Login realizado com sucesso! Bem-vindo, ${testAuthentication.nome}.`,
      }
    : { success: false, message: "Usuário ou senha incorretos." };
}