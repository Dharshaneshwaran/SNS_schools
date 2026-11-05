"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ChartBar, 
  CalendarCheck, 
  CalendarBlank, 
  PaperPlaneTilt, 
  ClipboardText,
  FileArrowUp,
  DownloadSimple,
  SealCheck,
  TrendUp,
  User,
  IdentificationCard,
  Quotes,
  CaretLeft,
  CaretRight,
  Clock
} from "@phosphor-icons/react";

import { Student, AcademicTab } from "../../../types/dashboard";
import { DashboardTheme } from "../../../types/theme";
import { apiRequest } from "../../../services/api-client";
import { useAuth } from "../../../hooks/use-auth";
import { getStudentTimetable, TimetableEntry } from "../../../services/timetable-service";
import { getStudentExamResults, ExamResult, getExamSchedule, ExamScheduleEntry } from "../../../services/exam-service";
import { getAnnouncements } from "../../../services/announcements-service";
import { getStudentAttendance, AttendanceRecord } from "../../../services/attendance-service";

/** SSR-safe media query hook (matches on the client only). */
function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia(query);
    const sync = () => setMatches(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, [query]);
  return matches;
}

const tabs: { key: AcademicTab | "timetable"; label: string; icon: React.ReactNode }[] = [
  { key: "calendar",   label: "Academic Calendar", icon: <CalendarBlank size={15} /> },
  { key: "attendance", label: "Attendance",         icon: <CalendarCheck size={15} /> },
  { key: "timetable",  label: "Time Table",         icon: <Clock size={15} /> },
  { key: "exam",       label: "Exam Report Card",   icon: <ChartBar size={15} /> },
  { key: "schedule",   label: "Exam Schedule",      icon: <ClipboardText size={15} /> },
  { key: "leave",      label: "Leave Application",  icon: <PaperPlaneTilt size={15} /> },
];

/** A leave application as returned by GET /leaves/mine. */
interface MyLeave {
  id: string;
  studentName: string;
  class: string;
  section: string;
  startDate: string;
  endDate: string;
  reason: string;
  documentUrl?: string | null;
  status: "pending" | "approved" | "rejected" | string;
  adminNote?: string | null;
  createdAt: string;
}

/** Chip palette for the application status. */
const leaveStatusMeta: Record<string, { label: string; fg: string; fgDark: string; bg: string; border: string }> = {
  pending:  { label: "Pending",  fg: "#B45309", fgDark: "#FBBF24", bg: "rgba(245, 158, 11, 0.12)", border: "rgba(245, 158, 11, 0.28)" },
  approved: { label: "Approved", fg: "#059669", fgDark: "#34D399", bg: "rgba(16, 185, 129, 0.12)", border: "rgba(16, 185, 129, 0.28)" },
  rejected: { label: "Rejected", fg: "#DC2626", fgDark: "#F87171", bg: "rgba(239, 68, 68, 0.12)", border: "rgba(239, 68, 68, 0.28)" },
};

function formatLeaveDate(iso: string): string {
  if (!iso) return "";
  const d = new Date(`${iso.slice(0, 10)}T00:00:00`);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
}

const timeTableData = [
  { day: "Monday",    periods: ["Math", "Physics", "English", "LUNCH", "", "L A B", "", "Hindi"] },
  { day: "Tuesday",   periods: ["", "L A B", "L A B", "LUNCH", "Art", "Physics", "Statistics", "SPORTS"] },
  { day: "Wednesday", periods: ["Biology", "English", "Math", "LUNCH", "Science", "", "L I B R A R Y", "Algebra"] },
  { day: "Thursday",  periods: ["Physics", "Math", "Hindi", "LUNCH", "", "L A B", "", "Biology"] },
  { day: "Friday",    periods: ["", "L A B", "L A B", "LUNCH", "Art", "Drama", "Math", "Lab"] },
  { day: "Saturday",  periods: ["-", "-", "-", "LUNCH", "", "S E M I N A R", "", "SPORTS"] },
];

const periodHeaders = ["I", "II", "III", "LUNCH", "IV", "V", "VI", "VII"];

const reportData: Record<string, any> = {
  periodic: {
    term: "Periodic Assessment – I",
    subjects: [
      { name: "Mathematics", internal: 19, exam: 18, total: 37, grade: "A+" },
      { name: "Science",     internal: 18, exam: 16, total: 34, grade: "A" },
      { name: "English",     internal: 19, exam: 17, total: 36, grade: "A" },
    ],
    attendance: "98%",
    percentage: "91%",
    remarks: "Good performance in Periodic tests."
  },
  cycle: {
    term: "Cycle Test – II",
    subjects: [
      { name: "Mathematics", internal: 20, exam: 23, total: 43, grade: "A+" },
      { name: "Science",     internal: 18, exam: 21, total: 39, grade: "A" },
    ],
    attendance: "95%",
    percentage: "88%",
    remarks: "Steady progress in Cycle tests."
  },
  term: {
    term: "Annual Examination 2025-26",
    subjects: [
      { name: "Mathematics", internal: 18, exam: 74, total: 92, grade: "A+" },
      { name: "Science",     internal: 17, exam: 68, total: 85, grade: "A" },
      { name: "English",     internal: 19, exam: 69, total: 88, grade: "A" },
      { name: "Hindi",       internal: 16, exam: 62, total: 78, grade: "B+" },
      { name: "Social",      internal: 18, exam: 64, total: 82, grade: "A-" },
    ],
    attendance: "96.4%",
    percentage: "92.4%",
    remarks: "Arjun is a dedicated student who shows great interest in Mathematics and Science."
  }
};

const examSchedule: Record<string, any[]> = {
  periodic: [
    { subject: "Mathematics", date: "June 05", hall: "Room 101", seat: "A12" },
    { subject: "Science",     date: "June 06", hall: "Room 102", seat: "B04" },
  ],
  cycle: [
    { subject: "English",     date: "July 12", hall: "Main Hall", seat: "45" },
    { subject: "Hindi",       date: "July 13", hall: "Main Hall", seat: "45" },
  ],
  term: [
    { subject: "Mathematics", date: "May 10", hall: "Hall A", seat: "25" },
    { subject: "Science",     date: "May 12", hall: "Hall B", seat: "12" },
    { subject: "English",     date: "May 14", hall: "Hall A", seat: "25" },
    { subject: "Hindi",       date: "May 15", hall: "Hall C", seat: "8" },
    { subject: "Social",      date: "May 16", hall: "Hall B", seat: "12" },
  ]
};

const attendanceData: Record<string, Record<number, { status: string, reason?: string }>> = {
  "2026-3": { // April
    1: { status: "P" }, 2: { status: "P" }, 3: { status: "P" }, 4: { status: "H", reason: "Easter Break" }, 5: { status: "H", reason: "Easter Break" },
    6: { status: "P" }, 7: { status: "P" }, 8: { status: "A", reason: "Health Issue" }, 9: { status: "P" }, 10: { status: "P" },
    11: { status: "P" }, 12: { status: "P" }, 13: { status: "P" }, 14: { status: "P" }, 15: { status: "P" },
    16: { status: "P" }, 17: { status: "P" }, 18: { status: "P" }, 19: { status: "P" }, 20: { status: "H", reason: "Sports Day" }, 25: { status: "H", reason: "Founder's Day" }
  },
  "2026-4": { // May
    1: { status: "H", reason: "Labour Day" },
    10: { status: "H", reason: "Term Exams Start" }
  }
};

