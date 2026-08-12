export default function LoginPage() {
  return (
    <main className="min-h-screen bg-[#050b14] text-white">
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,#0e749033,transparent_45%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:40px_40px]" />
      </div>

      <div className="relative flex min-h-screen items-center justify-center px-6 py-16">
        <div className="w-full max-w-md">
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-8 shadow-2xl backdrop-blur-sm">
            <div className="mb-6 text-center">
              <div className="mb-3 inline-flex items-center gap-3 rounded-full border border-cyan-400/20 bg-cyan-400/5 px-4 py-2 text-[10px] font-medium uppercase tracking-[0.25em] text-cyan-300">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-cyan-400 opacity-50" />
                  <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-cyan-400" />
                </span>
                Sistema de Arguição
              </div>

              <h1 className="text-4xl font-black tracking-tight text-white sm:text-5xl">
                DECAtlo
              </h1>
              <div className="mx-auto mt-4 h-px w-20 bg-cyan-400/50" />
            </div>

            <form className="space-y-5">
              <div>
                <label
                  htmlFor="usuario"
                  className="mb-2 block text-sm font-medium text-white/80"
                >
                  Usuário
                </label>
                <input
                  id="usuario"
                  type="text"
                  name="usuario"
                  placeholder="Digite seu usuário"
                  className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-base text-white placeholder:text-white/35 outline-none transition focus:border-cyan-400/70 focus:bg-white/[0.04] focus:ring-4 focus:ring-cyan-500/10"
                />
              </div>

              <div>
                <label
                  htmlFor="senha"
                  className="mb-2 block text-sm font-medium text-white/80"
                >
                  Senha
                </label>
                <input
                  id="senha"
                  type="password"
                  name="senha"
                  placeholder="Digite sua senha"
                  className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-base text-white placeholder:text-white/35 outline-none transition focus:border-cyan-400/70 focus:bg-white/[0.04] focus:ring-4 focus:ring-cyan-500/10"
                />
              </div>

              <button
                type="submit"
                className="mt-2 inline-flex w-full items-center justify-center rounded-lg bg-cyan-500 px-6 py-3 text-sm font-semibold text-[#04111f] transition hover:bg-cyan-400 hover:shadow-lg hover:shadow-cyan-500/20 focus:outline-none focus:ring-4 focus:ring-cyan-500/20"
              >
                Entrar
              </button>
            </form>
          </div>
        </div>
      </div>
    </main>
  );
}
