import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

import type { PermissionChave } from "@/lib/permissions";

export async function exigirPermissao(permissao: PermissionChave) {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  if (!session.user.permissions?.includes(permissao)) {
    redirect("/sem-permissao");
  }

  return session;
}

export async function exigirAlgumaPermissao(permissoes: PermissionChave[]) {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  const autorizado = permissoes.some((permissao) =>
    session.user.permissions?.includes(permissao),
  );

  if (!autorizado) {
    redirect("/sem-permissao");
  }

  return session;
}
