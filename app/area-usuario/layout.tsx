import { redirect } from "next/navigation";

import { UserProvider } from "@/contexts/UserContext";
import { auth } from "@/lib/auth";

export default async function AreaUsuarioLayout({
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
      {children}
    </UserProvider>
  );
}
