/**
 * Serviço de integração com a API de Partidas.
 * Contém todas as operações de CRUD e controle de estado do jogo.
 */
import { apiClient } from "./client";
import type { Partida } from "@/types/partidas";

export interface ListarPartidasResponse {
  success: boolean;
  message: string;
  data: Partida[];
}

export interface PartidaResponse {
  success: boolean;
  message: string;
  data: Partida;
}

// Payload para a criação de uma nova partida
export interface CriarPartidaPayload {
  nome: string;
  equipe1: string;
  equipe2: string;
  tipoPergunta: "objetiva" | "aberta";
  totalPerguntas: number;
  tempoResposta: number;
  embaralharPerguntas: boolean;
  mostrarExplicacao: boolean;
  permitirPular: boolean;
  assuntos: string[];
}

// Payload para a atualização do estado/andamento da partida
export interface AtualizarEstadoPartidaPayload {
  status: "aguardando" | "em_andamento" | "pausada" | "finalizada";
  perguntaAtual: number;
  pontos: {
    equipe1: number;
    equipe2: number;
  };
  equipeDaVez: "A" | "B";
  tempoRestante: number;
  cronometroFimEm: number | null;
  respostaVisivel: boolean;
  resultado: "correta" | "incorreta" | null;
}

/**
 * Busca a lista de partidas criadas. Pode receber um filtro de status.
 */
export async function listarPartidas(status?: string): Promise<ListarPartidasResponse> {
  const url = status ? `/api/partidas?status=${status}` : "/api/partidas";
  return apiClient<ListarPartidasResponse>(url, {
    method: "GET",
  });
}

/**
 * Retorna os detalhes de uma partida específica através do seu ID.
 */
export async function buscarPartida(id: string): Promise<PartidaResponse> {
  return apiClient<PartidaResponse>(`/api/partidas/${id}`, {
    method: "GET",
  });
}

/**
 * Cria uma nova partida com base nas configurações selecionadas, sorteando as perguntas adequadas.
 */
export async function criarPartida(payload: CriarPartidaPayload): Promise<PartidaResponse> {
  return apiClient<PartidaResponse>("/api/partidas", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

/**
 * Salva o estado atual do jogo (pontuação, pergunta atual, cronômetro, etc).
 */
export async function atualizarEstadoPartida(
  id: string,
  payload: AtualizarEstadoPartidaPayload
): Promise<PartidaResponse> {
  return apiClient<PartidaResponse>(`/api/partidas/${id}/estado`, {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
}
