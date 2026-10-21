"use client";

import Link from "next/link";
import { ArrowLeft, Cpu, Monitor, Radio } from "lucide-react";
import QuizMachineSimulator from "@/components/quiz-machine/QuizMachineSimulator";

export default function PublicQuizMachinePage() {
  return (
    <main className="min-h-screen bg-slate-950 p-4 sm:p-6 lg:p-8 text-white">
      <div className="mx-auto w-full max-w-5xl">
        <header className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-slate-800 pb-4">
          <div>
            <Link
              href="/"
              className="mb-2 inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white"
            >
              <ArrowLeft size={16} />
              Voltar ao início
            </Link>
            <div className="flex items-center gap-2.5">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-yellow-500/20 text-yellow-400 ring-1 ring-yellow-500/40">
                <Cpu size={22} />
              </div>
              <div>
                <h1 className="text-xl font-bold sm:text-2xl">
                  Máquina de Quiz (Console de Operação)
                </h1>
                <p className="text-sm text-slate-400">
                  Interface de palco para Arduino USB Serial e Simulador Virtual
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/telao/demo"
              target="_blank"
              className="inline-flex items-center gap-2 rounded-lg border border-slate-700 bg-slate-900 px-4 py-2.5 text-sm font-semibold hover:bg-slate-800 text-white"
            >
              <Monitor size={17} />
              Abrir Telão
            </Link>
          </div>
        </header>

        {/* SIMULADOR */}
        <section className="mb-6">
          <QuizMachineSimulator
            equipe1Nome="Equipe Alfa 1"
            equipe2Nome="Equipe Alfa 2"
          />
        </section>
      </div>
    </main>
  );
}
