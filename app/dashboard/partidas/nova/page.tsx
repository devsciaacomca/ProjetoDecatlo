"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

type TipoPergunta = "objetiva" | "aberta";

export default function NovaPartidaPage() {
  const router = useRouter();

  const [nomeJogo, setNomeJogo] = useState("Decatlo");
  const [equipe1, setEquipe1] = useState("");
  const [equipe2, setEquipe2] = useState("");

  const [tipoPergunta, setTipoPergunta] =
    useState<TipoPergunta>("objetiva");
  const [tempoResposta, setTempoResposta] = useState(30);
  const [totalPerguntas, setTotalPerguntas] = useState(20);
  const [embaralharPerguntas, setEmbaralharPerguntas] = useState(false);
  const [mostrarExplicacao, setMostrarExplicacao] = useState(true);
  const [permitirPular, setPermitirPular] = useState(true);

  const [assuntos, setAssuntos] = useState<string[]>([]);
  const [assuntosSelecionados, setAssuntosSelecionados] = useState<string[]>(
    [],
  );
  const [carregandoAssuntos, setCarregandoAssuntos] = useState(true);
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState("");

  useEffect(() => {
    async function carregarAssuntos() {
      try {
        const response = await fetch("/api/perguntas?assuntos=true");
        const resultado = await response.json();

        if (!response.ok || !resultado.success) {
          throw new Error(resultado.error || "Erro ao carregar assuntos.");
        }

        setAssuntos(resultado.data ?? []);
      } catch (error) {
        setErro(
          error instanceof Error
            ? error.message
            : "Erro ao carregar assuntos.",
        );
      } finally {
        setCarregandoAssuntos(false);
      }
    }

    carregarAssuntos();
  }, []);

  function alternarAssunto(assunto: string) {
    setAssuntosSelecionados((prev) =>
      prev.includes(assunto)
        ? prev.filter((item) => item !== assunto)
        : [...prev, assunto],
    );
  }

  async function criarPartida() {
    setErro("");

    if (!nomeJogo.trim() || !equipe1.trim() || !equipe2.trim()) {
      setErro("Preencha o nome da partida e as duas equipes.");
      return;
    }

    if (equipe1.trim() === equipe2.trim()) {
      setErro("As duas equipes precisam ser diferentes.");
      return;
    }

    if (assuntosSelecionados.length === 0) {
      setErro("Selecione pelo menos um assunto.");
      return;
    }

    setSalvando(true);

    try {
      const response = await fetch("/api/partidas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nome: nomeJogo.trim(),
          equipe1: equipe1.trim(),
          equipe2: equipe2.trim(),
          tipoPergunta,
          totalPerguntas,
          tempoResposta,
          embaralharPerguntas,
          mostrarExplicacao,
          permitirPular,
          assuntos: assuntosSelecionados,
        }),
      });

      const resultado = await response.json();

      if (!response.ok || !resultado.success) {
        throw new Error(
          resultado.error || "Não foi possível criar a partida.",
        );
      }

      router.push("/dashboard/partidas");
    } catch (error) {
      setErro(
        error instanceof Error
          ? error.message
          : "Não foi possível criar a partida.",
      );
    } finally {
      setSalvando(false);
    }
  }

  return (
    <main className="flex-1 p-4 sm:p-6 lg:p-8">
      <div className="mx-auto w-full max-w-5xl">
        <div className="mb-6">
          <h1 className="text-xl font-semibold sm:text-2xl">Nova partida</h1>
          <p className="mt-1 text-sm text-slate-500">
            Configure a partida e selecione os assuntos que serão usados.
          </p>
        </div>

        <div className="space-y-6">
          <section className="rounded-xl border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-200 px-5 py-4">
              <h2 className="font-semibold">Informações gerais</h2>
            </div>

            <div className="grid gap-5 p-5 sm:grid-cols-3">
              <div className="sm:col-span-3">
                <label className="mb-2 block text-sm font-medium">
                  Nome da partida
                </label>
                <input
                  value={nomeJogo}
                  onChange={(e) => setNomeJogo(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 px-4 py-3 text-sm outline-none focus:border-slate-700"
                  placeholder="Ex.: Decatlo 2026"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium">
                  Equipe 1
                </label>
                <input
                  value={equipe1}
                  onChange={(e) => setEquipe1(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 px-4 py-3 text-sm outline-none focus:border-slate-700"
                  placeholder="Nome da equipe"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium">
                  Equipe 2
                </label>
                <input
                  value={equipe2}
                  onChange={(e) => setEquipe2(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 px-4 py-3 text-sm outline-none focus:border-slate-700"
                  placeholder="Nome da equipe"
                />
              </div>
            </div>
          </section>

          <section className="rounded-xl border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-200 px-5 py-4">
              <h2 className="font-semibold">Perguntas</h2>
              <p className="mt-1 text-sm text-slate-500">
                Os assuntos abaixo são carregados diretamente do banco.
              </p>
            </div>

            <div className="space-y-6 p-5">
              <div>
                <label className="mb-3 block text-sm font-medium">
                  Tipo de pergunta
                </label>

                <div className="grid gap-3 sm:grid-cols-2">
                  {(["objetiva", "aberta"] as TipoPergunta[]).map((tipo) => (
                    <label
                      key={tipo}
                      className={`flex cursor-pointer items-center gap-3 rounded-lg border p-4 ${
                        tipoPergunta === tipo
                          ? "border-slate-900 bg-slate-50"
                          : "border-slate-200"
                      }`}
                    >
                      <input
                        type="radio"
                        name="tipo"
                        checked={tipoPergunta === tipo}
                        onChange={() => setTipoPergunta(tipo)}
                        className="h-4 w-4 accent-slate-900"
                      />
                      <span className="text-sm font-medium">
                        {tipo === "objetiva" ? "Objetiva" : "Direta / Aberta"}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-medium">
                    Total de perguntas
                  </label>
                  <input
                    type="number"
                    min={1}
                    value={totalPerguntas}
                    onChange={(e) => setTotalPerguntas(Number(e.target.value))}
                    className="w-full rounded-lg border border-slate-300 px-4 py-3 text-sm outline-none focus:border-slate-700"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium">
                    Tempo de resposta
                  </label>
                  <div className="flex">
                    <input
                      type="number"
                      min={5}
                      value={tempoResposta}
                      onChange={(e) => setTempoResposta(Number(e.target.value))}
                      className="min-w-0 flex-1 rounded-l-lg border border-r-0 border-slate-300 px-4 py-3 text-sm outline-none"
                    />
                    <span className="flex items-center rounded-r-lg border border-slate-300 bg-slate-50 px-4 text-sm text-slate-500">
                      segundos
                    </span>
                  </div>
                </div>
              </div>

              <div>
                <label className="mb-3 block text-sm font-medium">
                  Assuntos
                </label>

                {carregandoAssuntos ? (
                  <p className="rounded-lg border border-slate-200 bg-slate-50 p-4 text-sm text-slate-500">
                    Carregando assuntos...
                  </p>
                ) : assuntos.length === 0 ? (
                  <p className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-700">
                    Nenhum assunto cadastrado no banco.
                  </p>
                ) : (
                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                    {assuntos.map((assunto) => (
                      <label
                        key={assunto}
                        className={`flex cursor-pointer items-center gap-2 rounded-lg border p-3 text-sm transition ${
                          assuntosSelecionados.includes(assunto)
                            ? "border-slate-900 bg-slate-50"
                            : "border-slate-200 hover:bg-slate-50"
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={assuntosSelecionados.includes(assunto)}
                          onChange={() => alternarAssunto(assunto)}
                          className="h-4 w-4 accent-slate-900"
                        />
                        <span>{assunto}</span>
                      </label>
                    ))}
                  </div>
                )}
              </div>

              <div className="space-y-3">
                <label className="flex cursor-pointer items-center justify-between rounded-lg border border-slate-200 p-4">
                  <span>
                    <span className="block text-sm font-medium">
                      Embaralhar perguntas
                    </span>
                    <span className="text-xs text-slate-500">
                      Sorteia a ordem antes de salvar a partida.
                    </span>
                  </span>
                  <input
                    type="checkbox"
                    checked={embaralharPerguntas}
                    onChange={(e) => setEmbaralharPerguntas(e.target.checked)}
                    className="h-4 w-4 accent-slate-900"
                  />
                </label>

                <label className="flex cursor-pointer items-center justify-between rounded-lg border border-slate-200 p-4">
                  <span>
                    <span className="block text-sm font-medium">
                      Permitir pular pergunta
                    </span>
                    <span className="text-xs text-slate-500">
                      O apresentador poderá avançar sem responder.
                    </span>
                  </span>
                  <input
                    type="checkbox"
                    checked={permitirPular}
                    onChange={(e) => setPermitirPular(e.target.checked)}
                    className="h-4 w-4 accent-slate-900"
                  />
                </label>

                <label className="flex cursor-pointer items-center justify-between rounded-lg border border-slate-200 p-4">
                  <span>
                    <span className="block text-sm font-medium">
                      Mostrar explicação
                    </span>
                    <span className="text-xs text-slate-500">
                      Disponibiliza a explicação após a resposta.
                    </span>
                  </span>
                  <input
                    type="checkbox"
                    checked={mostrarExplicacao}
                    onChange={(e) => setMostrarExplicacao(e.target.checked)}
                    className="h-4 w-4 accent-slate-900"
                  />
                </label>
              </div>
            </div>
          </section>

          {erro && (
            <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
              {erro}
            </div>
          )}

          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <Link
              href="/dashboard/partidas"
              className="rounded-lg border border-slate-300 px-5 py-3 text-center text-sm font-semibold text-slate-700 hover:bg-slate-50"
            >
              Cancelar
            </Link>

            <button
              type="button"
              onClick={criarPartida}
              disabled={salvando || carregandoAssuntos || assuntos.length === 0}
              className="rounded-lg bg-slate-900 px-5 py-3 text-sm font-semibold text-white hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {salvando ? "Criando partida..." : "Criar partida"}
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
