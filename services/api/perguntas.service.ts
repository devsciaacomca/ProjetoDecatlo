/**
 * Serviço de integração com a API de Perguntas.
 * Permite listar, criar, editar e excluir questões do banco de dados.
 */
import { apiClient } from "./client";
import type { Pergunta } from "@/types/perguntas";

export interface ListarPerguntasResponse {
  success: boolean;
  message: string;
  data: Pergunta[];
}

export interface PerguntaResponse {
  success: boolean;
  message: string;
  data: Pergunta;
}

// Representa a estrutura de uma alternativa ao criar/editar uma pergunta
export interface AlternativaPayload {
  texto: string;
}

// Payload usado tanto para criar quanto para editar uma pergunta
export interface PerguntaPayload {
  assunto: string;
  tipo: "objetiva" | "aberta";
  enunciado: string;
  respostaCorreta: string;
  explicacao: string;
  alternativas?: AlternativaPayload[];
}

/**
 * Obtém todas as perguntas cadastradas.
 */
export async function listarPerguntas(): Promise<ListarPerguntasResponse> {
  return apiClient<ListarPerguntasResponse>("/api/perguntas", {
    method: "GET",
  });
}

/**
 * Busca uma pergunta específica pelo ID (usado na tela de edição).
 */
export async function buscarPergunta(id: number): Promise<PerguntaResponse> {
  return apiClient<PerguntaResponse>(`/api/perguntas/${id}`, {
    method: "GET",
  });
}

/**
 * Cria uma nova pergunta e suas alternativas, se for o caso.
 */
export async function criarPergunta(payload: PerguntaPayload): Promise<PerguntaResponse> {
  return apiClient<PerguntaResponse>("/api/perguntas", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

/**
 * Edita uma pergunta já existente. As alternativas anteriores são substituídas pelas novas.
 */
export async function atualizarPergunta(
  id: number,
  payload: PerguntaPayload
): Promise<PerguntaResponse> {
  return apiClient<PerguntaResponse>(`/api/perguntas/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}

/**
 * Exclui permanentemente uma pergunta. Não será possível excluir se já estiver vinculada a uma partida.
 */
export async function excluirPergunta(id: number): Promise<{ success: boolean; message: string }> {
  return apiClient<{ success: boolean; message: string }>(`/api/perguntas/${id}`, {
    method: "DELETE",
  });
}
