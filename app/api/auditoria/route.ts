import { NextRequest } from 'next/server';
import { successResponse, errorResponse } from '@/lib/api-response';

/**
 * Rota: /api/audit
 * 
 * Rota exclusiva para gravação e leitura de logs do sistema.
 * Ideal para rastrear quem fez o que (ex: "Professor X excluiu a Pergunta Y").
 */

// ==========================================
// GET: Histórico de Auditoria (Geralmente restrito a Admins)
// ==========================================
export async function GET() {
  try {
    // TODO (Fase 3): prisma.auditLog.findMany({ orderBy: { data: 'desc' } })
    
    // Dados de demonstração
    const logs = [
      { id: 1, usuario: 'Admin', acao: 'LOGIN', detalhes: 'Entrou no sistema', data: new Date().toISOString() },
      { id: 2, usuario: 'Prof. Silva', acao: 'CREATE_QUESTION', detalhes: 'Criou pergunta de Matemática', data: new Date().toISOString() }
    ];

    return successResponse(logs, 'Logs de auditoria carregados.');
  } catch (error) {
    console.error('Erro ao buscar logs:', error);
    return errorResponse('Erro ao buscar histórico de auditoria.', 500);
  }
}

// ==========================================
// POST: Registrar uma nova ação
// ==========================================
export async function POST(request: NextRequest) {
  try {
    let body;
    try {
      body = await request.json();
    } catch (e) {
      body = {};
    }

    // Para fins práticos, o front envia o que aconteceu
    if (!body.acao || !body.usuario) {
      return errorResponse('Ação e Usuário são obrigatórios para registrar log.', 400);
    }

    // TODO (Fase 3): prisma.auditLog.create(...)
    
    return successResponse(null, 'Log registrado com sucesso no sistema.', 201);
  } catch (error) {
    console.error('Erro ao salvar log:', error);
    return errorResponse('Erro interno ao tentar salvar log de auditoria.', 500);
  }
}
