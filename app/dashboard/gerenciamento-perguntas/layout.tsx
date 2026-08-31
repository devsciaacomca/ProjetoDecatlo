import { exigirPermissao } from "@/lib/autorizacao";

export default async function PerguntasLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await exigirPermissao("perguntas.gerenciar");

  return children;
}
