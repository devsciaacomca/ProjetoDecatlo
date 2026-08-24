import { Pergunta } from "@/types/perguntas";

export default function Question({
  pergunta,
  numero,
  total,
  respostaVisivel,
}: {
  pergunta: Pergunta;
  numero: number;
  total: number;
  respostaVisivel: boolean;
}) {
  return (
    <section className="w-full max-w-6xl rounded-3xl bg-white p-5 text-slate-900 shadow-2xl sm:p-8 lg:p-10">
      <div className="mb-6 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-950 text-lg font-black text-white">
            {numero}
          </div>

          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-slate-400">
              Pergunta
            </p>

            <p className="font-bold">
              {numero} de {total}
            </p>
          </div>
        </div>

        <span className="rounded-full bg-slate-100 px-4 py-2 text-sm font-bold text-slate-600">
          {pergunta.assunto}
        </span>
      </div>

      <h1 className="mb-8 text-center text-2xl font-black leading-tight sm:text-3xl lg:text-4xl">
        {pergunta.enunciado}
      </h1>

      {pergunta.tipo === "objetiva" && pergunta.alternativas ? (
        <div className="grid gap-3 md:grid-cols-3">
          {pergunta.alternativas.map((alternativa, index) => {
            const correta =
              respostaVisivel && alternativa.texto === pergunta.respostaCorreta;

            return (
              <div
                key={alternativa.id}
                className={`
                  flex min-h-20 items-center gap-4 rounded-2xl border-2
                  px-5 py-4
                  ${
                    correta
                      ? "border-green-500 bg-green-50"
                      : "border-slate-200 bg-slate-50"
                  }
                `}
              >
                <div
                  className={`
                    flex h-10 w-10 shrink-0 items-center justify-center
                    rounded-full text-lg font-black
                    ${
                      correta
                        ? "bg-green-500 text-white"
                        : "bg-slate-950 text-white"
                    }
                  `}
                >
                  {String.fromCharCode(65 + index)}
                </div>

                <span className="text-lg font-bold">{alternativa.texto}</span>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="flex min-h-32 items-center justify-center rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50">
          <p className="font-bold text-slate-400">Pergunta aberta</p>
        </div>
      )}

      {respostaVisivel && pergunta.respostaCorreta && (
        <div className="mt-5 rounded-2xl bg-green-100 p-4 text-center font-black text-green-700">
          Resposta correta: {pergunta.respostaCorreta}
        </div>
      )}
    </section>
  );
}
