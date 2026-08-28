export interface DashboardStat {
  label: string;
  value: string | number;
  description: string;
}

export interface DashboardFeature {
  href: string;
  icon: string;
  title: string;
  description: string;
  action: string;
  target?: string;
}

export interface DashboardActivity {
  id: number;
  title: string;
  description: string;
  time: string;
}

export interface DashboardUser {
  id: string;
  nome?: string | null;
  name?: string | null;
  email?: string | null;
  nip?: string | null;
  role?: string | null;
}
