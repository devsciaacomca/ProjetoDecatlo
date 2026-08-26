"use client";

import { useMemo, useState, useEffect } from "react";
import {
  Search,
  Plus,
  Pencil,
  Trash2,
  Users,
  X,
  ShieldCheck,
} from "lucide-react";

import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import Footer from "@/components/Footer";

//separar types em arquivo separado futuramente
type Role = "Administrador" | "Apresentador" | "Cadastrador" | "Usuário";
interface Usuario {
  id: number;
  nome: string;
  email: string;
  nip: string;
  role: Role;
  ativo: boolean;
}

const usuariosIniciais: Usuario[] = [];

//Verificar
const roles: Role[] = [
  "Administrador",
  "Apresentador",
  "Cadastrador",
  "Usuário",
];

export default function UsuariosPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [usuarios, setUsuarios] = useState<Usuario[]>(usuariosIniciais);

  const [busca, setBusca] = useState("");

  async function carregarUsuarios() {
    try {
      const response = await fetch("/api/usuarios");
      const data = await response.json();
      if (response.ok && data.success) {
        setUsuarios(data.data);
      }
    } catch (e) {
      console.error(e);
    }
  }

  useEffect(() => {
    carregarUsuarios();
  }, []);

  const [modalAberto, setModalAberto] = useState(false);

  const [usuarioEditando, setUsuarioEditando] = useState<Usuario | null>(null);

  const [form, setForm] = useState({
    nome: "",
    email: "",
    nip: "",
    role: "Usuário" as Role,
    senha: "",
    ativo: true,
  });

  const usuariosFiltrados = useMemo(() => {
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

  function abrirCadastro() {
    setUsuarioEditando(null);

    setForm({
      nome: "",
      email: "",
      nip: "",
      role: "Usuário",
      senha: "",
      ativo: true,
    });

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

    setModalAberto(true);
  }

  function fecharModal() {
    setModalAberto(false);
    setUsuarioEditando(null);
  }

  const roleToId: Record<Role, number> = {
    "Administrador": 1,
    "Apresentador": 2,
    "Cadastrador": 3,
    "Usuário": 4
  };

  async function salvarUsuario(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!form.nome.trim() || !form.email.trim() || !form.nip.trim()) {
      return;
    }

    const payload = {
      nome: form.nome.trim(),
      email: form.email.trim(),
      nip: form.nip.trim(),
      roleId: roleToId[form.role],
      ativo: form.ativo,
      ...(form.senha ? { senha: form.senha } : {})
    };

    try {
      if (usuarioEditando) {
        const response = await fetch(`/api/usuarios/${usuarioEditando.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        });
        if (response.ok) {
          carregarUsuarios();
          fecharModal();
        } else {
          alert("Erro ao editar usuário.");
        }
      } else {
        const response = await fetch("/api/usuarios", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        });
        if (response.ok) {
          carregarUsuarios();
          fecharModal();
        } else {
          const data = await response.json();
          alert(data.error || "Erro ao criar usuário.");
        }
      }
    } catch (e) {
      console.error(e);
      alert("Erro de conexão.");
    }
  }

  async function excluirUsuario(id: number) {
    const usuario = usuarios.find((item) => item.id === id);
    if (!usuario) return;

    const confirmar = window.confirm(
      `Deseja realmente excluir o usuário "${usuario.nome}"?`
    );
    if (!confirmar) return;

    try {
      const response = await fetch(`/api/usuarios/${id}`, {
        method: "DELETE"
      });
      if (response.ok) {
        carregarUsuarios();
      } else {
        alert("Erro ao excluir usuário.");
      }
    } catch (e) {
      console.error(e);
    }
  }

  function alternarStatus(usuario: Usuario) {
    setUsuarios((usuariosAtuais) =>
      usuariosAtuais.map((item) =>
        item.id === usuario.id
          ? {
              ...item,
              ativo: !item.ativo,
            }
          : item,
      ),
    );
  }

  return (
    <main className="min-h-screen bg-slate-100 text-slate-900">
      <div className="flex min-h-screen">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

        <section className="flex min-w-0 flex-1 flex-col">
          <Header onMenuClick={() => setSidebarOpen(true)} />

          <main className="flex-1 p-4 sm:p-6 lg:p-8">
            <div className="mx-auto w-full max-w-7xl">
              {/* Cabeçalho */}
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h1 className="text-xl font-semibold sm:text-2xl">
                    Usuários
                  </h1>

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
                  <Plus size={18} />
                  Novo usuário
                </button>
              </div>

              {/* Resumo */}
              <div className="mt-6 grid gap-4 sm:grid-cols-3">
                <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100">
                      <Users size={20} />
                    </div>

                    <div>
                      <p className="text-xs text-slate-500">
                        Total de usuários
                      </p>

                      <p className="text-2xl font-bold">{usuarios.length}</p>
                    </div>
                  </div>
                </div>

                <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                  <p className="text-xs text-slate-500">Usuários ativos</p>

                  <p className="mt-1 text-2xl font-bold">
                    {usuarios.filter((usuario) => usuario.ativo).length}
                  </p>
                </div>

                <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                  <p className="text-xs text-slate-500">Administradores</p>

                  <p className="mt-1 text-2xl font-bold">
                    {
                      usuarios.filter(
                        (usuario) => usuario.role === "Administrador",
                      ).length
                    }
                  </p>
                </div>
              </div>

              {/* Lista */}
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
                        onChange={(event) => setBusca(event.target.value)}
                        placeholder="Pesquisar usuário..."
                        className="w-full rounded-lg border border-slate-300 py-2.5 pl-10 pr-4 text-sm outline-none focus:border-slate-700 focus:ring-2 focus:ring-slate-200"
                      />
                    </div>
                  </div>
                </div>

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
                      {usuariosFiltrados.map((usuario) => (
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
                              <ShieldCheck size={13} />
                              {usuario.role}
                            </span>
                          </td>

                          <td className="px-6 py-4">
                            <button
                              type="button"
                              onClick={() => alternarStatus(usuario)}
                              className={`rounded-full px-3 py-1 text-xs font-semibold ${
                                usuario.ativo
                                  ? "bg-green-100 text-green-700"
                                  : "bg-slate-100 text-slate-500"
                              }`}
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
                                className="rounded-lg p-2 text-slate-500 transition hover:bg-red-50 hover:text-red-600"
                                title="Excluir usuário"
                              >
                                <Trash2 size={17} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>

                  {usuariosFiltrados.length === 0 && (
                    <div className="px-6 py-12 text-center">
                      <Users size={32} className="mx-auto text-slate-300" />

                      <p className="mt-3 text-sm font-medium">
                        Nenhum usuário encontrado
                      </p>

                      <p className="mt-1 text-sm text-slate-500">
                        Tente pesquisar por outro nome, e-mail ou NIP.
                      </p>
                    </div>
                  )}
                </div>
              </section>
            </div>
          </main>

          <Footer />
        </section>
      </div>

      {/* Modal */}
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
                className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={salvarUsuario} className="space-y-5 p-6">
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
                    setForm({
                      ...form,
                      nome: event.target.value,
                    })
                  }
                  placeholder="Ex.: João da Silva"
                  className="w-full rounded-lg border border-slate-300 px-4 py-3 text-sm outline-none focus:border-slate-700 focus:ring-2 focus:ring-slate-200"
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
                    disabled={!!usuarioEditando}
                    onChange={(event) =>
                      setForm({
                        ...form,
                        nip: event.target.value,
                      })
                    }
                    placeholder="Número de identificação"
                    className={`w-full rounded-lg border px-4 py-3 text-sm outline-none focus:ring-2 ${
                      usuarioEditando
                        ? "border-slate-200 bg-slate-50 text-slate-500 cursor-not-allowed"
                        : "border-slate-300 bg-white focus:border-slate-700 focus:ring-slate-200"
                    }`}
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
                    onChange={(event) =>
                      setForm({
                        ...form,
                        role: event.target.value as Role,
                      })
                    }
                    className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm outline-none focus:border-slate-700 focus:ring-2 focus:ring-slate-200"
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
                  onChange={(event) =>
                    setForm({
                      ...form,
                      email: event.target.value,
                    })
                  }
                  placeholder="usuario@exemplo.com"
                  className="w-full rounded-lg border border-slate-300 px-4 py-3 text-sm outline-none focus:border-slate-700 focus:ring-2 focus:ring-slate-200"
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
                  onChange={(event) =>
                    setForm({
                      ...form,
                      senha: event.target.value,
                    })
                  }
                  placeholder={
                    usuarioEditando
                      ? "Deixe vazio para manter a senha"
                      : "Digite uma senha"
                  }
                  className="w-full rounded-lg border border-slate-300 px-4 py-3 text-sm outline-none focus:border-slate-700 focus:ring-2 focus:ring-slate-200"
                />
              </div>

              <label className="flex items-center justify-between rounded-lg border border-slate-200 p-4">
                <div>
                  <p className="text-sm font-medium">Usuário ativo</p>

                  <p className="mt-1 text-xs text-slate-500">
                    Usuários inativos não devem conseguir acessar o sistema.
                  </p>
                </div>

                <input
                  type="checkbox"
                  checked={form.ativo}
                  onChange={(event) =>
                    setForm({
                      ...form,
                      ativo: event.target.checked,
                    })
                  }
                  className="h-4 w-4 accent-slate-900"
                />
              </label>

              <div className="flex justify-end gap-3 border-t border-slate-100 pt-5">
                <button
                  type="button"
                  onClick={fecharModal}
                  className="rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
                >
                  Cancelar
                </button>

                <button
                  type="submit"
                  className="rounded-lg bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-slate-800"
                >
                  {usuarioEditando ? "Salvar alterações" : "Cadastrar usuário"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}
