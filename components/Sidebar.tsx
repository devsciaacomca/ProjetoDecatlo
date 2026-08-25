"use client";

import {
  ClipboardList,
  History,
  LayoutDashboard,
  List,
  LogOut,
  Monitor,
  PlayCircle,
  PlusCircle,
  Users,
  X,
} from "lucide-react";
import { signOut } from "next-auth/react";
import Link from "next/link";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const menuSections = [
  {
    title: "Menu principal",
    items: [
      {
        href: "/dashboard",
        label: "Visão geral",
        icon: LayoutDashboard,
      },
    ],
  },
  {
    title: "Partidas",
    items: [
      {
        href: "/dashboard/partidas/nova",
        label: "Nova partida",
        icon: PlusCircle,
      },
      {
        href: "/dashboard/partidas",
        label: "Partidas",
        icon: List,
      },
      {
        href: "/dashboard/partidas/em-andamento",
        label: "Partida em andamento",
        icon: PlayCircle,
      },
    ],
  },
  {
    title: "Banco de perguntas",
    items: [
      {
        href: "/dashboard/gerenciamento-perguntas",
        label: "Perguntas",
        icon: ClipboardList,
      },
    ],
  },
  {
    title: "Administração",
    items: [
      {
        href: "/dashboard/usuarios",
        label: "Usuários",
        icon: Users,
      },
      {
        href: "/dashboard/auditoria",
        label: "Auditoria",
        icon: History,
      },
    ],
  },
];

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  return (
    <>
      {isOpen && (
        <button
          type="button"
          aria-label="Fechar menu"
          onClick={onClose}
          className="fixed inset-0 z-40 bg-black/40 lg:hidden"
        />
      )}

      <aside
        className={`
          fixed inset-y-0 left-0 z-50 flex w-72 flex-col
          bg-slate-950 text-white
          transition-transform duration-300
          lg:static lg:z-auto lg:translate-x-0
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        <div className="flex h-20 items-center justify-between border-b border-slate-800 px-6">
          <Link href="/" onClick={onClose}>
            <p className="text-xl font-bold tracking-widest">DECATLO</p>

            <p className="mt-1 text-xs text-slate-400">Sistema de Arguição</p>
          </Link>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-slate-400 hover:bg-slate-800 hover:text-white lg:hidden"
            aria-label="Fechar menu"
          >
            <X size={22} />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto px-4 py-6">
          {menuSections.map((section) => (
            <div key={section.title} className="mb-7">
              <p className="mb-3 px-3 text-xs font-semibold uppercase tracking-wider text-slate-500">
                {section.title}
              </p>

              <div className="space-y-1">
                {section.items.map((item) => {
                  const Icon = item.icon;

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={onClose}
                      className="flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium text-slate-300 transition hover:bg-slate-800 hover:text-white"
                    >
                      <Icon size={19} strokeWidth={1.8} />

                      <span>{item.label}</span>
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}

          <div className="border-t border-slate-800 pt-6">
            <p className="mb-3 px-3 text-xs font-semibold uppercase tracking-wider text-slate-500">
              Apresentação
            </p>

            <Link
              href="/dashboard/telao/123456"
              target="_blank"
              className="flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium text-slate-300 transition hover:bg-slate-800 hover:text-white"
            >
              <Monitor size={19} strokeWidth={1.8} />

              <span>Ver telão</span>
            </Link>
          </div>
        </nav>

        <div className="border-t border-slate-800 p-4">
          <button
            type="button"
            onClick={() => {
              onClose();
              void signOut({ callbackUrl: "/" });
            }}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-3 text-sm text-slate-400 transition hover:bg-slate-800 hover:text-white"
          >
            <LogOut size={18} />

            <span>Sair</span>
          </button>
        </div>
      </aside>
    </>
  );
}
