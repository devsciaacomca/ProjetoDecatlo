export interface DashboardStat {
  label: string;
  value: string | number;
  description: string;
}

export interface DashboardUser {
  id: string;
  nome?: string | null;
  name?: string | null;
  email?: string | null;
  nip?: string | null;
  idade?: number | null;
  role?: string | null;
  permissions?: string[] | null;
}
