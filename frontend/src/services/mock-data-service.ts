import { apiRequest } from "./api-client";
import type {
  AttendanceData,
  DashboardOverview,
  ReportsData,
  SettingsData,
  SubstitutionsData,
  TeachersData,
  TimetableData,
} from "../types/modules";

function authHeaders(accessToken: string) {
  return {
    Authorization: `Bearer ${accessToken}`,
  };
}

export function getDashboardOverview(accessToken: string) {
  return apiRequest<DashboardOverview>("/dashboard/overview", {
    headers: authHeaders(accessToken),
  });
}

export function getTeachers(accessToken: string) {
  return apiRequest<TeachersData>("/teachers", {
    headers: authHeaders(accessToken),
  });
}

export function getTimetable(accessToken: string) {
  return apiRequest<TimetableData>("/timetable", {
    headers: authHeaders(accessToken),
  });
}

export function getAttendance(accessToken: string) {
  return apiRequest<AttendanceData>("/attendance", {
    headers: authHeaders(accessToken),
  });
}

export function getSubstitutions(accessToken: string) {
  return apiRequest<SubstitutionsData>("/substitutions", {
    headers: authHeaders(accessToken),
  });
}

export function getReports(accessToken: string) {
  return apiRequest<ReportsData>("/reports", {
    headers: authHeaders(accessToken),
  });
}

export function getSettings(accessToken: string) {
  return apiRequest<SettingsData>("/settings", {
    headers: authHeaders(accessToken),
  });
}
