import { NextRequest } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import {
  errorResponse,
  commonErrors,
  successResponse,
} from "@/lib/api-response";
import { registrarAuditoria } from "@/lib/auditoria";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

type EstadoRecebido = {
  status: "aguardando" | "em_andamento" | "pausada" | "finalizada";

  perguntaAtual: number;

  pontos: {
    equipe1: number;
    equipe2: number;
  };

  equipeDaVez: "A" | "B";

  tempoRestante: number;

  cronometroFimEm: number | null;

  respostaVisivel: boolean;

  resultado: "correta" | "incorreta" | null;
};

function statusBanco(status: EstadoRecebido["status"]) {
  if (status === "aguardando") {
    return "pronta";
  }

  return status;
}

function nomeStatus(status: string) {
  const nomes: Record<string, string> = {
    configuracao: "Em configuração",
    pronta: "Pronta",
    aguardando: "Aguardando",
    em_andamento: "Em andamento",
    pausada: "Pausada",
    finalizada: "Finalizada",
  };

  return nomes[status] ?? status;
}

export async function PATCH(request: NextRequest, { params }: RouteContext) {
  try {
    const session = await auth();

    if (!session?.user) {
      return commonErrors.unauthorized();
    }

    const permissions = session.user.permissions ?? [];

    if (
      !permissions.includes("jogo.gerenciar") &&
      !permissions.includes("administrador")
    ) {
      return errorResponse(
        "Você não possui permissão para controlar a partida.",
        403,
      );
    }

    const { id } = await params;

    if (!id?.trim()) {
      return errorResponse("ID da partida é obrigatório.", 400);
    }

    const body = (await request.json()) as EstadoRecebido;

    if (!Number.isInteger(body.perguntaAtual) || body.perguntaAtual < 1) {
      return errorResponse("Pergunta atual inválida.", 400);
    }

    if (!Number.isInteger(body.tempoRestante) || body.tempoRestante < 0) {
      return errorResponse("Tempo restante inválido.", 400);
    }

    if (!body.pontos || body.pontos.equipe1 < 0 || body.pontos.equipe2 < 0) {
      return errorResponse("Pontuação inválida.", 400);
    }

    const partida = await prisma.partida.findUnique({
      where: {
        id,
      },
    });

    if (!partida) {
      return errorResponse("Partida não encontrada.", 404);
    }

    const novoStatus = statusBanco(body.status);

    const houveMudancaStatus = partida.status !== novoStatus;

    const houveMudancaPergunta = partida.perguntaAtual !== body.perguntaAtual;

    const houveMudancaEquipe = partida.equipeDaVez !== body.equipeDaVez;

    const houveMudancaPontuacao =
      partida.pontuacaoEquipeA !== body.pontos.equipe1 ||
      partida.pontuacaoEquipeB !== body.pontos.equipe2;

    const houveMudancaResposta =
      Boolean(partida.respostaVisivel) !== Boolean(body.respostaVisivel) ||
      partida.resultadoPergunta !== body.resultado;

    const atualizada = await prisma.partida.update({
      where: {
        id,
      },

      data: {
        status: novoStatus,

        perguntaAtual: body.perguntaAtual,

        pontuacaoEquipeA: body.pontos.equipe1,

        pontuacaoEquipeB: body.pontos.equipe2,

        equipeDaVez: body.equipeDaVez,

        tempoRestante: body.tempoRestante,

        cronometroFimEm: body.cronometroFimEm
          ? new Date(body.cronometroFimEm)
          : null,

        respostaVisivel: Boolean(body.respostaVisivel),

        resultadoPergunta: body.resultado,
      },
    });

    /*
     * Auditoria de mudanças importantes.
     *
     * Não registramos cada atualização do cronômetro.
     */

    if (houveMudancaStatus) {
      let acao = "ALTERACAO_STATUS_PARTIDA";

      if (novoStatus === "em_andamento") {
        acao = "INICIO_PARTIDA";
      }

      if (novoStatus === "pausada") {
        acao = "PAUSA_PARTIDA";
      }

      if (novoStatus === "finalizada") {
        acao = "FINALIZACAO_PARTIDA";
      }

      await registrarAuditoria({
        session,
        acao,
        entidade: "Partida",
        entidadeId: partida.id,
        descricao: `${
          acao === "INICIO_PARTIDA"
            ? "Iniciou"
            : acao === "PAUSA_PARTIDA"
              ? "Pausou"
              : acao === "FINALIZACAO_PARTIDA"
                ? "Finalizou"
                : "Alterou o status da"
        } partida "${partida.nome}".`,
        detalhes: {
          statusAnterior: partida.status,
          novoStatus,
          statusAnteriorDescricao: nomeStatus(partida.status),
          novoStatusDescricao: nomeStatus(novoStatus),
        },
      });
    }

    if (houveMudancaPergunta) {
      await registrarAuditoria({
        session,
        acao: "ALTERACAO_PERGUNTA",
        entidade: "Partida",
        entidadeId: partida.id,
        descricao: `Alterou a pergunta da partida "${partida.nome}".`,
        detalhes: {
          perguntaAnterior: partida.perguntaAtual,
          novaPergunta: body.perguntaAtual,
        },
      });
    }

    if (houveMudancaEquipe) {
      await registrarAuditoria({
        session,
        acao: "ALTERACAO_EQUIPE",
        entidade: "Partida",
        entidadeId: partida.id,
        descricao: `Alterou a equipe da vez na partida "${partida.nome}".`,
        detalhes: {
          equipeAnterior: partida.equipeDaVez,
          novaEquipe: body.equipeDaVez,
        },
      });
    }

    if (houveMudancaPontuacao) {
      await registrarAuditoria({
        session,
        acao: "ALTERACAO_PONTUACAO",
        entidade: "Partida",
        entidadeId: partida.id,
        descricao: `Alterou a pontuação da partida "${partida.nome}".`,
        detalhes: {
          anterior: {
            equipe1: partida.pontuacaoEquipeA,
            equipe2: partida.pontuacaoEquipeB,
          },
          nova: {
            equipe1: body.pontos.equipe1,
            equipe2: body.pontos.equipe2,
          },
        },
      });
    }

    if (houveMudancaResposta) {
      await registrarAuditoria({
        session,
        acao: "ALTERACAO_RESPOSTA_PARTIDA",
        entidade: "Partida",
        entidadeId: partida.id,
        descricao: `Alterou o resultado da pergunta na partida "${partida.nome}".`,
        detalhes: {
          respostaVisivelAnterior: partida.respostaVisivel,
          respostaVisivelNova: body.respostaVisivel,
          resultadoAnterior: partida.resultadoPergunta,
          resultadoNovo: body.resultado,
        },
      });
    }

    return successResponse(atualizada, "Estado da partida salvo com sucesso.");
  } catch (error) {
    console.error("Erro ao salvar estado da partida:", error);

    return commonErrors.internalServerError();
  }
}
