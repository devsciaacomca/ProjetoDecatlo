"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import {
  ArrowLeft,
  Gamepad2,
  Monitor,
  Settings,
  Play,
  Clock3,
  ListChecks,
  Users,
  Trophy,
  AlertCircle,
} from "lucide-react";
import { useEffect, useState } from "react";

type Partida = {
  id: string;
  nome: string;
  equipe1: string;
  equipe2: string;
  status: string;
  perguntas: number;
  perguntaAtual: number;
  pontuacaoEquipeA: number;
  pontuacaoEquipeB: number;
  tempoResposta: number;
  mostrarExplicacao: boolean;
  permitirPular: boolean;
  equipeDaVez: string;
  tempoRestante: number;
  respostaVisivel: boolean;
  data: string;
  perguntasSelecionadas: Array<{
    ordem: number;
    perguntaId: number;
    pergunta: {
      id: number;
      assunto: string;
      tipo: string;
      enunciado: string;
      respostaCorreta: string;
      explicacao: string;
      alternativas: Array<{
        id: number;
        texto: string;
      }>;
    };
  }>;
};

const statusConfig: Record<string, { label: string; className: string }> = {
  configuracao: {
    label: "Em configuração",
    className: "bg-slate-100 text-slate-600",
  },
  pronta: {
    label: "Pronta",
    className: "bg-amber-100 text-amber-700",
  },
  em_andamento: {
    label: "Em andamento",
    className: "bg-green-100 text-green-700",
  },
  pausada: {
    label: "Pausada",
    className: "bg-amber-100 text-amber-700",
  },
  finalizada: {
    label: "Finalizada",
    className: "bg-blue-100 text-blue-700",
  },
};

