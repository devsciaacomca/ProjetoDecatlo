import { ShieldCheck } from "lucide-react";

import { ROLES } from "@/types/usuarios";

import type { Role, UsuarioForm as UsuarioFormData } from "@/types/usuarios";

interface UsuarioFormProps {
  form: UsuarioFormData;
  editando: boolean;
  salvando: boolean;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  onChange: <K extends keyof UsuarioFormData>(
    campo: K,
    valor: UsuarioFormData[K],
  ) => void;
}

export function UsuarioForm({
  form,
  editando,
  salvando,
  onSubmit,
  onChange,
}: UsuarioFormProps) {
  return (
    <form onSubmit={onSubmit} className="space-y-5">
      <div>
        <label
          htmlFor="usuario-nome"
          className="mb-2 block text-sm font-medium text-slate-700"
        >
          Nome completo
        </label>

        <input
          id="usuario-nome"
          autoComplete="username"
          type="text"
          value={form.nome}
          onChange={(event) => onChange("nome", event.target.value)}
          placeholder="Digite o nome completo"
          className="w-full rounded-lg border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-slate-700 focus:ring-2 focus:ring-slate-200"
        />
      </div>

      <div>
        <label
          htmlFor="usuario-email"
          className="mb-2 block text-sm font-medium text-slate-700"
        >
          E-mail
        </label>

        <input
          id="usuario-email"
          type="email"
          autoComplete="email"
          value={form.email}
          onChange={(event) => onChange("email", event.target.value)}
          placeholder="usuario@email.com"
          className="w-full rounded-lg border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-slate-700 focus:ring-2 focus:ring-slate-200"
        />
      </div>

      <div>
        <label
          htmlFor="usuario-nip"
          className="mb-2 block text-sm font-medium text-slate-700"
        >
          NIP
        </label>

        <input
          id="usuario-nip"
          type="text"
          inputMode="numeric"
          maxLength={8}
          value={form.nip}
          onChange={(event) =>
            onChange("nip", event.target.value.replace(/\D/g, ""))
          }
          placeholder="00000000"
          className="w-full rounded-lg border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-slate-700 focus:ring-2 focus:ring-slate-200"
        />
      </div>

      <div>
        <label
          htmlFor="usuario-role"
          className="mb-2 block text-sm font-medium text-slate-700"
        >
          Perfil
        </label>

        <div className="relative">
          <ShieldCheck
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
          />

          <select
            id="usuario-role"
            value={form.role}
            onChange={(event) => onChange("role", event.target.value as Role)}
            className="w-full appearance-none rounded-lg border border-slate-300 bg-white py-3 pl-10 pr-4 text-sm outline-none transition focus:border-slate-700 focus:ring-2 focus:ring-slate-200"
          >
            {ROLES.map((role) => (
              <option key={role} value={role}>
                {role}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label
          htmlFor="usuario-senha"
          className="mb-2 block text-sm font-medium text-slate-700"
        >
          Senha
          {editando && (
            <span className="ml-1 text-xs font-normal text-slate-400">
              (deixe em branco para manter)
            </span>
          )}
        </label>

        <input
          id="usuario-senha"
          autoComplete="new-password"
          type="password"
          value={form.senha}
          onChange={(event) => onChange("senha", event.target.value)}
          placeholder={editando ? "••••••••" : "Digite uma senha"}
          className="w-full rounded-lg border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-slate-700 focus:ring-2 focus:ring-slate-200"
        />
      </div>

      <label className="flex cursor-pointer items-center gap-3">
        <input
          type="checkbox"
          checked={form.ativo}
          onChange={(event) => onChange("ativo", event.target.checked)}
          className="h-4 w-4 rounded border-slate-300"
        />

        <span className="text-sm text-slate-700">Usuário ativo</span>
      </label>

      <div className="flex justify-end gap-3 border-t border-slate-100 pt-5">
        <button
          type="submit"
          disabled={salvando}
          className="inline-flex items-center justify-center rounded-lg bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {salvando
            ? "Salvando..."
            : editando
              ? "Salvar alterações"
              : "Criar usuário"}
        </button>
      </div>
    </form>
  );
}
