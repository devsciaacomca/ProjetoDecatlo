import PerfilClient from "@/app/dashboard/perfil/page";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function AreaUsuarioPerfilPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");
  return <div className="min-h-screen bg-slate-100"><header className="mx-auto max-w-5xl px-4 pt-6"><a href="/area-usuario" className="text-sm font-semibold text-slate-600">← Voltar à Área do Usuário</a></header><PerfilClient /></div>;
}
