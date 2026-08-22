"use client";

import type { FormEvent } from "react";
import type { LoginErrors } from "@/utils/validation";

type LoginMessage = { tipo: "sucesso" | "erro"; texto: string } | null;

type LoginFormProps = {
  usuario: string;
  senha: string;
  erros: LoginErrors;
  mensagem: LoginMessage;
  carregando: boolean;
  onUsuarioChange: (value: string) => void;
  onSenhaChange: (value: string) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
};

export default function LoginForm({
  usuario, senha, erros, mensagem, carregando, onUsuarioChange, onSenhaChange, onSubmit,
}: LoginFormProps) {
  const inputClass = (hasError: boolean) => `w-full rounded-xl border px-4 py-3 text-base text-white placeholder:text-white/35 outline-none transition focus:bg-white/[0.04] focus:ring-4 ${hasError ? "border-red-500/50 bg-red-500/5 focus:border-red-500/70 focus:ring-red-500/10" : "border-white/10 bg-white/[0.03] focus:border-cyan-400/70 focus:ring-cyan-500/10"}`;

  return (
    <form className="space-y-5" onSubmit={onSubmit}>
      {mensagem && <div className={`rounded-lg p-4 text-sm font-medium ${mensagem.tipo === "sucesso" ? "border border-green-500/20 bg-green-500/10 text-green-300" : "border border-red-500/20 bg-red-500/10 text-red-300"}`}>{mensagem.texto}</div>}
      <div>
        <label htmlFor="usuario" className="mb-2 block text-sm font-medium text-white/80">Usuário</label>
        <input id="usuario" type="text" name="usuario" value={usuario} onChange={(event) => onUsuarioChange(event.target.value)} placeholder="Digite seu usuário" className={inputClass(Boolean(erros.usuario))} />
        {erros.usuario && <p className="mt-1 text-xs text-red-400">{erros.usuario[0]}</p>}
      </div>
      <div>
        <label htmlFor="senha" className="mb-2 block text-sm font-medium text-white/80">Senha</label>
        <input id="senha" type="password" name="senha" value={senha} onChange={(event) => onSenhaChange(event.target.value)} placeholder="Digite sua senha" className={inputClass(Boolean(erros.senha))} />
        {erros.senha && <div className="mt-2 space-y-1">{erros.senha.map((erro) => <p key={erro} className="text-xs text-red-400">• {erro}</p>)}</div>}
      </div>
      <button type="submit" disabled={carregando} className="mt-2 inline-flex w-full items-center justify-center rounded-lg bg-cyan-500 px-6 py-3 text-sm font-semibold text-[#04111f] transition disabled:cursor-not-allowed disabled:opacity-50 hover:bg-cyan-400 hover:shadow-lg hover:shadow-cyan-500/20 focus:outline-none focus:ring-4 focus:ring-cyan-500/20">
        {carregando ? "Entrando..." : "Entrar"}
      </button>
    </form>
  );
}