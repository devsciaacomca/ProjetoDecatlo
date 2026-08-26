"use client";

import { FormEvent, useState } from "react";
import { useSession } from "next-auth/react";
import {
  User,
  Mail,
  Shield,
  Lock,
  Badge,
  Save,
  Eye,
  EyeOff,
  CheckCircle2,
} from "lucide-react";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";

export default function PerfilPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const { data: session, status } = useSession();

  const user = session?.user;

  const [nome, setNome] = useState(user?.nome ?? user?.name ?? "");
  const [email, setEmail] = useState(user?.email ?? "");
  const [nip, setNip] = useState(user?.nip ?? "");

  const [senhaAtual, setSenhaAtual] = useState("");
  const [novaSenha, setNovaSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");

  const [mostrarSenhaAtual, setMostrarSenhaAtual] = useState(false);
  const [mostrarNovaSenha, setMostrarNovaSenha] = useState(false);
  const [mostrarConfirmacao, setMostrarConfirmacao] = useState(false);

  const [mensagem, setMensagem] = useState<string | null>(null);

  if (status === "loading") {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-100">
        <div className="text-sm text-slate-500">Carregando perfil...</div>
      </main>
    );
  }

  if (!user) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-100">
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm text-slate-600">
            Não foi possível carregar os dados do usuário.
          </p>
        </div>
      </main>
    );
  }

  function handleProfileSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    // Futuramente:
    // await fetch("/api/usuario/perfil", {
    //   method: "PATCH",
    //   body: JSON.stringify({ nome, email }),
    // });

    setMensagem("Dados do perfil preparados para atualização.");
  }

  function handlePasswordSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setMensagem(null);

    if (!senhaAtual || !novaSenha || !confirmarSenha) {
      setMensagem("Preencha todos os campos de senha.");
      return;
    }

    if (novaSenha !== confirmarSenha) {
      setMensagem("A confirmação da nova senha não corresponde.");
      return;
    }

    if (novaSenha.length < 6) {
      setMensagem("A nova senha deve possuir pelo menos 6 caracteres.");
      return;
    }

    // Futuramente:
    // await fetch("/api/usuario/senha", {
    //   method: "PATCH",
    //   body: JSON.stringify({
    //     senhaAtual,
    //     novaSenha,
    //   }),
    // });

    setMensagem("Senha preparada para atualização.");

    setSenhaAtual("");
    setNovaSenha("");
    setConfirmarSenha("");
  }

  return (
    <main className="min-h-screen bg-slate-100 text-slate-900">
      <div className="flex min-h-screen">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

        <section className="flex min-w-0 flex-1 flex-col">
          <Header onMenuClick={() => setSidebarOpen(true)} />

          <main className="min-h-screen bg-slate-100 text-slate-900">
            <div className="mx-auto w-full max-w-5xl p-4 sm:p-6 lg:p-8">
              {/* Cabeçalho */}
              <div className="mb-8">
                <h1 className="text-xl font-semibold sm:text-2xl">
                  Meu perfil
                </h1>

                <p className="mt-1 text-sm text-slate-500">
                  Gerencie suas informações pessoais e credenciais de acesso.
                </p>
              </div>

              {/* Mensagem */}
              {mensagem && (
                <div className="mb-6 flex items-center gap-3 rounded-xl border border-green-200 bg-green-50 px-5 py-4">
                  <CheckCircle2 size={20} className="shrink-0 text-green-600" />

                  <p className="text-sm text-green-700">{mensagem}</p>
                </div>
              )}

              <div className="grid gap-6 lg:grid-cols-3">
                {/* Identificação */}
                <section className="rounded-xl border border-slate-200 bg-white shadow-sm">
                  <div className="border-b border-slate-200 px-5 py-5">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100">
                        <User size={20} className="text-slate-600" />
                      </div>

                      <div>
                        <h2 className="font-semibold">Minha conta</h2>

                        <p className="text-xs text-slate-500">
                          Informações de acesso
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-5 p-5">
                    <div>
                      <p className="text-xs text-slate-500">Nome</p>

                      <p className="mt-1 text-sm font-medium">
                        {user.nome ?? user.name ?? "Não informado"}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs text-slate-500">E-mail</p>

                      <p className="mt-1 break-all text-sm font-medium">
                        {user.email ?? "Não informado"}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs text-slate-500">NIP</p>

                      <p className="mt-1 text-sm font-medium">
                        {user.nip ?? "Não informado"}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs text-slate-500">Função</p>

                      <div className="mt-2 inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1.5">
                        <Shield size={14} />

                        <span className="text-xs font-semibold">
                          {user.role ?? "Usuário"}
                        </span>
                      </div>
                    </div>
                  </div>
                </section>

                {/* Dados pessoais */}
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

                  <form
                    onSubmit={handleProfileSubmit}
                    className="space-y-5 p-5 sm:p-6"
                  >
                    {/* Nome */}
                    <div>
                      <label
                        htmlFor="nome"
                        className="mb-2 block text-sm font-medium"
                      >
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
                          onChange={(event) => setNome(event.target.value)}
                          className="w-full rounded-lg border border-slate-300 py-3 pl-10 pr-4 text-sm outline-none transition focus:border-slate-700 focus:ring-2 focus:ring-slate-200"
                          placeholder="Digite seu nome"
                        />
                      </div>
                    </div>

                    {/* Email */}
                    <div>
                      <label
                        htmlFor="email"
                        className="mb-2 block text-sm font-medium"
                      >
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
                          onChange={(event) => setEmail(event.target.value)}
                          className="w-full rounded-lg border border-slate-300 py-3 pl-10 pr-4 text-sm outline-none transition focus:border-slate-700 focus:ring-2 focus:ring-slate-200"
                          placeholder="seu@email.com"
                        />
                      </div>
                    </div>

                    {/* NIP */}
                    <div>
                      <label
                        htmlFor="nip"
                        className="mb-2 block text-sm font-medium"
                      >
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
                        O NIP é utilizado como identificador de acesso e não
                        pode ser alterado pelo usuário.
                      </p>
                    </div>

                    <div className="flex justify-end border-t border-slate-100 pt-5">
                      <button
                        type="submit"
                        className="inline-flex items-center gap-2 rounded-lg bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
                      >
                        <Save size={17} />
                        Salvar alterações
                      </button>
                    </div>
                  </form>
                </section>

                {/* Senha */}
                <section className="rounded-xl border border-slate-200 bg-white shadow-sm lg:col-span-3">
                  <div className="border-b border-slate-200 px-5 py-5 sm:px-6">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100">
                        <Lock size={20} className="text-slate-600" />
                      </div>

                      <div>
                        <h2 className="font-semibold">Alterar senha</h2>

                        <p className="text-xs text-slate-500">
                          Altere sua senha de acesso ao sistema.
                        </p>
                      </div>
                    </div>
                  </div>

                  <form
                    onSubmit={handlePasswordSubmit}
                    className="grid gap-5 p-5 sm:p-6 md:grid-cols-3"
                  >
                    {/* Senha atual */}
                    <PasswordInput
                      id="senha-atual"
                      label="Senha atual"
                      value={senhaAtual}
                      onChange={setSenhaAtual}
                      visible={mostrarSenhaAtual}
                      onToggle={() => setMostrarSenhaAtual((value) => !value)}
                    />

                    {/* Nova senha */}
                    <PasswordInput
                      id="nova-senha"
                      label="Nova senha"
                      value={novaSenha}
                      onChange={setNovaSenha}
                      visible={mostrarNovaSenha}
                      onToggle={() => setMostrarNovaSenha((value) => !value)}
                    />

                    {/* Confirmar */}
                    <PasswordInput
                      id="confirmar-senha"
                      label="Confirmar nova senha"
                      value={confirmarSenha}
                      onChange={setConfirmarSenha}
                      visible={mostrarConfirmacao}
                      onToggle={() => setMostrarConfirmacao((value) => !value)}
                    />

                    <div className="md:col-span-3 flex justify-end border-t border-slate-100 pt-5">
                      <button
                        type="submit"
                        className="inline-flex items-center gap-2 rounded-lg bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
                      >
                        <Lock size={17} />
                        Alterar senha
                      </button>
                    </div>
                  </form>
                </section>
              </div>
            </div>
          </main>
        </section>
      </div>
    </main>
  );
}
//separar types
interface PasswordInputProps {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  visible: boolean;
  onToggle: () => void;
}
// criar component
function PasswordInput({
  id,
  label,
  value,
  onChange,
  visible,
  onToggle,
}: PasswordInputProps) {
  return (
    <div>
      <label htmlFor={id} className="mb-2 block text-sm font-medium">
        {label}
      </label>

      <div className="relative">
        <input
          id={id}
          type={visible ? "text" : "password"}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className="w-full rounded-lg border border-slate-300 py-3 pl-4 pr-11 text-sm outline-none transition focus:border-slate-700 focus:ring-2 focus:ring-slate-200"
          placeholder="••••••••"
        />

        <button
          type="button"
          onClick={onToggle}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700"
          aria-label={visible ? "Ocultar senha" : "Mostrar senha"}
        >
          {visible ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      </div>
    </div>
  );
}
