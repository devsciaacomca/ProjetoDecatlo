import { apiClient } from "./client";

import type {
  AlterarSenhaPayload,
  AtualizarPerfilPayload,
  PerfilUsuario,
} from "@/types/perfil";

export interface AtualizarPerfilResponse {
  success: boolean;
  message: string;
  data: PerfilUsuario;
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
