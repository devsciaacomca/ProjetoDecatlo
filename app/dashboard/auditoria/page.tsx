"use client";

import { useMemo, useState } from "react";
import {
  Search,
  History,
  UserPlus,
  Pencil,
  Trash2,
  PlayCircle,
  Settings,
  ClipboardList,
  LogIn,
  CheckCircle2,
} from "lucide-react";

import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import Footer from "@/components/Footer";

//separar types e dados iniciais em outro arquivo
type TipoAcao =
  | "LOGIN"
  | "CRIACAO_USUARIO"
  | "EDICAO_USUARIO"
  | "EXCLUSAO_USUARIO"
  | "CRIACAO_PERGUNTA"
  | "EDICAO_PERGUNTA"
  | "EXCLUSAO_PERGUNTA"
  | "CRIACAO_PARTIDA"
  | "EDICAO_PARTIDA"
  | "INICIO_PARTIDA"
  | "FINALIZACAO_PARTIDA"
  | "ALTERACAO_CONFIGURACAO";

interface Auditoria {
  id: string;
  usuario: string;
  nip: string;
  acao: TipoAcao;
  entidade: string;
  entidadeId?: string;
  descricao: string;
  data: string;
}

const auditoriasIniciais: Auditoria[] = [
  {
    id: "audit-001",
    usuario: "João Silva",
    nip: "12345678",
    acao: "LOGIN",
    entidade: "Autenticação",
    descricao: "Realizou login no sistema.",
    data: "21/08/2026 14:40",
  },
  {
    id: "audit-002",
    usuario: "João Silva",
    nip: "12345678",
    acao: "CRIACAO_PARTIDA",
    entidade: "Partida",
    entidadeId: "123",
    descricao: 'Criou a partida "Decatlo 2026".',
    data: "21/08/2026 14:32",
  },
  {
    id: "audit-003",
    usuario: "Maria Santos",
    nip: "87654321",
    acao: "EDICAO_PERGUNTA",
    entidade: "Pergunta",
    entidadeId: "128",
    descricao: "Editou a pergunta #128.",
    data: "21/08/2026 14:20",
  },
  {
    id: "audit-004",
    usuario: "João Silva",
    nip: "12345678",
    acao: "ALTERACAO_CONFIGURACAO",
    entidade: "Partida",
    entidadeId: "123",
    descricao: "Alterou o tempo de resposta para 30 segundos.",
    data: "21/08/2026 14:10",
  },
  {
    id: "audit-005",
    usuario: "Administrador do Sistema",
    nip: "00000001",
    acao: "CRIACAO_USUARIO",
    entidade: "Usuário",
    entidadeId: "4",
    descricao: 'Cadastrou o usuário "Carlos Oliveira".',
    data: "21/08/2026 13:55",
  },
  {
    id: "audit-006",
    usuario: "Administrador do Sistema",
    nip: "00000001",
    acao: "EDICAO_USUARIO",
    entidade: "Usuário",
    entidadeId: "3",
    descricao: 'Alterou o perfil de "Maria Santos".',
    data: "21/08/2026 13:45",
  },
  {
    id: "audit-007",
    usuario: "João Silva",
    nip: "12345678",
    acao: "INICIO_PARTIDA",
    entidade: "Partida",
    entidadeId: "123",
    descricao: 'Iniciou a partida "Decatlo 2026".',
    data: "21/08/2026 13:30",
  },
  {
    id: "audit-008",
    usuario: "Maria Santos",
    nip: "87654321",
    acao: "CRIACAO_PERGUNTA",
    entidade: "Pergunta",
    entidadeId: "129",
    descricao: "Cadastrou uma nova pergunta de História.",
    data: "21/08/2026 12:50",
  },
  {
    id: "audit-009",
    usuario: "João Silva",
    nip: "12345678",
    acao: "FINALIZACAO_PARTIDA",
    entidade: "Partida",
    entidadeId: "122",
    descricao: 'Finalizou a partida "Decatlo - Treinamento".',
    data: "20/08/2026 17:20",
  },
];

