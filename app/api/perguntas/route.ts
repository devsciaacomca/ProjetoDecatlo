import { NextRequest } from 'next/server';
import { questionSchema } from '@/lib/validacoes/perguntas';
import { successResponse, errorResponse } from '@/lib/api-response';

/**
 * Rota: /api/questions
 * 
 * Esta rota gerencia o "CRUD" principal de perguntas.
 * - GET: Retorna a lista de perguntas cadastradas.
 * - POST: Cria uma nova pergunta após validar os dados.
 */

// ==========================================
// GET: Buscar todas as perguntas
// ==========================================
export async function GET() {
  try {
    // TODO (Fase 3): Substituir por prisma.question.findMany()
    // Como não temos o banco ainda, retornamos um array vazio simulando uma consulta bem-sucedida.
    const perguntasSimuladas = [
      { id: 1, assunto: 'Geografia', tipo: 'objetiva', enunciado: 'Qual a capital do Brasil?' }
    ];

    return successResponse(perguntasSimuladas, 'Perguntas carregadas com sucesso.');
  } catch (error) {
    console.error('Erro ao buscar perguntas:', error);
    return errorResponse('Erro ao buscar as perguntas do banco de dados.', 500);
  }
}

// ==========================================
// POST: Cadastrar uma nova pergunta
// ==========================================
export async function POST(request: NextRequest) {
  try {
    let body;
    try {
      body = await request.json();
    } catch (e) {
      body = {};
    }

    // Passamos a bola para o Zod verificar se as regras de negócio foram seguidas
    // Ex: "Se for objetiva, mandou as alternativas?"
    const validation = questionSchema.safeParse(body);

    if (!validation.success) {
      // Devolvemos 400 (Bad Request) avisando o que o usuário preencheu errado
      return errorResponse(
        'Falha na validação dos dados da pergunta', 
        400, 
        validation.error.flatten().fieldErrors
      );
    }

    const dadosValidados = validation.data;

    // TODO (Fase 3): Salvar no banco com prisma.question.create(...)
    
    // Simulando o objeto que o banco retornaria (já com ID gerado)
    const perguntaCriada = {
      id: Math.floor(Math.random() * 1000), // Gera um ID falso
      ...dadosValidados,
      criadaEm: new Date().toISOString()
    };

    // Retorna 201 (Created) significando que o recurso foi criado no servidor
    return successResponse(perguntaCriada, 'Pergunta criada com sucesso!', 201);

  } catch (error) {
    console.error('Erro ao criar pergunta:', error);
    return errorResponse('Erro inesperado ao salvar a pergunta.', 500);
  }
}
