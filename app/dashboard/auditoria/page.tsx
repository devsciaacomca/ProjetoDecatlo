"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  CheckCircle2,
  ClipboardList,
  History,
  LogIn,
  Pencil,
  PlayCircle,
  Search,
  Settings,
  Trash2,
  UserPlus,
} from "lucide-react";

interface Auditoria {
  id: string;
  usuario: string;
  nip: string;
  acao: string;
  entidade: string;
  entidadeId?: string;
  descricao: string;
  detalhes?: string;
  data: string;
}

interface ApiData {
  registros: Auditoria[];
  paginacao: {
    pagina: number;
    porPagina: number;
    total: number;
    totalPaginas: number;
  };
}

const acaoConfig: Record<
  string,
  { label: string; icon: typeof History; className: string }
> = {
  LOGIN: { label: "Login", icon: LogIn, className: "bg-slate-100 text-slate-700" },
  CRIACAO_USUARIO: { label: "Cadastro de usuário", icon: UserPlus, className: "bg-green-100 text-green-700" },
  EDICAO_USUARIO: { label: "Edição de usuário", icon: Pencil, className: "bg-blue-100 text-blue-700" },
  EXCLUSAO_USUARIO: { label: "Exclusão de usuário", icon: Trash2, className: "bg-red-100 text-red-700" },
  CRIACAO_PERGUNTA: { label: "Cadastro de pergunta", icon: ClipboardList, className: "bg-green-100 text-green-700" },
  EDICAO_PERGUNTA: { label: "Edição de pergunta", icon: Pencil, className: "bg-blue-100 text-blue-700" },
  EXCLUSAO_PERGUNTA: { label: "Exclusão de pergunta", icon: Trash2, className: "bg-red-100 text-red-700" },
  CRIACAO_PARTIDA: { label: "Criação de partida", icon: PlayCircle, className: "bg-green-100 text-green-700" },
  EDICAO_PARTIDA: { label: "Edição de partida", icon: Pencil, className: "bg-blue-100 text-blue-700" },
  INICIO_PARTIDA: { label: "Início de partida", icon: PlayCircle, className: "bg-green-100 text-green-700" },
  FINALIZACAO_PARTIDA: { label: "Finalização de partida", icon: CheckCircle2, className: "bg-blue-100 text-blue-700" },
  ALTERACAO_CONFIGURACAO: { label: "Alteração de configuração", icon: Settings, className: "bg-amber-100 text-amber-700" },
};

const fallbackConfig = {
  label: "Ação",
  icon: History,
  className: "bg-slate-100 text-slate-700",
};

function formatarData(data: string) {
  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(new Date(data));
}

