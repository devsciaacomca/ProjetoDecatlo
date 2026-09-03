import { Pencil, Trash2 } from "lucide-react";

import type { Usuario } from "@/types/usuarios";

interface UsuariosTabelaProps {
  usuarios: Usuario[];
  excluindoId: number | null;
  onEditar: (usuario: Usuario) => void;
  onExcluir: (id: number) => void;
  onAlternarStatus: (usuario: Usuario) => void;
}

export function UsuariosTabela({
  usuarios,
  excluindoId,
  onEditar,
  onExcluir,
  onAlternarStatus,
}: UsuariosTabelaProps) {
  if (usuarios.length === 0) {
    return (
      <div className="px-6 py-12 text-center">
        <p className="text-sm font-medium text-slate-700">
          Nenhum usuário encontrado
        </p>

        <p className="mt-1 text-xs text-slate-500">
          Tente alterar os termos da pesquisa.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[800px]">
        <thead className="bg-slate-50">
          <tr className="border-b border-slate-200 text-left">
            <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
              Usuário
            </th>

            <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
              NIP
            </th>

            <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
              Perfil
            </th>

            <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
              Status
            </th>

            <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">
              Ações
            </th>
          </tr>
        </thead>

        <tbody className="divide-y divide-slate-100">
          {usuarios.map((usuario) => (
            <tr key={usuario.id} className="transition hover:bg-slate-50">
              <td className="px-6 py-4">
                <div>
                  <p className="text-sm font-semibold text-slate-800">
                    {usuario.nome}
                  </p>

                  <p className="mt-1 text-xs text-slate-500">{usuario.email}</p>
                </div>
              </td>

              <td className="px-6 py-4">
                <span className="text-sm text-slate-600">{usuario.nip}</span>
              </td>

              <td className="px-6 py-4">
                <span className="inline-flex rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
                  {usuario.role}
                </span>
              </td>

              <td className="px-6 py-4">
                <button
                  type="button"
                  onClick={() => onAlternarStatus(usuario)}
                  className={
                    usuario.ativo
                      ? "inline-flex rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700"
                      : "inline-flex rounded-full bg-red-100 px-3 py-1 text-xs font-semibold text-red-700"
                  }
                >
                  {usuario.ativo ? "Ativo" : "Inativo"}
                </button>
              </td>

              <td className="px-6 py-4">
                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => onEditar(usuario)}
                    className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-500 transition hover:border-slate-300 hover:bg-slate-100 hover:text-slate-800"
                    aria-label={`Editar ${usuario.nome}`}
                  >
                    <Pencil size={16} />
                  </button>

                  <button
                    type="button"
                    onClick={() => onExcluir(usuario.id)}
                    disabled={excluindoId === usuario.id}
                    className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-red-200 text-red-500 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                    aria-label={`Excluir ${usuario.nome}`}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
