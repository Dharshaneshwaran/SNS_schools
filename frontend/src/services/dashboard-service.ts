import { apiRequest } from './api-client';

export interface DashboardOverview {
  stats: {
    label: string;
    value: string;
    hint: string;
    trend: string;
  }[];
  panels: {
    title: string;
    body: string;
  }[];
  quickActions: {
    title: string;
    description: string;
  }[];
}

export async function getDashboardOverview(): Promise<DashboardOverview> {
  return apiRequest<DashboardOverview>('/dashboard/overview');
}
