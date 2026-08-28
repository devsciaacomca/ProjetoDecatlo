"use client";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Search,
  Plus,
  Pencil,
  Trash2,
  Users,
  X,
  ShieldCheck,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
type Role = "Administrador" | "Apresentador" | "Cadastrador" | "Usuário";
interface Usuario {
  id: number;
  nome: string;
  email: string;
  nip: string;
  role: Role;
  ativo: boolean;
}
const roles: Role[] = [
  "Administrador",
  "Apresentador",
  "Cadastrador",
  "Usuário",
];
const roleToId: Record<Role, number> = {
  Administrador: 1,
  Apresentador: 2,
  Cadastrador: 3,
  Usuário: 4,
};
const USUARIOS_POR_PAGINA = 10;
const formularioInicial = {
  nome: "",
  email: "",
  nip: "",
  role: "Usuário" as Role,
  senha: "",
  ativo: true,
};
export default function UsuariosPage() {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [busca, setBusca] = useState("");
  const [carregando, setCarregando] = useState(true);
  const [modalAberto, setModalAberto] = useState(false);
  const [usuarioEditando, setUsuarioEditando] = useState<Usuario | null>(null);
  const [form, setForm] = useState(formularioInicial);
  const [salvando, setSalvando] = useState(false);
  const [excluindoId, setExcluindoId] = useState<number | null>(null);
  const [erro, setErro] = useState<string | null>(null);
  const [paginaAtual, setPaginaAtual] = useState(1);
  /* * ============================================================ * CARREGAR USUÁRIOS * ============================================================ */ const carregarUsuarios =
    useCallback(async () => {
      try {
        setCarregando(true);
        setErro(null);
        const response = await fetch("/api/usuarios", {
          method: "GET",
          cache: "no-store",
        });
        const data = await response.json();
        if (!response.ok || !data.success) {
          throw new Error(
            data.error || "Não foi possível carregar os usuários.",
          );
        }
        setUsuarios(data.data);
      } catch (error) {
        console.error(error);
        setErro(
          error instanceof Error ? error.message : "Erro ao carregar usuários.",
        );
      } finally {
        setCarregando(false);
      }
    }, []);
  useEffect(() => {
    carregarUsuarios();
  }, [carregarUsuarios]);
  /* * ============================================================ * FILTRO * ============================================================ */ const usuariosFiltrados =
    useMemo(() => {
      const termo = busca.toLowerCase().trim();
      if (!termo) {
        return usuarios;
      }
      return usuarios.filter(
        (usuario) =>
          usuario.nome.toLowerCase().includes(termo) ||
          usuario.email.toLowerCase().includes(termo) ||
          usuario.nip.toLowerCase().includes(termo),
      );
    }, [usuarios, busca]);
  /* * ============================================================ * PAGINAÇÃO * ============================================================ */ const totalPaginas =
    Math.max(1, Math.ceil(usuariosFiltrados.length / USUARIOS_POR_PAGINA));
  const usuariosPaginados = useMemo(() => {
    const inicio = (paginaAtual - 1) * USUARIOS_POR_PAGINA;
    const fim = inicio + USUARIOS_POR_PAGINA;
    return usuariosFiltrados.slice(inicio, fim);
  }, [usuariosFiltrados, paginaAtual]);
  /* * Sempre que a pesquisa mudar, volta para a primeira página. */ useEffect(() => {
    setPaginaAtual(1);
  }, [busca]);
  /* * Se a exclusão fizer a página atual deixar de existir, * volta para a última página disponível. */ useEffect(() => {
    if (paginaAtual > totalPaginas) {
      setPaginaAtual(totalPaginas);
    }
  }, [paginaAtual, totalPaginas]);
  /* * ============================================================ * MODAL * ============================================================ */ function abrirCadastro() {
    setUsuarioEditando(null);
    setForm(formularioInicial);
    setErro(null);
    setModalAberto(true);
  }
  function abrirEdicao(usuario: Usuario) {
    setUsuarioEditando(usuario);
    setForm({
      nome: usuario.nome,
      email: usuario.email,
      nip: usuario.nip,
      role: usuario.role,
      senha: "",
      ativo: usuario.ativo,
    });
    setErro(null);
    setModalAberto(true);
  }
  function fecharModal() {
    if (salvando) return;
    setModalAberto(false);
    setUsuarioEditando(null);
    setForm(formularioInicial);
  }
  /* * ============================================================ * SALVAR USUÁRIO * ============================================================ */ async function salvarUsuario(
    event: React.FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();
    if (!form.nome.trim() || !form.email.trim() || !form.nip.trim()) {
      setErro("Preencha nome, e-mail e NIP.");
      return;
    }
    if (!usuarioEditando && !form.senha.trim()) {
      setErro("Informe uma senha para o novo usuário.");
      return;
    }
    const payload = {
      nome: form.nome.trim(),
      email: form.email.trim(),
      nip: form.nip.trim(),
      roleId: roleToId[form.role],
      ativo: form.ativo,
      ...(form.senha.trim() ? { senha: form.senha } : {}),
    };
    try {
      setSalvando(true);
      setErro(null);
      if (usuarioEditando) {
        const response = await fetch(`/api/usuarios/${usuarioEditando.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.error || "Erro ao editar usuário.");
        }
        /* * Atualiza somente o usuário alterado. * Evita uma nova requisição desnecessária. */ setUsuarios(
          (usuariosAtuais) =>
            usuariosAtuais.map((usuario) =>
              usuario.id === usuarioEditando.id
                ? {
                    ...usuario,
                    nome: form.nome.trim(),
                    email: form.email.trim(),
                    nip: form.nip.trim(),
                    role: form.role,
                    ativo: form.ativo,
                  }
                : usuario,
            ),
        );
      } else {
        const response = await fetch("/api/usuarios", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.error || "Erro ao criar usuário.");
        }
        /* * Caso a API retorne o usuário criado: */ if (data.data) {
          setUsuarios((usuariosAtuais) => [data.data, ...usuariosAtuais]);
        } else {
          /* * Fallback caso sua API não retorne o registro. */ await carregarUsuarios();
        }
        setPaginaAtual(1);
      }
      fecharModal();
    } catch (error) {
      console.error(error);
      setErro(
        error instanceof Error ? error.message : "Erro ao salvar usuário.",
      );
    } finally {
      setSalvando(false);
    }
  }
  /* * ============================================================ * EXCLUIR USUÁRIO * ============================================================ */ async function excluirUsuario(
    id: number,
  ) {
    const usuario = usuarios.find((item) => item.id === id);
    if (!usuario) return;
    const confirmar = window.confirm(
      `Deseja realmente excluir o usuário "${usuario.nome}"?`,
    );
    if (!confirmar) return;
    try {
      setExcluindoId(id);
      const response = await fetch(`/api/usuarios/${id}`, { method: "DELETE" });
      const data = await response.json().catch(() => null);
      if (!response.ok) {
        throw new Error(data?.error || "Erro ao excluir usuário.");
      }
      setUsuarios((usuariosAtuais) =>
        usuariosAtuais.filter((item) => item.id !== id),
      );
    } catch (error) {
      console.error(error);
      alert(
        error instanceof Error ? error.message : "Erro ao excluir usuário.",
      );
    } finally {
      setExcluindoId(null);
    }
  }
  /* * ============================================================ * ALTERAR STATUS * ============================================================ * * IMPORTANTE: * Seu código original alterava apenas o estado local. * * Aqui estou enviando a alteração para a mesma API PUT. */ async function alternarStatus(
    usuario: Usuario,
  ) {
    const novoStatus = !usuario.ativo;
    try {
      const response = await fetch(`/api/usuarios/${usuario.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nome: usuario.nome,
          email: usuario.email,
          nip: usuario.nip,
          roleId: roleToId[usuario.role],
          ativo: novoStatus,
        }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Erro ao alterar status.");
      }
      setUsuarios((usuariosAtuais) =>
        usuariosAtuais.map((item) =>
          item.id === usuario.id ? { ...item, ativo: novoStatus } : item,
        ),
      );
    } catch (error) {
      console.error(error);
      alert(error instanceof Error ? error.message : "Erro ao alterar status.");
    }
  }
  /* * ============================================================ * PAGINAÇÃO * ============================================================ */ function irParaPagina(
    pagina: number,
  ) {
    if (pagina < 1 || pagina > totalPaginas) {
      return;
    }
    setPaginaAtual(pagina);
  }
  function renderizarPaginas() {
    const paginas: number[] = [];
    const inicio = Math.max(1, paginaAtual - 2);
    const fim = Math.min(totalPaginas, paginaAtual + 2);
    for (let pagina = inicio; pagina <= fim; pagina++) {
      paginas.push(pagina);
    }
    return paginas;
  }
  /* * ============================================================ * RENDER * ============================================================ */ return (
    <>
      <main className="flex-1 p-4 sm:p-6 lg:p-8">
        <div className="mx-auto w-full max-w-7xl">
          {/* ================================================== CABEÇALHO ================================================== */}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-xl font-semibold sm:text-2xl">Usuários</h1>
              <p className="mt-1 text-sm text-slate-500">
                Gerencie os usuários, seus perfis e permissões de acesso ao
                sistema.
              </p>
            </div>
            <button
              type="button"
              onClick={abrirCadastro}
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800"
            >
              <Plus size={18} /> Novo usuário
            </button>
          </div>
          {/* ================================================== RESUMO ================================================== */}
          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100">
                  <Users size={20} />
                </div>
                <div>
                  <p className="text-xs text-slate-500">Total de usuários</p>
                  <p className="text-2xl font-bold">
                    {carregando ? (
                      <span className="inline-block h-7 w-12 animate-pulse rounded bg-slate-200" />
                    ) : (
                      usuarios.length
                    )}
                  </p>
                </div>
              </div>
            </div>
            <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
              <p className="text-xs text-slate-500"> Usuários ativos </p>
              <p className="mt-1 text-2xl font-bold">
                {carregando ? (
                  <span className="inline-block h-7 w-12 animate-pulse rounded bg-slate-200" />
                ) : (
                  usuarios.filter((usuario) => usuario.ativo).length
                )}
              </p>
            </div>
            <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
              <p className="text-xs text-slate-500"> Administradores </p>
              <p className="mt-1 text-2xl font-bold">
                {carregando ? (
                  <span className="inline-block h-7 w-12 animate-pulse rounded bg-slate-200" />
                ) : (
                  usuarios.filter((usuario) => usuario.role === "Administrador")
                    .length
                )}
              </p>
            </div>
          </div>
          {/* ================================================== LISTA ================================================== */}
          <section className="mt-6 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-200 px-5 py-4 sm:px-6">
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <h2 className="font-semibold"> Usuários cadastrados </h2>
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
                    onChange={(event) => setBusca(event.target.value)}
                    placeholder="Pesquisar usuário..."
                    className="w-full rounded-lg border border-slate-300 py-2.5 pl-10 pr-4 text-sm outline-none focus:border-slate-700 focus:ring-2 focus:ring-slate-200"
                  />
                </div>
              </div>
            </div>
            {/* ================================================== ERRO ================================================== */}
            {erro && !modalAberto && (
              <div className="m-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3">
                <div className="flex items-center justify-between gap-4">
                  <p className="text-sm text-red-700"> {erro} </p>
                  <button
                    type="button"
                    onClick={carregarUsuarios}
                    className="text-sm font-semibold text-red-700 hover:underline"
                  >
                    Tentar novamente
                  </button>
                </div>
              </div>
            )}
            {/* ================================================== CARREGAMENTO ================================================== */}
            {carregando ? (
              <div className="divide-y divide-slate-100">
                {Array.from({ length: 6 }).map((_, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-6 px-6 py-5"
                  >
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
            ) : (
              <>
                {/* ================================================== TABELA ================================================== */}
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[800px]">
                    <thead className="bg-slate-50">
                      <tr className="border-b border-slate-200 text-left">
                        <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                          Usuário
                        </th>
                        <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                          NIP
                        </th>
                        <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                          Perfil
                        </th>
                        <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                          Status
                        </th>
                        <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">
                          Ações
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {usuariosPaginados.map((usuario) => (
                        <tr
                          key={usuario.id}
                          className="transition hover:bg-slate-50"
                        >
                          <td className="px-6 py-4">
                            <div>
                              <p className="text-sm font-semibold">
                                {usuario.nome}
                              </p>
                              <p className="mt-1 text-xs text-slate-500">
                                {usuario.email}
                              </p>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span className="font-mono text-sm text-slate-700">
                              {usuario.nip}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700">
                              <ShieldCheck size={13} /> {usuario.role}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <button
                              type="button"
                              onClick={() => alternarStatus(usuario)}
                              className={`rounded-full px-3 py-1 text-xs font-semibold ${usuario.ativo ? "bg-green-100 text-green-700" : "bg-slate-100 text-slate-500"}`}
                            >
                              {usuario.ativo ? "Ativo" : "Inativo"}
                            </button>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex justify-end gap-2">
                              <button
                                type="button"
                                onClick={() => abrirEdicao(usuario)}
                                className="rounded-lg p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-900"
                                title="Editar usuário"
                              >
                                <Pencil size={17} />
                              </button>
                              <button
                                type="button"
                                onClick={() => excluirUsuario(usuario.id)}
                                disabled={excluindoId === usuario.id}
                                className="rounded-lg p-2 text-slate-500 transition hover:bg-red-50 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-50"
                                title="Excluir usuário"
                              >
                                {excluindoId === usuario.id ? (
                                  <span className="block h-[17px] w-[17px] animate-spin rounded-full border-2 border-slate-300 border-t-red-500" />
                                ) : (
                                  <Trash2 size={17} />
                                )}
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {/* ================================================== VAZIO ================================================== */}
                  {usuariosFiltrados.length === 0 && (
                    <div className="px-6 py-12 text-center">
                      <Users size={32} className="mx-auto text-slate-300" />
                      <p className="mt-3 text-sm font-medium">
                        Nenhum usuário encontrado
                      </p>
                      <p className="mt-1 text-sm text-slate-500">
                        {busca
                          ? "Tente pesquisar por outro nome, e-mail ou NIP."
                          : "Ainda não existem usuários cadastrados."}
                      </p>
                    </div>
                  )}
                </div>
                {/* ================================================== PAGINAÇÃO ================================================== */}
                {usuariosFiltrados.length > 0 && (
                  <div className="flex flex-col gap-4 border-t border-slate-200 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
                    <p className="text-sm text-slate-500">
                      Mostrando {""}
                      <span className="font-medium text-slate-700">
                        {(paginaAtual - 1) * USUARIOS_POR_PAGINA + 1}
                      </span>
                      {""} até {""}
                      <span className="font-medium text-slate-700">
                        {Math.min(
                          paginaAtual * USUARIOS_POR_PAGINA,
                          usuariosFiltrados.length,
                        )}
                      </span>
                      {""} de {""}
                      <span className="font-medium text-slate-700">
                        {usuariosFiltrados.length}
                      </span>
                      {""} usuários
                    </p>
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => irParaPagina(paginaAtual - 1)}
                        disabled={paginaAtual === 1}
                        className="rounded-lg p-2 text-slate-500 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40"
                        aria-label="Página anterior"
                      >
                        <ChevronLeft size={18} />
                      </button>
                      {renderizarPaginas().map((pagina) => (
                        <button
                          key={pagina}
                          type="button"
                          onClick={() => irParaPagina(pagina)}
                          className={`h-9 min-w-9 rounded-lg px-2 text-sm font-medium transition ${pagina === paginaAtual ? "bg-slate-900 text-white" : "text-slate-600 hover:bg-slate-100"}`}
                        >
                          {pagina}
                        </button>
                      ))}
                      <button
                        type="button"
                        onClick={() => irParaPagina(paginaAtual + 1)}
                        disabled={paginaAtual === totalPaginas}
                        className="rounded-lg p-2 text-slate-500 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40"
                        aria-label="Próxima página"
                      >
                        <ChevronRight size={18} />
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}
          </section>
        </div>
      </main>
      {/* ========================================================== MODAL ========================================================== */}
      {modalAberto && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-xl rounded-xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5">
              <div>
                <h2 className="font-semibold">
                  {usuarioEditando ? "Editar usuário" : "Novo usuário"}
                </h2>
                <p className="mt-1 text-xs text-slate-500">
                  {usuarioEditando
                    ? "Atualize os dados e o perfil de acesso."
                    : "Cadastre um novo usuário no sistema."}
                </p>
              </div>
              <button
                type="button"
                onClick={fecharModal}
                disabled={salvando}
                className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700 disabled:opacity-40"
              >
                <X size={20} />
              </button>
            </div>
            <form onSubmit={salvarUsuario} className="space-y-5 p-6">
              {erro && (
                <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3">
                  <p className="text-sm text-red-700"> {erro} </p>
                </div>
              )}
              <div>
                <label
                  htmlFor="nome"
                  className="mb-2 block text-sm font-medium"
                >
                  Nome completo
                </label>
                <input
                  id="nome"
                  type="text"
                  value={form.nome}
                  onChange={(event) =>
                    setForm({ ...form, nome: event.target.value })
                  }
                  placeholder="Ex.: João da Silva"
                  disabled={salvando}
                  className="w-full rounded-lg border border-slate-300 px-4 py-3 text-sm outline-none focus:border-slate-700 focus:ring-2 focus:ring-slate-200 disabled:bg-slate-50"
                />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="nip"
                    className="mb-2 block text-sm font-medium"
                  >
                    NIP
                  </label>
                  <input
                    id="nip"
                    type="text"
                    value={form.nip}
                    disabled={!!usuarioEditando || salvando}
                    onChange={(event) =>
                      setForm({ ...form, nip: event.target.value })
                    }
                    placeholder="Número de identificação"
                    className={`w-full rounded-lg border px-4 py-3 text-sm outline-none focus:ring-2 ${usuarioEditando ? "cursor-not-allowed border-slate-200 bg-slate-50 text-slate-500" : "border-slate-300 bg-white focus:border-slate-700 focus:ring-slate-200"}`}
                  />
                </div>
                <div>
                  <label
                    htmlFor="role"
                    className="mb-2 block text-sm font-medium"
                  >
                    Perfil
                  </label>
                  <select
                    id="role"
                    value={form.role}
                    disabled={salvando}
                    onChange={(event) =>
                      setForm({ ...form, role: event.target.value as Role })
                    }
                    className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm outline-none focus:border-slate-700 focus:ring-2 focus:ring-slate-200 disabled:bg-slate-50"
                  >
                    {roles.map((role) => (
                      <option key={role} value={role}>
                        {role}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <label
                  htmlFor="email"
                  className="mb-2 block text-sm font-medium"
                >
                  E-mail
                </label>
                <input
                  id="email"
                  type="email"
                  value={form.email}
                  disabled={salvando}
                  onChange={(event) =>
                    setForm({ ...form, email: event.target.value })
                  }
                  placeholder="usuario@exemplo.com"
                  className="w-full rounded-lg border border-slate-300 px-4 py-3 text-sm outline-none focus:border-slate-700 focus:ring-2 focus:ring-slate-200 disabled:bg-slate-50"
                />
              </div>
              <div>
                <label
                  htmlFor="senha"
                  className="mb-2 block text-sm font-medium"
                >
                  {usuarioEditando ? "Nova senha" : "Senha"}
                </label>
                <input
                  id="senha"
                  type="password"
                  value={form.senha}
                  disabled={salvando}
                  onChange={(event) =>
                    setForm({ ...form, senha: event.target.value })
                  }
                  placeholder={
                    usuarioEditando
                      ? "Deixe vazio para manter a senha"
                      : "Digite uma senha"
                  }
                  className="w-full rounded-lg border border-slate-300 px-4 py-3 text-sm outline-none focus:border-slate-700 focus:ring-2 focus:ring-slate-200 disabled:bg-slate-50"
                />
              </div>
              <label className="flex items-center justify-between rounded-lg border border-slate-200 p-4">
                <div>
                  <p className="text-sm font-medium"> Usuário ativo </p>
                  <p className="mt-1 text-xs text-slate-500">
                    Usuários inativos não devem conseguir acessar o sistema.
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={form.ativo}
                  disabled={salvando}
                  onChange={(event) =>
                    setForm({ ...form, ativo: event.target.checked })
                  }
                  className="h-4 w-4 accent-slate-900"
                />
              </label>
              <div className="flex justify-end gap-3 border-t border-slate-100 pt-5">
                <button
                  type="button"
                  onClick={fecharModal}
                  disabled={salvando}
                  className="rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={salvando}
                  className="inline-flex min-w-[170px] items-center justify-center gap-2 rounded-lg bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {salvando && (
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                  )}
                  {salvando
                    ? "Salvando..."
                    : usuarioEditando
                      ? "Salvar alterações"
                      : "Cadastrar usuário"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