const acaoConfig: Record<
  TipoAcao,
  {
    label: string;
    icon: typeof History;
    className: string;
  }
> = {
  LOGIN: {
    label: "Login",
    icon: LogIn,
    className: "bg-slate-100 text-slate-700",
  },
  CRIACAO_USUARIO: {
    label: "Cadastro de usuário",
    icon: UserPlus,
    className: "bg-green-100 text-green-700",
  },
  EDICAO_USUARIO: {
    label: "Edição de usuário",
    icon: Pencil,
    className: "bg-blue-100 text-blue-700",
  },
  EXCLUSAO_USUARIO: {
    label: "Exclusão de usuário",
    icon: Trash2,
    className: "bg-red-100 text-red-700",
  },
  CRIACAO_PERGUNTA: {
    label: "Cadastro de pergunta",
    icon: ClipboardList,
    className: "bg-green-100 text-green-700",
  },
  EDICAO_PERGUNTA: {
    label: "Edição de pergunta",
    icon: Pencil,
    className: "bg-blue-100 text-blue-700",
  },
  EXCLUSAO_PERGUNTA: {
    label: "Exclusão de pergunta",
    icon: Trash2,
    className: "bg-red-100 text-red-700",
  },
  CRIACAO_PARTIDA: {
    label: "Criação de partida",
    icon: PlayCircle,
    className: "bg-green-100 text-green-700",
  },
  EDICAO_PARTIDA: {
    label: "Edição de partida",
    icon: Pencil,
    className: "bg-blue-100 text-blue-700",
  },
  INICIO_PARTIDA: {
    label: "Início de partida",
    icon: PlayCircle,
    className: "bg-green-100 text-green-700",
  },
  FINALIZACAO_PARTIDA: {
    label: "Finalização de partida",
    icon: CheckCircle2,
    className: "bg-blue-100 text-blue-700",
  },
  ALTERACAO_CONFIGURACAO: {
    label: "Alteração de configuração",
    icon: Settings,
    className: "bg-amber-100 text-amber-700",
  },
};

