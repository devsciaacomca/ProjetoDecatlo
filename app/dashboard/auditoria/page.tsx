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
  ArrowUp,
  ArrowDown,
  ArrowUpDown
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
  LOGIN: { label: "Acesso ao Sistema", icon: LogIn, className: "bg-slate-100 text-slate-700" },
  CRIACAO_USUARIO: { label: "Registro de Usuário", icon: UserPlus, className: "bg-green-100 text-green-700" },
  EDICAO_USUARIO: { label: "Atualização de Usuário", icon: Pencil, className: "bg-blue-100 text-blue-700" },
  EXCLUSAO_USUARIO: { label: "Remoção de Usuário", icon: Trash2, className: "bg-red-100 text-red-700" },
  CRIACAO_PERGUNTA: { label: "Registro de Pergunta", icon: ClipboardList, className: "bg-green-100 text-green-700" },
  EDICAO_PERGUNTA: { label: "Atualização de Pergunta", icon: Pencil, className: "bg-blue-100 text-blue-700" },
  EXCLUSAO_PERGUNTA: { label: "Remoção de Pergunta", icon: Trash2, className: "bg-red-100 text-red-700" },
  CRIACAO_PARTIDA: { label: "Criação de Partida", icon: PlayCircle, className: "bg-green-100 text-green-700" },
  EDICAO_PARTIDA: { label: "Atualização de Partida", icon: Pencil, className: "bg-blue-100 text-blue-700" },
  INICIO_PARTIDA: { label: "Iniciação da Partida", icon: PlayCircle, className: "bg-green-100 text-green-700" },
  FINALIZACAO_PARTIDA: { label: "Conclusão da Partida", icon: CheckCircle2, className: "bg-blue-100 text-blue-700" },
  ALTERACAO_CONFIGURACAO: { label: "Ajuste de Configuração", icon: Settings, className: "bg-amber-100 text-amber-700" },
};

