"use client";

import { useCallback, useEffect, useState, type FormEvent } from "react";

import { alterarSenha, atualizarPerfil } from "@/services/api/perfil.service";

import { useUser } from "@/contexts/UserContext";

export function usePerfil() {
  const { user, updateUser } = useUser();

  const [nome, setNome] = useState(user?.nome ?? user?.name ?? "");

  const [email, setEmail] = useState(user?.email ?? "");

  const [nip] = useState(user?.nip ?? "");

  const [senhaAtual, setSenhaAtual] = useState("");
  const [novaSenha, setNovaSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");

  const [mostrarSenhaAtual, setMostrarSenhaAtual] = useState(false);

  const [mostrarNovaSenha, setMostrarNovaSenha] = useState(false);

  const [mostrarConfirmacao, setMostrarConfirmacao] = useState(false);

  const [mensagem, setMensagem] = useState<string | null>(null);

  const [erro, setErro] = useState<string | null>(null);

  const [salvandoPerfil, setSalvandoPerfil] = useState(false);

  const [salvandoSenha, setSalvandoSenha] = useState(false);

  useEffect(() => {
    setNome(user?.nome ?? user?.name ?? "");
    setEmail(user?.email ?? "");
  }, [user?.nome, user?.name, user?.email]);

  const limparMensagens = useCallback(() => {
    setMensagem(null);
    setErro(null);
  }, []);

  const handleProfileSubmit = useCallback(
    async (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();

      limparMensagens();
      setSalvandoPerfil(true);

      try {
        const response = await atualizarPerfil({
          nome: nome.trim(),
          email: email.trim(),
        });

        updateUser({
          nome: response.data.nome,
          email: response.data.email,
        });

        setNome(response.data.nome);
        setEmail(response.data.email);

        setMensagem("Perfil atualizado com sucesso!");
      } catch (error) {
        console.error(error);

        setErro(
          error instanceof Error
            ? error.message
            : "Erro inesperado ao atualizar perfil.",
        );
      } finally {
        setSalvandoPerfil(false);
      }
    },
    [nome, email, updateUser, limparMensagens],
  );

  const handlePasswordSubmit = useCallback(
    async (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();

      limparMensagens();

      if (!senhaAtual || !novaSenha || !confirmarSenha) {
        setErro("Preencha todos os campos de senha.");
        return;
      }

      if (novaSenha !== confirmarSenha) {
        setErro("A confirmação da nova senha não corresponde.");
        return;
      }

      if (novaSenha.length < 6) {
        setErro("A nova senha deve possuir pelo menos 6 caracteres.");
        return;
      }

      setSalvandoSenha(true);

      try {
        await alterarSenha({
          senhaAtual,
          novaSenha,
        });

        setMensagem("Senha atualizada com sucesso!");

        setSenhaAtual("");
        setNovaSenha("");
        setConfirmarSenha("");

        setMostrarSenhaAtual(false);
        setMostrarNovaSenha(false);
        setMostrarConfirmacao(false);
      } catch (error) {
        console.error(error);

        setErro(
          error instanceof Error
            ? error.message
            : "Erro inesperado ao atualizar senha.",
        );
      } finally {
        setSalvandoSenha(false);
      }
    },
    [senhaAtual, novaSenha, confirmarSenha, limparMensagens],
  );

  return {
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

    setMensagem,
    setErro,

    handleProfileSubmit,
    handlePasswordSubmit,
    limparMensagens,
  };
}
