import { apiClient } from "./client";

import type { Role, Usuario } from "@/types/usuarios";

export interface ListarUsuariosParams {
  page?: number;
  limit?: number;
  search?: string;
}

export interface ListarUsuariosResponse {
  success: boolean;
  message: string;
  data: Usuario[];
  meta: {
    totalCount: number;
    totalPages: number;
    currentPage: number;
    limit: number;
  };
}

export interface UsuarioResponse {
  success: boolean;
  message: string;
  data: Usuario;
}

export interface CriarUsuarioPayload {
  nome: string;
  email: string;
  nip: string;
  role: Role;
  ativo: boolean;
  senha: string;
}

export interface AtualizarUsuarioPayload {
  nome: string;
  email: string;
  nip: string;
  role: Role;
  ativo: boolean;
  senha?: string;
}

export interface ExcluirUsuarioResponse {
  success: boolean;
  message: string;
  data: null;
}

export async function listarUsuarios(
  params: ListarUsuariosParams = {},
): Promise<ListarUsuariosResponse> {
  const query = new URLSearchParams();

  if (params.page !== undefined) {
    query.set("page", params.page.toString());
  }

  if (params.limit !== undefined) {
    query.set("limit", params.limit.toString());
  }

  if (params.search?.trim()) {
    query.set("search", params.search.trim());
  }

  const queryString = query.toString();

  return apiClient<ListarUsuariosResponse>(
    queryString ? `/api/usuarios?${queryString}` : "/api/usuarios",
    {
      method: "GET",
      cache: "no-store",
    },
  );
}

export async function criarUsuario(
  payload: CriarUsuarioPayload,
): Promise<UsuarioResponse> {
  return apiClient<UsuarioResponse>("/api/usuarios", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function atualizarUsuario(
  id: number,
  payload: AtualizarUsuarioPayload,
): Promise<UsuarioResponse> {
  return apiClient<UsuarioResponse>(`/api/usuarios/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}

export async function excluirUsuario(
  id: number,
): Promise<ExcluirUsuarioResponse> {
  return apiClient<ExcluirUsuarioResponse>(`/api/usuarios/${id}`, {
    method: "DELETE",
  });
}
