import { exigirPermissao } from "@/lib/autorizacao";

export default async function ControlePartidaLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await exigirPermissao("jogo.gerenciar");

  return children;
}