export default function AcademicSection({ student, theme, initialTab, onTabChange }: { student: Student; theme: DashboardTheme; initialTab?: AcademicTab | "timetable"; onTabChange?: (tab: AcademicTab | "timetable") => void }) {
  const { session } = useAuth();
  const isMobile = useMediaQuery("(max-width: 640px)");
  const isDesktop = useMediaQuery("(min-width: 1024px)");
  const railRef = useRef<HTMLDivElement>(null);
  const [activeTab, setActiveTab] = useState<AcademicTab | "calendar" | "attendance" | "exam" | "schedule" | "leave" | "timetable">(initialTab || "calendar");

  // Follow tab changes driven from outside (bottom nav, dashboard quick actions)
  useEffect(() => {
    if (initialTab && initialTab !== activeTab) setActiveTab(initialTab);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialTab]);

  // Centre the active chip inside the scrollable tab rail.
  // Scroll only the rail itself: letting scrollIntoView walk every ancestor can
  // nudge an `overflow: hidden` shell sideways on mobile.
  useEffect(() => {
    const rail = railRef.current;
    if (!rail) return;
    const chip = rail.querySelector<HTMLElement>(`[data-tab="${activeTab}"]`);
    if (!chip) return;
    const left = chip.offsetLeft - (rail.clientWidth - chip.offsetWidth) / 2;
    rail.scrollTo({ left: Math.max(0, left), behavior: "smooth" });
  }, [activeTab]);
  const [examType, setExamType] = useState<"periodic" | "cycle" | "term">("term");
  const [currentDate, setCurrentDate] = useState(new Date(2026, 3, 1)); // April 2026
  const [leaveSubmitted, setLeaveSubmitted] = useState(false);
  const [leaveError, setLeaveError] = useState<string | null>(null);
  const [attachedFile, setAttachedFile] = useState<File | null>(null);
  const [isUploadingDoc, setIsUploadingDoc] = useState(false);
  const [leaveForm, setLeaveForm] = useState({ startDate: "", endDate: "", reason: "" });
  const [myLeaves, setMyLeaves] = useState<MyLeave[]>([]);
  const [timetable, setTimetable] = useState<TimetableEntry[]>([]);
  const [examResults, setExamResults] = useState<ExamResult[]>([]);
  const [examSchedule, setExamSchedule] = useState<ExamScheduleEntry[]>([]);
  const [announcements, setAnnouncements] = useState<any[]>([]);
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [reportAttendance, setReportAttendance] = useState("0%");
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!student.id || student.id === "N/A") return;

    setIsLoading(true);
    
    // Fetch Timetable
    if (student.class && student.section) {
      getStudentTimetable(student.class, student.section)
        .then(setTimetable)
        .catch(() => {});
    }

    // Fetch Exam Results
    getStudentExamResults(student.id)
      .then(setExamResults)
      .catch(() => {});

    // Fetch Attendance Percentage for Report Card.
    // Attendance + exam rows are keyed by the roll number (studentId), not by
    // the StudentProfile row id.
    apiRequest<{ attendance: { value: string } }>(`/dashboard/parent/${student.studentId || student.id}`)
      .then(stats => setReportAttendance(stats.attendance.value))
      .catch(() => setReportAttendance("0%"));

    // Fetch announcements for calendar events
    getAnnouncements(0, 100)
      .then(setAnnouncements)
      .catch(() => {});

    // Fetch exam schedule
    if (student.class && student.section) {
      getExamSchedule(student.class, student.section)
        .then(setExamSchedule)
        .catch(() => {});
    }

    setIsLoading(false);
  }, [student.id, student.class, student.section]);

  // Re-fetch attendance whenever the displayed month changes.
  // Records are written by the admin/teacher register under the roll number.
  useEffect(() => {
    if (!student.studentId || student.studentId === "N/A") return;
    const month = `${currentDate.getFullYear()}-${(currentDate.getMonth() + 1).toString().padStart(2, '0')}`;
    getStudentAttendance(student.studentId, month)
      .then(setAttendanceRecords)
      .catch(() => {});
  }, [student.id, student.studentId, currentDate]);

  // Leave status list — re-read whenever the tab opens or a new application
  // goes out. Skipped while logged out so a stray 401 can't bounce the
  // placeholder dashboard to /login.
  useEffect(() => {
    if (activeTab !== "leave" || !session?.accessToken) return;
    let cancelled = false;
    apiRequest<MyLeave[]>("/leaves/mine")
      .then((rows) => {
        if (!cancelled && Array.isArray(rows)) setMyLeaves(rows);
      })
      .catch(() => {});
    return () => { cancelled = true; };
  }, [activeTab, session?.accessToken, leaveSubmitted]);

  // Map flat timetable entries to the 2D grid format used in the UI
  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const mappedTimeTable = days.map(day => {
    const dayEntries = timetable.filter(e => e.day === day);
    const periods = Array(8).fill("");
    periods[3] = "LUNCH"; // Standard lunch period
    
    dayEntries.forEach(entry => {
      // If period is 1-3, it stays. If 4-7, it maps to index 4-7.
      const idx = entry.period <= 3 ? entry.period - 1 : entry.period;
      if (idx < 8) periods[idx] = entry.subject;
    });
    
    return { day, periods };
  });

  const displayTimeTable = timetable.length > 0 ? mappedTimeTable : timeTableData;

  // Filter exam results by selected term
  const termMapping: Record<string, string> = {
    periodic: "Periodic I",
    cycle: "Cycle II",
    term: "Annual"
  };
  const filteredResults = examResults.filter(r => r.term.includes(termMapping[examType]) || r.term === examType);
  const displayResults = filteredResults.length > 0 ? {
    term: filteredResults[0].term,
    subjects: filteredResults.map(r => ({ name: r.subject, internal: r.internal, exam: r.exam, total: r.total, grade: r.grade })),
    attendance: reportAttendance,
    percentage: (filteredResults.reduce((acc, r) => acc + r.total, 0) / (filteredResults.length * 100) * 100).toFixed(1) + "%",
    remarks: filteredResults[0].remarks || `Good performance in ${filteredResults[0].term}.`
  } : {
    term: "No Data",
    subjects: [],
    attendance: reportAttendance,
    percentage: "0%",
    remarks: "No examination records found for this term."
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  // Build monthData from real API records (falls back to empty if none)
  const monthData: Record<number, { status: string; reason?: string }> = {};
  attendanceRecords.forEach(r => {
    const day = parseInt(r.date.split('-')[2]);
    monthData[day] = { status: r.status, reason: r.reason };
  });
  // Statuses are written as single letters by seeds and as full words by the
  // admin register, so accept both.
  const isPresent = (s: string) => s === "P" || s === "Present";
  const isAbsent = (s: string) => s === "A" || s === "Absent";
  const isLeave = (s: string) => s === "L" || s === "Leave";
  const totalPresent = Object.values(monthData).filter(d => isPresent(d.status)).length;
  const totalAbsent = Object.values(monthData).filter(d => isAbsent(d.status)).length;
  const totalLeave = Object.values(monthData).filter(d => isLeave(d.status)).length;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      {/* Tabs — sticky, horizontally scrollable pill rail. The active chip is a
          solid brand pill and the rail auto-centres it whenever the tab changes. */}
      <div
        style={{
          position: "sticky",
          top: 0,
          zIndex: 20,
          margin: "-10px 0 0",
          padding: "10px 0 6px",
          background: theme.isDark ? "rgba(10,10,10,0.93)" : "rgba(248,250,252,0.93)",
          backdropFilter: "blur(14px)",
          WebkitBackdropFilter: "blur(14px)",
        }}
      >
        <div
          ref={railRef}
          className="hide-scrollbar"
          style={{
            display: "flex",
            gap: isMobile ? 5 : 6,
            overflowX: "auto",
            padding: 5,
            background: theme.isDark ? "rgba(255,255,255,0.05)" : "#f1f5f9",
            borderRadius: 999,
            scrollPaddingInline: 12,
            scrollBehavior: "smooth",
          }}
        >
          {tabs.map((tab) => {
            const isActive = activeTab === tab.key;
            return (
              <button
                key={tab.key}
                data-tab={tab.key}
                onClick={() => {
                  setActiveTab(tab.key as any);
                  onTabChange?.(tab.key as any);
                }}
                className={`acad-tab${isActive ? " is-active" : ""}`}
                style={{
                  flex: isDesktop ? "1 1 auto" : "0 0 auto",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  gap: isMobile ? 7 : 9,
                  padding: isMobile ? "10px 15px" : "10px 18px",
                  borderRadius: 999, border: "none", whiteSpace: "nowrap",
                  fontSize: isMobile ? 13.5 : 14, fontWeight: 700,
                  cursor: "pointer",
                  fontFamily: "var(--font-inter,'Inter',sans-serif)",
                  background: isActive ? "linear-gradient(135deg, #FF7F50, #e66a3e)" : "transparent",
                  color: isActive ? "#FFFFFF" : theme.textMuted,
                  boxShadow: isActive ? "0 6px 16px rgba(255,127,80,0.32)" : "none",
                }}
              >
                <span style={{ display: "flex", opacity: isActive ? 1 : 0.8 }}>{tab.icon}</span>
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>
      {/* Exam Type Filter (only for Exam tabs) */}
      {(activeTab === "exam" || activeTab === "schedule") && (
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {[
            { id: "periodic", label: "Periodic Exam" },
            { id: "cycle",    label: "Cycle Exam" },
            { id: "term",     label: "Term Exam" },
          ].map(type => (
            <button 
              key={type.id} 
              onClick={() => setExamType(type.id as any)}
              style={{
                padding: "8px 16px",
                borderRadius: 10,
                border: `1px solid ${examType === type.id ? theme.primary : theme.border}`,
                background: examType === type.id ? theme.primary + "10" : "transparent",
                color: examType === type.id ? theme.primary : theme.textMuted,
                fontSize: 13,
                fontWeight: 700,
                cursor: "pointer",
                transition: "0.2s"
              }}
            >
              {type.label}
            </button>
          ))}
        </div>
      )}

      <AnimatePresence mode="wait">
        <motion.div key={activeTab} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.3 }}>
          
          {(activeTab === "attendance" || activeTab === "calendar") && (
            <div className="premium-card" style={{ padding: isMobile ? 14 : 24 }}>
              {activeTab === "attendance" && (
                <div style={{ display: "flex", gap: isMobile ? 8 : 20, marginBottom: isMobile ? 16 : 24 }}>
                  <div style={{ flex: 1, minWidth: 0, padding: isMobile ? "12px 10px" : "20px", borderRadius: isMobile ? 14 : 16, background: "rgba(16, 185, 129, 0.08)", border: "1px solid rgba(16, 185, 129, 0.1)" }}>
                    <p style={{ fontSize: 11, fontWeight: 800, color: "#10B981", textTransform: "uppercase", marginBottom: 4, letterSpacing: "0.04em" }}>Present</p>
                    <p style={{ fontSize: isMobile ? 17 : 24, fontWeight: 900, color: "#10B981", whiteSpace: "nowrap" }}>{totalPresent} Days</p>
                  </div>
                  <div style={{ flex: 1, minWidth: 0, padding: isMobile ? "12px 10px" : "20px", borderRadius: isMobile ? 14 : 16, background: "rgba(239, 68, 68, 0.08)", border: "1px solid rgba(239, 68, 68, 0.1)" }}>
                    <p style={{ fontSize: 11, fontWeight: 800, color: "#EF4444", textTransform: "uppercase", marginBottom: 4, letterSpacing: "0.04em" }}>Absent</p>
                    <p style={{ fontSize: isMobile ? 17 : 24, fontWeight: 900, color: "#EF4444", whiteSpace: "nowrap" }}>{totalAbsent} Day{totalAbsent !== 1 ? 's' : ''}</p>
                  </div>
                  <div style={{ flex: 1, minWidth: 0, padding: isMobile ? "12px 10px" : "20px", borderRadius: isMobile ? 14 : 16, background: "rgba(59, 130, 246, 0.08)", border: "1px solid rgba(59, 130, 246, 0.1)" }}>
                    <p style={{ fontSize: 11, fontWeight: 800, color: "#3B82F6", textTransform: "uppercase", marginBottom: 4, letterSpacing: "0.04em" }}>Leave</p>
                    <p style={{ fontSize: isMobile ? 17 : 24, fontWeight: 900, color: "#3B82F6", whiteSpace: "nowrap" }}>{totalLeave} Day{totalLeave !== 1 ? 's' : ''}</p>
                  </div>
                </div>
              )}
              <CalendarGrid 
                theme={theme} 
                date={currentDate} 
                onPrev={handlePrevMonth} 
                onNext={handleNextMonth}
                data={monthData} 
                announcements={announcements}
                type={activeTab === "attendance" ? "attendance" : "events"} 
                isMobile={isMobile}
              />
              <div style={{ display: "flex", gap: 20, marginTop: 24, justifyContent: "center", flexWrap: "wrap" }}>
                <LegendItem color={theme.success} label="Present" theme={theme} />
                <LegendItem color={theme.danger} label="Absent" theme={theme} />
                <LegendItem color="#3B82F6" label="Leave" theme={theme} />
                <LegendItem color={theme.isDark ? "rgba(255,255,255,0.1)" : "#f1f5f9"} label="Holiday" theme={theme} />
              </div>
            </div>
          )}

          {activeTab === "timetable" && (
            <div className="premium-card" style={{ padding: 0, overflow: "hidden", border: `1px solid ${theme.border}` }}>
              {!isDesktop ? (
                /* ── Compact day cards: a 9-column table can't breathe below lg,
                   so each day becomes a card with a 2-up period grid. ── */
                <div style={{ display: "flex", flexDirection: "column", gap: 12, padding: isMobile ? 12 : 16 }}>
                  {displayTimeTable.map((row, ri) => (
                    <div
                      key={ri}
                      style={{
                        borderRadius: 18,
                        border: `1px solid ${theme.border}`,
                        overflow: "hidden",
                        background: theme.isDark ? "rgba(255,255,255,0.02)" : "#FFFFFF",
                      }}
                    >
                      <div
                        style={{
                          display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8,
                          padding: isMobile ? "9px 13px" : "11px 16px",
                          background: theme.isDark ? "rgba(255,127,80,0.10)" : "rgba(255,127,80,0.07)",
                          borderBottom: `1px solid ${theme.border}`,
                        }}
                      >
                        <span style={{ fontSize: isMobile ? 14 : 15, fontWeight: 900, color: theme.text, letterSpacing: "-0.01em" }}>{row.day}</span>
                        <span style={{ fontSize: 9.5, fontWeight: 800, color: "#FF7F50", textTransform: "uppercase", letterSpacing: "0.08em" }}>
                          {row.periods.filter((p) => p && p !== "LUNCH" && p !== "-").length} Periods
                        </span>
                      </div>
                      <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr 1fr" : "repeat(4, 1fr)", gap: 8, padding: isMobile ? 9 : 12 }}>
                        {row.periods.map((p, pi) => {
                          const isLunch = p === "LUNCH";
                          const isEmpty = p === "" || p === "-";
                          const isSpecial = p === "L A B" || p === "L I B R A R Y" || p === "S E M I N A R" || p === "SPORTS";
                          return (
                            <div
                              key={pi}
                              style={{
                                padding: "7px 10px",
                                borderRadius: 11,
                                border: isEmpty ? `1px dashed ${theme.border}` : `1px solid ${theme.border}`,
                                background: isLunch
                                  ? (theme.isDark ? "rgba(255,255,255,0.04)" : "#F8FAFC")
                                  : (theme.isDark ? "rgba(255,255,255,0.03)" : "#FCFDFE"),
                                display: "flex",
                                flexDirection: isLunch ? "row" : "column",
                                alignItems: isLunch ? "center" : "flex-start",
                                justifyContent: isLunch ? "center" : undefined,
                                gap: 2,
                                minWidth: 0,
                              }}
                            >
                              <span style={{ fontSize: 9, fontWeight: 900, color: theme.textMuted, letterSpacing: "0.1em" }}>
                                {isLunch ? "LUNCH BREAK" : periodHeaders[pi]}
                              </span>
                              {!isLunch && (
                                <span
                                  style={{
                                    fontSize: 13, fontWeight: 800,
                                    color: isEmpty ? theme.textMuted : (isSpecial ? (theme.isDark ? "#94a3b8" : "#475569") : theme.text),
                                    letterSpacing: isSpecial ? "0.1em" : "normal",
                                    opacity: isEmpty ? 0.45 : 1,
                                    overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: "100%",
                                  }}
                                >
                                  {isEmpty ? "—" : p}
                                </span>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div style={{ overflowX: "auto" }}>
                  <table style={{ width: "100%", minWidth: 820, borderCollapse: "collapse" }}>
                    <thead>
                      <tr style={{ background: theme.isDark ? "rgba(255,255,255,0.02)" : "#F8FAFC" }}>
                        <th style={{ position: "sticky", left: 0, zIndex: 1, background: theme.isDark ? "#161616" : "#F8FAFC", padding: "16px 20px", textAlign: "left", fontSize: 11, fontWeight: 900, color: theme.textMuted, textTransform: "uppercase", letterSpacing: "0.06em", borderBottom: `1px solid ${theme.border}` }}>DAY/PERIOD</th>
                        {periodHeaders.map(h => (
                          <th key={h} style={{ padding: "16px 14px", textAlign: "center", fontSize: 12, fontWeight: 900, color: h === "LUNCH" ? theme.textMuted : theme.text, borderBottom: `1px solid ${theme.border}`, letterSpacing: "0.06em" }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {displayTimeTable.map((row, ri) => (
                        <tr key={ri} style={{ background: ri % 2 === 1 ? (theme.isDark ? "rgba(255,255,255,0.02)" : "#FCFDFE") : "transparent", borderBottom: ri < displayTimeTable.length - 1 ? `1px solid ${theme.border}` : "none" }}>
                          <td style={{ position: "sticky", left: 0, zIndex: 1, padding: "16px 20px", fontSize: 14, fontWeight: 900, color: theme.text, background: ri % 2 === 1 ? (theme.isDark ? "#171717" : "#FCFDFE") : (theme.isDark ? "#1A1A1A" : "#FFFFFF") }}>{row.day}</td>
                          {row.periods.map((p, pi) => {
                            const isLunch = p === "LUNCH";
                            const isEmpty = p === "" || p === "-";
                            const isSpecial = p === "L A B" || p === "L I B R A R Y" || p === "S E M I N A R" || p === "SPORTS";
                            return (
                              <td key={pi} style={{ 
                                padding: "16px 14px", 
                                textAlign: "center", 
                                fontSize: 13, 
                                fontWeight: isLunch || isSpecial ? 800 : 700,
                                color: isEmpty ? theme.textMuted : (isLunch ? theme.textMuted : (isSpecial ? (theme.isDark ? "#94a3b8" : "#475569") : theme.text)),
                                background: isLunch ? (theme.isDark ? "rgba(255,255,255,0.03)" : "#F8FAFC") : "transparent",
                                letterSpacing: isSpecial ? "0.15em" : "normal",
                                opacity: isLunch ? 0.75 : (isEmpty ? 0.45 : 1)
                              }}>
                                {p === "SPORTS" ? (
                                  <span style={{ background: theme.isDark ? "rgba(255,255,255,0.08)" : "#f1f5f9", padding: "4px 10px", borderRadius: 8, fontSize: 10, fontWeight: 800, color: theme.textMuted, textTransform: "uppercase" }}>SPORTS</span>
                                ) : (isEmpty ? "—" : p)}
                              </td>
                            );
                          })}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {activeTab === "exam" && (
            <div className="premium-card" style={{ padding: 0, overflow: "hidden", border: `1px solid ${theme.border}` }}>
              {/* Report Card Header */}
              <div style={{ padding: isMobile ? "20px 16px" : (isDesktop ? "40px" : "24px"), background: theme.isDark ? "rgba(255,255,255,0.02)" : "#F8FAFC", borderBottom: `1px solid ${theme.border}` }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 16, marginBottom: isMobile ? 24 : 40 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: isMobile ? 12 : 20, minWidth: 0 }}>
                    <div style={{ width: isMobile ? 48 : 64, height: isMobile ? 48 : 64, flexShrink: 0, borderRadius: isMobile ? 13 : 16, background: "white", padding: isMobile ? 7 : 10, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 8px 24px rgba(0,0,0,0.05)" }}>
                      <img src="/images/logo.png" alt="SNS Logo" style={{ width: "100%", height: "auto" }} />
                    </div>
                    <div style={{ minWidth: 0 }}>
                      <h2 style={{ fontSize: isMobile ? 18 : 24, fontWeight: 900, color: theme.text, letterSpacing: "-0.02em" }}>SNS ACADEMY</h2>
                      <p style={{ fontSize: isMobile ? 11 : 13, fontWeight: 700, color: theme.primary, textTransform: "uppercase", letterSpacing: "0.1em" }}>{displayResults.term}</p>
                    </div>
                  </div>
                  <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} style={{ padding: isMobile ? "11px 16px" : "12px 20px", borderRadius: 12, background: theme.primary, color: "white", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: 10, fontWeight: 700, fontSize: isMobile ? 13 : 14, marginLeft: "auto" }}>
                    <DownloadSimple size={isMobile ? 17 : 20} weight="bold" /> Download PDF
                  </motion.button>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: `repeat(auto-fit, minmax(${isMobile ? 150 : 200}px, 1fr))`, gap: isMobile ? 16 : 32 }}>
                  <InfoField icon={<User size={18} />} label="Student Name" value={student.name} theme={theme} isMobile={isMobile} />
                  <InfoField icon={<IdentificationCard size={18} />} label="Student ID" value={student.studentId !== "N/A" ? student.studentId : "Not Assigned"} theme={theme} isMobile={isMobile} />
                  <InfoField icon={<ChartBar size={18} />} label="Grade & Section" value={`${student.class}-${student.section}`} theme={theme} isMobile={isMobile} />
                </div>
              </div>

              {/* Marks Table */}
              <div style={{ padding: isMobile ? "0 16px" : (isDesktop ? "0 40px" : "0 24px"), overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                  <thead>
                    <tr>
                      <th style={{ padding: isMobile ? "16px 0" : "24px 0", textAlign: "left", fontSize: isMobile ? 10 : 12, fontWeight: 800, color: theme.textMuted, textTransform: "uppercase" }}>Subject</th>
                      <th style={{ padding: isMobile ? "16px 0" : "24px 0", textAlign: "center", fontSize: isMobile ? 10 : 12, fontWeight: 800, color: theme.textMuted, textTransform: "uppercase" }}>{isMobile ? "Int (20)" : "Internal (20)"}</th>
                      <th style={{ padding: isMobile ? "16px 0" : "24px 0", textAlign: "center", fontSize: isMobile ? 10 : 12, fontWeight: 800, color: theme.textMuted, textTransform: "uppercase" }}>Exam (80)</th>
                      <th style={{ padding: isMobile ? "16px 0" : "24px 0", textAlign: "center", fontSize: isMobile ? 10 : 12, fontWeight: 800, color: theme.textMuted, textTransform: "uppercase" }}>{isMobile ? "Total" : "Total (100)"}</th>
                      <th style={{ padding: isMobile ? "16px 0" : "24px 0", textAlign: "right", fontSize: isMobile ? 10 : 12, fontWeight: 800, color: theme.textMuted, textTransform: "uppercase" }}>Grade</th>
                    </tr>
                  </thead>
                  <tbody>
                    {displayResults.subjects.map((s: any, i: number) => (
                      <tr key={i} style={{ borderBottom: `1px solid ${theme.border}`, background: i % 2 === 1 ? (theme.isDark ? "rgba(255,255,255,0.02)" : "#FCFDFE") : "transparent" }}>
                        <td style={{ padding: "14px 0", fontSize: isMobile ? 13 : 16, fontWeight: 800, color: theme.text }}>{s.name}</td>
                        <td style={{ padding: "14px 0", textAlign: "center", fontSize: 15, fontWeight: 600, color: theme.textMuted }}>{s.internal}</td>
                        <td style={{ padding: "14px 0", textAlign: "center", fontSize: 15, fontWeight: 600, color: theme.textMuted }}>{s.exam}</td>
                        <td style={{ padding: "14px 0", textAlign: "center", fontSize: 16, fontWeight: 900, color: theme.primary }}>{s.total}</td>
                        <td style={{ padding: "14px 0", textAlign: "right" }}>
                          <span style={{ padding: "5px 10px", borderRadius: 8, background: theme.primary + "10", color: theme.primary, fontWeight: 800, fontSize: 13 }}>{s.grade}</span>
                        </td>
                      </tr>
                    ))}
                    {displayResults.subjects.length === 0 && (
                      <tr>
                        <td colSpan={5} style={{ padding: isMobile ? "32px 8px" : "40px", textAlign: "center", color: theme.textMuted, fontWeight: 600, fontSize: isMobile ? 13 : 15 }}>
                          No subjects recorded for this exam term.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Summary Section */}
              <div style={{ padding: isMobile ? "20px 16px" : (isDesktop ? "40px" : "24px"), background: theme.isDark ? "rgba(255,255,255,0.01)" : "#FFFFFF" }}>
                <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: isMobile ? 16 : 40 }}>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: isMobile ? 10 : 20 }}>
                    <SummaryCard label="Percentage" value={displayResults.percentage} icon={<TrendUp size={24} />} theme={theme} isMobile={isMobile} />
                    <SummaryCard label="Attendance" value={displayResults.attendance} icon={<SealCheck size={24} />} theme={theme} isMobile={isMobile} />
                  </div>
                  <div style={{ padding: isMobile ? 16 : 24, borderRadius: isMobile ? 16 : 20, background: theme.isDark ? "rgba(255,255,255,0.03)" : "#F8FAFC", border: `1px solid ${theme.border}`, position: "relative" }}>
                    <Quotes size={32} weight="fill" style={{ position: "absolute", top: -16, left: 20, color: theme.primary + "30" }} />
                    <p style={{ fontSize: 12, fontWeight: 800, color: theme.textMuted, textTransform: "uppercase", marginBottom: 12 }}>Teacher's Remarks</p>
                    <p style={{ fontSize: 14, fontWeight: 600, color: theme.text, lineHeight: "1.7", fontStyle: "italic" }}>{displayResults.remarks}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "schedule" && (
            <div className="premium-card" style={{ padding: isMobile ? 16 : (isDesktop ? 32 : 24) }}>
              {examSchedule.length === 0 ? (
                <div style={{ textAlign: "center", padding: "48px 16px", color: theme.textMuted }}>
                  <p style={{ fontSize: 16, fontWeight: 700, marginBottom: 8 }}>No exam schedule published yet.</p>
                  <p style={{ fontSize: 13, fontWeight: 500 }}>The school admin will publish the exam timetable soon.</p>
                </div>
              ) : (
              <div style={{ display: "grid", gridTemplateColumns: `repeat(auto-fit, minmax(${isMobile ? 220 : 250}px, 1fr))`, gap: isMobile ? 14 : 24 }}>
                {examSchedule.map((e, i) => (
                  <div key={e.id} style={{
                    padding: isMobile ? 16 : 24,
                    borderRadius: isMobile ? 16 : 20,
                    border: `1px solid ${theme.border}`,
                    background: theme.isDark ? "rgba(255,255,255,0.02)" : "#F8FAFC",
                    display: "flex",
                    flexDirection: "column",
                    gap: 12
                  }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <span style={{ fontSize: 11, fontWeight: 800, color: theme.primary, textTransform: "uppercase", background: theme.primary + "10", padding: "4px 10px", borderRadius: 8 }}>{e.term}</span>
                      <span style={{ fontSize: 13, fontWeight: 700, color: theme.textMuted }}>{new Date(e.examDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                    </div>
                    <h4 style={{ fontSize: 18, fontWeight: 800, color: theme.text }}>{e.subject}</h4>
                    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                      <p style={{ fontSize: 13, color: theme.textMuted, fontWeight: 600 }}>⏰ {e.startTime}{e.duration ? ` (${e.duration})` : ''}</p>
                      {e.hall && <p style={{ fontSize: 13, color: theme.textMuted, fontWeight: 600 }}>📍 {e.hall}</p>}
                    </div>
                  </div>
                ))}
              </div>
              )}
            </div>
          )}

          {activeTab === "leave" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            <div className="premium-card" style={{ padding: isMobile ? 16 : (isDesktop ? 32 : 24), maxWidth: 650 }}>
              <div style={{ marginBottom: 24 }}>
                <h3 style={{ fontSize: isMobile ? 18 : 20, fontWeight: 900, color: theme.text, marginBottom: 4 }}>Apply for Leave</h3>
                <p style={{ color: theme.textMuted, fontWeight: 600, fontSize: 13 }}>Student: {student.name} ({student.class}-{student.section})</p>
              </div>

              {leaveSubmitted ? (
                <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} style={{ textAlign: "center", padding: "24px 0" }}>
                  <div style={{ width: 64, height: 64, borderRadius: "50%", background: "#eefdf3", color: "#10b981", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 32, margin: "0 auto 24px" }}>✓</div>
                  <h4 style={{ fontSize: 20, fontWeight: 900, color: theme.text, marginBottom: 8 }}>Application Submitted!</h4>
                  <p style={{ color: theme.textMuted, fontWeight: 600, marginBottom: 32, maxWidth: 400, margin: "0 auto 32px", fontSize: 14 }}>The leave request for <strong>{student.name}</strong> of class <strong>{student.class}-{student.section}</strong> has been sent to the administrator.</p>
                  <button onClick={() => { setLeaveSubmitted(false); setAttachedFile(null); }} style={{ padding: "12px 28px", borderRadius: 14, background: theme.text, color: theme.bg, border: "none", cursor: "pointer", fontWeight: 800, fontSize: 14 }}>Apply for Another Date</button>
                </motion.div>
              ) : (
                <form
                  onSubmit={async (e) => {
                    e.preventDefault();
                    if (!session?.accessToken) return;
                    setLeaveError(null);
                    setIsUploadingDoc(true);

                    let documentUrl: string | undefined;
                    if (attachedFile) {
                      try {
                        const { uploadDocument } = await import("../../../lib/supabase");
                        documentUrl = await uploadDocument(attachedFile) ?? undefined;
                      } catch {
                        // non-fatal — submit without doc
                      }
                    }

                    try {
                      await apiRequest("/leaves", {
                        method: "POST",
                        headers: { Authorization: `Bearer ${session.accessToken}` },
                        body: JSON.stringify({
                          studentName: student.name,
                          class: student.class,
                          section: student.section,
                          startDate: leaveForm.startDate,
                          endDate: leaveForm.endDate,
                          reason: leaveForm.reason,
                          documentUrl,
                        }),
                      });
                      setLeaveSubmitted(true);
                      setLeaveForm({ startDate: "", endDate: "", reason: "" });
                      setAttachedFile(null);
                    } catch (err: unknown) {
                      setLeaveError(err instanceof Error ? err.message : "Failed to submit. Please try again.");
                    } finally {
                      setIsUploadingDoc(false);
                    }
                  }}
                  style={{ display: "flex", flexDirection: "column", gap: 24 }}
                >
                  {leaveError && (
                    <div style={{ padding: "12px 16px", borderRadius: 10, background: "#FEE2E2", color: "#EF4444", fontWeight: 700, fontSize: 13 }}>
                      {leaveError}
                    </div>
                  )}
                  <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: isMobile ? 14 : 20 }}>
                    <div className="form-group">
                      <label style={{ display: "block", fontSize: 11, fontWeight: 800, color: theme.textMuted, marginBottom: 8, textTransform: "uppercase" }}>Start Date</label>
                      <input type="date" required value={leaveForm.startDate} onChange={(e) => setLeaveForm({ ...leaveForm, startDate: e.target.value })} style={{ width: "100%", padding: "12px 14px", borderRadius: 12, border: `1px solid ${theme.border}`, background: theme.isDark ? "rgba(255,255,255,0.03)" : "#F8FAFC", outline: "none", fontSize: 13, fontWeight: 600, color: theme.text }} />
                    </div>
                    <div className="form-group">
                      <label style={{ display: "block", fontSize: 11, fontWeight: 800, color: theme.textMuted, marginBottom: 8, textTransform: "uppercase" }}>End Date</label>
                      <input type="date" required value={leaveForm.endDate} onChange={(e) => setLeaveForm({ ...leaveForm, endDate: e.target.value })} style={{ width: "100%", padding: "12px 14px", borderRadius: 12, border: `1px solid ${theme.border}`, background: theme.isDark ? "rgba(255,255,255,0.03)" : "#F8FAFC", outline: "none", fontSize: 13, fontWeight: 600, color: theme.text }} />
                    </div>
                  </div>

                  <div className="form-group">
                    <label style={{ display: "block", fontSize: 11, fontWeight: 800, color: theme.textMuted, marginBottom: 8, textTransform: "uppercase" }}>Reason for Leave</label>
                    <textarea rows={3} required placeholder="Please provide a valid reason..." value={leaveForm.reason} onChange={(e) => setLeaveForm({ ...leaveForm, reason: e.target.value })} style={{ width: "100%", padding: "12px 14px", borderRadius: 12, border: `1px solid ${theme.border}`, background: theme.isDark ? "rgba(255,255,255,0.03)" : "#F8FAFC", outline: "none", fontSize: 13, fontWeight: 600, resize: "none", color: theme.text }} />
                  </div>

                  <div className="form-group">
                    <label style={{ display: "block", fontSize: 11, fontWeight: 800, color: theme.textMuted, marginBottom: 8, textTransform: "uppercase" }}>Supporting Documents (Optional)</label>
                    <input type="file" ref={fileInputRef} onChange={(e) => setAttachedFile(e.target.files?.[0] || null)} style={{ display: "none" }} />
                    <div 
                      onClick={() => fileInputRef.current?.click()}
                      style={{ 
                        width: "100%", 
                        padding: isMobile ? 14 : 20, 
                        borderRadius: 12, 
                        border: `2px dashed ${attachedFile ? theme.primary : theme.border}`, 
                        background: attachedFile ? theme.primary + "05" : "transparent",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        gap: 8,
                        cursor: "pointer",
                        transition: "0.2s"
                      }}
                    >
                      <FileArrowUp size={24} weight="bold" color={attachedFile ? theme.primary : theme.textMuted} />
                      <span style={{ fontSize: 13, fontWeight: 700, color: attachedFile ? theme.primary : theme.textMuted }}>
                        {attachedFile ? attachedFile.name : "Click to upload attachment"}
                      </span>
                      {attachedFile && <span style={{ fontSize: 10, fontWeight: 600, color: theme.textMuted }}>{(attachedFile.size / 1024 / 1024).toFixed(2)} MB</span>}
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isUploadingDoc}
                    style={{ padding: "14px", borderRadius: 14, background: "linear-gradient(135deg, #FF7F50, #e66a3e)", color: "white", border: "none", cursor: isUploadingDoc ? "not-allowed" : "pointer", fontWeight: 900, fontSize: 15, boxShadow: "0 8px 24px rgba(255,127,80,0.25)", opacity: isUploadingDoc ? 0.7 : 1 }}
                  >
                    {isUploadingDoc ? "Submitting…" : "Submit Leave Application"}
                  </button>
                </form>
              )}
            </div>

            {/* ── Status of everything this family has applied for ── */}
            <div className="premium-card" style={{ padding: isMobile ? 16 : (isDesktop ? 32 : 24), maxWidth: 650 }}>
              <div style={{ marginBottom: 20 }}>
                <h3 style={{ fontSize: isMobile ? 18 : 20, fontWeight: 900, color: theme.text, marginBottom: 4 }}>My Applications</h3>
                <p style={{ color: theme.textMuted, fontWeight: 600, fontSize: 13 }}>
                  {myLeaves.length
                    ? `${myLeaves.length} application${myLeaves.length === 1 ? "" : "s"} on file — updates appear here once the office decides.`
                    : "Approval status for every leave you have requested."}
                </p>
              </div>

              {myLeaves.length === 0 ? (
                <div style={{ padding: isMobile ? 22 : 30, textAlign: "center", border: `1px dashed ${theme.border}`, borderRadius: 16, background: theme.isDark ? "rgba(255,255,255,0.02)" : "#FAFAFA" }}>
                  <PaperPlaneTilt size={28} weight="bold" color={theme.textMuted} style={{ marginBottom: 10 }} />
                  <p style={{ fontSize: 14, fontWeight: 700, color: theme.textMuted }}>
                    {session?.accessToken ? "No leave applications yet." : "Sign in to view your leave applications."}
                  </p>
                </div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  {myLeaves.map((lv) => {
                    const meta = leaveStatusMeta[lv.status] ?? leaveStatusMeta.pending;
                    const fg = theme.isDark ? meta.fgDark : meta.fg;
                    return (
                      <div key={lv.id} style={{ border: `1px solid ${theme.border}`, borderRadius: 16, padding: isMobile ? 14 : 18, background: theme.isDark ? "rgba(255,255,255,0.02)" : "#FFFFFF" }}>
                        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 10, marginBottom: 8 }}>
                          <div style={{ minWidth: 0 }}>
                            <p style={{ fontSize: isMobile ? 14 : 15, fontWeight: 800, color: theme.text }}>
                              {formatLeaveDate(lv.startDate)}
                              {lv.endDate && lv.endDate !== lv.startDate ? ` → ${formatLeaveDate(lv.endDate)}` : ""}
                            </p>
                            <p style={{ fontSize: 12, fontWeight: 600, color: theme.textMuted, marginTop: 2 }}>
                              Applied {formatLeaveDate(lv.createdAt)} · Class {lv.class}-{lv.section}
                            </p>
                          </div>
                          <span style={{ flexShrink: 0, fontSize: 10.5, fontWeight: 900, textTransform: "uppercase", letterSpacing: "0.06em", color: fg, background: meta.bg, border: `1px solid ${meta.border}`, borderRadius: 999, padding: "5px 11px" }}>
                            {meta.label}
                          </span>
                        </div>
                        <p style={{ fontSize: 13, fontWeight: 600, color: theme.text, opacity: 0.85, lineHeight: 1.5 }}>{lv.reason}</p>
                        {lv.adminNote && (
                          <p style={{ fontSize: 12, fontWeight: 600, color: theme.textMuted, marginTop: 8, fontStyle: "italic" }}>Admin note: {lv.adminNote}</p>
                        )}
                        {lv.status === "approved" && (
                          <p style={{ fontSize: 11.5, fontWeight: 700, color: theme.isDark ? "#60A5FA" : "#3B82F6", marginTop: 8 }}>
                            These days are recorded as Leave in the attendance register.
                          </p>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

function InfoField({ icon, label, value, theme, isMobile }: any) {
  return (
    <div style={{ display: "flex", gap: isMobile ? 12 : 16, alignItems: "center", minWidth: 0 }}>
      <div style={{ width: isMobile ? 36 : 44, height: isMobile ? 36 : 44, flexShrink: 0, borderRadius: isMobile ? 10 : 12, background: theme.primary + "10", color: theme.primary, display: "flex", alignItems: "center", justifyContent: "center" }}>{icon}</div>
      <div style={{ minWidth: 0 }}>
        <p style={{ fontSize: 11, fontWeight: 800, color: theme.textMuted, textTransform: "uppercase", letterSpacing: "0.05em" }}>{label}</p>
        <p style={{ fontSize: isMobile ? 14 : 16, fontWeight: 800, color: theme.text, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{value}</p>
      </div>
    </div>
  );
}

function SummaryCard({ label, value, icon, theme, isMobile }: any) {
  return (
    <div style={{ padding: isMobile ? 14 : 24, borderRadius: isMobile ? 14 : 20, background: theme.isDark ? "rgba(255,255,255,0.03)" : "#F8FAFC", border: `1px solid ${theme.border}`, display: "flex", alignItems: "center", gap: isMobile ? 12 : 20, minWidth: 0 }}>
      <div style={{ width: isMobile ? 40 : 52, height: isMobile ? 40 : 52, flexShrink: 0, borderRadius: isMobile ? 12 : 14, background: theme.primary + "15", color: theme.primary, display: "flex", alignItems: "center", justifyContent: "center" }}>{icon}</div>
      <div style={{ minWidth: 0 }}>
        <p style={{ fontSize: 11, fontWeight: 800, color: theme.textMuted, textTransform: "uppercase", letterSpacing: "0.04em" }}>{label}</p>
        <p style={{ fontSize: isMobile ? 19 : 24, fontWeight: 900, color: theme.text }}>{value}</p>
      </div>
    </div>
  );
}

function LegendItem({ color, label, theme }: { color: string, label: string, theme: DashboardTheme }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
      <div style={{ width: 12, height: 12, borderRadius: "50%", background: color }} />
      <span style={{ fontSize: 14, fontWeight: 700, color: theme.textMuted }}>{label}</span>
    </div>
  );
}

/** Colour + label for an attendance mark (P / A / L / H, either notation). */
function attendanceChip(status: string, dark: boolean): { label: string; fg: string; bg: string } | null {
  const s = (status || "").trim().toUpperCase();
  if (s === "P" || s === "PRESENT") return { label: "PRESENT", fg: dark ? "#34D399" : "#059669", bg: dark ? "rgba(16,185,129,0.18)" : "rgba(16,185,129,0.14)" };
  if (s === "A" || s === "ABSENT") return { label: "ABSENT", fg: dark ? "#F87171" : "#DC2626", bg: dark ? "rgba(239,68,68,0.18)" : "rgba(239,68,68,0.14)" };
  if (s === "L" || s === "LEAVE") return { label: "LEAVE", fg: dark ? "#60A5FA" : "#2563EB", bg: dark ? "rgba(59,130,246,0.20)" : "rgba(59,130,246,0.14)" };
  if (s === "H" || s === "HOLIDAY") return { label: "HOLIDAY", fg: dark ? "#94A3B8" : "#475569", bg: dark ? "rgba(148,163,184,0.18)" : "rgba(100,116,139,0.14)" };
  return null;
}

function CalendarGrid({ theme, date, onPrev, onNext, data, announcements, type, isMobile }: any) {
  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const weekDays = isMobile
    ? ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"]
    : ["SUNDAY", "MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY"];
  
  const firstDay = new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  const daysInMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  
  // Map announcements to calendar days
  const events: Record<number, { label: string, color: string, category: string }[]> = {};
  
  announcements?.forEach((ann: any) => {
    const annDate = new Date(ann.createdAt);
    if (annDate.getMonth() === date.getMonth() && annDate.getFullYear() === date.getFullYear()) {
      const d = annDate.getDate();
      if (!events[d]) events[d] = [];
      events[d].push({
        label: ann.title.toUpperCase(),
        color: ann.target === 'all' ? '#D9F9E6' : '#E0F2FE',
        category: ann.target === 'all' ? 'event' : 'academic'
      });
    }
  });

  const getCategoryColor = (category: string) => {
    switch(category) {
      case 'academic': return '#3B82F6';
      case 'holiday': return '#F43F5E';
      case 'exam': return '#F59E0B';
      case 'event': return '#10B981';
      default: return theme.primary;
    }
  };

  return (
    <div style={{ position: "relative", width: "100%" }}>
      {/* Header — stacks vertically on phones so the month controls stay reachable */}
      <div style={{ display: "flex", flexDirection: isMobile ? "column" : "row", flexWrap: "wrap", justifyContent: "space-between", alignItems: isMobile ? "stretch" : "center", gap: isMobile ? 14 : 16, marginBottom: isMobile ? 18 : 32 }}>
        <div style={{ display: "flex", alignItems: "flex-start", gap: isMobile ? 10 : 16, minWidth: 0 }}>
          <div style={{ 
            width: isMobile ? 38 : 48, height: isMobile ? 38 : 48, flexShrink: 0, borderRadius: isMobile ? 10 : 12, 
            background: "rgba(255,127,80,0.1)", color: "#FF7F50",
            display: "flex", alignItems: "center", justifyContent: "center"
          }}>
            <CalendarBlank size={isMobile ? 19 : 24} weight="bold" />
          </div>
          <div style={{ minWidth: 0 }}>
            <h3 style={{ fontSize: isMobile ? 17 : 28, fontWeight: 900, color: theme.text, fontFamily: "var(--font-poppins)", letterSpacing: "-0.02em", textTransform: "uppercase", lineHeight: 1.2 }}>
              SCHOOL SCHEDULE
            </h3>
            <p style={{ color: theme.textMuted, fontSize: isMobile ? 12 : 14, fontWeight: 500, marginTop: 2 }}>
              Academic events, exams and holidays for the current year.
            </p>
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: isMobile ? 10 : 24, justifyContent: isMobile ? "space-between" : "flex-end" }}>
          <div style={{ textAlign: "right", whiteSpace: "nowrap" }}>
            <span style={{ fontSize: isMobile ? 21 : 32, fontWeight: 900, color: theme.text }}>{monthNames[date.getMonth()]}</span>
            <span style={{ fontSize: isMobile ? 21 : 32, fontWeight: 900, color: theme.textMuted, marginLeft: 8 }}>{date.getFullYear()}</span>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <button onClick={onPrev} aria-label="Previous month" style={{ width: isMobile ? 38 : 44, height: isMobile ? 38 : 44, borderRadius: isMobile ? 10 : 12, border: `1px solid ${theme.border}`, background: theme.isDark ? "rgba(255,255,255,0.04)" : "white", cursor: "pointer", color: theme.textMuted, display: "flex", alignItems: "center", justifyContent: "center" }}><CaretLeft size={20} weight="bold" /></button>
            <button onClick={onNext} aria-label="Next month" style={{ width: isMobile ? 38 : 44, height: isMobile ? 38 : 44, borderRadius: isMobile ? 10 : 12, border: `1px solid ${theme.border}`, background: theme.isDark ? "rgba(255,255,255,0.04)" : "white", cursor: "pointer", color: theme.textMuted, display: "flex", alignItems: "center", justifyContent: "center" }}><CaretRight size={20} weight="bold" /></button>
          </div>
        </div>
      </div>
      
      {/* Grid */}
      <div style={{ 
        display: "grid", 
        gridTemplateColumns: "repeat(7, 1fr)", 
        border: `1px solid ${theme.border}`,
        borderRadius: isMobile ? "0 0 16px 16px" : "0 0 24px 24px",
        overflow: "hidden"
      }}>
        {weekDays.map(d => (
          <div key={d} style={{ 
            textAlign: "center", fontSize: isMobile ? 9.5 : 11, fontWeight: 900, color: theme.textMuted, 
            padding: isMobile ? "9px 0" : "16px 0", borderBottom: `1px solid ${theme.border}`, letterSpacing: "0.05em"
          }}>{d}</div>
        ))}
        
        {Array.from({ length: firstDay }).map((_, i) => (
          <div key={`offset-${i}`} style={{ borderRight: `1px solid ${theme.border}`, borderBottom: `1px solid ${theme.border}`, height: isMobile ? 54 : 120, background: theme.isDark ? "rgba(255,255,255,0.02)" : "#fcfcfd" }} />
        ))}
        
        {days.map(d => {
          const dayEvents = events[d] || [];
          // Attendance mode paints the register's mark for the day (P/A/L/H);
          // announcements stay visible except on phones, where the cell is
          // too short for both.
          const rec = type === "attendance" ? data?.[d] : undefined;
          const chip = rec ? attendanceChip(rec.status, theme.isDark) : null;
          const shownEvents = chip && isMobile ? [] : dayEvents;
          return (
            <div key={d} style={{ 
              height: isMobile ? 54 : 120, 
              borderRight: `1px solid ${theme.border}`, 
              borderBottom: `1px solid ${theme.border}`,
              padding: isMobile ? "5px 4px" : "12px",
              position: "relative",
              minWidth: 0,
              background: theme.isDark ? "#1A1A1A" : "white"
            }}>
              <span style={{ fontSize: isMobile ? 12 : 16, fontWeight: 700, color: theme.textMuted }}>{d}</span>
              {chip && (
                <div
                  title={rec?.reason ? `${chip.label} — ${rec.reason}` : chip.label}
                  style={{
                    marginTop: isMobile ? 3 : 6,
                    padding: isMobile ? "1px 5px" : "4px 8px",
                    borderRadius: 5,
                    background: chip.bg,
                    color: chip.fg,
                    fontSize: isMobile ? 7.5 : 9.5,
                    fontWeight: 900,
                    letterSpacing: "0.06em",
                    display: "inline-flex",
                    maxWidth: "100%",
                    overflow: "hidden",
                    whiteSpace: "nowrap",
                    textOverflow: "ellipsis",
                  }}
                >
                  {chip.label}
                </div>
              )}
              <div style={{ marginTop: isMobile ? 4 : 8, display: "flex", flexDirection: "column", gap: 3 }}>
                {(isMobile ? shownEvents.slice(0, 1) : shownEvents).map((ev, i) => (
                  <div key={i} title={ev.label} style={{ 
                    padding: isMobile ? "2px 4px" : "4px 8px", 
                    borderRadius: 5, 
                    background: ev.color, 
                    fontSize: isMobile ? 7 : 9, 
                    fontWeight: 900, 
                    color: getCategoryColor(ev.category),
                    display: "flex",
                    alignItems: "center",
                    gap: 4,
                    overflow: "hidden",
                    whiteSpace: "nowrap",
                    textOverflow: "ellipsis",
                    minWidth: 0
                  }}>
                    {!isMobile && <div style={{ width: 4, height: 4, flexShrink: 0, borderRadius: "50%", background: getCategoryColor(ev.category) }} />}
                    <span style={{ overflow: "hidden", textOverflow: "ellipsis" }}>{ev.label}</span>
                  </div>
                ))}
                {isMobile && shownEvents.length > 1 && (
                  <span style={{ fontSize: 7, fontWeight: 900, color: theme.textMuted }}>+{shownEvents.length - 1} more</span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer: Next Events & Legend */}
      <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: isMobile ? 14 : 32, marginTop: isMobile ? 18 : 40 }}>
        {/* Next Events Card */}
        <div style={{ 
          background: "linear-gradient(135deg, #FF7F50 0%, #FF6347 100%)", 
          borderRadius: isMobile ? 20 : 32, 
          padding: isMobile ? 18 : 32,
          color: "white",
          boxShadow: "0 20px 40px rgba(255,127,80,0.2)"
        }}>
          <h4 style={{ fontSize: isMobile ? 18 : 24, fontWeight: 900, marginBottom: 8 }}>Next Events</h4>
          <span style={{ fontSize: 10, fontWeight: 800, background: "rgba(255,255,255,0.2)", padding: "4px 12px", borderRadius: 8, textTransform: "uppercase" }}>Academic Focus</span>
          
          <div style={{ marginTop: isMobile ? 16 : 24, display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: isMobile ? 12 : 16 }}>
            {[
              { date: "MAY 1", title: "Labor Day Holiday", time: "Full Day" },
              { date: "MAY 15", title: "Mid-Term Exami...", time: "09:00 AM" },
              { date: "MAY 22", title: "Annual Sports M...", time: "08:30 AM" },
              { date: "MAY 28", title: "Parent Teacher...", time: "10:00 AM" },
            ].map((ev, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, minWidth: 0 }}>
                <div style={{ 
                  width: isMobile ? 38 : 44, height: isMobile ? 38 : 44, flexShrink: 0, borderRadius: "50%", 
                  background: "rgba(255,255,255,0.2)", 
                  display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
                  fontSize: 9, fontWeight: 900
                }}>
                  <span>{ev.date.split(' ')[0]}</span>
                  <span style={{ fontSize: 14 }}>{ev.date.split(' ')[1]}</span>
                </div>
                <div style={{ minWidth: 0 }}>
                  <p style={{ fontSize: 14, fontWeight: 800, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{ev.title}</p>
                  <p style={{ fontSize: 11, opacity: 0.8 }}>{ev.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Legend Card */}
        <div style={{ 
          background: theme.isDark ? "rgba(255,255,255,0.02)" : "white", 
          borderRadius: isMobile ? 20 : 32, 
          padding: isMobile ? 18 : 32, 
          border: `1px solid ${theme.border}`,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center"
        }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: isMobile ? 14 : 24 }}>
            <LegendItem color="#3B82F6" label="ACADEMIC" theme={theme} />
            <LegendItem color="#F43F5E" label="HOLIDAY" theme={theme} />
            <LegendItem color="#F59E0B" label="EXAM" theme={theme} />
            <LegendItem color="#10B981" label="EVENT" theme={theme} />
          </div>
          <div style={{ marginTop: isMobile ? 18 : 32, display: "flex", justifyContent: "flex-end", opacity: 0.3 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <img src="/images/logo.png" alt="Logo" style={{ width: 24, height: 24, filter: "grayscale(1)" }} />
              <span style={{ fontSize: 14, fontWeight: 900, color: "#1e293b", letterSpacing: "0.05em" }}>SNS ACADEMY</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

