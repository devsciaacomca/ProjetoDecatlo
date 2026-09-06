"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import {
  ArrowLeft,
  ArrowLeftCircle,
  ArrowRight,
  Check,
  Eye,
  EyeOff,
  Minus,
  Monitor,
  Pause,
  Play,
  Plus,
  Radio,
  RotateCcw,
  SkipForward,
  Square,
  X,
} from "lucide-react";
import { GameProvider, useGame } from "@/contexts/GameContext";

function ControleContent() {
  const params = useParams<{ id: string }>();
  const {
    partida,
    pergunta,
    estado,
    configuracao,
    sincronizado,
    carregando,
    erro,
    iniciarPartida,
    pausarPartida,
    finalizarPartida,
    iniciarCronometro,
    pausarCronometro,
    reiniciarCronometro,
    proximaPergunta,
    perguntaAnterior,
    pularPergunta,
    trocarEquipe,
    definirEquipe,
    responder,
    adicionarPonto,
    removerPonto,
    mostrarResposta,
    esconderResposta,
  } = useGame();

  if (carregando) {
    return <div className="flex flex-1 items-center justify-center p-8 text-sm text-slate-500">Carregando partida...</div>;
  }

  if (erro) {
    return <div className="flex flex-1 items-center justify-center p-8"><div className="rounded-xl border border-red-200 bg-red-50 p-5 text-sm text-red-700">{erro}</div></div>;
  }

  const equipeDaVez = estado.equipeDaVez === "A" ? partida.equipe1 : partida.equipe2;
  const progresso = configuracao.totalPerguntas > 0 ? Math.round((estado.perguntaAtual / configuracao.totalPerguntas) * 100) : 0;

  return (
    <main className="flex-1 p-4 sm:p-6 lg:p-8">
      <div className="mx-auto w-full max-w-7xl">
        <header className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <Link href={`/dashboard/partidas/${params.id}`} className="mb-3 inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-900"><ArrowLeft size={16} /> Voltar para partida</Link>
            <h1 className="text-xl font-semibold sm:text-2xl">Controle da partida</h1>
            <p className="mt-1 text-sm text-slate-500">{partida.nome}</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <div className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm"><Radio size={16} className={sincronizado ? "text-green-600" : "text-slate-400"} />{sincronizado ? "Telão conectado" : "Aguardando telão"}</div>
            <Link href={`/telao/${params.id}`} target="_blank" className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold hover:bg-slate-50"><Monitor size={17} /> Abrir telão</Link>
          </div>
        </header>

        <section className="mb-5 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div><p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Status</p><p className="mt-2 font-semibold">{estado.status === "em_andamento" ? "Partida em andamento" : estado.status === "pausada" ? "Partida pausada" : estado.status === "finalizada" ? "Partida finalizada" : "Aguardando início"}</p></div>
            <div className="flex flex-wrap gap-2">
              {estado.status !== "em_andamento" && estado.status !== "finalizada" && <button onClick={iniciarPartida} className="inline-flex items-center gap-2 rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white"><Play size={16}/> Iniciar partida</button>}
              {estado.status === "em_andamento" && <button onClick={pausarPartida} className="inline-flex items-center gap-2 rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-semibold"><Pause size={16}/> Pausar partida</button>}
              {estado.status !== "finalizada" && <button onClick={finalizarPartida} className="inline-flex items-center gap-2 rounded-lg border border-red-200 px-4 py-2.5 text-sm font-semibold text-red-600"><Square size={15}/> Finalizar</button>}
            </div>
          </div>
        </section>

        <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div><p className="text-sm text-slate-500">Progresso</p><p className="mt-1 text-lg font-semibold">Pergunta {estado.perguntaAtual} de {configuracao.totalPerguntas}</p></div>
            <div className="w-full sm:w-72"><div className="mb-2 flex justify-between text-xs text-slate-500"><span>Progresso</span><span>{progresso}%</span></div><div className="h-2 overflow-hidden rounded-full bg-slate-200"><div className="h-full bg-slate-900 transition-all" style={{ width: `${progresso}%` }}/></div></div>
          </div>
        </section>

        <section className="mt-5 grid gap-4 sm:grid-cols-2">
          {(["A", "B"] as const).map((equipe) => {
            const nome = equipe === "A" ? partida.equipe1 : partida.equipe2;
            const pontos = equipe === "A" ? estado.pontos.equipe1 : estado.pontos.equipe2;
            return <div key={equipe} className={`rounded-xl border p-5 shadow-sm ${estado.equipeDaVez === equipe ? "border-slate-900 bg-slate-50" : "border-slate-200 bg-white"}`}>
              <div className="flex items-center justify-between"><p className="font-semibold">{nome}</p>{estado.equipeDaVez === equipe && <span className="rounded-full bg-slate-900 px-2.5 py-1 text-xs font-semibold text-white">Vez</span>}</div>
              <p className="mt-2 text-4xl font-bold">{pontos}</p>
              <div className="mt-4 flex gap-2"><button onClick={() => removerPonto(equipe)} className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-300"><Minus size={16}/></button><button onClick={() => adicionarPonto(equipe)} className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-slate-900 text-white"><Plus size={16}/></button><button onClick={() => definirEquipe(equipe)} className="ml-2 rounded-lg border border-slate-300 px-3 text-xs font-semibold">Definir vez</button></div>
            </div>;
          })}
        </section>

        <section className="mt-5 grid gap-5 lg:grid-cols-3">
          <div className="rounded-xl border border-slate-200 bg-white shadow-sm lg:col-span-2">
            <div className="border-b border-slate-200 px-6 py-5 flex items-center justify-between"><div><p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Pergunta {estado.perguntaAtual}</p><p className="mt-1 text-sm font-semibold">Equipe da vez: {equipeDaVez}</p></div><div className="rounded-lg bg-slate-100 px-4 py-2 text-center"><p className="text-xs text-slate-500">Tempo</p><p className="text-2xl font-bold tabular-nums">{estado.tempoRestante}s</p></div></div>
            <div className="p-6">
              {pergunta ? <><div className="rounded-xl bg-slate-50 p-6"><div className="mb-3 flex flex-wrap gap-2"><span className="rounded-full bg-slate-200 px-2.5 py-1 text-xs font-semibold text-slate-600">{pergunta.assunto}</span><span className="rounded-full bg-slate-200 px-2.5 py-1 text-xs font-semibold text-slate-600">{pergunta.tipo}</span></div><p className="text-lg font-semibold leading-8">{pergunta.enunciado}</p></div>
                {pergunta.tipo === "objetiva" && pergunta.alternativas && <div className="mt-6 grid gap-3 sm:grid-cols-2">{pergunta.alternativas.map((a, i) => <div key={a.id} className="rounded-lg border border-slate-200 p-4"><span className="mr-3 inline-flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-sm font-semibold">{String.fromCharCode(65+i)}</span>{a.texto}</div>)}</div>}
                {estado.respostaVisivel && <div className="mt-6 rounded-xl border border-green-200 bg-green-50 p-5"><p className="text-xs font-bold uppercase tracking-wide text-green-700">Resposta correta</p><p className="mt-1 font-bold text-green-900">{pergunta.respostaCorreta}</p>{configuracao.mostrarExplicacao && pergunta.explicacao && <p className="mt-3 text-sm text-green-900">{pergunta.explicacao}</p>}</div>}
              </> : <div className="rounded-xl bg-slate-50 p-8 text-center text-sm text-slate-500">Nenhuma pergunta encontrada para esta posição.</div>}
            </div>
          </div>

          <aside className="rounded-xl border border-slate-200 bg-white shadow-sm"><div className="border-b border-slate-200 px-5 py-5"><h2 className="font-semibold">Controles</h2><p className="mt-1 text-sm text-slate-500">Ações do apresentador.</p></div><div className="space-y-4 p-5">
            <div><p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">Cronômetro</p><div className="grid grid-cols-3 gap-2"><button onClick={iniciarCronometro} disabled={estado.status === "finalizada"} className="rounded-lg bg-slate-900 px-2 py-3 text-white"><Play size={16} className="mx-auto"/></button><button onClick={pausarCronometro} disabled={estado.cronometroFimEm === null} className="rounded-lg border px-2 py-3"><Pause size={16} className="mx-auto"/></button><button onClick={reiniciarCronometro} disabled={estado.status === "finalizada"} className="rounded-lg border px-2 py-3"><RotateCcw size={16} className="mx-auto"/></button></div></div>
            <div><p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">Resposta</p><div className="grid grid-cols-2 gap-2"><button onClick={() => responder("correta")} className="rounded-lg bg-green-600 px-3 py-3 text-sm font-semibold text-white"><Check size={16} className="mx-auto mb-1"/>Correta</button><button onClick={() => responder("incorreta")} className="rounded-lg bg-red-600 px-3 py-3 text-sm font-semibold text-white"><X size={16} className="mx-auto mb-1"/>Incorreta</button></div><div className="mt-2 grid grid-cols-2 gap-2"><button onClick={mostrarResposta} className="rounded-lg border px-3 py-2 text-xs font-semibold"><Eye size={15} className="mr-1 inline"/>Mostrar</button><button onClick={esconderResposta} className="rounded-lg border px-3 py-2 text-xs font-semibold"><EyeOff size={15} className="mr-1 inline"/>Esconder</button></div></div>
            <div><p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">Perguntas</p><div className="grid grid-cols-2 gap-2"><button onClick={perguntaAnterior} disabled={estado.perguntaAtual <= 1} className="rounded-lg border px-3 py-3 text-sm font-semibold disabled:opacity-40"><ArrowLeftCircle size={16} className="mx-auto mb-1"/>Anterior</button><button onClick={proximaPergunta} className="rounded-lg border px-3 py-3 text-sm font-semibold"><ArrowRight size={16} className="mx-auto mb-1"/>Próxima</button></div>{configuracao.permitirPular && <button onClick={pularPergunta} className="mt-2 w-full rounded-lg border border-dashed px-3 py-2.5 text-sm font-semibold"><SkipForward size={15} className="mr-1 inline"/>Pular pergunta</button>}</div>
            <button onClick={trocarEquipe} className="w-full rounded-lg bg-slate-100 px-3 py-2.5 text-sm font-semibold hover:bg-slate-200">Trocar equipe da vez</button>
          </div></aside>
        </section>
      </div>
    </main>
  );
}

export default function ControlePage() {
  const params = useParams<{ id: string }>();
  return <GameProvider partidaId={params.id} role="control"><ControleContent /></GameProvider>;
}
