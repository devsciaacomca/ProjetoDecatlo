import { X } from "lucide-react";

import { UsuarioForm } from "./UsuarioForm";

import type { Usuario, UsuarioForm as UsuarioFormData } from "@/types/usuarios";

interface UsuarioModalProps {
  aberto: boolean;
  usuario: Usuario | null;
  form: UsuarioFormData;
  salvando: boolean;
  erro: string | null;
  onClose: () => void;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  onChange: <K extends keyof UsuarioFormData>(
    campo: K,
    valor: UsuarioFormData[K],
  ) => void;
}

export function UsuarioModal({
  aberto,
  usuario,
  form,
  salvando,
  erro,
  onClose,
  onSubmit,
  onChange,
}: UsuarioModalProps) {
  if (!aberto) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 p-4">
      <div
        className="w-full max-w-lg overflow-hidden rounded-xl bg-white shadow-xl"
        role="dialog"
        aria-modal="true"
        aria-labelledby="usuario-modal-titulo"
      >
        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
          <div>
            <h2 id="usuario-modal-titulo" className="font-semibold">
              {usuario ? "Editar usuário" : "Novo usuário"}
            </h2>

            <p className="mt-1 text-xs text-slate-500">
              {usuario
                ? "Atualize os dados do usuário."
                : "Cadastre um novo usuário no sistema."}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={salvando}
            className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
            aria-label="Fechar"
          >
            <X size={20} />
          </button>
        </div>

        <div className="max-h-[80vh] overflow-y-auto p-5">
          {erro && (
            <div className="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3">
              <p className="text-sm text-red-700">{erro}</p>
            </div>
          )}

          <UsuarioForm
            form={form}
            editando={Boolean(usuario)}
            salvando={salvando}
            onSubmit={onSubmit}
            onChange={onChange}
          />
        </div>
      </div>
    </div>
  );
}
