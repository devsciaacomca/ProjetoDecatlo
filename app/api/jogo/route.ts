import { NextRequest } from 'next/server';
import { successResponse, errorResponse } from '@/lib/api-response';
import { auth } from '@/lib/auth';

/**
 * Rota: /api/game
 * 
 * Responsável por gerenciar o "Estado da Partida" atual, 
 * que será exibido no Telão em tempo real.
 */

// ==========================================
// GET: Pegar o status atual do jogo
// ==========================================
export async function GET() {
  try {
    // TODO (Fase 3): Buscar do banco a partida atual
    // Simulando os dados que o Telão precisaria
    const estadoDoJogo = {
      idPartida: 101,
      faseAtual: 'Configuração',
      perguntaAtual: null,
      cronometroAtivo: false,
      pontuacaoEquipes: [
        { equipe: 'Equipe Azul', pontos: 10 },
        { equipe: 'Equipe Vermelha', pontos: 15 }
      ]
    };

    return successResponse(estadoDoJogo, 'Status do jogo recuperado.');
  } catch (error) {
    console.error('Erro ao buscar status do jogo:', error);
    return errorResponse('Erro ao buscar status da partida.', 500);
  }
}

// ==========================================
// PUT: Atualizar o status do jogo (ex: Iniciar, Pausar, Pular Pergunta)
// ==========================================
export async function PUT(request: NextRequest) {
  try {
    // 1. Camada de Segurança (Autenticação)
    // Apenas usuários autenticados (ex: apresentadores/controladores) podem mexer no andamento do jogo.
    const session = await auth();
    
    if (!session) {
      return errorResponse('Acesso negado. Você precisa estar logado para controlar o jogo.', 401);
    }

    let body;
    try {
      body = await request.json();
    } catch (e) {
      body = {};
    }

    if (!body.acao) {
      return errorResponse('É necessário enviar a "acao" que deseja realizar no jogo.', 400);
    }

    // TODO (Fase 3): Atualizar o registro no Prisma com base na ação enviada
    // Quem solicitou a ação? session.user.name
    
    return successResponse({ acaoRealizada: body.acao }, `Ação '${body.acao}' aplicada com sucesso ao jogo!`);
  } catch (error) {
    console.error('Erro ao atualizar jogo:', error);
    return errorResponse('Erro ao processar a ação no jogo.', 500);
  }
}
