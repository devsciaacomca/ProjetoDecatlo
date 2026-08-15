import type { DashboardStat } from "@/types/dashboard";

export const dashboardStats: DashboardStat[] = [
  {
    label: "Perguntas cadastradas",
    value: 128,
    description: "Total de perguntas",
  },
  {
    label: "Usuários",
    value: 12,
    description: "Usuários cadastrados",
  },
  {
    label: "Partidas realizadas",
    value: 8,
    description: "Histórico de partidas",
  },
  {
    label: "Partida atual",
    value: "Nenhuma",
    description: "Nenhuma partida em andamento",
  },
];