export default function AuditoriaPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [auditorias] = useState<Auditoria[]>(auditoriasIniciais);

  const [busca, setBusca] = useState("");

  const [filtroAcao, setFiltroAcao] = useState<TipoAcao | "todas">("todas");

  const auditoriasFiltradas = useMemo(() => {
    const termo = busca.toLowerCase().trim();

    return auditorias.filter((auditoria) => {
      const correspondeBusca =
        !termo ||
        auditoria.usuario.toLowerCase().includes(termo) ||
        auditoria.nip.toLowerCase().includes(termo) ||
        auditoria.descricao.toLowerCase().includes(termo) ||
        auditoria.entidade.toLowerCase().includes(termo);

      const correspondeAcao =
        filtroAcao === "todas" || auditoria.acao === filtroAcao;

      return correspondeBusca && correspondeAcao;
    });
  }, [auditorias, busca, filtroAcao]);

  return (
    <main className="min-h-screen bg-slate-100 text-slate-900">
      <div className="flex min-h-screen">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

        <section className="flex min-w-0 flex-1 flex-col">
          <Header onMenuClick={() => setSidebarOpen(true)} />

          <main className="flex-1 p-4 sm:p-6 lg:p-8">
            <div className="mx-auto w-full max-w-7xl">
              {/* Cabeçalho */}
              <div>
                <h1 className="text-xl font-semibold sm:text-2xl">Auditoria</h1>

                <p className="mt-1 text-sm text-slate-500">
                  Histórico das alterações e ações realizadas pelos usuários no
                  sistema.
                </p>
              </div>

              {/* Cards */}
              <div className="mt-6 grid gap-4 sm:grid-cols-3">
                <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100">
                      <History size={20} />
                    </div>

                    <div>
                      <p className="text-xs text-slate-500">Registros</p>

                      <p className="text-2xl font-bold">{auditorias.length}</p>
                    </div>
                  </div>
                </div>

                <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                  <p className="text-xs text-slate-500">Usuários envolvidos</p>

                  <p className="mt-1 text-2xl font-bold">
                    {new Set(auditorias.map((auditoria) => auditoria.nip)).size}
                  </p>
                </div>

                <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                  <p className="text-xs text-slate-500">
                    Alterações encontradas
                  </p>

                  <p className="mt-1 text-2xl font-bold">
                    {auditoriasFiltradas.length}
                  </p>
                </div>
              </div>

              {/* Filtros */}
              <section className="mt-6 rounded-xl border border-slate-200 bg-white shadow-sm">
                <div className="flex flex-col gap-4 p-5 md:flex-row">
                  <div className="relative flex-1">
                    <Search
                      size={18}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                    />

                    <input
                      type="search"
                      value={busca}
                      onChange={(event) => setBusca(event.target.value)}
                      placeholder="Pesquisar usuário, NIP, ação ou descrição..."
                      className="w-full rounded-lg border border-slate-300 py-2.5 pl-10 pr-4 text-sm outline-none focus:border-slate-700 focus:ring-2 focus:ring-slate-200"
                    />
                  </div>

                  <select
                    value={filtroAcao}
                    onChange={(event) =>
                      setFiltroAcao(event.target.value as TipoAcao | "todas")
                    }
                    className="rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm outline-none focus:border-slate-700 focus:ring-2 focus:ring-slate-200 md:w-64"
                  >
                    <option value="todas">Todas as ações</option>

                    {Object.entries(acaoConfig).map(([valor, config]) => (
                      <option key={valor} value={valor}>
                        {config.label}
                      </option>
                    ))}
                  </select>
                </div>
              </section>

              {/* Histórico */}
              <section className="mt-6 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
                <div className="border-b border-slate-200 px-5 py-4 sm:px-6">
                  <h2 className="font-semibold">Histórico de atividades</h2>

                  <p className="mt-1 text-xs text-slate-500">
                    Todas as ações registradas no sistema.
                  </p>
                </div>

                <div className="divide-y divide-slate-100">
                  {auditoriasFiltradas.map((auditoria) => {
                    const config = acaoConfig[auditoria.acao];

                    const Icon = config.icon;

                    return (
                      <div
                        key={auditoria.id}
                        className="px-5 py-5 transition hover:bg-slate-50 sm:px-6"
                      >
                        <div className="flex gap-4">
                          <div
                            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${config.className}`}
                          >
                            <Icon size={18} />
                          </div>

                          <div className="min-w-0 flex-1">
                            <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                              <div>
                                <div className="flex flex-wrap items-center gap-2">
                                  <p className="text-sm font-semibold">
                                    {auditoria.usuario}
                                  </p>

                                  <span className="font-mono text-xs text-slate-400">
                                    NIP {auditoria.nip}
                                  </span>
                                </div>

                                <p className="mt-1 text-sm text-slate-600">
                                  {auditoria.descricao}
                                </p>
                              </div>

                              <span className="shrink-0 text-xs text-slate-400">
                                {auditoria.data}
                              </span>
                            </div>

                            <div className="mt-3 flex flex-wrap gap-2">
                              <span
                                className={`rounded-full px-2.5 py-1 text-xs font-medium ${config.className}`}
                              >
                                {config.label}
                              </span>

                              <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600">
                                {auditoria.entidade}
                                {auditoria.entidadeId
                                  ? ` #${auditoria.entidadeId}`
                                  : ""}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {auditoriasFiltradas.length === 0 && (
                  <div className="px-6 py-12 text-center">
                    <History size={32} className="mx-auto text-slate-300" />

                    <p className="mt-3 text-sm font-medium">
                      Nenhum registro encontrado
                    </p>

                    <p className="mt-1 text-sm text-slate-500">
                      Tente alterar os filtros utilizados.
                    </p>
                  </div>
                )}
              </section>
            </div>
          </main>

          <Footer />
        </section>
      </div>
    </main>
  );
}
