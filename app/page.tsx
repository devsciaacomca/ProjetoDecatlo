import Link from "next/link";
import Header from "@/components/Header";
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
        {/* Header */}
        <Header />

        {/* Conteúdo principal */}
        <section className="flex flex-1 items-center justify-center px-6 py-16">
          <div className="mx-auto w-full max-w-4xl text-center">
            {/* Identificação */}
            <div className="mb-8 inline-flex items-center gap-3 rounded-full border border-cyan-400/20 bg-cyan-400/5 px-5 py-2">
              <span className="relative flex h-2.5 w-2.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-cyan-400 opacity-50" />
                <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-cyan-400" />
              </span>

              <span className="text-xs font-medium uppercase tracking-[0.2em] text-cyan-300">
                Sistema de Arguição
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

            {/* Descrição */}
            <p className="mx-auto mt-8 max-w-2xl text-base leading-7 text-white/60 sm:text-lg">
              Plataforma destinada ao gerenciamento, organização e realização
              das atividades de arguição do Decatlo do Corpo de Alunos do CIAA.
            </p>

            {/* Card de acesso */}
            <div className="mx-auto mt-12 max-w-xl rounded-2xl border border-white/10 bg-white/[0.03] p-8 shadow-2xl backdrop-blur-sm">
              {/* Ícone */}
              <div className="mb-6 flex justify-center">
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

              <h3 className="text-xl font-semibold text-white">
                Acesso ao sistema
              </h3>

              <p className="mt-3 text-sm leading-6 text-white/50">
                Entre no sistema para acessar as funcionalidades de
                gerenciamento e participação no Decatlo.
              </p>

              {/* Botão de Login */}
              <Link
                href="/login"
                className="mt-7 inline-flex w-full items-center justify-center rounded-lg bg-cyan-500 px-6 py-3 text-sm font-semibold text-[#04111f] transition hover:bg-cyan-400 hover:shadow-lg hover:shadow-cyan-500/20"
              >
                Entrar no sistema
              </Link>

              <p className="mt-5 text-xs text-white/30">
                Acesso restrito aos usuários autorizados.
              </p>
            </div>

            {/* Funcionalidades */}
            <div className="mx-auto mt-10 flex max-w-xl flex-wrap justify-center gap-x-6 gap-y-2 text-xs uppercase tracking-widest text-white/30">
              <span>Gerenciamento</span>
              <span>•</span>
              <span>Arguição</span>
              <span>•</span>
              <span>Resultados</span>
            </div>
          </div>
        </section>

        {/* Footer */}
        <Footer />
      </div>
    </main>
  );
}
