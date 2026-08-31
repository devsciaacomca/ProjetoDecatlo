import { exigirPermissao } from "@/lib/autorizacao";

export default async function NovaPartidaLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await exigirPermissao("jogo.configurar");

  return children;
}
