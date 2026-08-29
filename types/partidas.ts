
import type { LucideIcon } from "lucide-react";

export type PartidaStatus =
  | "configuracao"
  | "pronta"
  | "em_andamento"
  | "finalizada";

export type Equipe = "A" | "B";

export type Partida = {
  id: string;
  nome: string;
  equipe1: string;
  equipe2: string;
  status: PartidaStatus;
  perguntas: number;
  perguntaAtual: number;
  data: string;
};

export type StatusConfig = {
  label: string;
  className: string;
  icon: LucideIcon;
};