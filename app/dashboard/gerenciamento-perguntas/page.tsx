"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Pencil, Trash2 } from "lucide-react";

import type { Pergunta, PerguntaTipo } from "@/types/perguntas";

type ApiResponse = {
  success: boolean;
  data?: Pergunta[];
  error?: string;
};

export default function GerenciamentoPerguntasPage() {
  const [perguntas, setPerguntas] = useState<Pergunta[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");
  const [busca, setBusca] = useState("");
  const [assuntoFiltro, setAssuntoFiltro] = useState("todos");
  const [tipoFiltro, setTipoFiltro] = useState<PerguntaTipo | "todos">("todos");

  async function carregarPerguntas() {
    setCarregando(true);
    setErro("");

    try {
      const response = await fetch("/api/perguntas", { cache: "no-store" });
      const json = (await response.json()) as ApiResponse;

      if (!response.ok || !json.success) {
        throw new Error(json.error ?? "Não foi possível carregar as perguntas.");
      }

      setPerguntas(json.data ?? []);
    } catch (error) {
      setErro(error instanceof Error ? error.message : "Erro ao carregar perguntas.");
    } finally {
      setCarregando(false);
    }
  }

  useEffect(() => {
    carregarPerguntas();
  }, []);

  const assuntos = useMemo(
    () => [...new Set(perguntas.map((pergunta) => pergunta.assunto))].sort(),
    [perguntas],
  );

  const perguntasFiltradas = useMemo(() => {
    const termo = busca.trim().toLowerCase();

    return perguntas.filter((pergunta) => {
      const correspondeBusca =
        !termo ||
        pergunta.enunciado.toLowerCase().includes(termo) ||
        pergunta.assunto.toLowerCase().includes(termo) ||
        pergunta.respostaCorreta.toLowerCase().includes(termo);

      const correspondeAssunto =
        assuntoFiltro === "todos" || pergunta.assunto === assuntoFiltro;

      const correspondeTipo =
        tipoFiltro === "todos" || pergunta.tipo === tipoFiltro;

      return correspondeBusca && correspondeAssunto && correspondeTipo;
    });
  }, [perguntas, busca, assuntoFiltro, tipoFiltro]);

  async function handleExcluir(id: number) {
    const confirmar = window.confirm(
      `Deseja realmente excluir a pergunta #${id}?`,
    );

    if (!confirmar) return;

    try {
      const response = await fetch(`/api/perguntas/${id}`, {
        method: "DELETE",
      });

      const json = await response.json();

      if (!response.ok || !json.success) {
        throw new Error(json.error ?? "Não foi possível excluir a pergunta.");
      }

      setPerguntas((prev) => prev.filter((pergunta) => pergunta.id !== id));
    } catch (error) {
      window.alert(
        error instanceof Error ? error.message : "Erro ao excluir pergunta.",
      );
    }
  }

  return (
    <main className="flex-1 p-4 sm:p-6 lg:p-8">
      <div className="mx-auto w-full max-w-7xl">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">
              Gerenciamento de Perguntas
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              Consulte, edite e exclua as perguntas salvas no banco.
            </p>
          </div>

          <Link
            href="/dashboard/cadastro-perguntas"
            className="inline-flex items-center justify-center rounded-lg bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
          >
            + Nova pergunta
          </Link>
        </div>

        <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm text-slate-500">Total de perguntas</p>
            <p className="mt-2 text-3xl font-bold">
              {carregando ? "..." : perguntas.length}
            </p>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm text-slate-500">Perguntas encontradas</p>
            <p className="mt-2 text-3xl font-bold">
              {carregando ? "..." : perguntasFiltradas.length}
            </p>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm text-slate-500">Assuntos</p>
            <p className="mt-2 text-3xl font-bold">{assuntos.length}</p>
          </div>
        </div>

        <section className="mb-6 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="font-semibold">Filtros</h2>

          <div className="mt-4 grid gap-4 md:grid-cols-3">
            <div>
              <label htmlFor="busca" className="mb-2 block text-sm font-medium">
                Buscar
              </label>
              <input
                id="busca"
                value={busca}
                onChange={(event) => setBusca(event.target.value)}
                placeholder="Pergunta, assunto ou resposta..."
                className="w-full rounded-lg border border-slate-300 px-4 py-3 text-sm outline-none focus:border-slate-700 focus:ring-2 focus:ring-slate-200"
              />
            </div>

            <div>
              <label htmlFor="assunto" className="mb-2 block text-sm font-medium">
                Assunto
              </label>
              <select
                id="assunto"
                value={assuntoFiltro}
                onChange={(event) => setAssuntoFiltro(event.target.value)}
                className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm outline-none"
              >
                <option value="todos">Todos os assuntos</option>
                {assuntos.map((assunto) => (
                  <option key={assunto} value={assunto}>
                    {assunto}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="tipo" className="mb-2 block text-sm font-medium">
                Tipo
              </label>
              <select
                id="tipo"
                value={tipoFiltro}
                onChange={(event) =>
                  setTipoFiltro(event.target.value as PerguntaTipo | "todos")
                }
                className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm outline-none"
              >
                <option value="todos">Todos os tipos</option>
                <option value="objetiva">Objetiva</option>
                <option value="aberta">Aberta</option>
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
          <div className="border-b border-slate-200 px-6 py-5">
            <h2 className="font-semibold">Perguntas cadastradas</h2>
            <p className="mt-1 text-sm text-slate-500">
              {carregando ? "Carregando..." : `${perguntasFiltradas.length} encontrada(s).`}
            </p>
          </div>

          {carregando ? (
            <div className="px-6 py-12 text-center text-sm text-slate-500">
              Carregando perguntas do banco...
            </div>
          ) : perguntasFiltradas.length === 0 ? (
            <div className="px-6 py-12 text-center">
              <p className="font-medium text-slate-700">
                Nenhuma pergunta encontrada.
              </p>
              <p className="mt-1 text-sm text-slate-500">
                Cadastre uma pergunta ou altere os filtros.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[900px] text-left text-sm">
                <thead className="border-b border-slate-200 bg-slate-50">
                  <tr>
                    <th className="px-6 py-4 font-semibold">ID</th>
                    <th className="px-6 py-4 font-semibold">Pergunta</th>
                    <th className="px-6 py-4 font-semibold">Assunto</th>
                    <th className="px-6 py-4 font-semibold">Tipo</th>
                    <th className="px-6 py-4 font-semibold">Alternativas</th>
                    <th className="px-6 py-4 font-semibold">Criada em</th>
                    <th className="px-6 py-4 text-right font-semibold">Ações</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100">
                  {perguntasFiltradas.map((pergunta) => (
                    <tr key={pergunta.id} className="transition hover:bg-slate-50">
                      <td className="whitespace-nowrap px-6 py-4 font-medium">
                        #{pergunta.id}
                      </td>
                      <td className="max-w-md px-6 py-4">
                        <p className="font-medium">{pergunta.enunciado}</p>
                        {pergunta.respostaCorreta && (
                          <p className="mt-1 text-xs text-slate-500">
                            Resposta: {pergunta.respostaCorreta}
                          </p>
                        )}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4">
                        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium">
                          {pergunta.assunto}
                        </span>
                      </td>
                      <td className="whitespace-nowrap px-6 py-4">
                        {pergunta.tipo === "objetiva" ? "Objetiva" : "Aberta"}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-slate-600">
                        {pergunta.tipo === "objetiva"
                          ? `${pergunta.alternativas?.length ?? 0} alternativas`
                          : "—"}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-slate-500">
                        {new Date(pergunta.criadaEm).toLocaleString("pt-BR")}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4">
                        <div className="flex justify-end gap-2">
                          <Link
                            href={`/dashboard/gerenciamento-perguntas/${pergunta.id}/editar`}
                            className="inline-flex items-center gap-1 rounded-lg border border-slate-300 px-3 py-2 text-xs font-medium hover:bg-slate-50"
                          >
                            <Pencil size={14} />
                            Editar
                          </Link>
                          <button
                            type="button"
                            onClick={() => handleExcluir(pergunta.id)}
                            className="inline-flex items-center gap-1 rounded-lg border border-red-200 px-3 py-2 text-xs font-medium text-red-600 hover:bg-red-50"
                          >
                            <Trash2 size={14} />
                            Excluir
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
