"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import type { PerguntaTipo } from "@/types/perguntas";

type Alternativa = { id: number; texto: string };

export default function EditarPerguntaPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const [carregando, setCarregando] = useState(true);
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState("");
  const [assunto, setAssunto] = useState("");
  const [tipo, setTipo] = useState<PerguntaTipo>("objetiva");
  const [enunciado, setEnunciado] = useState("");
  const [respostaCorreta, setRespostaCorreta] = useState("");
  const [explicacao, setExplicacao] = useState("");
  const [alternativas, setAlternativas] = useState<Alternativa[]>([]);

  useEffect(() => {
    async function carregar() {
      try {
        const response = await fetch(`/api/perguntas/${params.id}`, { cache: "no-store" });
        const json = await response.json();
        if (!response.ok || !json.success) throw new Error(json.error ?? "Erro ao carregar pergunta.");
        const p = json.data;
        setAssunto(p.assunto);
        setTipo(p.tipo);
        setEnunciado(p.enunciado);
        setRespostaCorreta(p.respostaCorreta);
        setExplicacao(p.explicacao);
        setAlternativas(p.alternativas ?? []);
      } catch (error) {
        setErro(error instanceof Error ? error.message : "Erro ao carregar pergunta.");
      } finally {
        setCarregando(false);
      }
    }
    carregar();
  }, [params.id]);

  async function salvar(event: React.FormEvent) {
    event.preventDefault();
    setSalvando(true);
    setErro("");

    try {
      const response = await fetch(`/api/perguntas/${params.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          assunto,
          tipo,
          enunciado,
          respostaCorreta,
          explicacao,
          alternativas: tipo === "objetiva" ? alternativas.filter((a) => a.texto.trim()) : [],
        }),
      });
      const json = await response.json();
      if (!response.ok || !json.success) throw new Error(json.error ?? "Erro ao salvar pergunta.");
      router.push("/dashboard/gerenciamento-perguntas");
    } catch (error) {
      setErro(error instanceof Error ? error.message : "Erro ao salvar pergunta.");
    } finally {
      setSalvando(false);
    }
  }

  if (carregando) {
    return <main className="flex-1 p-8 text-sm text-slate-500">Carregando pergunta...</main>;
  }

  return (
    <main className="flex-1 p-4 sm:p-6 lg:p-8">
      <div className="mx-auto w-full max-w-3xl">
        <section className="rounded-xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-200 px-5 py-4">
            <h1 className="text-lg font-semibold">Editar pergunta #{params.id}</h1>
          </div>
          <form onSubmit={salvar} className="space-y-5 p-5 sm:p-6">
            <input value={assunto} onChange={(e) => setAssunto(e.target.value)} required className="w-full rounded-lg border border-slate-300 px-4 py-3 text-sm" placeholder="Assunto" />
            <select value={tipo} onChange={(e) => setTipo(e.target.value as PerguntaTipo)} className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm">
              <option value="objetiva">Objetiva</option>
              <option value="aberta">Aberta</option>
            </select>
            <textarea value={enunciado} onChange={(e) => setEnunciado(e.target.value)} required rows={4} className="w-full rounded-lg border border-slate-300 px-4 py-3 text-sm" />
            <textarea value={explicacao} onChange={(e) => setExplicacao(e.target.value)} required rows={4} className="w-full rounded-lg border border-slate-300 px-4 py-3 text-sm" placeholder="Explicação" />
            <input value={respostaCorreta} onChange={(e) => setRespostaCorreta(e.target.value)} className="w-full rounded-lg border border-slate-300 px-4 py-3 text-sm" placeholder="Resposta correta" />

            {tipo === "objetiva" && (
              <div className="space-y-3">
                {alternativas.map((a, index) => (
                  <div key={a.id} className="flex gap-2">
                    <input value={a.texto} onChange={(e) => setAlternativas((prev) => prev.map((item) => item.id === a.id ? { ...item, texto: e.target.value } : item))} className="w-full rounded-lg border border-slate-300 px-4 py-3 text-sm" placeholder={`Alternativa ${String.fromCharCode(65 + index)}`} />
                    <button type="button" onClick={() => setAlternativas((prev) => prev.filter((item) => item.id !== a.id))} className="rounded-lg border border-red-200 px-3 text-red-600">×</button>
                  </div>
                ))}
                <button type="button" onClick={() => setAlternativas((prev) => [...prev, { id: Date.now(), texto: "" }])} className="rounded-lg border border-dashed border-slate-300 px-4 py-2 text-sm">+ Alternativa</button>
              </div>
            )}

            {erro && <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">{erro}</div>}

            <div className="flex gap-3">
              <button type="button" onClick={() => router.back()} className="rounded-lg border border-slate-300 px-5 py-3 text-sm">Cancelar</button>
              <button disabled={salvando} className="rounded-lg bg-slate-900 px-5 py-3 text-sm font-semibold text-white disabled:opacity-50">
                {salvando ? "Salvando..." : "Salvar alterações"}
              </button>
            </div>
          </form>
        </section>
      </div>
    </main>
  );
}
