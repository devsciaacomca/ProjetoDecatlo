// services/api/perfil.service.ts

import { apiClient } from "./client";

export interface AtualizarPerfilPayload {
  nome: string;
  email: string;
}

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

export interface AtualizarPerfilResponse {
  success: boolean;
  message: string;
  data: PerfilUsuario;
}

export interface AlterarSenhaPayload {
  senhaAtual: string;
  novaSenha: string;
}

export interface AlterarSenhaResponse {
  success: boolean;
  message: string;
  data: null;
}

export async function atualizarPerfil(
  payload: AtualizarPerfilPayload,
): Promise<AtualizarPerfilResponse> {
  return apiClient<AtualizarPerfilResponse>("/api/usuario/perfil", {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
}

export async function alterarSenha(
  payload: AlterarSenhaPayload,
): Promise<AlterarSenhaResponse> {
  return apiClient<AlterarSenhaResponse>("/api/usuario/senha", {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
}