export default function PartidaPage() {
  const params = useParams<{ id: string }>();
  const id = params?.id;

  const [partida, setPartida] = useState<Partida | null>(null);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");

  useEffect(() => {
    if (!id) return;

    let ativo = true;

    async function carregarPartida() {
      try {
        setCarregando(true);
        setErro("");

        const response = await fetch(`/api/partidas/${id}`, {
          cache: "no-store",
        });

        const resultado = await response.json();

        if (!response.ok || !resultado.success) {
          throw new Error(
            resultado.error || "Não foi possível carregar a partida.",
          );
        }

        if (ativo) {
          setPartida(resultado.data);
        }
      } catch (error) {
        if (ativo) {
          setErro(
            error instanceof Error
              ? error.message
              : "Não foi possível carregar a partida.",
          );
        }
      } finally {
        if (ativo) {
          setCarregando(false);
        }
      }
    }

    carregarPartida();

    return () => {
      ativo = false;
    };
  }, [id]);

  if (carregando) {
    return null;
  }

  if (erro || !partida) {
    return (
      <main className="flex-1 p-4 sm:p-6 lg:p-8">
        <div className="mx-auto max-w-3xl rounded-xl border border-red-200 bg-white p-8 text-center shadow-sm">
          <AlertCircle className="mx-auto text-red-500" size={36} />
          <h1 className="mt-4 text-lg font-semibold">
            Não foi possível carregar a partida
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            {erro || "A partida não foi encontrada."}
          </p>
          <Link
            href="/dashboard/partidas"
            className="mt-6 inline-flex items-center gap-2 rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-slate-800"
          >
            <ArrowLeft size={16} />
            Voltar para partidas
          </Link>
        </div>
      </main>
    );
  }

  const status = statusConfig[partida.status] ?? {
    label: partida.status,
    className: "bg-slate-100 text-slate-600",
  };

  return (
    <main className="flex-1 p-4 sm:p-6 lg:p-8">
      <div className="mx-auto w-full max-w-6xl">
        <div className="mb-6">
          <Link
            href="/dashboard/partidas"
            className="mb-4 inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-900"
          >
            <ArrowLeft size={16} />
            Voltar para partidas
          </Link>

          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="text-xl font-semibold sm:text-2xl">
                  {partida.nome}
                </h1>

                <span
                  className={`rounded-full px-3 py-1 text-xs font-semibold ${status.className}`}
                >
                  {status.label}
                </span>
              </div>

              <p className="mt-1 text-sm text-slate-500">
                Gerencie e acompanhe esta partida.
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              <Link
                href={`/dashboard/partidas/${partida.id}/controle`}
                className="inline-flex items-center gap-2 rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-slate-800"
              >
                <Gamepad2 size={17} />
                Controle
              </Link>

              <Link
                href={`/telao/${partida.id}`}
                target="_blank"
                className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
              >
                <Monitor size={17} />
                Abrir telão
              </Link>
            </div>
          </div>
        </div>

        <section className="rounded-xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-200 px-6 py-5">
            <div className="flex items-center gap-2">
              <Trophy size={18} />
              <h2 className="font-semibold">Placar</h2>
            </div>
            <p className="mt-1 text-sm text-slate-500">
              Pontuação atual das equipes.
            </p>
          </div>

          <div className="grid divide-y sm:grid-cols-2 sm:divide-x sm:divide-y-0">
            <div className="p-8 text-center">
              <p className="text-sm text-slate-500">{partida.equipe1}</p>
              <p className="mt-2 text-5xl font-bold">
                {partida.pontuacaoEquipeA}
              </p>
              <p className="mt-2 text-xs text-slate-400">pontos</p>
            </div>

            <div className="p-8 text-center">
              <p className="text-sm text-slate-500">{partida.equipe2}</p>
              <p className="mt-2 text-5xl font-bold">
                {partida.pontuacaoEquipeB}
              </p>
              <p className="mt-2 text-xs text-slate-400">pontos</p>
            </div>
          </div>
        </section>

        <section className="mt-6">
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex items-center gap-2 text-slate-500">
                <Users size={18} />
                <span className="text-sm">Equipes</span>
              </div>
              <p className="mt-3 font-semibold">
                {partida.equipe1} × {partida.equipe2}
              </p>
            </div>

            <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex items-center gap-2 text-slate-500">
                <ListChecks size={18} />
                <span className="text-sm">Perguntas</span>
              </div>
              <p className="mt-3 font-semibold">
                {partida.perguntaAtual} / {partida.perguntas}
              </p>
            </div>

            <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex items-center gap-2 text-slate-500">
                <Clock3 size={18} />
                <span className="text-sm">Tempo</span>
              </div>
              <p className="mt-3 font-semibold">
                {partida.tempoResposta} segundos
              </p>
            </div>

            <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex items-center gap-2 text-slate-500">
                <Settings size={18} />
                <span className="text-sm">Configurações</span>
              </div>
              <p className="mt-3 text-sm font-semibold">
                {partida.mostrarExplicacao
                  ? "Explicação ativada"
                  : "Explicação desativada"}
              </p>
              <p className="mt-1 text-xs text-slate-400">
                {partida.permitirPular
                  ? "Pode pular perguntas"
                  : "Não pode pular perguntas"}
              </p>
            </div>
          </div>
        </section>

        <section className="mt-6 rounded-xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-200 px-6 py-5">
            <h2 className="font-semibold">Perguntas da partida</h2>
            <p className="mt-1 text-sm text-slate-500">
              Perguntas selecionadas e ordenadas no momento da criação.
            </p>
          </div>

          <div className="divide-y divide-slate-100">
            {partida.perguntasSelecionadas.map((item) => (
              <div
                key={`${item.perguntaId}-${item.ordem}`}
                className="p-5"
              >
                <div className="flex gap-4">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-sm font-bold">
                    {item.ordem}
                  </span>

                  <div className="min-w-0">
                    <div className="flex flex-wrap gap-2">
                      <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600">
                        {item.pergunta.assunto}
                      </span>
                      <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600">
                        {item.pergunta.tipo}
                      </span>
                    </div>

                    <p className="mt-2 font-medium leading-6">
                      {item.pergunta.enunciado}
                    </p>

                    {item.pergunta.tipo === "objetiva" &&
                      item.pergunta.alternativas.length > 0 && (
                        <div className="mt-3 grid gap-2 sm:grid-cols-2">
                          {item.pergunta.alternativas.map(
                            (alternativa, index) => (
                              <div
                                key={alternativa.id}
                                className="rounded-lg border border-slate-200 px-3 py-2 text-sm"
                              >
                                <span className="mr-2 font-semibold">
                                  {String.fromCharCode(65 + index)}.
                                </span>
                                {alternativa.texto}
                              </div>
                            ),
                          )}
                        </div>
                      )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {partida.status === "pronta" && (
          <section className="mt-6 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="font-semibold">Partida pronta</h2>
                <p className="mt-1 text-sm text-slate-500">
                  A partida possui {partida.perguntas} perguntas selecionadas
                  e está pronta para execução.
                </p>
              </div>

              <Link
                href={`/dashboard/partidas/${partida.id}/controle`}
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-slate-900 px-5 py-3 text-sm font-semibold text-white hover:bg-slate-800"
              >
                <Play size={18} />
                Iniciar partida
              </Link>
            </div>
          </section>
        )}
      </div>
    </main>
  );
}
