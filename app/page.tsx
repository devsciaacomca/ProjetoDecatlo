import Link from "next/link";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#050b14] text-white">
      {/* Background */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,#0e749033,transparent_45%)]" />

        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:40px_40px]" />
      </div>

      <div className="relative flex min-h-screen flex-col">
        {/* Conteúdo principal */}
        <section className="flex flex-1 items-center justify-center px-4 py-8 sm:px-6 sm:py-12">
          <div className="mx-auto w-full max-w-4xl text-center">
            {/* Identificação */}
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/5 px-4 py-1.5 sm:mb-7 sm:gap-3 sm:px-5 sm:py-2">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-cyan-400 opacity-50" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-cyan-400" />
              </span>

              <span className="text-[10px] font-medium uppercase tracking-[0.15em] text-cyan-300 sm:text-xs sm:tracking-[0.2em]">
                Sistema de Arguição
              </span>
            </div>

            {/* Título */}
            <h2 className="text-4xl font-bold tracking-tight sm:text-6xl lg:text-7xl">
              <span className="block text-white">DECAtlo</span>

              <span className="mt-1 block bg-gradient-to-r from-cyan-300 via-blue-400 to-cyan-500 bg-clip-text text-transparent sm:mt-2">
                CIAA
              </span>
            </h2>

            <div className="mx-auto mt-5 h-px w-20 bg-cyan-400/50 sm:mt-7 sm:w-24" />

            {/* Descrição */}
            <p className="mx-auto mt-5 max-w-2xl text-sm leading-6 text-white/60 sm:mt-7 sm:text-lg sm:leading-7">
              Plataforma destinada ao gerenciamento, organização e realização
              das atividades de arguição do Decatlo do Corpo de Alunos do CIAA.
            </p>

            {/* Card de acesso */}
            <div className="mx-auto mt-7 max-w-xl rounded-2xl border border-white/10 bg-white/[0.03] p-5 shadow-2xl backdrop-blur-sm sm:mt-10 sm:p-8">
              {/* Ícone */}
              <div className="mb-4 flex justify-center sm:mb-5">
                <div className="flex h-14 w-14 items-center justify-center rounded-xl border border-cyan-400/20 bg-cyan-400/5 sm:h-16 sm:w-16 sm:rounded-2xl">
                  <svg
                    className="h-7 w-7 text-cyan-400 sm:h-8 sm:w-8"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="m10 17 5-5-5-5"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15 12H3"
                    />
                  </svg>
                </div>
              </div>

              <h3 className="text-lg font-semibold text-white sm:text-xl">
                Acesso ao sistema
              </h3>

              <p className="mt-2 text-sm leading-5 text-white/50 sm:mt-3 sm:leading-6">
                Entre no sistema para acessar as funcionalidades de
                gerenciamento e participação no Decatlo.
              </p>

              {/* Botão de Login */}
              <Link
                href="/login"
                className="mt-5 inline-flex w-full items-center justify-center rounded-lg bg-cyan-500 px-6 py-3 text-sm font-semibold text-[#04111f] transition hover:bg-cyan-400 hover:shadow-lg hover:shadow-cyan-500/20 sm:mt-7"
              >
                Entrar no sistema
              </Link>

              <p className="mt-4 text-xs text-white/30 sm:mt-5">
                Acesso restrito aos usuários autorizados.
              </p>
            </div>

            {/* Funcionalidades */}
            <div className="mx-auto mt-7 flex max-w-xl flex-wrap justify-center gap-x-4 gap-y-1.5 text-[10px] uppercase tracking-widest text-white/30 sm:mt-9 sm:gap-x-6 sm:gap-y-2 sm:text-xs">
              <span>Gerenciamento</span>
              <span>•</span>
              <span>Arguição</span>
              <span>•</span>
              <span>Resultados</span>
            </div>
          </div>
        </section>

        <Footer />
      </div>
    </main>
  );
}
