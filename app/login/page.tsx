"use client";

import { useState } from "react";

import Footer from "@/components/Footer";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";

const ADMIN_USER = "Administrador";
const ADMIN_PASSWORD = "Ciaa@dev10";

const validatePassword = (password: string): { valid: boolean; errors: string[] } => {
  const errors: string[] = [];

  if (password.length < 8) {
    errors.push("Mínimo 8 caracteres");
  }

  if (!/[A-Z]/.test(password)) {
    errors.push("Pelo menos uma letra maiúscula");
  }

  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
    errors.push("Pelo menos um caractere especial");
  }

  if (!/[0-9]/.test(password)) {
    errors.push("Pelo menos um número");
  }

  return {
    valid: errors.length === 0,
    errors,
  };
};

export default function LoginPage() {
  const [usuario, setUsuario] = useState("");
  const [senha, setSenha] = useState("");
  const [erros, setErros] = useState<{ [key: string]: string[] }>({});
  const [mensagem, setMensagem] = useState<{ tipo: "sucesso" | "erro"; texto: string } | null>(null);
  const [carregando, setCarregando] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErros({});
    setMensagem(null);

    console.log("DEBUG - Senha digitada:", senha);
    console.log("DEBUG - Senha esperada:", ADMIN_PASSWORD);
    console.log("DEBUG - Usuário digitado:", usuario);
    console.log("DEBUG - Usuário esperado:", ADMIN_USER);

    const novoErros: { [key: string]: string[] } = {};

    // Validar senha
    const validacaoSenha = validatePassword(senha);
    console.log("DEBUG - Validação de senha:", validacaoSenha);
    if (!validacaoSenha.valid) {
      novoErros.senha = validacaoSenha.errors;
    }

    // Validar usuário vazio
    if (!usuario.trim()) {
      novoErros.usuario = ["Usuário é obrigatório"];
    }

    if (Object.keys(novoErros).length > 0) {
      console.log("DEBUG - Erros de validação encontrados:", novoErros);
      setErros(novoErros);
      return;
    }

    setCarregando(true);

    // Validar credenciais
    console.log("DEBUG - Comparando credenciais...");
    if (usuario === ADMIN_USER && senha === ADMIN_PASSWORD) {
      console.log("DEBUG - Login bem-sucedido!");
      setMensagem({
        tipo: "sucesso",
        texto: "Login realizado com sucesso! Bem-vindo, Administrador.",
      });
      // Aqui você pode adicionar redirecionamento ou armazenar token
      setTimeout(() => {
        // window.location.href = "/dashboard";
      }, 1500);
    } else {
      console.log("DEBUG - Credenciais incorretas!");
      setMensagem({
        tipo: "erro",
        texto: "Usuário ou senha incorretos.",
      });
    }

    setCarregando(false);
  };

  return (
    <main className="min-h-screen bg-[#050b14] text-white">
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,#0e749033,transparent_45%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:40px_40px]" />
      </div>

      <div className="relative flex min-h-screen items-center justify-center px-6 py-16">
        <div className="w-full max-w-md">
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-8 shadow-2xl backdrop-blur-sm">
            <div className="mb-6 text-center">
              <div className="mb-3 inline-flex items-center gap-3 rounded-full border border-cyan-400/20 bg-cyan-400/5 px-4 py-2 text-[10px] font-medium uppercase tracking-[0.25em] text-cyan-300">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-cyan-400 opacity-50" />
                  <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-cyan-400" />
                </span>
                Sistema de Arguição
              </div>

              <h1 className="text-4xl font-black tracking-tight text-white sm:text-5xl">
                DECAtlo
              </h1>
              <div className="mx-auto mt-4 h-px w-20 bg-cyan-400/50" />
            </div>

            <form className="space-y-5" onSubmit={handleSubmit}>
              {mensagem && (
                <div
                  className={`rounded-lg p-4 text-sm font-medium ${
                    mensagem.tipo === "sucesso"
                      ? "border border-green-500/20 bg-green-500/10 text-green-300"
                      : "border border-red-500/20 bg-red-500/10 text-red-300"
                  }`}
                >
                  {mensagem.texto}
                </div>
              )}

              <div>
                <label
                  htmlFor="usuario"
                  className="mb-2 block text-sm font-medium text-white/80"
                >
                  Usuário
                </label>
                <input
                  id="usuario"
                  type="text"
                  name="usuario"
                  value={usuario}
                  onChange={(e) => setUsuario(e.target.value)}
                  placeholder="Digite seu usuário"
                  className={`w-full rounded-xl border px-4 py-3 text-base text-white placeholder:text-white/35 outline-none transition focus:bg-white/[0.04] focus:ring-4 ${
                    erros.usuario
                      ? "border-red-500/50 bg-red-500/5 focus:border-red-500/70 focus:ring-red-500/10"
                      : "border-white/10 bg-white/[0.03] focus:border-cyan-400/70 focus:ring-cyan-500/10"
                  }`}
                />
                {erros.usuario && (
                  <p className="mt-1 text-xs text-red-400">{erros.usuario[0]}</p>
                )}
              </div>

              <div>
                <label
                  htmlFor="senha"
                  className="mb-2 block text-sm font-medium text-white/80"
                >
                  Senha
                </label>
                <input
                  id="senha"
                  type="password"
                  name="senha"
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)}
                  placeholder="Digite sua senha"
                  className={`w-full rounded-xl border px-4 py-3 text-base text-white placeholder:text-white/35 outline-none transition focus:bg-white/[0.04] focus:ring-4 ${
                    erros.senha
                      ? "border-red-500/50 bg-red-500/5 focus:border-red-500/70 focus:ring-red-500/10"
                      : "border-white/10 bg-white/[0.03] focus:border-cyan-400/70 focus:ring-cyan-500/10"
                  }`}
                />
                {erros.senha && (
                  <div className="mt-2 space-y-1">
                    {erros.senha.map((erro, index) => (
                      <p key={index} className="text-xs text-red-400">
                        • {erro}
                      </p>
                    ))}
                  </div>
                )}
              </div>

              <button
                type="submit"
                disabled={carregando}
                className="mt-2 inline-flex w-full items-center justify-center rounded-lg bg-cyan-500 px-6 py-3 text-sm font-semibold text-[#04111f] transition disabled:opacity-50 disabled:cursor-not-allowed hover:bg-cyan-400 hover:shadow-lg hover:shadow-cyan-500/20 focus:outline-none focus:ring-4 focus:ring-cyan-500/20"
              >
                {carregando ? "Entrando..." : "Entrar"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </main>
  );
}
