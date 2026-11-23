import { apiRequest } from './api-client';
import type { AttendanceRules } from '../types/modules';

export interface AttendanceRecord {
  id: string;
  studentId: string;
  date: string;
  status: string;
  reason?: string;
  class: string;
  section: string;
}

export async function getStudentAttendance(studentId: string, month?: string): Promise<AttendanceRecord[]> {
  const url = month
    ? `/attendance/student/${studentId}?month=${month}`
    : `/attendance/student/${studentId}`;
  return apiRequest<AttendanceRecord[]>(url);
}

export async function markAttendance(payload: {
  date: string;
  class: string;
  section: string;
  records: { studentId: string; status: string; reason?: string }[];
}): Promise<{ marked: number }> {
  return apiRequest('/attendance/mark', { method: 'POST', body: JSON.stringify(payload) });
}

export async function markTeacherAttendance(payload: {
  date: string;
  records: { teacherId: string; status: string; department?: string }[];
}): Promise<{ marked: number }> {
  return apiRequest('/attendance/mark-teacher', { method: 'POST', body: JSON.stringify(payload) });
}

export async function getAttendanceRules(): Promise<AttendanceRules> {
  return apiRequest<AttendanceRules>('/attendance/rules');
}

/**
 * Admin-only. Out-of-range values come back as a 400 whose message names the
 * field and its bounds, so callers can show it verbatim.
 */
export async function updateAttendanceRules(
  patch: Partial<AttendanceRules>,
): Promise<AttendanceRules> {
  return apiRequest<AttendanceRules>('/attendance/rules', {
    method: 'PATCH',
    body: JSON.stringify(patch),
  });
}
