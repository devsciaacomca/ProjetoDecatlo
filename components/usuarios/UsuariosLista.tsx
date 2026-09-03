import { Search } from "lucide-react";

interface UsuariosListaProps {
  busca: string;
  erro: string | null;
  modalAberto: boolean;
  carregando: boolean;
  onBuscaChange: (valor: string) => void;
  onTentarNovamente: () => void;
  children: React.ReactNode;
}

export function UsuariosLista({
  busca,
  erro,
  modalAberto,
  carregando,
  onBuscaChange,
  onTentarNovamente,
  children,
}: UsuariosListaProps) {
  return (
    <section className="mt-6 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-200 px-5 py-4 sm:px-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="font-semibold">Usuários cadastrados</h2>

            <p className="mt-1 text-xs text-slate-500">
              Pesquise por nome, e-mail ou NIP.
            </p>
          </div>

          <div className="relative w-full md:max-w-sm">
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <input
              type="search"
              value={busca}
              onChange={(event) => onBuscaChange(event.target.value)}
              placeholder="Pesquisar usuário..."
              className="w-full rounded-lg border border-slate-300 py-2.5 pl-10 pr-4 text-sm outline-none focus:border-slate-700 focus:ring-2 focus:ring-slate-200"
            />
          </div>
        </div>
      </div>

      {erro && !modalAberto && (
        <div className="m-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3">
          <div className="flex items-center justify-between gap-4">
            <p className="text-sm text-red-700">{erro}</p>

            <button
              type="button"
              onClick={onTentarNovamente}
              className="text-sm font-semibold text-red-700 hover:underline"
            >
              Tentar novamente
            </button>
          </div>
        </div>
      )}

      {carregando ? <UsuariosListaSkeleton /> : children}
    </section>
  );
}

function UsuariosListaSkeleton() {
  return (
    <div className="divide-y divide-slate-100">
      {Array.from({ length: 6 }).map((_, index) => (
        <div key={index} className="flex items-center gap-6 px-6 py-5">
          <div className="flex-1">
            <div className="h-4 w-40 animate-pulse rounded bg-slate-200" />

            <div className="mt-2 h-3 w-56 animate-pulse rounded bg-slate-100" />
          </div>

          <div className="hidden w-28 sm:block">
            <div className="h-4 w-20 animate-pulse rounded bg-slate-200" />
          </div>

          <div className="hidden w-32 sm:block">
            <div className="h-6 w-24 animate-pulse rounded-full bg-slate-200" />
          </div>

          <div className="hidden w-24 sm:block">
            <div className="h-6 w-16 animate-pulse rounded-full bg-slate-200" />
          </div>

          <div className="w-20">
            <div className="ml-auto h-8 w-16 animate-pulse rounded bg-slate-200" />
          </div>
        </div>
      ))}
    </div>
  );
}
