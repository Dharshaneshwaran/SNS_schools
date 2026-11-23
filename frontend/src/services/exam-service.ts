import { apiRequest } from './api-client';

export interface ExamResult {
  id: string;
  studentId: string;
  term: string;
  subject: string;
  internal: number;
  exam: number;
  total: number;
  grade: string;
  remarks?: string;
  academicYear: string;
}

export async function getStudentExamResults(studentId: string, term?: string): Promise<ExamResult[]> {
  const url = term ? `/exams/results/${studentId}?term=${term}` : `/exams/results/${studentId}`;
  return apiRequest<ExamResult[]>(url);
}

export interface ExamScheduleEntry {
  id: string;
  class: string;
  section: string;
  subject: string;
  examDate: string;
  startTime: string;
  duration?: string;
  hall?: string;
  term: string;
  academicYear: string;
}

export async function getExamSchedule(cls: string, section: string, term?: string): Promise<ExamScheduleEntry[]> {
  const url = term
    ? `/exams/schedule?class=${cls}&section=${section}&term=${term}`
    : `/exams/schedule?class=${cls}&section=${section}`;
  return apiRequest<ExamScheduleEntry[]>(url);
}

export async function createExamSchedule(data: Omit<ExamScheduleEntry, 'id'>): Promise<ExamScheduleEntry> {
  return apiRequest<ExamScheduleEntry>('/exams/schedule', { method: 'POST', body: JSON.stringify(data) });
}

export async function deleteExamSchedule(id: string): Promise<void> {
  return apiRequest(`/exams/schedule/${id}`, { method: 'DELETE' });
}

export async function bulkSaveResults(data: {
  class: string;
  section: string;
  term: string;
  academicYear: string;
  students: { studentId: string; name: string; subjects: { subject: string; internal: number; exam: number; total: number }[] }[];
}): Promise<{ saved: number }> {
  return apiRequest('/exams/results/bulk', { method: 'POST', body: JSON.stringify(data) });
}

// ─── Report cards ─────────────────────────────────────────────────────

export interface GradingBand {
  minMark: number;
  maxMark: number;
  grade: string;
  remark: string;
}

export interface GradingScale {
  name: string;
  passMark: number;
  bands: GradingBand[];
}

export interface SchoolInfo {
  name: string;
  academicYear: string;
  mediumOfInstruction: string;
  board: string;
  contactPhone: string;
  address: string;
}

export interface ReportCardSubject {
  subject: string;
  internal: number;
  exam: number;
  total: number;
  maxMark: number;
  grade: string;
  remark: string;
  passed: boolean;
}

export interface ReportCard {
  student: {
    profileId: string;
    userId: string;
    rollNo: string;
    name: string;
    class: string;
    section: string;
    admissionNo: string;
    gender: string;
    dob: string;
  };
  term: string;
  subjects: ReportCardSubject[];
  summary: {
    totalObtained: number;
    totalMax: number;
    percentage: number;
    overallGrade: string;
    overallRemark: string;
    passed: boolean;
    subjectsAttempted: number;
    subjectsFailed: string[];
  };
  gradingScale: GradingScale;
  school: SchoolInfo;
}

export interface ReportCardsResponse {
  term: string;
  academicYear: string;
  class: string;
  section: string;
  generatedAt: string;
  gradingScale: GradingScale | null;
  school: SchoolInfo;
  summary: { total: number; withResults: number; passed: number; failed: number };
  students: ReportCard[];
}

/** Terms that actually have marks recorded, newest first. */
export function getTerms(): Promise<{ term: string; academicYear: string }[]> {
  return apiRequest('/exams/terms');
}

export function getReportCards(
  cls: string,
  section: string,
  term: string,
): Promise<ReportCardsResponse> {
  const query = new URLSearchParams({ class: cls, section, term });
  return apiRequest<ReportCardsResponse>(`/exams/report-cards?${query}`);
}
