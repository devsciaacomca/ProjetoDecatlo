"use client";

import { useState } from "react";

import Footer from "@/components/Footer";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";

// este componente foi criado para ser utilizado em rotas que ainda estão em desenvolvimento, ela exibe uma mensagem informando que a página está em desenvolvimento e um botão para voltar ao dashboard.

export default function PaginaEmDesenvolvimento() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <main className="min-h-screen bg-slate-100 text-slate-900">
      <div className="flex min-h-screen">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

        <section className="flex min-w-0 flex-1 flex-col">
          <Header onMenuClick={() => setSidebarOpen(true)} />

          <main className="flex flex-1 items-center justify-center p-4 sm:p-6 lg:p-8">
            <div className="w-full max-w-2xl">
              <section className="rounded-xl border border-slate-200 bg-white p-8 text-center shadow-sm sm:p-12">
                {/* Ícone */}
                <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-slate-100">
                  <span className="text-2xl">⚙</span>
                </div>

                {/* Conteúdo */}
                <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                  Página em desenvolvimento
                </h1>

                <p className="mx-auto mt-3 max-w-lg text-sm leading-6 text-slate-500 sm:text-base">
                  Esta funcionalidade ainda está sendo desenvolvida e estará
                  disponível em breve.
                </p>

                {/* Status */}
                <div className="mt-6 inline-flex items-center gap-2 rounded-full bg-slate-100 px-4 py-2 text-sm font-medium text-slate-600">
                  <span className="h-2 w-2 rounded-full bg-slate-500" />
                  Em desenvolvimento
                </div>

                {/* Botão */}
                <div className="mt-8">
                  <a
                    href="/dashboard"
                    className="inline-flex rounded-lg bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
                  >
                    Voltar ao dashboard
                  </a>
                </div>
              </section>
            </div>
          </main>

          <Footer />
        </section>
      </div>
    </main>
  );
}
