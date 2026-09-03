export interface PerfilUsuario {
  id: number;
  nome: string;
  email: string;
  nip: string;
  idade: number | null;
  role: {
    nome: string;
  };
}

export interface AtualizarPerfilPayload {
  nome: string;
  email: string;
}

export interface AlterarSenhaPayload {
  senhaAtual: string;
  novaSenha: string;
}

export interface PerfilMensagem {
  tipo: "sucesso" | "erro";
  texto: string;
}
