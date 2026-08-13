export default function Footer() {
  return (
    <footer className="mt-auto border-t border-slate-200 bg-white">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-6 py-5 text-center sm:flex-row sm:text-left">
        <div>
          <p className="text-sm font-semibold text-slate-700">
            Sistema de Arguição — Decatlo
          </p>

          <p className="mt-1 text-xs text-slate-500">
            Sistema de apoio à realização e gerenciamento do Decatlo.
          </p>
        </div>

        <div className="text-xs text-slate-400">
          <p>Centro de Instrução Almirante Alexandrino</p>
          <p className="mt-1">
            © {new Date().getFullYear()} — Todos os direitos reservados
          </p>
        </div>
      </div>
    </footer>
  );
}
