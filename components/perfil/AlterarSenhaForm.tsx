import { Lock } from "lucide-react";

import { PasswordInput } from "./PasswordInput";

interface AlterarSenhaFormProps {
  email?: string | null;

  senhaAtual: string;
  novaSenha: string;
  confirmarSenha: string;

  mostrarSenhaAtual: boolean;
  mostrarNovaSenha: boolean;
  mostrarConfirmacao: boolean;

  salvando: boolean;

  onSenhaAtualChange: (value: string) => void;
  onNovaSenhaChange: (value: string) => void;
  onConfirmarSenhaChange: (value: string) => void;

  onToggleSenhaAtual: () => void;
  onToggleNovaSenha: () => void;
  onToggleConfirmacao: () => void;

  onSubmit: React.FormEventHandler<HTMLFormElement>;
}

export function AlterarSenhaForm({
  email,

  senhaAtual,
  novaSenha,
  confirmarSenha,

  mostrarSenhaAtual,
  mostrarNovaSenha,
  mostrarConfirmacao,

  salvando,

  onSenhaAtualChange,
  onNovaSenhaChange,
  onConfirmarSenhaChange,

  onToggleSenhaAtual,
  onToggleNovaSenha,
  onToggleConfirmacao,

  onSubmit,
}: AlterarSenhaFormProps) {
  return (
    <section className="rounded-xl border border-slate-200 bg-white shadow-sm lg:col-span-3">
      <div className="border-b border-slate-200 px-5 py-5 sm:px-6">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100">
            <Lock size={20} className="text-slate-600" />
          </div>

          <div>
            <h2 className="font-semibold">Alterar senha</h2>

            <p className="text-xs text-slate-500">
              Altere sua senha de acesso ao sistema.
            </p>
          </div>
        </div>
      </div>

      <form
        onSubmit={onSubmit}
        className="grid gap-5 p-5 sm:p-6 md:grid-cols-3"
      >
        {/* 
          Campo utilizado por tecnologias assistivas e gerenciadores
          de senha para identificar a conta relacionada ao formulário.
        */}
        <div className="sr-only">
          <label htmlFor="usuario-senha">Usuário ou e-mail</label>

          <input
            id="usuario-senha"
            name="username"
            type="email"
            autoComplete="username"
            value={email ?? ""}
            readOnly
            tabIndex={-1}
          />
        </div>

        <PasswordInput
          id="senha-atual"
          autocomplete="current-password"
          label="Senha atual"
          value={senhaAtual}
          visible={mostrarSenhaAtual}
          onChange={onSenhaAtualChange}
          onToggle={onToggleSenhaAtual}
        />

        <PasswordInput
          id="nova-senha"
          autocomplete="new-password"
          label="Nova senha"
          value={novaSenha}
          visible={mostrarNovaSenha}
          onChange={onNovaSenhaChange}
          onToggle={onToggleNovaSenha}
        />

        <PasswordInput
          id="confirmar-senha"
          autocomplete="new-password"
          label="Confirmar nova senha"
          value={confirmarSenha}
          visible={mostrarConfirmacao}
          onChange={onConfirmarSenhaChange}
          onToggle={onToggleConfirmacao}
        />

        <div className="flex justify-end border-t border-slate-100 pt-5 md:col-span-3">
          <button
            type="submit"
            disabled={salvando}
            className="inline-flex items-center gap-2 rounded-lg bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Lock size={17} />

            {salvando ? "Alterando..." : "Alterar senha"}
          </button>
        </div>
      </form>
    </section>
  );
}
