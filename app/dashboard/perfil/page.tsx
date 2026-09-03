"use client";

import { AlterarSenhaForm } from "@/components/perfil/AlterarSenhaForm";
import { PerfilDadosPessoais } from "@/components/perfil/PerfilDadosPessoais";
import { PerfilHeader } from "@/components/perfil/PerfilHeader";
import { PerfilIdentificacao } from "@/components/perfil/PerfilIdentificacao";
import { PerfilMensagens } from "@/components/perfil/PerfilMensagens";

import { usePerfil } from "@/hooks/usePerfil";

export default function PerfilClient() {
  const {
    user,

    nome,
    email,
    nip,

    senhaAtual,
    novaSenha,
    confirmarSenha,

    mostrarSenhaAtual,
    mostrarNovaSenha,
    mostrarConfirmacao,

    mensagem,
    erro,

    salvandoPerfil,
    salvandoSenha,

    setNome,
    setEmail,

    setSenhaAtual,
    setNovaSenha,
    setConfirmarSenha,

    setMostrarSenhaAtual,
    setMostrarNovaSenha,
    setMostrarConfirmacao,

    handleProfileSubmit,
    handlePasswordSubmit,
  } = usePerfil();

  return (
    <main className="flex-1 bg-slate-100">
      <div className="mx-auto w-full max-w-5xl p-4 sm:p-6 lg:p-8">
        <PerfilHeader nome={user?.nome ?? user?.name} />

        <PerfilMensagens mensagem={mensagem} erro={erro} />

        <div className="grid gap-6 lg:grid-cols-3">
          <PerfilIdentificacao user={user} />

          <PerfilDadosPessoais
            nome={nome}
            email={email}
            nip={nip}
            salvando={salvandoPerfil}
            onNomeChange={setNome}
            onEmailChange={setEmail}
            onSubmit={handleProfileSubmit}
          />

          <AlterarSenhaForm
            email={user?.email}
            senhaAtual={senhaAtual}
            novaSenha={novaSenha}
            confirmarSenha={confirmarSenha}
            mostrarSenhaAtual={mostrarSenhaAtual}
            mostrarNovaSenha={mostrarNovaSenha}
            mostrarConfirmacao={mostrarConfirmacao}
            salvando={salvandoSenha}
            onSenhaAtualChange={setSenhaAtual}
            onNovaSenhaChange={setNovaSenha}
            onConfirmarSenhaChange={setConfirmarSenha}
            onToggleSenhaAtual={() => setMostrarSenhaAtual((value) => !value)}
            onToggleNovaSenha={() => setMostrarNovaSenha((value) => !value)}
            onToggleConfirmacao={() => setMostrarConfirmacao((value) => !value)}
            onSubmit={handlePasswordSubmit}
          />
        </div>
      </div>
    </main>
  );
}
