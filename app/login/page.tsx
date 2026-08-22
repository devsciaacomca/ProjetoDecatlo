"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import LoginBrand from "@/components/login/LoginBrand";
import LoginForm from "@/components/login/LoginForm";
import { authenticateLogin } from "@/utils/authenticate";
import { validateLogin, type LoginErrors } from "@/utils/validation";

type LoginMessage = { tipo: "sucesso" | "erro"; texto: string } | null;

export default function LoginPage() {
  const router = useRouter();
  const [usuario, setUsuario] = useState("");
  const [senha, setSenha] = useState("");
  const [erros, setErros] = useState<LoginErrors>({});
  const [mensagem, setMensagem] = useState<LoginMessage>(null);
  const [carregando, setCarregando] = useState(false);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMensagem(null);

    const validationErrors = validateLogin(usuario, senha);
    setErros(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    setCarregando(true);
    const result = authenticateLogin(usuario, senha);
    setMensagem({
      tipo: result.success ? "sucesso" : "erro",
      texto: result.message,
    });

    if (result.success) {
      router.replace("/dashboard");
    } else {
      setCarregando(false);
    }
  }

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
            <LoginForm
              usuario={usuario}
              senha={senha}
              erros={erros}
              mensagem={mensagem}
              carregando={carregando}
              onUsuarioChange={setUsuario}
              onSenhaChange={setSenha}
              onSubmit={handleSubmit}
            />
          </div>
        </div>
      </div>
      {carregando && (
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
      )}
    </main>
  );
}
