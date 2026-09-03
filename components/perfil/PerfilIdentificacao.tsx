import { Shield, User } from "lucide-react";

import type { DashboardUser } from "@/types/dashboard";

interface PerfilIdentificacaoProps {
  user: DashboardUser | null;
}

export function PerfilIdentificacao({ user }: PerfilIdentificacaoProps) {
  return (
    <section className="rounded-xl border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-200 px-5 py-5">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100">
            <User size={20} className="text-slate-600" />
          </div>

          <div>
            <h2 className="font-semibold">Minha conta</h2>

            <p className="text-xs text-slate-500">Informações de acesso</p>
          </div>
        </div>
      </div>

      <div className="space-y-5 p-5">
        <div>
          <p className="text-xs text-slate-500">Nome</p>

          <p className="mt-1 text-sm font-medium">
            {user?.nome ?? user?.name ?? "Não informado"}
          </p>
        </div>

        <div>
          <p className="text-xs text-slate-500">E-mail</p>

          <p className="mt-1 break-all text-sm font-medium">
            {user?.email ?? "Não informado"}
          </p>
        </div>

        <div>
          <p className="text-xs text-slate-500">NIP</p>

          <p className="mt-1 text-sm font-medium">
            {user?.nip ?? "Não informado"}
          </p>
        </div>

        <div>
          <p className="text-xs text-slate-500">Função</p>

          <div className="mt-2 inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1.5">
            <Shield size={14} />

            <span className="text-xs font-semibold">
              {user?.role ?? "Usuário"}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
