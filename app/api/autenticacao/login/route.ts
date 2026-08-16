import { NextRequest } from 'next/server';
import { loginSchema } from '@/lib/validacoes/autenticacao';
import { successResponse, errorResponse } from '@/lib/api-response';

/**
 * Rota: POST /api/auth/login
 * 
 * Esta rota recebe as credenciais (email e senha) enviadas pelo frontend,
 * valida os dados com o Zod, e, no futuro, consultará o banco de dados
 * para verificar se o usuário existe e se a senha está correta.
 */
export async function POST(request: NextRequest) {
  try {
    // 1. Tenta extrair o corpo da requisição (JSON)
    const body = await request.json();

    // 2. Valida os dados usando o nosso esquema Zod (lembra que você mudou para 8 caracteres? Ele vai checar isso aqui!)
    // O safeParse não "quebra" o código se der erro, ele retorna um objeto com success = false.
    const validation = loginSchema.safeParse(body);

    if (!validation.success) {
      // Se a validação falhou, pegamos os erros amigáveis do Zod e mandamos pro frontend
      // ex: "A senha deve ter pelo menos 8 caracteres."
      return errorResponse('Dados de login inválidos', 400, validation.error.flatten().fieldErrors);
    }

    // Se chegou aqui, os dados estão válidos e tipados!
    const { email, password } = validation.data;

    // TODO (Fase 3): Aqui entrará a lógica do Prisma.
    // Exemplo: const user = await prisma.user.findUnique({ where: { email } })
    // if (!user || user.password !== hash(password)) return errorResponse("Credenciais inválidas");

    // Por enquanto (já que não temos banco), vamos simular um sucesso
    // Atenção: Nunca retorne a senha do usuário na resposta real!
    return successResponse(
      {
        token: 'simulacao_de_token_jwt_12345',
        user: {
          email: email,
          name: 'Usuário Simulado',
          role: 'ADMIN'
        }
      },
      'Login realizado com sucesso!'
    );

  } catch (error) {
    // Se der qualquer erro catastrófico (ex: JSON malformado), cai aqui
    console.error('Erro na rota de login:', error);
    return errorResponse('Erro interno no servidor ao tentar fazer login', 500);
  }
}
