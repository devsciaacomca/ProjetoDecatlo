import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

export default async function ImprimirPerguntasPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  if (!session.user.permissions?.includes("perguntas.gerenciar")) {
    redirect("/logout");
  }

  const perguntas = await prisma.pergunta.findMany({
    orderBy: [
      { assunto: "asc" },
      { id: "asc" },
    ],
    include: {
      alternativas: true,
    },
  });

  return (
    <div className="bg-white min-h-screen text-black p-8 print:p-0 mx-auto max-w-4xl" style={{ WebkitPrintColorAdjust: 'exact', printColorAdjust: 'exact' }}>
      <div className="mb-8 border-b-2 border-black pb-4 text-center mt-4">
        <h1 className="text-3xl font-black uppercase tracking-widest">Decatlo</h1>
        <p className="text-lg font-bold mt-2">Banco de Perguntas - Com Gabarito e Explicação</p>
      </div>

      <div className="space-y-12">
        {perguntas.map((pergunta, index) => (
          <div key={pergunta.id} className="break-inside-avoid">
            <div className="flex gap-2 text-sm font-bold uppercase text-slate-500 mb-2 border-b border-slate-200 pb-1">
              <span>#{pergunta.id}</span>
              <span>•</span>
              <span>{pergunta.assunto}</span>
              <span>•</span>
              <span>{pergunta.tipo === "objetiva" ? "Objetiva" : "Aberta"}</span>
            </div>
            
            <p className="text-lg font-semibold mb-4 leading-relaxed">{index + 1}. {pergunta.enunciado}</p>

            {pergunta.tipo === "objetiva" && pergunta.alternativas && (
              <div className="ml-6 space-y-2 mb-4">
                {pergunta.alternativas.map((alt, i) => {
                  const letra = String.fromCharCode(65 + i);
                  const isCorreta = letra === pergunta.respostaCorreta || alt.texto === pergunta.respostaCorreta;
                  return (
                    <div key={alt.id} className={`flex gap-3 ${isCorreta ? 'font-bold' : ''}`}>
                      <span>{letra})</span>
                      <span>{alt.texto}</span>
                    </div>
                  );
                })}
              </div>
            )}

            <div className="mt-4 rounded-lg bg-slate-100 p-4 border border-slate-300">
              <p className="text-sm font-bold uppercase tracking-widest text-slate-700 mb-1">Resposta Correta:</p>
              <p className="font-bold mb-3 text-slate-900">{pergunta.respostaCorreta}</p>
              
              <p className="text-sm font-bold uppercase tracking-widest text-slate-700 mb-1">Explicação Didática:</p>
              <p className="text-slate-800">{pergunta.explicacao || "Sem explicação registrada."}</p>
            </div>
          </div>
        ))}
      </div>

      <script dangerouslySetInnerHTML={{ __html: 'window.onload = function() { window.print(); }' }} />
    </div>
  );
}
