"use client";

import { useState } from "react";

import Link from "next/link";

type TipoPergunta = "objetiva" | "aberta";

export default function NovaPartidaPage() {
  const [nomeJogo, setNomeJogo] = useState("Decatlo");
  const [equipe1, setEquipe1] = useState("Alfa 1");
  const [equipe2, setEquipe2] = useState("Alfa 2");

  const [tipoPergunta, setTipoPergunta] = useState<TipoPergunta>("objetiva");

  const [tempoResposta, setTempoResposta] = useState(30);
  const [totalPerguntas, setTotalPerguntas] = useState(20);

  const [embaralharPerguntas, setEmbaralharPerguntas] = useState(false);

  const [mostrarExplicacao, setMostrarExplicacao] = useState(true);

  const [permitirPular, setPermitirPular] = useState(true);

  return (
    <main className="flex-1 p-4 sm:p-6 lg:p-8">
      <div className="mx-auto w-full max-w-6xl">
        {/* Cabeçalho da página */}
        <div className="mb-6">
          <h1 className="text-xl font-semibold sm:text-2xl">Nova partida</h1>

          <p className="mt-1 text-sm text-slate-500">
            Configure os detalhes da partida antes de iniciar o jogo.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Coluna principal */}
          <div className="space-y-6 lg:col-span-2">
            {/* Informações gerais */}
            <section className="rounded-xl border border-slate-200 bg-white shadow-sm">
              <div className="border-b border-slate-200 px-5 py-4 sm:px-6 sm:py-5">
                <h2 className="text-base font-semibold">Informações gerais</h2>

                <p className="mt-1 text-sm text-slate-500">
                  Defina as informações básicas da partida.
                </p>
              </div>

              <div className="space-y-5 p-5 sm:p-6">
                <div>
                  <label
                    htmlFor="nome-jogo"
                    className="mb-2 block text-sm font-medium"
                  >
                    Nome da partida
                  </label>

                  <input
                    id="nome-jogo"
                    type="text"
                    value={nomeJogo}
                    onChange={(event) => setNomeJogo(event.target.value)}
                    className="w-full rounded-lg border border-slate-300 px-4 py-3 text-sm outline-none placeholder:text-slate-400 focus:border-slate-700 focus:ring-2 focus:ring-slate-200"
                    placeholder="Ex.: Decatlo 2026"
                  />
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label
                      htmlFor="equipe-1"
                      className="mb-2 block text-sm font-medium"
                    >
                      Equipe 1
                    </label>

                    <select
                      id="equipe-1"
                      value={equipe1}
                      onChange={(event) => setEquipe1(event.target.value)}
                      className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm outline-none focus:border-slate-700 focus:ring-2 focus:ring-slate-200"
                    >
                      <option>Alfa 1</option>
                      <option>Alfa 2</option>
                      <option>Alfa 3</option>
                      <option>Alfa 4</option>
                    </select>
                  </div>

                  <div>
                    <label
                      htmlFor="equipe-2"
                      className="mb-2 block text-sm font-medium"
                    >
                      Equipe 2
                    </label>

                    <select
                      id="equipe-2"
                      value={equipe2}
                      onChange={(event) => setEquipe2(event.target.value)}
                      className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm outline-none focus:border-slate-700 focus:ring-2 focus:ring-slate-200"
                    >
                      <option>Alfa 1</option>
                      <option>Alfa 2</option>
                      <option>Bravo 1</option>
                      <option>Bravo 2</option>
                    </select>
                  </div>
                </div>
              </div>
            </section>

            {/* Equipes e avatares */}
            <section className="rounded-xl border border-slate-200 bg-white shadow-sm">
              <div className="border-b border-slate-200 px-5 py-4 sm:px-6 sm:py-5">
                <h2 className="text-base font-semibold">
                  Equipes e apresentação
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Configure os elementos que serão apresentados no telão.
                </p>
              </div>

              <div className="space-y-5 p-5 sm:p-6">
                <div className="grid gap-5 sm:grid-cols-2">
                  {/* Equipe 1 */}
                  <div className="rounded-lg border border-slate-200 p-4">
                    <p className="text-sm font-semibold">{equipe1}</p>

                    <p className="mt-1 text-xs text-slate-500">
                      Avatar da equipe
                    </p>

                    <div className="mt-4 flex h-32 items-center justify-center rounded-lg bg-slate-100">
                      <span className="text-sm text-slate-400">
                        Pré-visualização
                      </span>
                    </div>

                    <button
                      type="button"
                      className="mt-3 w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
                    >
                      Selecionar mídia
                    </button>
                  </div>

                  {/* Equipe 2 */}
                  <div className="rounded-lg border border-slate-200 p-4">
                    <p className="text-sm font-semibold">{equipe2}</p>

                    <p className="mt-1 text-xs text-slate-500">
                      Avatar da equipe
                    </p>

                    <div className="mt-4 flex h-32 items-center justify-center rounded-lg bg-slate-100">
                      <span className="text-sm text-slate-400">
                        Pré-visualização
                      </span>
                    </div>

                    <button
                      type="button"
                      className="mt-3 w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
                    >
                      Selecionar mídia
                    </button>
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="tipo-avatar"
                    className="mb-2 block text-sm font-medium"
                  >
                    Tipo de mídia
                  </label>

                  <select
                    id="tipo-avatar"
                    className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm outline-none focus:border-slate-700 focus:ring-2 focus:ring-slate-200"
                  >
                    <option>Vídeo</option>
                    <option>Imagem</option>
                  </select>

                  <p className="mt-2 text-xs text-slate-500">
                    O vídeo ou imagem será utilizado na tela de apresentação
                    durante a partida.
                  </p>
                </div>
              </div>
            </section>

            {/* Perguntas */}
            <section className="rounded-xl border border-slate-200 bg-white shadow-sm">
              <div className="border-b border-slate-200 px-5 py-4 sm:px-6 sm:py-5">
                <h2 className="text-base font-semibold">
                  Configuração das perguntas
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Defina como as perguntas serão selecionadas durante a partida.
                </p>
              </div>

              <div className="space-y-6 p-5 sm:p-6">
                {/* Tipo */}
                <div>
                  <label className="mb-3 block text-sm font-medium">
                    Tipo de pergunta
                  </label>

                  <div className="grid gap-3 sm:grid-cols-2">
                    <label
                      className={`flex cursor-pointer items-center gap-3 rounded-lg border p-4 transition ${
                        tipoPergunta === "objetiva"
                          ? "border-slate-900 bg-slate-50"
                          : "border-slate-200"
                      }`}
                    >
                      <input
                        type="radio"
                        name="tipo-pergunta"
                        checked={tipoPergunta === "objetiva"}
                        onChange={() => setTipoPergunta("objetiva")}
                        className="h-4 w-4 accent-slate-900"
                      />

                      <div>
                        <p className="text-sm font-medium">Objetiva</p>

                        <p className="text-xs text-slate-500">
                          Possui alternativas de resposta.
                        </p>
                      </div>
                    </label>

                    <label
                      className={`flex cursor-pointer items-center gap-3 rounded-lg border p-4 transition ${
                        tipoPergunta === "aberta"
                          ? "border-slate-900 bg-slate-50"
                          : "border-slate-200"
                      }`}
                    >
                      <input
                        type="radio"
                        name="tipo-pergunta"
                        checked={tipoPergunta === "aberta"}
                        onChange={() => setTipoPergunta("aberta")}
                        className="h-4 w-4 accent-slate-900"
                      />

                      <div>
                        <p className="text-sm font-medium">Direta / Aberta</p>

                        <p className="text-xs text-slate-500">
                          Resposta livre avaliada pelo apresentador.
                        </p>
                      </div>
                    </label>
                  </div>
                </div>

                {/* Quantidade */}
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label
                      htmlFor="total-perguntas"
                      className="mb-2 block text-sm font-medium"
                    >
                      Total de perguntas
                    </label>

                    <input
                      id="total-perguntas"
                      type="number"
                      min={1}
                      value={totalPerguntas}
                      onChange={(event) =>
                        setTotalPerguntas(Number(event.target.value))
                      }
                      className="w-full rounded-lg border border-slate-300 px-4 py-3 text-sm outline-none focus:border-slate-700 focus:ring-2 focus:ring-slate-200"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="tempo-resposta"
                      className="mb-2 block text-sm font-medium"
                    >
                      Tempo de resposta
                    </label>

                    <div className="flex">
                      <input
                        id="tempo-resposta"
                        type="number"
                        min={5}
                        value={tempoResposta}
                        onChange={(event) =>
                          setTempoResposta(Number(event.target.value))
                        }
                        className="min-w-0 flex-1 rounded-l-lg border border-r-0 border-slate-300 px-4 py-3 text-sm outline-none focus:border-slate-700 focus:ring-2 focus:ring-slate-200"
                      />

                      <span className="flex items-center rounded-r-lg border border-slate-300 bg-slate-50 px-4 text-sm text-slate-500">
                        segundos
                      </span>
                    </div>
                  </div>
                </div>

                {/* Assuntos */}
                <div>
                  <label className="mb-3 block text-sm font-medium">
                    Assuntos
                  </label>

                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                    {[
                      "História",
                      "Geografia",
                      "Português",
                      "Matemática",
                      "Ciências",
                      "Atualidades",
                    ].map((assunto) => (
                      <label
                        key={assunto}
                        className="flex cursor-pointer items-center gap-2 rounded-lg border border-slate-200 p-3 text-sm hover:bg-slate-50"
                      >
                        <input
                          type="checkbox"
                          defaultChecked={
                            assunto === "História" || assunto === "Geografia"
                          }
                          className="h-4 w-4 rounded accent-slate-900"
                        />

                        <span>{assunto}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Opções */}
                <div>
                  <label className="mb-3 block text-sm font-medium">
                    Opções da partida
                  </label>

                  <div className="space-y-3">
                    <label className="flex cursor-pointer items-center justify-between rounded-lg border border-slate-200 p-4">
                      <div>
                        <p className="text-sm font-medium">
                          Embaralhar perguntas
                        </p>

                        <p className="text-xs text-slate-500">
                          Altera a ordem das perguntas a cada partida.
                        </p>
                      </div>

                      <input
                        type="checkbox"
                        checked={embaralharPerguntas}
                        onChange={(event) =>
                          setEmbaralharPerguntas(event.target.checked)
                        }
                        className="h-4 w-4 accent-slate-900"
                      />
                    </label>

                    <label className="flex cursor-pointer items-center justify-between rounded-lg border border-slate-200 p-4">
                      <div>
                        <p className="text-sm font-medium">
                          Permitir pular pergunta
                        </p>

                        <p className="text-xs text-slate-500">
                          O apresentador poderá avançar sem responder.
                        </p>
                      </div>

                      <input
                        type="checkbox"
                        checked={permitirPular}
                        onChange={(event) =>
                          setPermitirPular(event.target.checked)
                        }
                        className="h-4 w-4 accent-slate-900"
                      />
                    </label>

                    <label className="flex cursor-pointer items-center justify-between rounded-lg border border-slate-200 p-4">
                      <div>
                        <p className="text-sm font-medium">
                          Mostrar explicação
                        </p>

                        <p className="text-xs text-slate-500">
                          Disponibiliza a explicação didática após a resposta.
                        </p>
                      </div>

                      <input
                        type="checkbox"
                        checked={mostrarExplicacao}
                        onChange={(event) =>
                          setMostrarExplicacao(event.target.checked)
                        }
                        className="h-4 w-4 accent-slate-900"
                      />
                    </label>
                  </div>
                </div>
              </div>
            </section>
          </div>

          {/* Resumo */}
          <aside className="lg:col-span-1">
            <div className="sticky top-24 rounded-xl border border-slate-200 bg-white shadow-sm">
              <div className="border-b border-slate-200 px-5 py-4">
                <h2 className="text-base font-semibold">Resumo da partida</h2>

                <p className="mt-1 text-xs text-slate-500">
                  Confira as configurações atuais.
                </p>
              </div>

              <div className="space-y-4 p-5">
                <div>
                  <p className="text-xs text-slate-500">Partida</p>

                  <p className="mt-1 text-sm font-medium">
                    {nomeJogo || "Sem nome"}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-slate-500">Equipe 1</p>

                    <p className="mt-1 text-sm font-medium">{equipe1}</p>
                  </div>

                  <div>
                    <p className="text-xs text-slate-500">Equipe 2</p>

                    <p className="mt-1 text-sm font-medium">{equipe2}</p>
                  </div>
                </div>

                <div className="border-t border-slate-100 pt-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-500">Tipo</span>

                    <span className="text-sm font-medium">
                      {tipoPergunta === "objetiva" ? "Objetiva" : "Aberta"}
                    </span>
                  </div>

                  <div className="mt-3 flex items-center justify-between">
                    <span className="text-sm text-slate-500">Perguntas</span>

                    <span className="text-sm font-medium">
                      {totalPerguntas}
                    </span>
                  </div>

                  <div className="mt-3 flex items-center justify-between">
                    <span className="text-sm text-slate-500">Tempo</span>

                    <span className="text-sm font-medium">
                      {tempoResposta}s
                    </span>
                  </div>
                </div>

                <div className="rounded-lg bg-slate-50 p-4">
                  <p className="text-xs font-medium text-slate-600">
                    Salvamento automático
                  </p>

                  <p className="mt-1 text-xs leading-5 text-slate-500">
                    As alterações desta configuração serão salvas
                    automaticamente.
                  </p>
                </div>

                <Link
                  href="/dashboard/partidas/123"
                  className="w-full rounded-lg bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
                >
                  Criar partida
                </Link>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
