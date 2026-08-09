import Image from "next/image";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#07111f] text-white">
      {/* Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -left-32 -top-32 h-96 w-96 rounded-full bg-blue-900/20 blur-3xl" />
        <div className="absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-cyan-900/20 blur-3xl" />

        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:40px_40px]" />
      </div>

      <div className="relative flex min-h-screen flex-col">
        {/* Header */}
        <header className="border-b border-white/10 bg-[#07111f]/80 backdrop-blur-md">
          <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-5">
            <div className="flex items-center gap-4">
              {/* Substitua pelo brasão/logo quando disponível */}
              <div className="flex h-12 w-12 items-center justify-center rounded-lg border border-white/15 bg-white/5">
                <span className="text-lg font-bold tracking-wider text-cyan-400">
                  C
                </span>
              </div>

              <div>
                <p className="text-xs font-medium uppercase tracking-[0.25em] text-cyan-400">
                  CIAA
                </p>

                <h1 className="text-sm font-semibold tracking-wide text-white">
                  Corpo de Alunos
                </h1>
              </div>
            </div>

            <div className="hidden text-right sm:block">
              <p className="text-xs uppercase tracking-widest text-white/40">
                COMCA
              </p>

              <p className="text-sm font-medium text-white/70">Decatlo</p>
            </div>
          </div>
        </header>

        {/* Conteúdo principal */}
        <section className="flex flex-1 items-center justify-center px-6 py-20">
          <div className="mx-auto w-full max-w-4xl text-center">
            {/* Status */}
            <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/5 px-4 py-2">
              <span className="relative flex h-2.5 w-2.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-cyan-400 opacity-50" />
                <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-cyan-400" />
              </span>

              <span className="text-xs font-medium uppercase tracking-[0.2em] text-cyan-300">
                Sistema em desenvolvimento
              </span>
            </div>

            {/* Título */}
            <h2 className="text-5xl font-bold tracking-tight sm:text-6xl lg:text-7xl">
              <span className="block text-white">DECAtlo</span>

              <span className="mt-2 block bg-gradient-to-r from-cyan-300 via-blue-400 to-cyan-500 bg-clip-text text-transparent">
                CIAA
              </span>
            </h2>

            <div className="mx-auto mt-8 h-px w-24 bg-cyan-400/50" />

            <p className="mx-auto mt-8 max-w-2xl text-base leading-7 text-white/60 sm:text-lg">
              Plataforma oficial para gerenciamento, acompanhamento e realização
              das atividades do Decatlo do Corpo de Alunos.
            </p>

            {/* Card */}
            <div className="mx-auto mt-12 max-w-xl rounded-2xl border border-white/10 bg-white/[0.03] p-8 shadow-2xl backdrop-blur-sm">
              <div className="mb-5 flex justify-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-cyan-400/20 bg-cyan-400/5">
                  <svg
                    className="h-8 w-8 text-cyan-400"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 6v6l4 2"
                    />
                    <circle cx="12" cy="12" r="9" />
                  </svg>
                </div>
              </div>

              <h3 className="text-xl font-semibold text-white">Em breve</h3>

              <p className="mt-3 text-sm leading-6 text-white/50">
                Estamos preparando a plataforma para proporcionar uma
                experiência completa durante o Decatlo.
              </p>

              <div className="mt-6 flex items-center justify-center gap-2 text-xs uppercase tracking-widest text-white/30">
                <span>Preparação</span>
                <span>•</span>
                <span>Competição</span>
                <span>•</span>
                <span>Resultados</span>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-white/10">
          <div className="mx-auto flex w-full max-w-6xl flex-col items-center justify-between gap-3 px-6 py-5 text-center sm:flex-row sm:text-left">
            <p className="text-xs text-white/30">
              Decatlo • Corpo de Alunos • CIAA
            </p>

            <p className="text-xs text-white/20">Sistema em desenvolvimento</p>
          </div>
        </footer>
      </div>
    </main>
  );
}
