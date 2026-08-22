export type AuthenticationData = {
  usuario: string;
  senha: string;
  nome: string;
};

// Credenciais usadas somente para demonstracao local.
export const testAuthentication: AuthenticationData = {
  usuario: "Administrador",
  senha: "Ciaa@dev10",
  nome: "Administrador",
};
