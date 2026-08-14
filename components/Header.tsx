"use client";

import Link from "next/link";
import { Menu } from "lucide-react";

interface HeaderProps {
  onMenuClick: () => void;
}

export default function Header({ onMenuClick }: HeaderProps) {
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
            S
          </div>

          <div className="hidden text-left sm:block">
            <p className="text-sm font-semibold text-slate-900">Samuel</p>

            <p className="text-xs text-slate-500">Administrador</p>
          </div>
        </Link>
      </div>
    </header>
  );
}
