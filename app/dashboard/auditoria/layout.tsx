import { exigirPermissao } from "@/lib/autorizacao";

export default async function AuditoriaLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await exigirPermissao("auditoria.visualizar");

  return children;
}
