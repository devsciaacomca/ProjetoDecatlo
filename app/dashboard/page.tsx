"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import {
  ClipboardList,
  Gamepad2,
  List,
  Monitor,
  Plus,
  Users,
} from "lucide-react";
import { useUser } from "@/contexts/UserContext";

interface DashboardData {
  estatisticas: {
    totalPerguntas: number;
    totalPartidas: number;
    partidasEmAndamento: number;
    partidasFinalizadas: number;
    totalUsuarios: number;
  };
  ultimaPartida: {
    id: string;
    nome: string;
    equipe1: string;
    equipe2: string;
    status: string;
    perguntaAtual: number;
    perguntas: number;
    data: string;
  } | null;
  partidaEmAndamento: {
    id: string;
    nome: string;
    equipe1: string;
    equipe2: string;
    status: string;
    perguntaAtual: number;
    perguntas: number;
    pontuacaoEquipeA: number;
    pontuacaoEquipeB: number;
    tempoRestante: number;
    equipeDaVez: string;
  } | null;
}

export default function DashboardPage() {
  const { user } = useUser();
  const [dados, setDados] = useState<DashboardData | null>(null);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");

  const permissions = user?.permissions ?? [];
  const podeGerenciarPartidas = permissions.includes("jogo.configurar");
  const podeControlarPartida = permissions.includes("jogo.gerenciar");
  const podeGerenciarPerguntas = permissions.includes("perguntas.gerenciar");
  const podeAbrirTelao = permissions.includes("telao.abrir");

  const carregar = useCallback(async () => {
    try {
      setErro("");
      const response = await fetch("/api/dashboard", {
        cache: "no-store",
      });

      const json = await response.json();

      if (!response.ok || !json.success) {
        throw new Error(json.error ?? "Não foi possível carregar o dashboard.");
      }

      setDados(json.data);
    } catch (error) {
      setErro(error instanceof Error ? error.message : "Erro ao carregar dashboard.");
    } finally {
      setCarregando(false);
    }
  }, []);

  useEffect(() => {
    carregar();
  }, [carregar]);

  useEffect(() => {
    const interval = window.setInterval(carregar, 15000);
    return () => window.clearInterval(interval);
  }, [carregar]);

  const partida = dados?.partidaEmAndamento;

  const stats = dados
    ? [
        ["Perguntas cadastradas", dados.estatisticas.totalPerguntas, "Banco de perguntas"],
        ["Partidas", dados.estatisticas.totalPartidas, "Total registrado"],
        ["Em andamento", dados.estatisticas.partidasEmAndamento, "Partidas ativas"],
        ["Usuários ativos", dados.estatisticas.totalUsuarios, "Usuários habilitados"],
      ]
    : [];

  return (
    <main className="flex-1 p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl">
        <h1 className="text-2xl font-bold">Visão geral</h1>
        <p className="mt-1 text-sm text-slate-500">
          Dados atualizados diretamente do banco de dados.
        </p>

        {erro && (
          <div className="mt-6 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {erro}
          </div>
        )}

        {podeGerenciarPartidas && (
          <section className="mt-6 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-slate-100">
                  <Gamepad2 size={24} />
                </div>
                <div>
                  <h2 className="text-lg font-semibold">Partidas</h2>
                  <p className="mt-1 max-w-xl text-sm leading-6 text-slate-500">
                    Crie e configure uma nova partida, defina equipes,
                    perguntas e regras antes de iniciar.
                  </p>
                </div>
              </div>

              <Link
                href="/dashboard/partidas/nova"
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-slate-900 px-5 py-3 text-sm font-semibold text-white hover:bg-slate-800"
              >
                <Plus size={18} />
                Nova partida
              </Link>
            </div>
          </section>
        )}

        <section className="mt-6 rounded-xl border border-slate-200 bg-white shadow-sm">
          {carregando ? (
            <div className="px-6 py-10 text-center text-sm text-slate-500">
              Carregando partida atual...
            </div>
          ) : partida ? (
            <div className="px-6 py-6">
              <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-full bg-green-500" />
                    <span className="text-xs font-semibold uppercase tracking-wide text-green-700">
                      Em andamento
                    </span>
                  </div>

                  <h3 className="mt-2 text-lg font-semibold">{partida.nome}</h3>

                  <p className="mt-1 text-sm text-slate-500">
                    {partida.equipe1} × {partida.equipe2}
                  </p>

                  <p className="mt-2 text-xs text-slate-400">
                    Pergunta {partida.perguntaAtual} de {partida.perguntas}
                    {" · "}
                    Placar {partida.pontuacaoEquipeA} × {partida.pontuacaoEquipeB}
                  </p>
                </div>

                <div className="flex flex-col gap-2 sm:flex-row">
                  {podeControlarPartida && (
                    <Link
                      href={`/dashboard/partidas/${partida.id}/controle`}
                      className="inline-flex items-center justify-center gap-2 rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white"
                    >
                      <Gamepad2 size={17} />
                      Controlar partida
                    </Link>
                  )}

                  {podeAbrirTelao && (
                    <Link
                      href={`/telao/${partida.id}`}
                      target="_blank"
                      className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-700"
                    >
                      <Monitor size={17} />
                      Abrir telão
                    </Link>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="px-6 py-10 text-center">
              <Gamepad2 size={30} className="mx-auto text-slate-300" />
              <p className="mt-3 text-sm font-medium">
                Nenhuma partida em andamento
              </p>
              <Link
                href="/dashboard/partidas"
                className="mt-4 inline-flex items-center gap-2 text-sm font-semibold hover:underline"
              >
                <List size={16} />
                Ver partidas
              </Link>
            </div>
          )}
        </section>

        <section className="mt-8">
          <h2 className="mb-4 text-lg font-semibold">Acesso rápido</h2>

          <div className="grid gap-5 md:grid-cols-3">
            {podeGerenciarPartidas && (
              <Link
                href="/dashboard/partidas"
                className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md"
              >
                <List size={21} />
                <h3 className="mt-5 font-semibold">Partidas</h3>
                <p className="mt-2 text-sm text-slate-500">
                  Consulte partidas criadas, em andamento e finalizadas.
                </p>
              </Link>
            )}

            {podeGerenciarPerguntas && (
              <Link
                href="/dashboard/gerenciamento-perguntas"
                className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md"
              >
                <ClipboardList size={21} />
                <h3 className="mt-5 font-semibold">Banco de perguntas</h3>
                <p className="mt-2 text-sm text-slate-500">
                  Cadastre e gerencie as perguntas utilizadas nas partidas.
                </p>
              </Link>
            )}

            {podeAbrirTelao && partida && (
              <Link
                href={`/telao/${partida.id}`}
                target="_blank"
                className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md"
              >
                <Monitor size={21} />
                <h3 className="mt-5 font-semibold">Telão</h3>
                <p className="mt-2 text-sm text-slate-500">
                  Abra a apresentação da partida atual.
                </p>
              </Link>
            )}
          </div>
        </section>

        <section className="mt-8">
          <h2 className="mb-4 text-lg font-semibold">Estatísticas</h2>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {carregando
              ? Array.from({ length: 4 }).map((_, index) => (
                  <div
                    key={index}
                    className="h-28 animate-pulse rounded-xl border border-slate-200 bg-slate-100"
                  />
                ))
              : stats.map(([label, value, description]) => (
                  <div
                    key={label}
                    className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
                  >
                    <p className="text-sm text-slate-500">{label}</p>
                    <p className="mt-2 text-3xl font-bold">{value}</p>
                    <p className="mt-2 text-xs text-slate-400">{description}</p>
                  </div>
                ))}
          </div>
        </section>

        {dados?.ultimaPartida && (
          <section className="mt-8 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center gap-3">
              <Users size={20} />
              <div>
                <h2 className="font-semibold">Última partida registrada</h2>
                <p className="text-sm text-slate-500">
                  {dados.ultimaPartida.nome} · {dados.ultimaPartida.equipe1} ×{" "}
                  {dados.ultimaPartida.equipe2}
                </p>
              </div>
            </div>
          </section>
        )}
      </div>
    </main>
  );
}
