"use client";
import { useState } from "react";
import { perguntas } from "@/data/perguntas/perguntas";
import type { TipoPergunta } from "@/types/perguntas";
type AlternativaForm = { id: number; texto: string };
export default function CadastroPerguntasPage() {
  const [assunto, setAssunto] = useState("");
  const [tipo, setTipo] = useState<TipoPergunta>("objetiva");
  const [enunciado, setEnunciado] = useState("");
  const [explicacao, setExplicacao] = useState("");
  const [alternativas, setAlternativas] = useState<AlternativaForm[]>([
    { id: 1, texto: "" },
    { id: 2, texto: "" },
    { id: 3, texto: "" },
  ]);
  const [respostaCorreta, setRespostaCorreta] = useState<number | null>(null);
  const assuntos = [...new Set(perguntas.map((pergunta) => pergunta.assunto))];

  function adicionarAlternativa() {
    const novoId =
      alternativas.length > 0
        ? Math.max(...alternativas.map((alternativa) => alternativa.id)) + 1
        : 1;
    setAlternativas((prev) => [...prev, { id: novoId, texto: "" }]);
  }
  function removerAlternativa(id: number) {
    if (alternativas.length === 1) {
      return;
    }
    setAlternativas((prev) =>
      prev.filter((alternativa) => alternativa.id !== id),
    );
    if (respostaCorreta === id) {
      setRespostaCorreta(null);
    }
  }
  function atualizarAlternativa(id: number, texto: string) {
    setAlternativas((prev) =>
      prev.map((alternativa) =>
        alternativa.id === id ? { ...alternativa, texto } : alternativa,
      ),
    );
  }
  function alterarTipo(novoTipo: TipoPergunta) {
    setTipo(novoTipo);
    if (novoTipo === "aberta") {
      setRespostaCorreta(null);
    }
  }
  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const novaPergunta = {
      id: Math.max(...perguntas.map((pergunta) => pergunta.id)) + 1,
      assunto,
      tipo,
      enunciado,
      ...(tipo === "objetiva"
        ? {
            alternativas: alternativas.map((alternativa) => ({
              id: alternativa.id,
              texto: alternativa.texto,
            })),
            respostaCorreta:
              alternativas.find(
                (alternativa) => alternativa.id === respostaCorreta,
              )?.texto ?? "",
          }
        : {}),
      explicacao,
      criadaEm: new Date().toLocaleDateString("pt-BR"),
    };
    console.log("Nova pergunta:", novaPergunta);
  }

  return (
    <main className="flex-1 p-4 sm:p-6 lg:p-8">
      <div className="mx-auto w-full max-w-3xl">
        <section className="rounded-xl border border-slate-200 bg-white shadow-sm">
          {/* Cabeçalho */}
          <div className="border-b border-slate-200 px-5 py-4 sm:px-6 sm:py-5">
            <h1 className="text-lg font-semibold">Nova pergunta</h1>
            <p className="mt-1 text-sm text-slate-500">
              Preencha as informações da pergunta abaixo.
            </p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-6 p-5 sm:p-6">
            {/* Assunto */}
            <div>
              <label className="mb-3 block text-sm font-medium">Assunto</label>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                {assuntos.map((item) => {
                  const selecionado = assunto === item;
                  return (
                    <button
                      key={item}
                      type="button"
                      onClick={() => setAssunto(item)}
                      className={`rounded-lg border px-3 py-3 text-sm font-medium transition ${selecionado ? "border-slate-900 bg-slate-900 text-white" : "border-slate-200 bg-white text-slate-700 hover:border-slate-400 hover:bg-slate-50"}`}
                    >
                      {item}
                    </button>
                  );
                })}
              </div>
            </div>
            {/* Tipo */}
            <div>
              <label className="mb-3 block text-sm font-medium">
                Tipo de pergunta
              </label>
              <div className="grid gap-3 sm:grid-cols-2">
                <label
                  className={`flex cursor-pointer items-center gap-3 rounded-lg border p-4 ${tipo === "objetiva" ? "border-slate-900 bg-slate-50" : "border-slate-200"}`}
                >
                  <input
                    type="radio"
                    name="tipo"
                    checked={tipo === "objetiva"}
                    onChange={() => alterarTipo("objetiva")}
                    className="h-4 w-4 accent-slate-900"
                  />
                  <div>
                    <p className="text-sm font-medium"> Objetiva </p>
                    <p className="text-xs text-slate-500">
                      Possui alternativas.
                    </p>
                  </div>
                </label>
                <label
                  className={`flex cursor-pointer items-center gap-3 rounded-lg border p-4 ${tipo === "aberta" ? "border-slate-900 bg-slate-50" : "border-slate-200"}`}
                >
                  <input
                    type="radio"
                    name="tipo"
                    checked={tipo === "aberta"}
                    onChange={() => alterarTipo("aberta")}
                    className="h-4 w-4 accent-slate-900"
                  />
                  <div>
                    <p className="text-sm font-medium"> Aberta </p>
                    <p className="text-xs text-slate-500">Resposta livre.</p>
                  </div>
                </label>
              </div>
            </div>
            {/* Enunciado */}
            <div>
              <label
                htmlFor="enunciado"
                className="mb-2 block text-sm font-medium"
              >
                Pergunta
              </label>
              <textarea
                id="enunciado"
                value={enunciado}
                onChange={(event) => setEnunciado(event.target.value)}
                rows={4}
                placeholder="Digite a pergunta..."
                className="w-full resize-none rounded-lg border border-slate-300 px-4 py-3 text-sm outline-none placeholder:text-slate-400 focus:border-slate-700 focus:ring-2 focus:ring-slate-200"
              />
            </div>
            {/* Alternativas */}
            {tipo === "objetiva" && (
              <div>
                <div className="mb-4 flex items-center justify-between">
                  <div>
                    <h2 className="text-sm font-semibold">Alternativas</h2>
                    <p className="mt-1 text-xs text-slate-500">
                      Selecione a alternativa correta.
                    </p>
                  </div>
                  <span className="text-xs text-slate-400">
                    {alternativas.length} alternativas
                  </span>
                </div>
                <div className="space-y-3">
                  {alternativas.map((alternativa, index) => (
                    <div
                      key={alternativa.id}
                      className="flex items-center gap-2"
                    >
                      {/* Correta */}
                      <label className="flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded-lg border border-slate-200 bg-slate-50">
                        <input
                          type="radio"
                          name="resposta-correta"
                          checked={respostaCorreta === alternativa.id}
                          onChange={() => setRespostaCorreta(alternativa.id)}
                          className="h-4 w-4 accent-slate-900"
                        />
                      </label>
                      {/* Letra */}
                      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-slate-900 text-sm font-bold text-white">
                        {String.fromCharCode(65 + index)}
                      </span>
                      {/* Texto */}
                      <input
                        type="text"
                        value={alternativa.texto}
                        onChange={(event) =>
                          atualizarAlternativa(
                            alternativa.id,
                            event.target.value,
                          )
                        }
                        placeholder={`Resposta ${String.fromCharCode(65 + index)}`}
                        className="h-10 min-w-0 w-full rounded-lg border border-slate-300 px-4 text-sm outline-none placeholder:text-slate-400 focus:border-slate-700 focus:ring-2 focus:ring-slate-200"
                      />
                      {/* Remover */}
                      <button
                        type="button"
                        onClick={() => removerAlternativa(alternativa.id)}
                        disabled={alternativas.length === 1}
                        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-slate-200 text-lg text-slate-400 hover:border-red-200 hover:bg-red-50 hover:text-red-500 disabled:cursor-not-allowed disabled:opacity-30"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
                <button
                  type="button"
                  onClick={adicionarAlternativa}
                  className="mt-4 w-full rounded-lg border border-dashed border-slate-300 px-4 py-3 text-sm font-medium text-slate-600 hover:bg-slate-50"
                >
                  + Adicionar alternativa
                </button>
              </div>
            )}
            {/* Explicação */}
            <div>
              <label
                htmlFor="explicacao"
                className="mb-2 block text-sm font-medium"
              >
                Explicação didática
              </label>
              <textarea
                id="explicacao"
                value={explicacao}
                onChange={(event) => setExplicacao(event.target.value)}
                rows={5}
                placeholder="Informe a explicação que poderá ser utilizada pelo apresentador..."
                className="w-full resize-none rounded-lg border border-slate-300 px-4 py-3 text-sm outline-none placeholder:text-slate-400 focus:border-slate-700 focus:ring-2 focus:ring-slate-200"
              />
            </div>
            {/* Ações */}
            <div className="border-t border-slate-200 pt-5">
              <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                <button
                  type="submit"
                  className="rounded-lg bg-slate-900 px-5 py-3 text-sm font-semibold text-white hover:bg-slate-800"
                >
                  Cadastrar pergunta
                </button>
              </div>
            </div>
          </form>
        </section>
      </div>
    </main>
  );
}
