import { NextRequest } from 'next/server';
import { successResponse, errorResponse } from '@/lib/api-response';

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
    // TODO (Fase 3): Buscar do banco (ex: a partida que está com status "EM_ANDAMENTO")
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
    const body = await request.json();

    // Como o jogo tem muitos estados possíveis, o ideal aqui seria ter um schema Zod
    // Mas para simplificar, vamos assumir que recebemos uma ação
    if (!body.acao) {
      return errorResponse('É necessário enviar a "acao" que deseja realizar no jogo.', 400);
    }

    // TODO (Fase 3): Atualizar o registro no Prisma com base na ação
    
    return successResponse({ acaoRealizada: body.acao }, `Ação '${body.acao}' aplicada com sucesso ao jogo!`);
  } catch (error) {
    console.error('Erro ao atualizar jogo:', error);
    return errorResponse('Erro ao processar a ação no jogo.', 500);
  }
}
