"use client";

import { Menu } from "lucide-react";
import { useSession } from "next-auth/react";
import Link from "next/link";

interface HeaderProps {
  onMenuClick: () => void;
}

export default function Header({ onMenuClick }: HeaderProps) {
  const { data: session } = useSession();
  const nome = session?.user?.nome ?? "Usuário";
  const role = session?.user?.role ?? "";
  const inicial = nome.trim().charAt(0).toUpperCase() || "?";

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200 bg-white">
      <div className="flex h-20 items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Menu mobile + título */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onMenuClick}
            className="rounded-lg p-2 text-slate-600 transition hover:bg-slate-100 lg:hidden"
            aria-label="Abrir menu"
          >
            <Menu size={24} />
          </button>

          <div>
            <h2 className="text-lg font-semibold text-slate-900 sm:text-xl">
              Dashboard
            </h2>

            <p className="hidden text-sm text-slate-500 sm:block">
              Visão geral do Sistema de Arguição
            </p>
          </div>
        </div>

        {/* Usuário */}
        <Link
          href="/dashboard/perfil"
          className="flex items-center gap-3 rounded-lg px-2 py-2 transition hover:bg-slate-100"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-800 text-sm font-semibold text-white">
            {inicial}
          </div>

          <div className="hidden text-left sm:block">
            <p className="text-sm font-semibold text-slate-900">{nome}</p>

            {role ? <p className="text-xs text-slate-500">{role}</p> : null}
          </div>
        </Link>
      </div>
    </header>
  );
}
