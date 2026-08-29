import {
  Partida,
  PartidaStatus,
} from "@/types/partidas";

import {
  PlayCircle,
  CheckCircle2,
  Clock3,
} from "lucide-react";

export const partidas: Partida[] = [
  {
    id: "123",
    nome: "Decatlo 2026",
    equipe1: "Alfa 1",
    equipe2: "Alfa 2",
    status: "em_andamento",
    perguntas: 20,
    perguntaAtual: 8,
    data: "21/08/2026",
  },
  {
    id: "122",
    nome: "Decatlo - Treinamento",
    equipe1: "Alfa 3",
    equipe2: "Bravo 1",
    status: "finalizada",
    perguntas: 15,
    perguntaAtual: 15,
    data: "20/08/2026",
  },
  {
    id: "121",
    nome: "Decatlo - História",
    equipe1: "Alfa 1",
    equipe2: "Alfa 4",
    status: "pronta",
    perguntas: 20,
    perguntaAtual: 0,
    data: "20/08/2026",
  },
  {
    id: "120",
    nome: "Decatlo - Simulado",
    equipe1: "Bravo 1",
    equipe2: "Bravo 2",
    status: "configuracao",
    perguntas: 10,
    perguntaAtual: 0,
    data: "19/08/2026",
  },
];

export const statusConfig: Record<
  PartidaStatus,
  {
    label: string;
    className: string;
    icon: typeof PlayCircle;
  }
> = {
  configuracao: {
    label: "Em configuração",
    className:
      "bg-slate-100 text-slate-700",
    icon: Clock3,
  },

  pronta: {
    label: "Pronta",
    className:
      "bg-amber-100 text-amber-700",
    icon: Clock3,
  },

  em_andamento: {
    label: "Em andamento",
    className:
      "bg-green-100 text-green-700",
    icon: PlayCircle,
  },

  finalizada: {
    label: "Finalizada",
    className:
      "bg-blue-100 text-blue-700",
    icon: CheckCircle2,
  },
};