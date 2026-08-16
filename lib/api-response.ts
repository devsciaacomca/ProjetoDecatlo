import { NextResponse } from 'next/server';

/**
 * Utilitários para padronizar as respostas da nossa API.
 * 
 * Ter uma resposta padrão é essencial para que o Frontend saiba 
 * exatamente o que esperar, independentemente de qual rota foi chamada.
 * Assim evitamos que cada rota retorne um formato de objeto diferente.
 */

// Formato padrão de resposta de sucesso
export function successResponse<T>(data: T, message: string = 'Operação realizada com sucesso', status: number = 200) {
  return NextResponse.json(
    {
      success: true, // Indica para o front que deu tudo certo
      message,       // Uma mensagem amigável (pode ser mostrada em um Toast/Notificação)
      data,          // Os dados reais (ex: lista de perguntas, dados do usuário)
    },
    { status }
  );
}

// Formato padrão de resposta de erro
export function errorResponse(error: string, status: number = 400, details?: any) {
  return NextResponse.json(
    {
      success: false, // Indica para o front que algo deu errado
      error,          // A mensagem principal de erro
      details,        // Detalhes extras (ex: quais campos falharam na validação do Zod)
    },
    { status }
  );
}

// Erros comuns já pré-configurados para facilitar o uso no dia a dia
export const commonErrors = {
  unauthorized: () => errorResponse('Não autorizado. Faça login para continuar.', 401),
  forbidden: () => errorResponse('Você não tem permissão para realizar esta ação.', 403),
  notFound: (resource: string = 'Recurso') => errorResponse(`${resource} não encontrado(a).`, 404),
  internalServerError: () => errorResponse('Erro interno no servidor. Tente novamente mais tarde.', 500),
};
