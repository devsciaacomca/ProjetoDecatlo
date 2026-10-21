"use client";

import Link from "next/link";
import { ArrowLeft, Cpu, Monitor, Radio, Sparkles } from "lucide-react";
import QuizMachineSimulator from "@/components/quiz-machine/QuizMachineSimulator";

export default function QuizMachinePage() {
  return (
    <main className="flex-1 p-4 sm:p-6 lg:p-8">
      <div className="mx-auto w-full max-w-5xl">
        <header className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <Link
              href="/dashboard"
              className="mb-2 inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-900"
            >
              <ArrowLeft size={16} />
              Voltar ao painel
            </Link>
            <div className="flex items-center gap-2.5">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-900 text-yellow-400">
                <Cpu size={22} />
              </div>
              <div>
                <h1 className="text-xl font-bold sm:text-2xl">
                  Central da Máquina de Quiz
                </h1>
                <p className="text-sm text-slate-500">
                  Gerenciamento de hardware serial (Arduino USB) e simulador virtual
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/telao/demo"
              target="_blank"
              className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold hover:bg-slate-50"
            >
              <Monitor size={17} />
              Abrir Telão Demo
            </Link>
          </div>
        </header>

        {/* SIMULADOR COMPLETO */}
        <section className="mb-8">
          <QuizMachineSimulator
            equipe1Nome="Equipe Alfa 1"
            equipe2Nome="Equipe Alfa 2"
          />
        </section>

        {/* INSTRUÇÕES E DIAGNÓSTICO */}
        <section className="grid gap-6 md:grid-cols-2">
          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="flex items-center gap-2 text-base font-bold text-slate-900">
              <Sparkles size={18} className="text-yellow-500" />
              Como Funciona a Integração
            </h2>
            <ul className="mt-3 space-y-2.5 text-sm text-slate-600">
              <li className="flex items-start gap-2">
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-slate-100 text-xs font-bold text-slate-700">
                  1
                </span>
                <span>
                  <strong>Hardware Físico:</strong> Conecte o Arduino com o código{" "}
                  <code>arduino_quiz.ino</code> via cabo USB. O servidor detecta
                  automaticamente a porta COM/TTY.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-slate-100 text-xs font-bold text-slate-700">
                  2
                </span>
                <span>
                  <strong>Simulação Virtual:</strong> Caso esteja sem o Arduino, clique
                  nos botões vermelhos e azuis acima ou use as teclas{" "}
                  <kbd className="rounded bg-slate-100 px-1 font-semibold">1</kbd> e{" "}
                  <kbd className="rounded bg-slate-100 px-1 font-semibold">2</kbd>.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-slate-100 text-xs font-bold text-slate-700">
                  3
                </span>
                <span>
                  <strong>Sincronização em Tempo Real:</strong> Quando um jogador bate,
                  o Telão toca o bipe característico (1000Hz ou 500Hz), trava o
                  outro jogador e define a equipe da vez automaticamente!
                </span>
              </li>
            </ul>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="flex items-center gap-2 text-base font-bold text-slate-900">
              <Radio size={18} className="text-blue-500" />
              Pinagem do Arduino Nano / Uno
            </h2>
            <div className="mt-3 space-y-2 text-xs">
              <div className="flex items-center justify-between rounded-lg border border-slate-100 bg-slate-50 p-2.5">
                <span className="font-semibold text-slate-700">Pino 2 (INPUT_PULLUP)</span>
                <span className="font-bold text-red-600">Botão Jogador 1 (Alfa 1)</span>
              </div>
              <div className="flex items-center justify-between rounded-lg border border-slate-100 bg-slate-50 p-2.5">
                <span className="font-semibold text-slate-700">Pino 3 (INPUT_PULLUP)</span>
                <span className="font-bold text-blue-600">Botão Jogador 2 (Alfa 2)</span>
              </div>
              <div className="flex items-center justify-between rounded-lg border border-slate-100 bg-slate-50 p-2.5">
                <span className="font-semibold text-slate-700">Pino 4 (INPUT_PULLUP)</span>
                <span className="font-bold text-amber-600">Botão Reset Físico</span>
              </div>
              <div className="flex items-center justify-between rounded-lg border border-slate-100 bg-slate-50 p-2.5">
                <span className="font-semibold text-slate-700">Pino 8 (OUTPUT)</span>
                <span className="font-bold text-emerald-600">LED Status da Máquina</span>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
