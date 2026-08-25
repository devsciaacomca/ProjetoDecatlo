import { NextRequest } from 'next/server';
import { questionSchema } from '@/lib/validations/perguntas';
import { successResponse, errorResponse } from '@/lib/api-response';
import { auth } from '@/lib/auth';

/**
 * Rota: /api/questions
 * 
 * Esta rota gerencia o "CRUD" (Criação e Leitura) de perguntas.
 * - GET: Retorna a lista de perguntas cadastradas.
 * - POST: Cria uma nova pergunta (Exige usuário logado).
 */

// ==========================================
// GET: Buscar todas as perguntas
// ==========================================
export async function GET() {
  try {
    // TODO (Fase 3): Substituir por prisma.pergunta.findMany()
    // Por enquanto, como não conectamos o banco, devolvemos um exemplo fictício.
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
    // 1. Camada de Segurança (Autenticação)
    // Verificamos se quem está chamando a API realmente fez login no sistema (via NextAuth).
    const session = await auth();
    
    if (!session) {
      // Se não tem sessão ativa, barramos na porta! Retorna 401 (Unauthorized)
      return errorResponse('Acesso negado. Você precisa estar logado para cadastrar perguntas.', 401);
    }

    // 2. Extração dos Dados
    let body;
    try {
      body = await request.json();
    } catch (e) {
      body = {};
    }

    // 3. Validação Estrita (Zod)
    // Aqui nós usamos o schema que unificamos na pasta 'lib/validations'
    // Ele vai checar se o assunto tem pelo menos 3 letras, se a objetiva tem alternativas, etc.
    const validation = questionSchema.safeParse(body);

    if (!validation.success) {
      // Se preencheu algo errado, devolvemos um 400 avisando os erros exatos
      return errorResponse(
        'Falha na validação dos dados da pergunta', 
        400, 
        validation.error.flatten().fieldErrors
      );
    }

    const dadosValidados = validation.data;

    // TODO (Fase 3): Salvar no banco com prisma.pergunta.create(...)
    // O usuário que criou a pergunta fica salvo na sessão: session.user.id
    
    // Simulando o objeto recém criado
    const perguntaCriada = {
      id: Math.floor(Math.random() * 1000),
      ...dadosValidados,
      criadaEm: new Date().toISOString(),
      criadaPor: session.user?.name || 'Desconhecido'
    };

    // Sucesso! (Código 201 significa "Criado")
    return successResponse(perguntaCriada, 'Pergunta criada com sucesso!', 201);

  } catch (error) {
    console.error('Erro ao criar pergunta:', error);
    return errorResponse('Erro inesperado ao salvar a pergunta.', 500);
  }
}
