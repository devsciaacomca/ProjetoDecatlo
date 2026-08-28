import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

import DashboardShell from "@/components/dashboard/DashboardShell";
import { UserProvider } from "@/contexts/UserContext";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  return (
    <UserProvider initialUser={session.user}>
      <DashboardShell>{children}</DashboardShell>
    </UserProvider>
  );
}
