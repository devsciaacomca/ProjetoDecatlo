"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Eye, Pencil, Trash2, Search, ArrowUp, ArrowDown, ArrowUpDown, X, EyeOff, ClipboardList } from "lucide-react";

import type { Pergunta } from "@/types/perguntas";

type ApiData = {
  registros: Pergunta[];
  paginacao: {
    pagina: number;
    porPagina: number;
    total: number;
    totalPaginas: number;
  };
};

type ApiResponse = {
  success: boolean;
  data?: ApiData;
  error?: string;
};

export default function GerenciamentoPerguntasPage() {
  const [dados, setDados] = useState<ApiData | null>(null);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");
  const [busca, setBusca] = useState("");
  
  const [pagina, setPagina] = useState(1);
  const [porPagina, setPorPagina] = useState(20);
  const [ordenarPor, setOrdenarPor] = useState("id");
  const [ordem, setOrdem] = useState<"asc" | "desc">("desc");

  // State for View Modal
  const [perguntaVisualizar, setPerguntaVisualizar] = useState<Pergunta | null>(null);
  const [mostrarResposta, setMostrarResposta] = useState(false);

  const carregarPerguntas = useCallback(async () => {
    setCarregando(true);
    setErro("");

    try {
      const params = new URLSearchParams({
        pagina: String(pagina),
        porPagina: String(porPagina),
        ordenarPor,
        ordem,
      });

      if (busca.trim()) params.set("termo", busca.trim());

      const response = await fetch(`/api/perguntas?${params.toString()}`, { cache: "no-store" });
      const json = (await response.json()) as ApiResponse;

      if (!response.ok || !json.success || !json.data) {
        throw new Error(json.error ?? "Não foi possível carregar as perguntas.");
      }

      setDados(json.data);
    } catch (error) {
      setErro(error instanceof Error ? error.message : "Erro ao carregar perguntas.");
    } finally {
      setCarregando(false);
    }
  }, [busca, pagina, porPagina, ordenarPor, ordem]);

  useEffect(() => {
    const timer = window.setTimeout(carregarPerguntas, 300);
    return () => window.clearTimeout(timer);
  }, [carregarPerguntas]);

  async function handleExcluir(id: number) {
    const confirmar = window.confirm(`Deseja realmente excluir a pergunta #${id}?`);
    if (!confirmar) return;

    try {
      const response = await fetch(`/api/perguntas/${id}`, { method: "DELETE" });
      const json = await response.json();

      if (!response.ok || !json.success) {
        throw new Error(json.error ?? "Não foi possível excluir a pergunta.");
      }

      carregarPerguntas(); // recarrega a página atual
    } catch (error) {
      window.alert(error instanceof Error ? error.message : "Erro ao excluir pergunta.");
    }
  }

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

  const total = dados?.paginacao.total ?? 0;
  const totalPaginas = dados?.paginacao.totalPaginas ?? 1;

  return (
    <main className="flex-1 p-4 sm:p-6 lg:p-8">
      <div className="mx-auto w-full max-w-7xl">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Gerenciamento de Perguntas</h1>
            <p className="mt-1 text-sm text-slate-500">
              Consulte, edite e exclua as perguntas salvas no banco.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Link
              href="/dashboard/gerenciamento-perguntas/imprimir"
              target="_blank"
              className="inline-flex items-center justify-center rounded-lg border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              Exportar PDF
            </Link>
            <Link
              href="/dashboard/cadastro-perguntas"
              className="inline-flex items-center justify-center rounded-lg bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
            >
              + Nova pergunta
            </Link>
          </div>
        </div>

        <section className="mb-6 rounded-xl border border-slate-200 bg-white shadow-sm">
          <div className="flex flex-col gap-4 p-5 md:flex-row md:items-center md:justify-between">
            <div className="relative flex-1 max-w-md">
              <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="search"
                value={busca}
                onChange={(event) => {
                  setBusca(event.target.value);
                  setPagina(1);
                }}
                placeholder="Pesquisar pergunta ou assunto..."
                className="w-full rounded-lg border border-slate-300 py-2.5 pl-10 pr-4 text-sm outline-none focus:border-slate-700 focus:ring-2 focus:ring-slate-200"
              />
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

        {erro && (
          <div className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {erro}
          </div>
        )}

        <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-6 py-4 font-semibold text-slate-700 cursor-pointer select-none hover:bg-slate-100 transition" onClick={() => alternarOrdenacao("id")}>
                    ID {renderSortIcon("id")}
                  </th>
                  <th className="px-6 py-4 font-semibold text-slate-700 cursor-pointer select-none hover:bg-slate-100 transition" onClick={() => alternarOrdenacao("enunciado")}>
                    Pergunta {renderSortIcon("enunciado")}
                  </th>
                  <th className="px-6 py-4 font-semibold text-slate-700 cursor-pointer select-none hover:bg-slate-100 transition" onClick={() => alternarOrdenacao("assunto")}>
                    Assunto {renderSortIcon("assunto")}
                  </th>
                  <th className="px-6 py-4 font-semibold text-slate-700 cursor-pointer select-none hover:bg-slate-100 transition" onClick={() => alternarOrdenacao("tipo")}>
                    Tipo {renderSortIcon("tipo")}
                  </th>
                  <th className="px-6 py-4 font-semibold text-slate-700 cursor-pointer select-none hover:bg-slate-100 transition" onClick={() => alternarOrdenacao("criadaEm")}>
                    Data {renderSortIcon("criadaEm")}
                  </th>
                  <th className="px-6 py-4 text-right font-semibold text-slate-700">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {carregando && (!dados || dados.registros.length === 0) ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-slate-500">
                      Carregando perguntas...
                    </td>
                  </tr>
                ) : dados?.registros.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center">
                      <ClipboardList size={32} className="mx-auto text-slate-300" />
                      <p className="mt-3 font-medium text-slate-600">Nenhuma pergunta encontrada</p>
                    </td>
                  </tr>
                ) : (
                  dados?.registros.map((pergunta) => (
                    <tr key={pergunta.id} className="transition hover:bg-slate-50">
                      <td className="px-6 py-4 font-medium text-slate-600">#{pergunta.id}</td>
                      <td className="px-6 py-4 whitespace-normal min-w-[300px]">
                        <p className="font-medium text-slate-900 line-clamp-2" title={pergunta.enunciado}>{pergunta.enunciado}</p>
                      </td>
                      <td className="px-6 py-4">
                        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium border border-slate-200">
                          {pergunta.assunto}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-slate-600">
                        {pergunta.tipo === "objetiva" ? "Objetiva" : "Aberta"}
                      </td>
                      <td className="px-6 py-4 text-slate-600">
                        {new Intl.DateTimeFormat("pt-BR").format(new Date(pergunta.criadaEm))}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => {
                              setPerguntaVisualizar(pergunta);
                              setMostrarResposta(false);
                            }}
                            className="inline-flex items-center gap-1 rounded-lg border border-slate-300 px-3 py-2 text-xs font-medium hover:bg-slate-50"
                          >
                            <Eye size={14} />
                            Visualizar
                          </button>
                          <Link
                            href={`/dashboard/gerenciamento-perguntas/${pergunta.id}/editar`}
                            className="inline-flex items-center gap-1 rounded-lg border border-blue-200 bg-blue-50 px-3 py-2 text-xs font-medium text-blue-700 hover:bg-blue-100"
                          >
                            <Pencil size={14} />
                            Editar
                          </Link>
                          <button
                            type="button"
                            onClick={() => handleExcluir(pergunta.id)}
                            className="inline-flex items-center gap-1 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs font-medium text-red-600 hover:bg-red-100"
                          >
                            <Trash2 size={14} />
                            Excluir
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between border-t border-slate-200 bg-slate-50 px-6 py-4 gap-4">
            <span className="text-sm text-slate-600">
              Mostrando página <span className="font-semibold">{pagina}</span> de <span className="font-semibold">{totalPaginas}</span> ({total} perguntas)
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

      {/* Modal de Visualização */}
      {perguntaVisualizar && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="relative w-full max-w-2xl rounded-2xl bg-white p-6 shadow-2xl">
            <button
              onClick={() => setPerguntaVisualizar(null)}
              className="absolute right-4 top-4 rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
            >
              <X size={20} />
            </button>

            <h3 className="text-lg font-bold pr-8">Visualização de Pergunta #{perguntaVisualizar.id}</h3>
            
            <div className="mt-4 space-y-4">
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-sm font-medium text-slate-500 mb-1">Enunciado:</p>
                <p className="text-base font-semibold">{perguntaVisualizar.enunciado}</p>
              </div>

              {perguntaVisualizar.tipo === "objetiva" && (
                <div className="space-y-2">
                  <p className="text-sm font-medium text-slate-500">Alternativas:</p>
                  {perguntaVisualizar.alternativas?.map((alt, idx) => (
                    <div key={idx} className="rounded-lg border border-slate-200 p-3 text-sm">
                      {String.fromCharCode(65 + idx)}) {alt.texto}
                    </div>
                  ))}
                </div>
              )}

              <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-medium text-slate-500">Resposta Correta:</p>
                  <button
                    onClick={() => setMostrarResposta(!mostrarResposta)}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-medium hover:bg-slate-100"
                  >
                    {mostrarResposta ? <EyeOff size={14} /> : <Eye size={14} />}
                    {mostrarResposta ? "Ocultar" : "Revelar"}
                  </button>
                </div>
                
                {mostrarResposta ? (
                  <p className="text-base font-bold text-green-700">{perguntaVisualizar.respostaCorreta}</p>
                ) : (
                  <div className="h-6 w-full max-w-xs rounded-md bg-slate-200 animate-pulse" />
                )}
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setPerguntaVisualizar(null)}
                className="rounded-lg bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-slate-800"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
