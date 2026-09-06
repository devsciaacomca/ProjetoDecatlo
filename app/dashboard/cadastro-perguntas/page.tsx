"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { PerguntaTipo } from "@/types/perguntas";

type AlternativaForm = {
  id: number;
  texto: string;
};

export default function CadastroPerguntasPage() {
  const router = useRouter();

  const [assunto, setAssunto] = useState("");
  const [assuntos, setAssuntos] = useState<string[]>([]);
  const [carregandoAssuntos, setCarregandoAssuntos] = useState(true);
  const [erroAssuntos, setErroAssuntos] = useState("");

  const [tipo, setTipo] = useState<PerguntaTipo>("objetiva");
  const [enunciado, setEnunciado] = useState("");
  const [explicacao, setExplicacao] = useState("");
  const [alternativas, setAlternativas] = useState<AlternativaForm[]>([
    { id: 1, texto: "" },
    { id: 2, texto: "" },
    { id: 3, texto: "" },
  ]);
  const [respostaCorreta, setRespostaCorreta] = useState<number | null>(null);
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState("");
  const [respostaCorretaAberta, setRespostaCorretaAberta] = useState("");
  useEffect(() => {
    let ativo = true;

    async function carregarAssuntos() {
      try {
        setCarregandoAssuntos(true);
        setErroAssuntos("");

        const response = await fetch("/api/perguntas?assuntos=true");

        if (!response.ok) {
          throw new Error("Não foi possível carregar os assuntos.");
        }

        const resultado = await response.json();

        if (!resultado.success) {
          throw new Error(
            resultado.error || "Não foi possível carregar os assuntos.",
          );
        }

        if (ativo) {
          setAssuntos(resultado.data ?? []);
        }
      } catch (error) {
        if (ativo) {
          setErroAssuntos(
            error instanceof Error
              ? error.message
              : "Não foi possível carregar os assuntos.",
          );
        }
      } finally {
        if (ativo) {
          setCarregandoAssuntos(false);
        }
      }
    }

    carregarAssuntos();

    return () => {
      ativo = false;
    };
  }, []);

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

  function alterarTipo(novoTipo: PerguntaTipo) {
    setTipo(novoTipo);

    if (novoTipo === "aberta") {
      setRespostaCorreta(null);
    } else {
      setRespostaCorretaAberta("");
    }
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErro("");

    const assuntoNormalizado = assunto.trim();

    if (!assuntoNormalizado) {
      setErro("Informe um assunto.");
      return;
    }

    const resposta =
      tipo === "objetiva"
        ? (alternativas.find(
            (alternativa) => alternativa.id === respostaCorreta,
          )?.texto ?? "")
        : respostaCorretaAberta.trim();

    try {
      setSalvando(true);

      const response = await fetch("/api/perguntas", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          assunto: assuntoNormalizado,
          tipo,
          enunciado,
          respostaCorreta: resposta,
          explicacao,
          alternativas:
            tipo === "objetiva"
              ? alternativas.map((alternativa) => ({
                  texto: alternativa.texto,
                }))
              : [],
        }),
      });

      const resultado = await response.json();

      if (!response.ok || !resultado.success) {
        setErro(resultado.error || "Não foi possível cadastrar a pergunta.");
        return;
      }

      router.push("/dashboard/gerenciamento-perguntas");
    } catch {
      setErro("Não foi possível conectar ao servidor.");
    } finally {
      setSalvando(false);
    }
  }

  return (
    <main className="flex-1 p-4 sm:p-6 lg:p-8">
      <div className="mx-auto w-full max-w-3xl">
        <section className="rounded-xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-200 px-5 py-4 sm:px-6 sm:py-5">
            <h1 className="text-lg font-semibold">Nova pergunta</h1>
            <p className="mt-1 text-sm text-slate-500">
              Crie perguntas usando um assunto existente ou cadastre um novo.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6 p-5 sm:p-6">
            <div>
              <label
                htmlFor="assunto"
                className="mb-2 block text-sm font-medium"
              >
                Assunto
              </label>

              <input
                id="assunto"
                name="assunto"
                type="text"
                list="assuntos-disponiveis"
                value={assunto}
                onChange={(event) => setAssunto(event.target.value)}
                required
                disabled={carregandoAssuntos}
                placeholder="Ex.: História, Ciências, Esportes..."
                className="h-11 w-full rounded-lg border border-slate-300 px-4 text-sm outline-none placeholder:text-slate-400 focus:border-slate-700 focus:ring-2 focus:ring-slate-200 disabled:bg-slate-50"
              />

              <datalist id="assuntos-disponiveis">
                {assuntos.map((item) => (
                  <option key={item} value={item} />
                ))}
              </datalist>

              <p className="mt-2 text-xs text-slate-500">
                Você pode selecionar um assunto existente ou digitar um novo. O
                sistema não permite duplicar assuntos apenas mudando
                maiúsculas/minúsculas.
              </p>

              {carregandoAssuntos && (
                <p className="mt-2 text-xs text-slate-500">
                  Carregando assuntos existentes...
                </p>
              )}

              {erroAssuntos && (
                <p className="mt-2 text-sm text-red-600">{erroAssuntos}</p>
              )}

              {assuntos.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {assuntos.map((item) => (
                    <button
                      key={item}
                      type="button"
                      onClick={() => setAssunto(item)}
                      className={`rounded-full border px-3 py-1.5 text-xs font-medium transition ${
                        assunto.trim().toLocaleLowerCase("pt-BR") ===
                        item.toLocaleLowerCase("pt-BR")
                          ? "border-slate-900 bg-slate-900 text-white"
                          : "border-slate-200 bg-white text-slate-600 hover:border-slate-400"
                      }`}
                    >
                      {item}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div>
              <label className="mb-3 block text-sm font-medium">
                Tipo de pergunta
              </label>

              <div className="grid gap-3 sm:grid-cols-2">
                <label
                  className={`flex cursor-pointer items-center gap-3 rounded-lg border p-4 ${
                    tipo === "objetiva"
                      ? "border-slate-900 bg-slate-50"
                      : "border-slate-200"
                  }`}
                >
                  <input
                    type="radio"
                    name="tipo"
                    checked={tipo === "objetiva"}
                    onChange={() => alterarTipo("objetiva")}
                    className="h-4 w-4 accent-slate-900"
                  />
                  <div>
                    <p className="text-sm font-medium">Objetiva</p>
                    <p className="text-xs text-slate-500">
                      Possui alternativas.
                    </p>
                  </div>
                </label>

                <label
                  className={`flex cursor-pointer items-center gap-3 rounded-lg border p-4 ${
                    tipo === "aberta"
                      ? "border-slate-900 bg-slate-50"
                      : "border-slate-200"
                  }`}
                >
                  <input
                    type="radio"
                    name="tipo"
                    checked={tipo === "aberta"}
                    onChange={() => alterarTipo("aberta")}
                    className="h-4 w-4 accent-slate-900"
                  />
                  <div>
                    <p className="text-sm font-medium">Aberta</p>
                    <p className="text-xs text-slate-500">Resposta livre.</p>
                  </div>
                </label>
              </div>
            </div>

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
                required
                placeholder="Digite a pergunta..."
                className="w-full resize-none rounded-lg border border-slate-300 px-4 py-3 text-sm outline-none placeholder:text-slate-400 focus:border-slate-700 focus:ring-2 focus:ring-slate-200"
              />
            </div>

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
                      <label className="flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded-lg border border-slate-200 bg-slate-50">
                        <input
                          type="radio"
                          name="resposta-correta"
                          checked={respostaCorreta === alternativa.id}
                          onChange={() => setRespostaCorreta(alternativa.id)}
                          className="h-4 w-4 accent-slate-900"
                        />
                      </label>

                      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-slate-900 text-sm font-bold text-white">
                        {String.fromCharCode(65 + index)}
                      </span>

                      <input
                        type="text"
                        value={alternativa.texto}
                        onChange={(event) =>
                          atualizarAlternativa(
                            alternativa.id,
                            event.target.value,
                          )
                        }
                        required
                        placeholder={`Resposta ${String.fromCharCode(65 + index)}`}
                        className="h-10 min-w-0 w-full rounded-lg border border-slate-300 px-4 text-sm outline-none placeholder:text-slate-400 focus:border-slate-700 focus:ring-2 focus:ring-slate-200"
                      />

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
            {tipo === "aberta" && (
              <div>
                <label
                  htmlFor="respostaCorretaAberta"
                  className="mb-2 block text-sm font-medium"
                >
                  Resposta correta
                </label>

                <textarea
                  id="respostaCorretaAberta"
                  value={respostaCorretaAberta}
                  onChange={(event) =>
                    setRespostaCorretaAberta(event.target.value)
                  }
                  rows={4}
                  required
                  placeholder="Digite a resposta esperada para esta pergunta..."
                  className="w-full resize-none rounded-lg border border-slate-300 px-4 py-3 text-sm outline-none placeholder:text-slate-400 focus:border-slate-700 focus:ring-2 focus:ring-slate-200"
                />

                <p className="mt-2 text-xs text-slate-500">
                  Informe a resposta esperada para que o apresentador possa
                  comparar a resposta dada pela equipe.
                </p>
              </div>
            )}
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

            {erro && (
              <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {erro}
              </div>
            )}

            <div className="border-t border-slate-200 pt-5">
              <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                <button
                  type="submit"
                  disabled={salvando || carregandoAssuntos}
                  className="rounded-lg bg-slate-900 px-5 py-3 text-sm font-semibold text-white hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {salvando ? "Cadastrando..." : "Cadastrar pergunta"}
                </button>
              </div>
            </div>
          </form>
        </section>
      </div>
    </main>
  );
}