const fallbackConfig = {
  label: "Ação Registrada",
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
  const [porPagina, setPorPagina] = useState(20);
  const [ordenarPor, setOrdenarPor] = useState("criadoEm");
  const [ordem, setOrdem] = useState<"asc" | "desc">("desc");
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");

  const carregar = useCallback(async () => {
    try {
      setCarregando(true);
      setErro("");

      const params = new URLSearchParams({
        pagina: String(pagina),
        porPagina: String(porPagina),
        ordenarPor,
        ordem,
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
  }, [busca, filtroAcao, pagina, porPagina, ordenarPor, ordem]);

  useEffect(() => {
    const timer = window.setTimeout(carregar, 300);
    return () => window.clearTimeout(timer);
  }, [carregar]);

  const alternarOrdenacao = (coluna: string) => {
    if (ordenarPor === coluna) {
      setOrdem(ordem === "asc" ? "desc" : "asc");
    } else {
      setOrdenarPor(coluna);
      setOrdem("asc");
    }
    setPagina(1);
  };

  const renderSortIcon = (coluna: string) => {
    if (ordenarPor !== coluna) return <ArrowUpDown size={14} className="ml-1 inline-block opacity-40" />;
    return ordem === "asc" ? <ArrowUp size={14} className="ml-1 inline-block" /> : <ArrowDown size={14} className="ml-1 inline-block" />;
  };

  const acoes = useMemo(() => {
    return Object.keys(acaoConfig).sort();
  }, []);

  const total = dados?.paginacao.total ?? 0;
  const totalPaginas = dados?.paginacao.totalPaginas ?? 1;

  return (
    <main className="flex-1 p-4 sm:p-6 lg:p-8">
      <div className="mx-auto w-full max-w-7xl">
        <h1 className="text-xl font-semibold sm:text-2xl">Auditoria</h1>
        <p className="mt-1 text-sm text-slate-500">
          Histórico de ações organizadas e auditáveis.
        </p>

        {erro && (
          <div className="mt-6 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {erro}
          </div>
        )}

        <section className="mt-6 rounded-xl border border-slate-200 bg-white shadow-sm">
          <div className="flex flex-col gap-4 p-5 md:flex-row md:items-center md:justify-between">
            <div className="flex flex-1 flex-col gap-4 md:flex-row">
              <div className="relative flex-1 max-w-md">
                <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="search"
                  value={busca}
                  onChange={(event) => {
                    setBusca(event.target.value);
                    setPagina(1);
                  }}
                  placeholder="Pesquisar por NIP, usuário ou descrição..."
                  className="w-full rounded-lg border border-slate-300 py-2.5 pl-10 pr-4 text-sm outline-none focus:border-slate-700 focus:ring-2 focus:ring-slate-200"
                />
              </div>

              <select
                value={filtroAcao}
                onChange={(event) => {
                  setFiltroAcao(event.target.value);
                  setPagina(1);
                }}
                className="rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm md:w-64 outline-none"
              >
                <option value="todas">Todas as ações</option>
                {acoes.map((acao) => (
                  <option key={acao} value={acao}>
                    {acaoConfig[acao]?.label ?? acao}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="flex items-center gap-2 text-sm text-slate-600">
              <span>Registros por página:</span>
              <select
                value={porPagina}
                onChange={(event) => {
                  setPorPagina(Number(event.target.value));
                  setPagina(1);
                }}
                className="rounded-lg border border-slate-300 bg-white px-2 py-1.5 outline-none"
              >
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
              </select>
            </div>
          </div>
        </section>

        <section className="mt-6 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-6 py-4 font-semibold text-slate-700 cursor-pointer select-none hover:bg-slate-100 transition" onClick={() => alternarOrdenacao("criadoEm")}>
                    Data / Hora {renderSortIcon("criadoEm")}
                  </th>
                  <th className="px-6 py-4 font-semibold text-slate-700 cursor-pointer select-none hover:bg-slate-100 transition" onClick={() => alternarOrdenacao("acao")}>
                    Ação {renderSortIcon("acao")}
                  </th>
                  <th className="px-6 py-4 font-semibold text-slate-700 cursor-pointer select-none hover:bg-slate-100 transition" onClick={() => alternarOrdenacao("usuario")}>
                    Responsável {renderSortIcon("usuario")}
                  </th>
                  <th className="px-6 py-4 font-semibold text-slate-700 cursor-pointer select-none hover:bg-slate-100 transition" onClick={() => alternarOrdenacao("entidade")}>
                    Entidade {renderSortIcon("entidade")}
                  </th>
                  <th className="px-6 py-4 font-semibold text-slate-700">Descrição</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {carregando && (!dados || dados.registros.length === 0) ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-slate-500">
                      Carregando registros...
                    </td>
                  </tr>
                ) : dados?.registros.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center">
                      <History size={32} className="mx-auto text-slate-300" />
                      <p className="mt-3 font-medium text-slate-600">Nenhum registro encontrado</p>
                    </td>
                  </tr>
                ) : (
                  dados?.registros.map((auditoria) => {
                    const config = acaoConfig[auditoria.acao] ?? fallbackConfig;
                    const Icon = config.icon;

                    return (
                      <tr key={auditoria.id} className="transition hover:bg-slate-50">
                        <td className="px-6 py-4 text-slate-600">
                          {formatarData(auditoria.data)}
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${config.className}`}>
                            <Icon size={12} />
                            {config.label}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <p className="font-medium text-slate-900">{auditoria.usuario}</p>
                          <p className="text-xs text-slate-500">NIP: {auditoria.nip}</p>
                        </td>
                        <td className="px-6 py-4">
                          <span className="rounded-md bg-slate-100 px-2 py-1 text-xs font-medium text-slate-600 border border-slate-200">
                            {auditoria.entidade}
                            {auditoria.entidadeId ? ` #${auditoria.entidadeId}` : ""}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-normal min-w-[250px] text-slate-600">
                          {auditoria.descricao}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between border-t border-slate-200 bg-slate-50 px-6 py-4 gap-4">
            <span className="text-sm text-slate-600">
              Mostrando página <span className="font-semibold">{pagina}</span> de <span className="font-semibold">{totalPaginas}</span> ({total} registros totais)
            </span>

            <div className="flex gap-2">
              <button
                type="button"
                disabled={pagina <= 1 || carregando}
                onClick={() => setPagina((p) => p - 1)}
                className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium transition hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Anterior
              </button>
              <button
                type="button"
                disabled={pagina >= totalPaginas || carregando}
                onClick={() => setPagina((p) => p + 1)}
                className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium transition hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
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
