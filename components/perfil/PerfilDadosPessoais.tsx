import { Badge, Mail, Save, User } from "lucide-react";

interface PerfilDadosPessoaisProps {
  nome: string;
  email: string;
  nip: string;
  salvando: boolean;
  onNomeChange: (value: string) => void;
  onEmailChange: (value: string) => void;
  onSubmit: React.FormEventHandler<HTMLFormElement>;
}

export function PerfilDadosPessoais({
  nome,
  email,
  nip,
  salvando,
  onNomeChange,
  onEmailChange,
  onSubmit,
}: PerfilDadosPessoaisProps) {
  return (
    <section className="rounded-xl border border-slate-200 bg-white shadow-sm lg:col-span-2">
      <div className="border-b border-slate-200 px-5 py-5 sm:px-6">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100">
            <Badge size={20} className="text-slate-600" />
          </div>

          <div>
            <h2 className="font-semibold">Dados pessoais</h2>

            <p className="text-xs text-slate-500">
              Atualize suas informações pessoais.
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={onSubmit} className="space-y-5 p-5 sm:p-6">
        <div>
          <label htmlFor="nome" className="mb-2 block text-sm font-medium">
            Nome completo
          </label>

          <div className="relative">
            <User
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <input
              id="nome"
              type="text"
              value={nome}
              onChange={(event) => onNomeChange(event.target.value)}
              className="w-full rounded-lg border border-slate-300 py-3 pl-10 pr-4 text-sm outline-none transition focus:border-slate-700 focus:ring-2 focus:ring-slate-200"
              placeholder="Digite seu nome"
            />
          </div>
        </div>

        <div>
          <label htmlFor="email" className="mb-2 block text-sm font-medium">
            E-mail
          </label>

          <div className="relative">
            <Mail
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <input
              id="email"
              type="email"
              value={email}
              onChange={(event) => onEmailChange(event.target.value)}
              className="w-full rounded-lg border border-slate-300 py-3 pl-10 pr-4 text-sm outline-none transition focus:border-slate-700 focus:ring-2 focus:ring-slate-200"
              placeholder="seu@email.com"
            />
          </div>
        </div>

        <div>
          <label htmlFor="nip" className="mb-2 block text-sm font-medium">
            NIP
          </label>

          <div className="relative">
            <Badge
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <input
              id="nip"
              type="text"
              value={nip}
              disabled
              className="w-full cursor-not-allowed rounded-lg border border-slate-200 bg-slate-50 py-3 pl-10 pr-4 text-sm text-slate-500"
            />
          </div>

          <p className="mt-2 text-xs text-slate-400">
            O NIP é utilizado como identificador de acesso e não pode ser
            alterado pelo usuário.
          </p>
        </div>

        <div className="flex justify-end border-t border-slate-100 pt-5">
          <button
            type="submit"
            disabled={salvando}
            className="inline-flex items-center gap-2 rounded-lg bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Save size={17} />

            {salvando ? "Salvando..." : "Salvar alterações"}
          </button>
        </div>
      </form>
    </section>
  );
}
