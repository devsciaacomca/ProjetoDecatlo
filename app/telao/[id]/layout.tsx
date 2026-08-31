import { exigirPermissao } from "@/lib/autorizacao";

export default async function TelaoLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await exigirPermissao("telao.abrir");

  return children;
}
