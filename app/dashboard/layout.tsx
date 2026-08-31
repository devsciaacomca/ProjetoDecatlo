import { exigirPermissao } from "@/lib/autorizacao";

import DashboardShell from "@/components/dashboard/DashboardShell";
import { UserProvider } from "@/contexts/UserContext";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await exigirPermissao("dashboard.acessar");

  return (
    <UserProvider initialUser={session.user}>
      <DashboardShell>{children}</DashboardShell>
    </UserProvider>
  );
}
