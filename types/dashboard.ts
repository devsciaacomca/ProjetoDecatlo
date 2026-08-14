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
