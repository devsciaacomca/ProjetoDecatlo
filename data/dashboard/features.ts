import type { DashboardFeature } from "@/types/dashboard";

export const dashboardFeatures: DashboardFeature[] = [
  {
    href: "/dashboard/gerenciamento-perguntas",
    icon: "▤",
    title: "Gerenciamento de perguntas",
    description: "Cadastre, edite e exclua perguntas do sistema.",
    action: "Acessar →",
  },
  {
    href: "/dashboard/configuracao-jogo",
    icon: "⚙",
    title: "Configuração do jogo",
    description: "Configure equipes, perguntas, matérias e tempo de resposta.",
    action: "Acessar →",
  },
  {
    href: "/dashboard/gerenciamento-jogo",
    icon: "▶",
    title: "Painel do apresentador",
    description: "Controle uma partida, cronômetro, respostas e pontuação.",
    action: "Abrir →",
  },
  {
    href: "/dashboard/usuarios",
    icon: "♙",
    title: "Usuários",
    description: "Cadastre e gerencie os usuários do sistema.",
    action: "Acessar →",
  },
  {
    href: "/dashboard/auditoria",
    icon: "▥",
    title: "Auditoria",
    description: "Consulte o histórico de alterações realizadas no sistema.",
    action: "Acessar →",
  },
  {
    href: "/telao/123",
    icon: "▣",
    title: "Tela de apresentação",
    description: "Abrir a tela que será utilizada no telão da apresentação.",
    action: "Abrir telão ↗",
    target: "_blank",
  },
];
