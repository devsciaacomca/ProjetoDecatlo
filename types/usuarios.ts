export type Role = "Administrador" | "Apresentador" | "Cadastrador" | "Usuário";

export interface Usuario {
  id: number;
  nome: string;
  email: string;
  nip: string;
  role: Role;
  ativo: boolean;
}

export interface UsuarioForm {
  nome: string;
  email: string;
  nip: string;
  role: Role;
  senha: string;
  ativo: boolean;
}

export const ROLES: Role[] = [
  "Administrador",
  "Apresentador",
  "Cadastrador",
  "Usuário",
];

export const FORMULARIO_USUARIO_INICIAL: UsuarioForm = {
  nome: "",
  email: "",
  nip: "",
  role: "Usuário",
  senha: "",
  ativo: true,
};
