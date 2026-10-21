import { NextRequest } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { successResponse, errorResponse, commonErrors } from "@/lib/api-response";

type RouteContext = {
  params: Promise<{ id: string }>;
};

// Memória temporária para estado de partidas em modo fallback/offline
const fallbackStore = globalThis as unknown as {
  __decatloFallbackPartidas?: Map<string, any>;
};

if (!fallbackStore.__decatloFallbackPartidas) {
  fallbackStore.__decatloFallbackPartidas = new Map();
}

function getFallbackPartida(id: string) {
  const custom = fallbackStore.__decatloFallbackPartidas?.get(id);

  const base = {
    id: id || "demo",
    nome: "Gincana CIAA - Decatlo 2026",
    equipe1: "Equipe Alfa 1",
    equipe2: "Equipe Alfa 2",
    status: "pronta",
    perguntas: 3,
    perguntaAtual: 1,
    pontuacaoEquipeA: 0,
    pontuacaoEquipeB: 0,
    tempoResposta: 30,
    embaralharPerguntas: false,
    mostrarExplicacao: true,
    permitirPular: true,
    equipeDaVez: "A",
    tempoRestante: 30,
    cronometroFimEm: null,
    respostaVisivel: false,
    resultadoPergunta: null,
    data: new Date().toISOString(),
    perguntasSelecionadas: [
      {
        ordem: 1,
        perguntaId: 101,
        pergunta: {
          id: 101,
          assunto: "Estabilizadores",
          tipo: "objetiva",
          enunciado:
            "Descreva as partes componentes dos estabilizadores comuns ao controle das aletas:",
          respostaCorreta: "Painel de controle e U.C.E.",
          explicacao:
            "O painel de controle e a U.C.E. realizam a interface de supervisão e comando das aletas estabilizadoras.",
          alternativas: [
            { id: 1, texto: "Giroscópio e Bombas" },
            { id: 2, texto: "Painel de controle e U.C.E." },
            { id: 3, texto: "Acumulador e Válvula Moog" },
            { id: 4, texto: "Conversores e Transmissores" },
          ],
        },
      },
      {
        ordem: 2,
        perguntaId: 102,
        pergunta: {
          id: 102,
          assunto: "Propulsão",
          tipo: "objetiva",
          enunciado:
            "Qual a função do redutor principal de velocidade em sistemas de propulsão marítima?",
          respostaCorreta:
            "Reduzir a rotação da turbina/motor para a rotação ideal do hélice",
          explicacao:
            "O redutor principal adapta as altas rotações da máquina térmica para a rotação hidrodinamicamente eficiente do propulsor.",
          alternativas: [
            {
              id: 5,
              texto:
                "Reduzir a rotação da turbina/motor para a rotação ideal do hélice",
            },
            { id: 6, texto: "Aumentar a pressão do combustível injetado" },
            { id: 7, texto: "Controlar o ângulo do leme durante manobras" },
            { id: 8, texto: "Estabilizar a temperatura do óleo lubrificante" },
          ],
        },
      },
      {
        ordem: 3,
        perguntaId: 103,
        pergunta: {
          id: 103,
          assunto: "Máquinas Auxiliares",
          tipo: "objetiva",
          enunciado:
            "Nas bombas centrífugas, o componente rotativo responsável por transferir energia ao fluido chama-se:",
          respostaCorreta: "Rotor (Impelidor)",
          explicacao:
            "O rotor (ou impelidor) gira acelerando o fluido radialmente para a voluta.",
          alternativas: [
            { id: 9, texto: "Voluta" },
            { id: 10, texto: "Rotor (Impelidor)" },
            { id: 11, texto: "Selo mecânico" },
            { id: 12, texto: "Difusor estacionário" },
          ],
        },
      },
    ],
    respostas: [],
  };

  if (custom) {
    return { ...base, ...custom };
  }

  return base;
}

export async function GET(
  _request: NextRequest,
  { params }: RouteContext,
) {
  const { id } = await params;

  if (!id?.trim()) {
    return errorResponse("ID da partida é obrigatório.", 400);
  }

  try {
    const session = await auth();

    // Se o banco estiver acessível, tenta buscar a partida real
    try {
      const partida = await prisma.partida.findUnique({
        where: { id },
        include: {
          perguntasSelecionadas: {
            orderBy: { ordem: "asc" },
            include: {
              pergunta: {
                include: {
                  alternativas: true,
                },
              },
            },
          },
          respostas: {
            orderBy: { respondidaEm: "asc" },
          },
        },
      });

      if (partida) {
        return successResponse(partida, "Partida carregada com sucesso");
      }
    } catch (dbErr) {
      console.warn(
        `[Partida API] Banco de dados inacessível ou erro ao buscar (${id}). Ativando modo fallback/demo.`
      );
    }

    // Se não encontrou no banco ou o banco está offline (ou id for demo/teste)
    const fallback = getFallbackPartida(id);
    return successResponse(fallback, "Partida (Modo Demonstração) carregada com sucesso");
  } catch (error) {
    console.error("Erro ao buscar partida:", error);
    const fallback = getFallbackPartida(id);
    return successResponse(fallback, "Partida (Modo Recuperação) carregada");
  }
}
