"use client";

import { useActionState } from "react";
import LoginBrand from "@/components/login/LoginBrand";
import { authenticate, type LoginState } from "@/app/login/actions";

const estadoInicial: LoginState = {};

export default function LoginPage() {
  const [state, formAction, pending] = useActionState(
    authenticate,
    estadoInicial,
  );

  return (
    <main className="min-h-screen bg-[#050b14] text-white">
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,#0e749033,transparent_45%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:40px_40px]" />
      </div>

      <div className="relative flex min-h-screen items-center justify-center px-6 py-16">
        <div className="w-full max-w-md">
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-8 shadow-2xl backdrop-blur-sm">
            <LoginBrand />

            <form className="space-y-5" action={formAction}>
              <input type="hidden" name="callbackUrl" value="/dashboard" />

              {state.error ? (
                <div className="rounded-lg border border-red-500/20 bg-red-500/10 p-4 text-sm font-medium text-red-300">
                  {state.error}
                </div>
              ) : null}

              <div>
                <label
                  htmlFor="identifier"
                  className="mb-2 block text-sm font-medium text-white/80"
                >
                  NIP ou e-mail
                </label>
                <input
                  id="identifier"
                  type="text"
                  name="identifier"
                  autoComplete="username"
                  placeholder="NIP com 8 dígitos ou e-mail"
                  required
                  className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-base text-white placeholder:text-white/35 outline-none transition focus:border-cyan-400/70 focus:bg-white/[0.04] focus:ring-4 focus:ring-cyan-500/10"
                />
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="mb-2 block text-sm font-medium text-white/80"
                >
                  Senha
                </label>
                <input
                  id="password"
                  type="password"
                  name="password"
                  autoComplete="current-password"
                  placeholder="Digite sua senha"
                  required
                  className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-base text-white placeholder:text-white/35 outline-none transition focus:border-cyan-400/70 focus:bg-white/[0.04] focus:ring-4 focus:ring-cyan-500/10"
                />
              </div>

              <button
                type="submit"
                disabled={pending}
                className="mt-2 inline-flex w-full items-center justify-center rounded-lg bg-cyan-500 px-6 py-3 text-sm font-semibold text-[#04111f] transition disabled:cursor-not-allowed disabled:opacity-50 hover:bg-cyan-400 hover:shadow-lg hover:shadow-cyan-500/20 focus:outline-none focus:ring-4 focus:ring-cyan-500/20"
              >
                {pending ? "Entrando..." : "Entrar"}
              </button>
            </form>
          </div>
        </div>
      </div>

      {pending ? (
        <div
          className="fixed inset-0 z-10 flex items-center justify-center bg-[#050b14]/90 px-6 backdrop-blur-sm"
          role="status"
          aria-live="polite"
        >
          <div className="flex flex-col items-center gap-4 text-center">
            <div
              className="h-10 w-10 animate-spin rounded-full border-4 border-white/20 border-t-cyan-400"
              aria-hidden="true"
            />
            <p className="text-base font-medium text-white">Carregando...</p>
            <p className="text-sm text-white/60">Aguarde um momento.</p>
          </div>
        </div>
      ) : null}
    </main>
  );
}
