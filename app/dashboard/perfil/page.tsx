import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import PerfilClient from "@/components/perfil/PerfilClient";
export default async function PerfilPage() {
  const session = await auth();
  if (!session?.user) {
    redirect("/login");
  }
  return <PerfilClient user={session.user} />;
}
