export const PERMISSIONS = [
  { chave: "dashboard.acessar", descricao: "Acessar o dashboard" },
  { chave: "perguntas.gerenciar", descricao: "Cadastrar, editar e excluir perguntas" },
  { chave: "usuarios.gerenciar", descricao: "Cadastrar e gerenciar usuários" },
  { chave: "jogo.configurar", descricao: "Configurar equipes, matérias e tempo de resposta" },
  { chave: "jogo.gerenciar", descricao: "Controlar partida, cronômetro e pontuação" },
  { chave: "auditoria.visualizar", descricao: "Consultar o histórico de alterações" },
  { chave: "telao.abrir", descricao: "Abrir a tela de apresentação" },
] as const;

export type PermissionChave = (typeof PERMISSIONS)[number]["chave"];

import { Session } from "next-auth";

/**
 * Verifica se um usuário possui determinada permissão
 */
export function hasPermission(session: Session | null, chave: PermissionChave): boolean {
  if (!session?.user?.permissions) return false;
  return session.user.permissions.includes(chave);
}
