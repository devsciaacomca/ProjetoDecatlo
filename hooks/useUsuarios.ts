"use client";

import { useCallback, useEffect, useState } from "react";

import {
  atualizarUsuario,
  criarUsuario,
  excluirUsuario,
  listarUsuarios,
} from "@/services/api/usuarios.service";

import type {
  AtualizarUsuarioPayload,
  CriarUsuarioPayload,
} from "@/services/api/usuarios.service";

import { FORMULARIO_USUARIO_INICIAL } from "@/types/usuarios";

import type { Usuario, UsuarioForm } from "@/types/usuarios";

const USUARIOS_POR_PAGINA = 10;

export function useUsuarios() {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);

  const [busca, setBusca] = useState("");

  const [paginaAtual, setPaginaAtual] = useState(1);

  const [totalUsuarios, setTotalUsuarios] = useState(0);

  const [totalPaginas, setTotalPaginas] = useState(1);

  const [carregando, setCarregando] = useState(true);

  const [salvando, setSalvando] = useState(false);

  const [excluindoId, setExcluindoId] = useState<number | null>(null);

  const [erro, setErro] = useState<string | null>(null);

  const [modalAberto, setModalAberto] = useState(false);

  const [usuarioEditando, setUsuarioEditando] = useState<Usuario | null>(null);

  const [form, setForm] = useState<UsuarioForm>(FORMULARIO_USUARIO_INICIAL);

  const carregarUsuarios = useCallback(async () => {
    try {
      setCarregando(true);
      setErro(null);

      const response = await listarUsuarios({
        page: paginaAtual,
        limit: USUARIOS_POR_PAGINA,
        search: busca,
      });

      setUsuarios(response.data);

      setTotalUsuarios(response.meta?.totalCount ?? 0);

      setTotalPaginas(response.meta?.totalPages ?? 1);
    } catch (error) {
      console.error(error);

      setErro(
        error instanceof Error ? error.message : "Erro ao carregar usuários.",
      );
    } finally {
      setCarregando(false);
    }
  }, [paginaAtual, busca]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      carregarUsuarios();
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [carregarUsuarios]);

  useEffect(() => {
    setPaginaAtual(1);
  }, [busca]);

  useEffect(() => {
    if (paginaAtual > totalPaginas) {
      setPaginaAtual(totalPaginas);
    }
  }, [paginaAtual, totalPaginas]);

  const abrirCadastro = useCallback(() => {
    setUsuarioEditando(null);
    setForm(FORMULARIO_USUARIO_INICIAL);
    setErro(null);
    setModalAberto(true);
  }, []);

  const abrirEdicao = useCallback((usuario: Usuario) => {
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
  }, []);

  const fecharModal = useCallback(() => {
    if (salvando) return;

    setModalAberto(false);
    setUsuarioEditando(null);
    setForm(FORMULARIO_USUARIO_INICIAL);
    setErro(null);
  }, [salvando]);

  const atualizarCampo = useCallback(
    <K extends keyof UsuarioForm>(campo: K, valor: UsuarioForm[K]) => {
      setForm((formAtual) => ({
        ...formAtual,
        [campo]: valor,
      }));
    },
    [],
  );

  const salvarUsuario = useCallback(
    async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();

      if (!form.nome.trim() || !form.email.trim() || !form.nip.trim()) {
        setErro("Preencha nome, e-mail e NIP.");
        return;
      }

      if (form.nip.trim().length !== 8) {
        setErro("O NIP deve ter exatamente 8 dígitos.");
        return;
      }

      if (!usuarioEditando && !form.senha.trim()) {
        setErro("Informe uma senha para o novo usuário.");
        return;
      }

      try {
        setSalvando(true);
        setErro(null);

        if (usuarioEditando) {
          const payload: AtualizarUsuarioPayload = {
            nome: form.nome.trim(),
            email: form.email.trim(),
            nip: form.nip.trim(),
            role: form.role,
            ativo: form.ativo,
            ...(form.senha.trim() ? { senha: form.senha.trim() } : {}),
          };

          const response = await atualizarUsuario(usuarioEditando.id, payload);

          if (response.data) {
            setUsuarios((usuariosAtuais) =>
              usuariosAtuais.map((usuario) =>
                usuario.id === usuarioEditando.id ? response.data : usuario,
              ),
            );
          }
        } else {
          const payload: CriarUsuarioPayload = {
            nome: form.nome.trim(),
            email: form.email.trim(),
            nip: form.nip.trim(),
            role: form.role,
            ativo: form.ativo,
            senha: form.senha.trim(),
          };

          const response = await criarUsuario(payload);

          if (response.data) {
            setUsuarios((usuariosAtuais) => [response.data, ...usuariosAtuais]);

            setTotalUsuarios((totalAtual) => totalAtual + 1);
          } else {
            await carregarUsuarios();
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
    },
    [form, usuarioEditando, carregarUsuarios, fecharModal],
  );

  const excluir = useCallback(
    async (id: number) => {
      const usuario = usuarios.find((item) => item.id === id);

      if (!usuario) return;

      const confirmar = window.confirm(
        `Deseja realmente excluir o usuário "${usuario.nome}"?`,
      );

      if (!confirmar) return;

      try {
        setExcluindoId(id);

        await excluirUsuario(id);

        setUsuarios((usuariosAtuais) =>
          usuariosAtuais.filter((item) => item.id !== id),
        );

        setTotalUsuarios((totalAtual) => Math.max(0, totalAtual - 1));
      } catch (error) {
        console.error(error);

        alert(
          error instanceof Error ? error.message : "Erro ao excluir usuário.",
        );
      } finally {
        setExcluindoId(null);
      }
    },
    [usuarios],
  );

  const alternarStatus = useCallback(async (usuario: Usuario) => {
    const novoStatus = !usuario.ativo;

    try {
      await atualizarUsuario(usuario.id, {
        nome: usuario.nome,
        email: usuario.email,
        nip: usuario.nip,
        role: usuario.role,
        ativo: novoStatus,
      });

      setUsuarios((usuariosAtuais) =>
        usuariosAtuais.map((item) =>
          item.id === usuario.id
            ? {
                ...item,
                ativo: novoStatus,
              }
            : item,
        ),
      );
    } catch (error) {
      console.error(error);

      alert(error instanceof Error ? error.message : "Erro ao alterar status.");
    }
  }, []);

  const irParaPagina = useCallback(
    (pagina: number) => {
      if (pagina < 1 || pagina > totalPaginas) {
        return;
      }

      setPaginaAtual(pagina);
    },
    [totalPaginas],
  );

  return {
    usuarios,
    busca,
    paginaAtual,
    totalUsuarios,
    totalPaginas,
    carregando,
    salvando,
    excluindoId,
    erro,
    modalAberto,
    usuarioEditando,
    form,

    setBusca,
    setErro,

    carregarUsuarios,
    abrirCadastro,
    abrirEdicao,
    fecharModal,
    atualizarCampo,
    salvarUsuario,
    excluir,
    alternarStatus,
    irParaPagina,
  };
}
