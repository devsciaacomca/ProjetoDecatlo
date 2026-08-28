"use client";

import { useMemo, useState } from "react";
import Link from "next/link";

import { perguntas } from "@/data/perguntas/perguntas";

export default function GerenciamentoPerguntasPage() {
  const [busca, setBusca] = useState("");
  const [assuntoFiltro, setAssuntoFiltro] = useState("todos");
  const [tipoFiltro, setTipoFiltro] = useState("todos");

  // Separar depois em um hook ou utils, para não poluir a pagina com lógica de filtragem.
  const perguntasFiltradas = useMemo(() => {
    return perguntas.filter((pergunta) => {
      const correspondeBusca = pergunta.enunciado
        .toLowerCase()
        .includes(busca.toLowerCase());

      const correspondeAssunto =
        assuntoFiltro === "todos" || pergunta.assunto === assuntoFiltro;

      const correspondeTipo =
        tipoFiltro === "todos" || pergunta.tipo === tipoFiltro;

      return correspondeBusca && correspondeAssunto && correspondeTipo;
    });
  }, [busca, assuntoFiltro, tipoFiltro]);

  const assuntos = [...new Set(perguntas.map((pergunta) => pergunta.assunto))];

  const handleExcluir = (id: number) => {
    const pergunta = perguntas.find((item) => item.id === id);

    if (!pergunta) return;

    const confirmar = window.confirm(
      `Deseja realmente excluir a pergunta #${pergunta.id}?`,
    );

    if (!confirmar) return;

    // Futuramente:
    // excluir a pergunta do banco de dados e atualizar a lista de perguntas exibida na tela.
    console.log("Excluir pergunta:", id);
  };

  return (
    <main className="flex-1 p-4 sm:p-6 lg:p-8">
      <div className="mx-auto w-full max-w-7xl">
        {/* Cabeçalho */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">
              Gerenciamento de Perguntas
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              Consulte, edite e exclua as perguntas cadastradas.
            </p>
          </div>

          <Link
            href="/dashboard/cadastro-perguntas"
            className="inline-flex items-center justify-center rounded-lg bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
          >
            + Nova pergunta
          </Link>
        </div>

        {/* Estatísticas */}
        <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm text-slate-500">Total de perguntas</p>

            <p className="mt-2 text-3xl font-bold">{perguntas.length}</p>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm text-slate-500">Perguntas encontradas</p>

            <p className="mt-2 text-3xl font-bold">
              {perguntasFiltradas.length}
            </p>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm text-slate-500">Assuntos</p>

            <p className="mt-2 text-3xl font-bold">{assuntos.length}</p>
          </div>
        </div>

        {/* Filtros */}
        <section className="mb-6 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="mb-4">
            <h2 className="font-semibold">Filtros</h2>

            <p className="mt-1 text-sm text-slate-500">
              Utilize os filtros para localizar uma pergunta.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {/* Busca */}
            <div>
              <label
                htmlFor="busca"
                className="mb-2 block text-sm font-medium text-slate-700"
              >
                Buscar
              </label>

              <input
                id="busca"
                type="text"
                value={busca}
                onChange={(event) => setBusca(event.target.value)}
                placeholder="Digite parte da pergunta..."
                className="w-full rounded-lg border border-slate-300 px-4 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-slate-700 focus:ring-2 focus:ring-slate-200"
              />
            </div>

            {/* Assunto */}
            <div>
              <label
                htmlFor="assunto"
                className="mb-2 block text-sm font-medium text-slate-700"
              >
                Assunto
              </label>

              <select
                id="assunto"
                value={assuntoFiltro}
                onChange={(event) => setAssuntoFiltro(event.target.value)}
                className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-slate-700 focus:ring-2 focus:ring-slate-200"
              >
                <option value="todos">Todos os assuntos</option>

                {assuntos.map((assunto) => (
                  <option key={assunto} value={assunto}>
                    {assunto}
                  </option>
                ))}
              </select>
            </div>

            {/* Tipo */}
            <div>
              <label
                htmlFor="tipo"
                className="mb-2 block text-sm font-medium text-slate-700"
              >
                Tipo
              </label>

              <select
                id="tipo"
                value={tipoFiltro}
                onChange={(event) => setTipoFiltro(event.target.value)}
                className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-slate-700 focus:ring-2 focus:ring-slate-200"
              >
                <option value="todos">Todos os tipos</option>
                <option value="objetiva">Objetiva</option>
                <option value="aberta">Aberta</option>
              </select>
            </div>
          </div>
        </section>

        {/* Lista */}
        <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-200 px-6 py-5">
            <h2 className="font-semibold">Perguntas cadastradas</h2>

            <p className="mt-1 text-sm text-slate-500">
              {perguntasFiltradas.length} pergunta
              {perguntasFiltradas.length !== 1 ? "s" : ""} encontrada
              {perguntasFiltradas.length !== 1 ? "s" : ""}.
            </p>
          </div>

          {/* Tabela */}
          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px] text-left text-sm">
              <thead className="border-b border-slate-200 bg-slate-50">
                <tr>
                  <th className="px-6 py-4 font-semibold text-slate-700">ID</th>

                  <th className="px-6 py-4 font-semibold text-slate-700">
                    Pergunta
                  </th>

                  <th className="px-6 py-4 font-semibold text-slate-700">
                    Assunto
                  </th>

                  <th className="px-6 py-4 font-semibold text-slate-700">
                    Tipo
                  </th>
                  <th className="px-6 py-4 font-semibold text-slate-700">
                    Alternativas
                  </th>
                  <th className="px-6 py-4 font-semibold text-slate-700">
                    Criada em
                  </th>

                  <th className="px-6 py-4 text-right font-semibold text-slate-700">
                    Ações
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {perguntasFiltradas.map((pergunta) => (
                  <tr
                    key={pergunta.id}
                    className="transition hover:bg-slate-50"
                  >
                    <td className="whitespace-nowrap px-6 py-4 font-medium text-slate-600">
                      #{pergunta.id}
                    </td>

                    <td className="max-w-md px-6 py-4">
                      <p className="font-medium text-slate-900">
                        {pergunta.enunciado}
                      </p>

                      {pergunta.respostaCorreta && (
                        <p className="mt-1 text-xs text-slate-500">
                          Resposta: {pergunta.respostaCorreta}
                        </p>
                      )}
                    </td>

                    <td className="whitespace-nowrap px-6 py-4">
                      <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700">
                        {pergunta.assunto}
                      </span>
                    </td>

                    <td className="whitespace-nowrap px-6 py-4">
                      <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700">
                        {pergunta.tipo === "objetiva" ? "Objetiva" : "Aberta"}
                      </span>
                    </td>

                    <td className="whitespace-nowrap px-6 py-4">
                      {pergunta.tipo === "objetiva" ? (
                        <span className="text-slate-600">
                          {pergunta.alternativas?.length ?? 0} alternativas
                        </span>
                      ) : (
                        <span className="text-slate-400">—</span>
                      )}
                    </td>

                    <td className="whitespace-nowrap px-6 py-4 text-slate-500">
                      {pergunta.criadaEm}
                    </td>

                    <td className="whitespace-nowrap px-6 py-4">
                      <div className="flex justify-end gap-2">
                        <Link
                          href={`/gerenciamento-perguntas/${pergunta.id}/editar`}
                          className="rounded-lg border border-slate-300 px-3 py-2 text-xs font-medium text-slate-700 transition hover:bg-slate-50"
                        >
                          Editar
                        </Link>

                        <button
                          type="button"
                          onClick={() => handleExcluir(pergunta.id)}
                          className="rounded-lg border border-red-200 px-3 py-2 text-xs font-medium text-red-600 transition hover:bg-red-50"
                        >
                          Excluir
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Estado vazio */}
          {perguntasFiltradas.length === 0 && (
            <div className="px-6 py-12 text-center">
              <p className="font-medium text-slate-700">
                Nenhuma pergunta encontrada.
              </p>

              <p className="mt-1 text-sm text-slate-500">
                Tente alterar os filtros ou realizar uma nova busca.
              </p>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
