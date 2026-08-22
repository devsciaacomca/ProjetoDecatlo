export type LoginErrors = {
  usuario?: string[];
  senha?: string[];
};

const passwordRules = [
  { test: (password: string) => password.length >= 8, message: "Mínimo 8 caracteres" },
  { test: (password: string) => /[A-Z]/.test(password), message: "Pelo menos uma letra maiúscula" },
  { test: (password: string) => /[0-9]/.test(password), message: "Pelo menos um número" },
  { test: (password: string) => /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password), message: "Pelo menos um caractere especial" },
];

export function validateLogin(usuario: string, senha: string): LoginErrors {
  const errors: LoginErrors = {};
  const passwordErrors = passwordRules
    .filter((rule) => !rule.test(senha))
    .map((rule) => rule.message);

  if (!usuario.trim()) errors.usuario = ["Usuário é obrigatório"];
  if (passwordErrors.length > 0) errors.senha = passwordErrors;

  return errors;
}