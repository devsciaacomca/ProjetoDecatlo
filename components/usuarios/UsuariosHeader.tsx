import { Plus } from "lucide-react";

interface UsuariosHeaderProps {
  onNovoUsuario: () => void;
}

export function UsuariosHeader({ onNovoUsuario }: UsuariosHeaderProps) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 className="text-xl font-semibold sm:text-2xl">Usuários</h1>

        <p className="mt-1 text-sm text-slate-500">
          Gerencie os usuários, seus perfis e permissões de acesso ao sistema.
        </p>
      </div>

      <button
        type="button"
        onClick={onNovoUsuario}
        className="inline-flex items-center justify-center gap-2 rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800"
      >
        <Plus size={18} />
        Novo usuário
      </button>
    </div>
  );
}
