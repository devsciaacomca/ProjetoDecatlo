import { exigirAlgumaPermissao } from "@/lib/autorizacao";

export default async function PartidasLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await exigirAlgumaPermissao(["jogo.configurar", "jogo.gerenciar"]);

  return children;
}
