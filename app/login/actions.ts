"use server";

import { AuthError } from "next-auth";
import { signIn } from "@/lib/auth";

export type LoginState = {
  error?: string;
};

function destinoSeguro(callbackUrl: string) {
  if (!callbackUrl.startsWith("/")) {
    return "/dashboard";
  }

  if (callbackUrl.startsWith("/login") || callbackUrl.startsWith("/api/")) {
    return "/dashboard";
  }

  return callbackUrl.startsWith("/dashboard") ? callbackUrl : "/dashboard";
}

export async function authenticate(
  _estadoAnterior: LoginState,
  formData: FormData,
): Promise<LoginState> {
  const identifier = String(formData.get("identifier") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const callbackUrl = destinoSeguro(String(formData.get("callbackUrl") ?? "/dashboard"));

  if (!identifier || !password) {
    return { error: "NIP/e-mail e senha são obrigatórios." };
  }

  try {
    await signIn("credentials", {
      identifier,
      password,
      redirectTo: callbackUrl,
    });
  } catch (error) {
    if (error instanceof AuthError) {
      return { error: "NIP/e-mail ou senha incorretos." };
    }

    throw error;
  }

  return {};
}
