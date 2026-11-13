import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect, notFound } from "next/navigation";

type Props = { params: Promise<{ id: string }> };

export default async function ImprimirPartidaPage({ params }: Props) {
  const session = await auth();
  if (!session?.user) redirect("/login");
  if (!session.user.permissions?.includes("perguntas.gerenciar") && !session.user.permissions?.includes("jogo.gerenciar")) redirect("/logout");
  const { id } = await params;
  const partida = await prisma.partida.findUnique({
    where: { id },
    include: { perguntasSelecionadas: { orderBy: { ordem: "asc" }, include: { pergunta: { include: { alternativas: true } } } } },
  });
  if (!partida) notFound();
  return <main className="mx-auto min-h-screen max-w-4xl bg-white p-6 text-black print:p-0">
    <style>{`@media print { @page { size: A4; margin: 14mm; } body { background: white !important; } .no-print { display:none !important; } .question { break-inside: avoid; page-break-inside: avoid; } }`}</style>
    <p className="no-print mb-6 text-right text-sm text-slate-500">A janela de impressão será aberta automaticamente.</p>
    <header className="mb-8 border-b-2 border-black pb-4 text-center"><h1 className="text-2xl font-black">DECATLO</h1><h2 className="mt-2 text-lg font-bold">{partida.nome}</h2><p>{partida.equipe1} × {partida.equipe2}</p><p className="mt-1 text-sm">Perguntas da partida — com gabarito</p></header>
    <div className="space-y-8">{partida.perguntasSelecionadas.map(({ ordem, pergunta }) => <article className="question" key={pergunta.id}><p className="mb-2 text-xs font-bold uppercase text-slate-600">Pergunta {ordem} · {pergunta.assunto} · {pergunta.tipo}</p><h3 className="mb-3 text-base font-semibold">{pergunta.enunciado}</h3>{pergunta.tipo === "objetiva" && <ol className="mb-3 ml-6 list-[upper-alpha] space-y-1">{pergunta.alternativas.map((a) => <li key={a.id}>{a.texto}</li>)}</ol>}<div className="rounded border border-slate-300 bg-slate-50 p-3"><p><strong>Resposta:</strong> {pergunta.respostaCorreta}</p>{pergunta.explicacao && <p className="mt-2"><strong>Explicação:</strong> {pergunta.explicacao}</p>}</div></article>)}</div>
    <script dangerouslySetInnerHTML={{ __html: "window.addEventListener('load', () => window.print());" }} />
  </main>;
}
