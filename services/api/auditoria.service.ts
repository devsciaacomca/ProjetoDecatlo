/**
 * Serviço de integração com a API de Auditoria.
 * Responsável por centralizar as requisições de listagem e registro de logs do sistema.
 */
import { apiClient } from "./client";

// Define a estrutura do log de auditoria retornada pela API
export interface AuditoriaLog {
  id: string;
  usuario: string;
  nip: string;
  acao: string;
  entidade: string;
  entidadeId?: string;
  descricao: string;
  detalhes?: string;
  data: string;
}

// Parâmetros aceitos na busca (paginação e filtros)
export interface ListarAuditoriaParams {
  pagina?: number;
  busca?: string;
  acao?: string;
}

// Resposta da API de listagem
export interface ListarAuditoriaResponse {
  success: boolean;
  message: string;
  data: {
    registros: AuditoriaLog[];
    paginacao: {
      pagina: number;
      porPagina: number;
      total: number;
      totalPaginas: number;
    };
  };
}

// Payload para registrar um log manualmente (via POST)
export interface CriarAuditoriaPayload {
  acao: string;
  entidade: string;
  entidadeId?: string | number | null;
  descricao: string;
  detalhes?: string | null;
}

export interface CriarAuditoriaResponse {
  success: boolean;
  message: string;
  data: { id: number };
}

/**
 * Busca o histórico de auditoria com base nos filtros e paginação fornecidos.
 */
export async function listarAuditoria(
  params?: ListarAuditoriaParams
): Promise<ListarAuditoriaResponse> {
  const searchParams = new URLSearchParams();
  
  if (params?.pagina) searchParams.set("pagina", String(params.pagina));
  if (params?.busca) searchParams.set("busca", params.busca);
  if (params?.acao && params.acao !== "todas") searchParams.set("acao", params.acao);

  const queryString = searchParams.toString();
  const url = queryString ? `/api/auditoria?${queryString}` : "/api/auditoria";

  return apiClient<ListarAuditoriaResponse>(url, {
    method: "GET",
  });
}

/**
 * Registra um novo log de auditoria no sistema.
 */
export async function criarAuditoria(
  payload: CriarAuditoriaPayload
): Promise<CriarAuditoriaResponse> {
  return apiClient<CriarAuditoriaResponse>("/api/auditoria", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}
