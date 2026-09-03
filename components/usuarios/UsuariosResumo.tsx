import { Users } from "lucide-react";

import type { Usuario } from "@/types/usuarios";

interface UsuariosResumoProps {
  usuarios: Usuario[];
  totalUsuarios: number;
  carregando: boolean;
}

function Skeleton() {
  return (
    <span className="inline-block h-7 w-12 animate-pulse rounded bg-slate-200" />
  );
}

export function UsuariosResumo({
  usuarios,
  totalUsuarios,
  carregando,
}: UsuariosResumoProps) {
  const usuariosAtivos = usuarios.filter((usuario) => usuario.ativo).length;

  const administradores = usuarios.filter(
    (usuario) => usuario.role === "Administrador",
  ).length;

  return (
    <div className="mt-6 grid gap-4 sm:grid-cols-3">
      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100">
            <Users size={20} />
          </div>

          <div>
            <p className="text-xs text-slate-500">Total de usuários</p>

            <p className="text-2xl font-bold">
              {carregando ? <Skeleton /> : totalUsuarios}
            </p>
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <p className="text-xs text-slate-500">Usuários ativos</p>

        <p className="mt-1 text-2xl font-bold">
          {carregando ? <Skeleton /> : usuariosAtivos}
        </p>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <p className="text-xs text-slate-500">Administradores</p>

        <p className="mt-1 text-2xl font-bold">
          {carregando ? <Skeleton /> : administradores}
        </p>
      </div>
    </div>
  );
}
