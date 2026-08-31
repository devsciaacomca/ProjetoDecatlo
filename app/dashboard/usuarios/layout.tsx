import { exigirPermissao } from "@/lib/autorizacao";

export default async function UsuariosLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await exigirPermissao("usuarios.gerenciar");

  return children;
}
