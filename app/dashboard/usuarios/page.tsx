"use client";

import { UsuariosHeader } from "@/components/usuarios/UsuariosHeader";
import { UsuariosResumo } from "@/components/usuarios/UsuariosResumo";
import { UsuariosLista } from "@/components/usuarios/UsuariosLista";
import { UsuariosTabela } from "@/components/usuarios/UsuariosTabela";
import { UsuariosPaginacao } from "@/components/usuarios/UsuariosPaginacao";
import { UsuarioModal } from "@/components/usuarios/UsuarioModal";

import { useUsuarios } from "@/hooks/useUsuarios";

const USUARIOS_POR_PAGINA = 10;

export default function UsuariosPage() {
  const {
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

    carregarUsuarios,
    abrirCadastro,
    abrirEdicao,
    fecharModal,
    atualizarCampo,
    salvarUsuario,
    excluir,
    alternarStatus,
    irParaPagina,
  } = useUsuarios();

  return (
    <main className="flex-1 p-4 sm:p-6 lg:p-8">
      <div className="mx-auto w-full max-w-7xl">
        <UsuariosHeader onNovoUsuario={abrirCadastro} />

        <UsuariosResumo
          usuarios={usuarios}
          totalUsuarios={totalUsuarios}
          carregando={carregando}
        />

        <UsuariosLista
          busca={busca}
          erro={erro}
          modalAberto={modalAberto}
          carregando={carregando}
          onBuscaChange={setBusca}
          onTentarNovamente={carregarUsuarios}
        >
          <UsuariosTabela
            usuarios={usuarios}
            excluindoId={excluindoId}
            onEditar={abrirEdicao}
            onExcluir={excluir}
            onAlternarStatus={alternarStatus}
          />

          <UsuariosPaginacao
            paginaAtual={paginaAtual}
            totalPaginas={totalPaginas}
            totalUsuarios={totalUsuarios}
            usuariosNaPagina={usuarios.length}
            porPagina={USUARIOS_POR_PAGINA}
            onPaginaChange={irParaPagina}
          />
        </UsuariosLista>

        <UsuarioModal
          aberto={modalAberto}
          usuario={usuarioEditando}
          form={form}
          salvando={salvando}
          erro={erro}
          onClose={fecharModal}
          onSubmit={salvarUsuario}
          onChange={atualizarCampo}
        />
      </div>
    </main>
  );
}
