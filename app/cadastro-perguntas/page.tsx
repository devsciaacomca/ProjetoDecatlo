import Footer from "@/components/Footer";
import Header from "@/components/Header";

export default function CadastroPerguntasPage() {
  return (
    <main className="min-h-screen bg-slate-100">
      <Header />
      <div className="mx-auto w-full max-w-3xl px-4 py-10">
        {/* Cabeçalho */}
        <header className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-slate-900">
            <span className="text-2xl font-bold text-white"> MB </span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            Cadastro de Perguntas
          </h1>
          <p className="mt-2 text-sm text-slate-600">
            Sistema de Arguição — Decatlo
          </p>
        </header>
        {/* Formulário */}
        <section className="rounded-xl border border-slate-300 bg-white shadow-sm">
          {/* Título da seção */}
          <div className="border-b border-slate-200 px-6 py-5">
            <h2 className="text-lg font-semibold text-slate-900">
              Nova pergunta
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Preencha as informações da pergunta abaixo.
            </p>
          </div>
          <form className="space-y-6 p-6">
            {/* Assunto */}
            <div>
              <label
                htmlFor="assunto"
                className="mb-2 block text-sm font-medium text-slate-700"
              >
                Assunto
              </label>
              <select
                id="assunto"
                name="assunto"
                className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-700 focus:ring-2 focus:ring-slate-200"
              >
                <option value="">Selecione um assunto</option>
                <option value="historia">História</option>
                <option value="geografia">Geografia</option>
                <option value="portugues">Português</option>
                <option value="matematica">Matemática</option>
                <option value="atualidades">Atualidades</option>
              </select>
            </div>
            {/* Tipo */}
            <div>
              <label
                htmlFor="tipo"
                className="mb-2 block text-sm font-medium text-slate-700"
              >
                Tipo de pergunta
              </label>
              <select
                id="tipo"
                name="tipo"
                className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-700 focus:ring-2 focus:ring-slate-200"
              >
                <option value="objetiva"> Objetiva </option>
                <option value="aberta"> Aberta </option>
              </select>
            </div>
            {/* Pergunta */}
            <div>
              <label
                htmlFor="pergunta"
                className="mb-2 block text-sm font-medium text-slate-700"
              >
                Pergunta
              </label>
              <textarea
                id="pergunta"
                name="pergunta"
                rows={4}
                placeholder="Digite a pergunta..."
                className="w-full resize-none rounded-lg border border-slate-300 px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-700 focus:ring-2 focus:ring-slate-200"
              />
            </div>
            {/* Respostas */}
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-semibold text-slate-900">
                  Respostas
                </h3>
                <p className="mt-1 text-xs text-slate-500">
                  Para perguntas objetivas, informe as alternativas e selecione
                  a resposta correta.
                </p>
              </div>
              {["A", "B", "C", "D"].map((option) => (
                <div key={option} className="flex items-center gap-3">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-slate-900 text-sm font-bold text-white">
                    {option}
                  </span>
                  <input
                    type="text"
                    placeholder={`Resposta ${option}`}
                    className="h-10 w-full rounded-lg border border-slate-300 px-4 text-sm outline-none transition placeholder:text-slate-400 focus:border-slate-700 focus:ring-2 focus:ring-slate-200"
                  />
                </div>
              ))}
            </div>
            {/* Resposta correta */}
            <div>
              <label
                htmlFor="resposta-correta"
                className="mb-2 block text-sm font-medium text-slate-700"
              >
                Resposta correta
              </label>
              <select
                id="resposta-correta"
                name="resposta-correta"
                className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-700 focus:ring-2 focus:ring-slate-200"
              >
                <option value="">Selecione a resposta correta</option>
                <option value="A">Resposta A</option>
                <option value="B">Resposta B</option>
                <option value="C">Resposta C</option>
                <option value="D">Resposta D</option>
              </select>
            </div>
            {/* Explicação */}
            <div>
              <label
                htmlFor="explicacao"
                className="mb-2 block text-sm font-medium text-slate-700"
              >
                Explicação didática
              </label>
              <textarea
                id="explicacao"
                name="explicacao"
                rows={5}
                placeholder="Informe a explicação que poderá ser utilizada pelo apresentador..."
                className="w-full resize-none rounded-lg border border-slate-300 px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-700 focus:ring-2 focus:ring-slate-200"
              />
            </div>
            {/* Separador */}
            <div className="border-t border-slate-200 pt-6">
              <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  className="rounded-lg border border-slate-300 px-5 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
                >
                  Cadastrar pergunta
                </button>
              </div>
            </div>
          </form>
        </section>
      </div>
      <Footer />
    </main>
  );
}
