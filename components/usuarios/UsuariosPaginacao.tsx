import { ChevronLeft, ChevronRight } from "lucide-react";

interface UsuariosPaginacaoProps {
  paginaAtual: number;
  totalPaginas: number;
  totalUsuarios: number;
  usuariosNaPagina: number;
  porPagina: number;
  onPaginaChange: (pagina: number) => void;
}

export function UsuariosPaginacao({
  paginaAtual,
  totalPaginas,
  totalUsuarios,
  usuariosNaPagina,
  porPagina,
  onPaginaChange,
}: UsuariosPaginacaoProps) {
  if (totalUsuarios === 0) {
    return null;
  }

  const inicio = (paginaAtual - 1) * porPagina + 1;

  const fim = inicio + usuariosNaPagina - 1;

  const paginas: number[] = [];

  const inicioPaginas = Math.max(1, paginaAtual - 2);

  const fimPaginas = Math.min(totalPaginas, paginaAtual + 2);

  for (let pagina = inicioPaginas; pagina <= fimPaginas; pagina++) {
    paginas.push(pagina);
  }

  return (
    <div className="flex flex-col gap-4 border-t border-slate-200 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
      <p className="text-xs text-slate-500">
        Mostrando <span className="font-medium text-slate-700">{inicio}</span>{" "}
        até <span className="font-medium text-slate-700">{fim}</span> de{" "}
        <span className="font-medium text-slate-700">{totalUsuarios}</span>{" "}
        usuários
      </p>

      {totalPaginas > 1 && (
        <div className="flex items-center gap-1">
          <button
            type="button"
            disabled={paginaAtual === 1}
            onClick={() => onPaginaChange(paginaAtual - 1)}
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-500 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40"
            aria-label="Página anterior"
          >
            <ChevronLeft size={17} />
          </button>

          {paginas.map((pagina) => (
            <button
              key={pagina}
              type="button"
              onClick={() => onPaginaChange(pagina)}
              className={
                pagina === paginaAtual
                  ? "inline-flex h-9 min-w-9 items-center justify-center rounded-lg bg-slate-900 px-2 text-xs font-semibold text-white"
                  : "inline-flex h-9 min-w-9 items-center justify-center rounded-lg border border-slate-200 px-2 text-xs font-semibold text-slate-600 transition hover:bg-slate-100"
              }
            >
              {pagina}
            </button>
          ))}

          <button
            type="button"
            disabled={paginaAtual === totalPaginas}
            onClick={() => onPaginaChange(paginaAtual + 1)}
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-500 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40"
            aria-label="Próxima página"
          >
            <ChevronRight size={17} />
          </button>
        </div>
      )}
    </div>
  );
}
