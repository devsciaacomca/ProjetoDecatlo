"use client";

import { useState } from "react";
import Link from "next/link";

// components
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import Footer from "@/components/Footer";

// Data
import { dashboardActivities } from "@/data/dashboard/activities";
import { dashboardFeatures } from "@/data/dashboard/features";
import { dashboardStats } from "@/data/dashboard/stats";

export default function DashboardPage() {
  // este estado está se repetindo em todas paginas que usam o header e sidebar, podemos criar um contexto para ele.
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <main className="min-h-screen bg-slate-100 text-slate-900">
      <div className="flex min-h-screen">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

        <section className="flex min-w-0 flex-1 flex-col">
          <Header onMenuClick={() => setSidebarOpen(true)} />

          <main className="flex-1 p-4 sm:p-6 lg:p-8">
            <div className="mx-auto max-w-7xl">
              {/* Estatísticas */}
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                {dashboardStats.map((stat) => (
                  <div
                    key={stat.label}
                    className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
                  >
                    <p className="text-sm text-slate-500">{stat.label}</p>

                    <p className="mt-2 text-3xl font-bold">{stat.value}</p>

                    <p className="mt-2 text-xs text-slate-400">
                      {stat.description}
                    </p>
                  </div>
                ))}
              </div>

              {/* Ações principais */}
              <div className="mt-8">
                <div className="mb-4">
                  <h3 className="text-lg font-semibold">Funcionalidades</h3>

                  <p className="mt-1 text-sm text-slate-500">
                    Acesse as principais áreas do sistema.
                  </p>
                </div>

                <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                  {dashboardFeatures.map((feature) => (
                    <Link
                      key={feature.href}
                      href={feature.href}
                      target={feature.target}
                      className="group rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md"
                    >
                      <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-lg bg-slate-100 text-xl">
                        {feature.icon}
                      </div>

                      <h4 className="font-semibold">{feature.title}</h4>

                      <p className="mt-2 text-sm leading-6 text-slate-500">
                        {feature.description}
                      </p>

                      <p className="mt-5 text-sm font-semibold">
                        {feature.action}
                      </p>
                    </Link>
                  ))}
                </div>
              </div>

              {/* Atividade recente */}
              <div className="mt-8 rounded-xl border border-slate-200 bg-white shadow-sm">
                <div className="border-b border-slate-200 px-6 py-5">
                  <h3 className="font-semibold">Atividade recente</h3>

                  <p className="mt-1 text-sm text-slate-500">
                    Últimas ações realizadas no sistema.
                  </p>
                </div>

                <div className="divide-y divide-slate-100">
                  {dashboardActivities.map((activity) => (
                    <div
                      key={`${activity.title}-${activity.time}`}
                      className="flex items-center justify-between px-6 py-4"
                    >
                      <div>
                        <p className="text-sm font-medium">{activity.title}</p>

                        <p className="mt-1 text-xs text-slate-500">
                          {activity.description}
                        </p>
                      </div>

                      <span className="text-xs text-slate-400">
                        {activity.time}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </main>

          <Footer />
        </section>
      </div>
    </main>
  );
}
