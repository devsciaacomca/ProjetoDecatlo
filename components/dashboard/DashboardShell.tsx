"use client";

import { useState } from "react";

import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import Footer from "@/components/Footer";

interface DashboardUser {
  id: string;
  nome?: string | null;
  name?: string | null;
  email?: string | null;
  nip?: string | null;
  role?: string | null;
}

interface DashboardShellProps {
  children: React.ReactNode;
  user: DashboardUser;
}

export default function DashboardShell({
  children,
  user,
}: DashboardShellProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <main className="min-h-screen bg-slate-100 text-slate-900">
      <div className="flex min-h-screen">
        <Sidebar
          user={user}
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />

        <section className="flex min-w-0 flex-1 flex-col">
          <Header user={user} onMenuClick={() => setSidebarOpen(true)} />

          <main className="flex-1">{children}</main>

          <Footer />
        </section>
      </div>
    </main>
  );
}
