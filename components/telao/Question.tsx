interface QuestionProps {
  questionNumber: number;
  question: string;
  alternatives: string[];
  correctAnswer: number;
  explanation: string;
}

export default function Question({
  questionNumber,
  question,
  alternatives,
  correctAnswer,
  explanation,
}: QuestionProps) {
  return (
    <section className="w-full rounded-xl border border-slate-200 bg-white p-8 text-center shadow-sm sm:p-12">
      <div className="flex flex-col items-start">
        <p className="text-sm text-slate-400">Pergunta {questionNumber}</p>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
          {question}
        </h1>
        <div className="flex gap-1 w-full mt-4 justify-between">
          {alternatives.map((alternative, index) => (
            <p
              key={alternative}
              className="rounded-md bg-slate-900 px-5 py-3 text-md text-white text-left"
            >
              {String.fromCharCode(65 + index)}) {alternative}
            </p>
          ))}
        </div>
      </div>
    </section>
  );
}
