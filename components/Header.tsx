import Link from "next/link";

export default function Header() {
  return (
    <header className="w-full border-b border-slate-300 bg-slate-900 text-white">
      {" "}
      <div className="mx-auto flex min-h-16 max-w-7xl items-center justify-between px-6">
        {" "}
        <div>
          {" "}
          <h1 className="text-lg font-bold tracking-wide"> DECATLO </h1>{" "}
          <p className="text-xs text-slate-300"> Sistema de Arguição </p>{" "}
        </div>{" "}
        <nav className="flex items-center gap-6 text-sm">
          {" "}
          <Link href="/" className="transition hover:text-slate-300">
            {" "}
            Início{" "}
          </Link>{" "}
          <Link
            href="/cadastro-perguntas"
            className="transition hover:text-slate-300"
          >
            {" "}
            Cadatro de Perguntas{" "}
          </Link>{" "}
          <Link
            href="/configuracao-jogo"
            className="transition hover:text-slate-300"
          >
            {" "}
            Configuração{" "}
          </Link>{" "}
        </nav>{" "}
      </div>{" "}
    </header>
  );
}
