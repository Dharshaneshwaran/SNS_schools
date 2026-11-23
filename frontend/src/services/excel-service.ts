import { readSession } from "../lib/session-storage";
import { apiBaseUrl } from "./api-client";

/**
 * Excel helpers (requirements section 20).
 *
 * `apiRequest` always sets `Content-Type: application/json` and parses the
 * body as JSON, so it can neither stream a workbook back nor send
 * multipart form data. Everything here uses raw `fetch` instead, attaching
 * the same bearer token `apiRequest` would.
 */

function authHeaders(): Record<string, string> {
  const session = readSession();
  return session?.accessToken
    ? { Authorization: `Bearer ${session.accessToken}` }
    : {};
}

function fileNameFrom(response: Response, fallback: string): string {
  const disposition = response.headers.get("Content-Disposition") ?? "";
  const match = /filename="?([^";]+)"?/i.exec(disposition);
  return match?.[1]?.trim() || fallback;
}

/** Fetch a workbook and hand it to the browser's download manager. */
export async function downloadWorkbook(
  path: string,
  fallbackName: string,
): Promise<string> {
  const response = await fetch(`${apiBaseUrl}${path}`, {
    headers: authHeaders(),
  });

  if (!response.ok) {
    let message = `HTTP ${response.status}`;
    try {
      const body = await response.json();
      message = body?.message ?? body?.error ?? message;
    } catch {
      /* body was not JSON */
    }
    throw new Error(message);
  }

  const blob = await response.blob();
  const name = fileNameFrom(response, fallbackName);
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = name;
  link.style.visibility = "hidden";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);

  return name;
}

export function exportStudentsExcel(classCode?: string, section?: string) {
  const params = new URLSearchParams();
  if (classCode) params.set("class", classCode);
  if (section) params.set("section", section);
  const query = params.toString();
  return downloadWorkbook(
    `/excel/students${query ? `?${query}` : ""}`,
    "students.xlsx",
  );
}

export function exportMarksExcel(classCode: string, section: string, term: string) {
  const params = new URLSearchParams({ class: classCode, section, term });
  return downloadWorkbook(`/excel/marks?${params}`, "marks.xlsx");
}

export function exportTimetableExcel(classLabel?: string) {
  const query = classLabel
    ? `?class=${encodeURIComponent(classLabel)}`
    : "";
  return downloadWorkbook(`/excel/timetable${query}`, "timetable.xlsx");
}

export function downloadStudentTemplate() {
  return downloadWorkbook(
    "/excel/template/students",
    "student-import-template.xlsx",
  );
}

// ─── Import ────────────────────────────────────────────────────────────

export interface ImportRow {
  name: string;
  email: string;
  class: string;
  section: string;
  gender: string;
  dob: string;
  studentId: string;
  admissionNo: string;
  fatherName: string;
  fatherContact: string;
  motherName: string;
  motherContact: string;
  address: string;
}

export interface ImportResult {
  dryRun: boolean;
  sheet?: string;
  totalRows?: number;
  matchedColumns: Record<string, number>;
  unmatchedFields: string[];
  ready: ImportRow[];
  skipped: { row: number; reason: string }[];
  errors: { row: number; message: string }[];
  created: { name: string; email: string; password: string; class: string; section: string }[];
}

/**
 * Upload a workbook for validation (`dryRun`) or creation.
 * Always call with `dryRun: true` first so the office can review the
 * column mapping before anything is written.
 */
export async function importStudentsExcel(
  file: File,
  dryRun: boolean,
): Promise<ImportResult> {
  const form = new FormData();
  form.append("file", file);

  const response = await fetch(
    `${apiBaseUrl}/excel/students/import${dryRun ? "?dryRun=1" : ""}`,
    {
      method: "POST",
      headers: authHeaders(),
      body: form,
    },
  );

  const body = await response.json().catch(() => null);

  if (!response.ok) {
    const message =
      body?.message?.[0] ??
      (typeof body?.message === "string" ? body.message : null) ??
      body?.error ??
      `HTTP ${response.status}`;
    const detail = Array.isArray(body?.errors)
      ? ` (${body.errors
          .slice(0, 3)
          .map((e: { message: string }) => e.message)
          .join("; ")})`
      : "";
    throw new Error(`${message}${detail}`);
  }

  return body as ImportResult;
}
