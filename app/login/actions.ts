"use server";

import { AuthError } from "next-auth";

import { signIn } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { normalizarIdentificador } from "@/lib/validations/login";

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

  return callbackUrl;
}

export async function authenticate(
  _estadoAnterior: LoginState,
  formData: FormData,
): Promise<LoginState> {
  const identifier = String(formData.get("identifier") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  if (!identifier || !password) {
    return {
      error: "NIP/e-mail e senha são obrigatórios.",
    };
  }

  try {
    const identificador = normalizarIdentificador(identifier);

    const user = await prisma.user.findFirst({
      where:
        identificador.tipo === "nip"
          ? { nip: identificador.valor }
          : { email: identificador.valor },
      include: {
        role: true,
      },
    });

    const callbackUrl = destinoSeguro(
      String(formData.get("callbackUrl") ?? "/dashboard"),
    );

    const destino = user?.role.nome === "Usuário" ? "/telao" : callbackUrl;

    await signIn("credentials", {
      identifier,
      password,
      redirectTo: destino,
    });
  } catch (error) {
    if (error instanceof AuthError) {
      return {
        error: "NIP/e-mail ou senha incorretos.",
      };
    }

    throw error;
  }

  return {};
}