export default function AuditoriaPage() {
  const [dados, setDados] = useState<ApiData | null>(null);
  const [busca, setBusca] = useState("");
  const [filtroAcao, setFiltroAcao] = useState("todas");
  const [pagina, setPagina] = useState(1);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");

  const carregar = useCallback(async () => {
    try {
      setCarregando(true);
      setErro("");

      const params = new URLSearchParams({
        pagina: String(pagina),
      });

      if (busca.trim()) params.set("busca", busca.trim());
      if (filtroAcao !== "todas") params.set("acao", filtroAcao);

      const response = await fetch(`/api/auditoria?${params.toString()}`, {
        cache: "no-store",
      });

      const json = await response.json();

      if (!response.ok || !json.success) {
        throw new Error(json.error ?? "Não foi possível carregar a auditoria.");
      }

      setDados(json.data);
    } catch (error) {
      setErro(error instanceof Error ? error.message : "Erro ao carregar auditoria.");
    } finally {
      setCarregando(false);
    }
  }, [busca, filtroAcao, pagina]);

  useEffect(() => {
    const timer = window.setTimeout(carregar, 250);
    return () => window.clearTimeout(timer);
  }, [carregar]);

  const acoes = useMemo(() => {
    const valores = new Set(
      (dados?.registros ?? []).map((registro) => registro.acao),
    );

    return Array.from(valores).sort();
  }, [dados]);

  const total = dados?.paginacao.total ?? 0;
  const totalPaginas = dados?.paginacao.totalPaginas ?? 1;

  return (
    <main className="flex-1 p-4 sm:p-6 lg:p-8">
      <div className="mx-auto w-full max-w-7xl">
        <h1 className="text-xl font-semibold sm:text-2xl">Auditoria</h1>
        <p className="mt-1 text-sm text-slate-500">
          Histórico real das ações registradas no banco de dados.
        </p>

        {erro && (
          <div className="mt-6 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {erro}
          </div>
        )}

        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-xs text-slate-500">Registros</p>
            <p className="mt-1 text-2xl font-bold">{total}</p>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-xs text-slate-500">Usuários nesta página</p>
            <p className="mt-1 text-2xl font-bold">
              {new Set((dados?.registros ?? []).map((item) => item.nip)).size}
            </p>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-xs text-slate-500">Página</p>
            <p className="mt-1 text-2xl font-bold">
              {pagina} / {totalPaginas}
            </p>
          </div>
        </div>

        <section className="mt-6 rounded-xl border border-slate-200 bg-white shadow-sm">
          <div className="flex flex-col gap-4 p-5 md:flex-row">
            <div className="relative flex-1">
              <Search
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                type="search"
                value={busca}
                onChange={(event) => {
                  setBusca(event.target.value);
                  setPagina(1);
                }}
                placeholder="Pesquisar usuário, NIP, ação ou descrição..."
                className="w-full rounded-lg border border-slate-300 py-2.5 pl-10 pr-4 text-sm outline-none focus:border-slate-700 focus:ring-2 focus:ring-slate-200"
              />
            </div>

            <select
              value={filtroAcao}
              onChange={(event) => {
                setFiltroAcao(event.target.value);
                setPagina(1);
              }}
              className="rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm md:w-64"
            >
              <option value="todas">Todas as ações</option>
              {acoes.map((acao) => (
                <option key={acao} value={acao}>
                  {acaoConfig[acao]?.label ?? acao}
                </option>
              ))}
            </select>
          </div>
        </section>

        <section className="mt-6 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-200 px-5 py-4 sm:px-6">
            <h2 className="font-semibold">Histórico de atividades</h2>
            <p className="mt-1 text-xs text-slate-500">
              Os registros abaixo são carregados diretamente do PostgreSQL.
            </p>
          </div>

          {carregando ? (
            <div className="space-y-4 p-6">
              {Array.from({ length: 5 }).map((_, index) => (
                <div
                  key={index}
                  className="h-20 animate-pulse rounded-lg bg-slate-100"
                />
              ))}
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {(dados?.registros ?? []).map((auditoria) => {
                const config = acaoConfig[auditoria.acao] ?? fallbackConfig;
                const Icon = config.icon;

                return (
                  <div
                    key={auditoria.id}
                    className="px-5 py-5 transition hover:bg-slate-50 sm:px-6"
                  >
                    <div className="flex gap-4">
                      <div
                        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${config.className}`}
                      >
                        <Icon size={18} />
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                          <div>
                            <div className="flex flex-wrap items-center gap-2">
                              <p className="text-sm font-semibold">
                                {auditoria.usuario}
                              </p>
                              <span className="font-mono text-xs text-slate-400">
                                NIP {auditoria.nip}
                              </span>
                            </div>
                            <p className="mt-1 text-sm text-slate-600">
                              {auditoria.descricao}
                            </p>
                          </div>

                          <span className="shrink-0 text-xs text-slate-400">
                            {formatarData(auditoria.data)}
                          </span>
                        </div>

                        <div className="mt-3 flex flex-wrap gap-2">
                          <span
                            className={`rounded-full px-2.5 py-1 text-xs font-medium ${config.className}`}
                          >
                            {config.label}
                          </span>

                          <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600">
                            {auditoria.entidade}
                            {auditoria.entidadeId
                              ? ` #${auditoria.entidadeId}`
                              : ""}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}

              {dados?.registros.length === 0 && (
                <div className="px-6 py-12 text-center">
                  <History size={32} className="mx-auto text-slate-300" />
                  <p className="mt-3 text-sm font-medium">
                    Nenhum registro encontrado
                  </p>
                </div>
              )}
            </div>
          )}

          <div className="flex items-center justify-between border-t border-slate-200 px-5 py-4">
            <span className="text-xs text-slate-500">
              {total} registro(s)
            </span>

            <div className="flex gap-2">
              <button
                type="button"
                disabled={pagina <= 1 || carregando}
                onClick={() => setPagina((valor) => valor - 1)}
                className="rounded-lg border border-slate-300 px-3 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-40"
              >
                Anterior
              </button>

              <button
                type="button"
                disabled={pagina >= totalPaginas || carregando}
                onClick={() => setPagina((valor) => valor + 1)}
                className="rounded-lg border border-slate-300 px-3 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-40"
              >
                Próxima
              </button>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
