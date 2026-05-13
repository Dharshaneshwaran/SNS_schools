import { apiRequest } from './api-client';

export interface MonthlyChartEntry {
  month: number;
  boys: number;
  girls: number;
  boysCount: number;
  girlsCount: number;
}

export interface RecentRegistration {
  name: string;
  type: string;
  date: string;
}

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
  newUsersThisWeek: number;
  recentRegistrations: RecentRegistration[];
  monthlyChart: MonthlyChartEntry[];
}

export async function getDashboardOverview(): Promise<DashboardOverview> {
  return apiRequest<DashboardOverview>('/dashboard/overview', {
    headers: {
      "Cache-Control": "no-cache, no-store, must-revalidate",
      "Pragma": "no-cache",
      "Expires": "0",
    },
  });
}

export interface ParentDashboardOverview {
  attendance: {
    value: string;
    sub: string;
  };
  exam: {
    value: string;
    sub: string;
  };
}

export async function getParentDashboardOverview(studentId: string): Promise<ParentDashboardOverview> {
  return apiRequest<ParentDashboardOverview>(`/dashboard/parent/${studentId}`);
}

export interface TeacherDashboardOverview {
  schoolPresence: {
    present: number;
    absent: number;
  };
  celebrations: {
    studentBirthdays: { name: string; grade: string; date: string }[];
    staffBirthdays: { name: string; role: string; date: string }[];
  };
  upcomingClass: {
    subject: string;
    grade: string;
    time: string;
    students: number;
  } | null;
  classAttendance: {
    present: number;
    absent: number;
    percentage: number;
    grade: string;
  };
  announcement: {
    title: string;
    message: string;
    author: string;
    date: string;
  } | null;
}

export async function getTeacherDashboardOverview(): Promise<TeacherDashboardOverview> {
  return apiRequest<TeacherDashboardOverview>('/dashboard/teacher', {
    headers: {
      "Cache-Control": "no-cache, no-store, must-revalidate",
      "Pragma": "no-cache",
      "Expires": "0",
    },
  });
}
