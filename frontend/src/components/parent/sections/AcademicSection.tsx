"use client";

import { useState, useRef } from "react";
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
  Quotes
} from "@phosphor-icons/react";

import { Student, AcademicTab } from "../../../types/dashboard";
import { DashboardTheme } from "../../../types/theme";

const tabs: { key: AcademicTab | "timetable"; label: string; icon: React.ReactNode }[] = [
  { key: "calendar",   label: "Academic Calendar", icon: <CalendarBlank size={15} /> },
  { key: "attendance", label: "Attendance",         icon: <CalendarCheck size={15} /> },
  { key: "exam",       label: "Exam Report Card",   icon: <ChartBar size={15} /> },
  { key: "schedule",   label: "Exam Schedule",      icon: <ClipboardText size={15} /> },
  { key: "leave",      label: "Leave Application",  icon: <PaperPlaneTilt size={15} /> },
];

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

export default function AcademicSection({ student, theme, initialTab }: { student: Student; theme: DashboardTheme; initialTab?: AcademicTab | "timetable" }) {
  const [activeTab, setActiveTab] = useState<AcademicTab | "timetable">(initialTab || "calendar");
  const [examType, setExamType] = useState<"periodic" | "cycle" | "term">("term");
  const [currentDate, setCurrentDate] = useState(new Date(2026, 3, 1)); // April 2026
  const [leaveSubmitted, setLeaveSubmitted] = useState(false);
  const [attachedFile, setAttachedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  // Calculate stats for current month
  const monthKey = `${currentDate.getFullYear()}-${currentDate.getMonth()}`;
  const monthData = attendanceData[monthKey] || {};
  const totalPresent = Object.values(monthData).filter(d => d.status === "P").length;
  const totalAbsent = Object.values(monthData).filter(d => d.status === "A").length;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      {/* Tabs */}
      <div style={{ display: "flex", gap: 12, flexWrap: "wrap", background: theme.isDark ? "rgba(255,255,255,0.05)" : "#f1f5f9", padding: "6px", borderRadius: 16, width: "fit-content" }}>
        {tabs.map((tab) => {
          const isActive = activeTab === tab.key;
          return (
            <button key={tab.key} onClick={() => setActiveTab(tab.key as any)}
              style={{
                display: "flex", alignItems: "center", gap: 10,
                padding: "10px 20px", borderRadius: 12, border: "none",
                cursor: "pointer", fontSize: 14, fontWeight: 700,
                background: isActive ? (theme.isDark ? "rgba(255,255,255,0.1)" : "#FFFFFF") : "transparent",
                color: isActive ? "#FF7F50" : theme.textMuted,
                boxShadow: isActive ? "0 4px 12px rgba(0,0,0,0.05)" : "none",
                transition: "all 0.2s",
                fontFamily: "var(--font-inter,'Inter',sans-serif)",
              }}>
              {tab.icon} {tab.label}
            </button>
          );
        })}
      </div>
      {/* Exam Type Filter (only for Exam tabs) */}
      {(activeTab === "exam" || activeTab === "schedule") && (
        <div style={{ display: "flex", gap: 10, marginBottom: 8 }}>
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
            <div className="premium-card" style={{ padding: "24px" }}>
              {activeTab === "attendance" && (
                <div style={{ display: "flex", gap: 20, marginBottom: 24 }}>
                  <div style={{ flex: 1, padding: "20px", borderRadius: 16, background: "rgba(16, 185, 129, 0.08)", border: "1px solid rgba(16, 185, 129, 0.1)" }}>
                    <p style={{ fontSize: 12, fontWeight: 800, color: "#10B981", textTransform: "uppercase", marginBottom: 4 }}>Total Present</p>
                    <p style={{ fontSize: 24, fontWeight: 900, color: "#10B981" }}>{totalPresent} Days</p>
                  </div>
                  <div style={{ flex: 1, padding: "20px", borderRadius: 16, background: "rgba(239, 68, 68, 0.08)", border: "1px solid rgba(239, 68, 68, 0.1)" }}>
                    <p style={{ fontSize: 12, fontWeight: 800, color: "#EF4444", textTransform: "uppercase", marginBottom: 4 }}>Total Absent</p>
                    <p style={{ fontSize: 24, fontWeight: 900, color: "#EF4444" }}>{totalAbsent} Day{totalAbsent !== 1 ? 's' : ''}</p>
                  </div>
                </div>
              )}
              <CalendarGrid 
                theme={theme} 
                date={currentDate} 
                onPrev={handlePrevMonth} 
                onNext={handleNextMonth}
                data={monthData} 
                type={activeTab === "attendance" ? "attendance" : "events"} 
              />
              <div style={{ display: "flex", gap: 20, marginTop: 24, justifyContent: "center", flexWrap: "wrap" }}>
                <LegendItem color={theme.success} label="Present" theme={theme} />
                <LegendItem color={theme.danger} label="Absent" theme={theme} />
                <LegendItem color="#3B82F6" label="Leave" theme={theme} />
                <LegendItem color={theme.isDark ? "rgba(255,255,255,0.1)" : "#f1f5f9"} label="Holiday" theme={theme} />
              </div>
            </div>
          )}



          {activeTab === "exam" && (
            <div className="premium-card" style={{ padding: 0, overflow: "hidden", border: `1px solid ${theme.border}` }}>
              {/* Report Card Header */}
              <div style={{ padding: "40px", background: theme.isDark ? "rgba(255,255,255,0.02)" : "#F8FAFC", borderBottom: `1px solid ${theme.border}` }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 40 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
                    <div style={{ width: 64, height: 64, borderRadius: 16, background: "white", padding: 10, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 8px 24px rgba(0,0,0,0.05)" }}>
                      <img src="/images/logo.png" alt="SNS Logo" style={{ width: "100%", height: "auto" }} />
                    </div>
                    <div>
                      <h2 style={{ fontSize: 24, fontWeight: 900, color: theme.text, letterSpacing: "-0.02em" }}>SNS ACADEMY</h2>
                      <p style={{ fontSize: 13, fontWeight: 700, color: theme.primary, textTransform: "uppercase", letterSpacing: "0.1em" }}>{reportData[examType].term}</p>
                    </div>
                  </div>
                  <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} style={{ padding: "12px 20px", borderRadius: 12, background: theme.primary, color: "white", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: 10, fontWeight: 700, fontSize: 14 }}>
                    <DownloadSimple size={20} weight="bold" /> Download PDF
                  </motion.button>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 32 }}>
                  <InfoField icon={<User size={18} />} label="Student Name" value={student.name} theme={theme} />
                  <InfoField icon={<IdentificationCard size={18} />} label="Roll Number" value={`SNS2024-${student.id}`} theme={theme} />
                  <InfoField icon={<ChartBar size={18} />} label="Grade & Section" value={`${student.class}-${student.section}`} theme={theme} />
                </div>
              </div>

              {/* Marks Table */}
              <div style={{ padding: "0 40px" }}>
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                  <thead>
                    <tr>
                      <th style={{ padding: "24px 0", textAlign: "left", fontSize: 12, fontWeight: 800, color: theme.textMuted, textTransform: "uppercase" }}>Subject</th>
                      <th style={{ padding: "24px 0", textAlign: "center", fontSize: 12, fontWeight: 800, color: theme.textMuted, textTransform: "uppercase" }}>Internal (20)</th>
                      <th style={{ padding: "24px 0", textAlign: "center", fontSize: 12, fontWeight: 800, color: theme.textMuted, textTransform: "uppercase" }}>Exam (80)</th>
                      <th style={{ padding: "24px 0", textAlign: "center", fontSize: 12, fontWeight: 800, color: theme.textMuted, textTransform: "uppercase" }}>Total (100)</th>
                      <th style={{ padding: "24px 0", textAlign: "right", fontSize: 12, fontWeight: 800, color: theme.textMuted, textTransform: "uppercase" }}>Grade</th>
                    </tr>
                  </thead>
                  <tbody>
                    {reportData[examType].subjects.map((s: any, i: number) => (
                      <tr key={i} style={{ borderBottom: `1px solid ${theme.border}` }}>
                        <td style={{ padding: "20px 0", fontSize: 16, fontWeight: 800, color: theme.text }}>{s.name}</td>
                        <td style={{ padding: "20px 0", textAlign: "center", fontSize: 15, fontWeight: 600, color: theme.textMuted }}>{s.internal}</td>
                        <td style={{ padding: "20px 0", textAlign: "center", fontSize: 15, fontWeight: 600, color: theme.textMuted }}>{s.exam}</td>
                        <td style={{ padding: "20px 0", textAlign: "center", fontSize: 16, fontWeight: 900, color: theme.primary }}>{s.total}</td>
                        <td style={{ padding: "20px 0", textAlign: "right" }}>
                          <span style={{ padding: "6px 12px", borderRadius: 8, background: theme.primary + "10", color: theme.primary, fontWeight: 800, fontSize: 13 }}>{s.grade}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Summary Section */}
              <div style={{ padding: "40px", background: theme.isDark ? "rgba(255,255,255,0.01)" : "#FFFFFF" }}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 40 }}>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
                    <SummaryCard label="Percentage" value={reportData[examType].percentage} icon={<TrendUp size={24} />} theme={theme} />
                    <SummaryCard label="Attendance" value={reportData[examType].attendance} icon={<SealCheck size={24} />} theme={theme} />
                  </div>
                  <div style={{ padding: "24px", borderRadius: 20, background: theme.isDark ? "rgba(255,255,255,0.03)" : "#F8FAFC", border: `1px solid ${theme.border}`, position: "relative" }}>
                    <Quotes size={32} weight="fill" style={{ position: "absolute", top: -16, left: 20, color: theme.primary + "30" }} />
                    <p style={{ fontSize: 12, fontWeight: 800, color: theme.textMuted, textTransform: "uppercase", marginBottom: 12 }}>Teacher's Remarks</p>
                    <p style={{ fontSize: 14, fontWeight: 600, color: theme.text, lineHeight: "1.7", fontStyle: "italic" }}>{reportData[examType].remarks}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "schedule" && (
            <div className="premium-card" style={{ padding: "32px" }}>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: 24 }}>
                {examSchedule[examType].map((e, i) => (
                  <div key={i} style={{ 
                    padding: "24px", 
                    borderRadius: 20, 
                    border: `1px solid ${theme.border}`,
                    background: theme.isDark ? "rgba(255,255,255,0.02)" : "#F8FAFC",
                    display: "flex",
                    flexDirection: "column",
                    gap: 16
                  }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <span style={{ fontSize: 11, fontWeight: 800, color: theme.primary, textTransform: "uppercase", background: theme.primary + "10", padding: "4px 10px", borderRadius: 8 }}>Day {i+1}</span>
                      <span style={{ fontSize: 13, fontWeight: 700, color: theme.textMuted }}>{e.date}</span>
                    </div>
                    <h4 style={{ fontSize: 18, fontWeight: 800, color: theme.text }}>{e.subject}</h4>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "leave" && (
            <div className="premium-card" style={{ padding: "32px", maxWidth: 650 }}>
              <div style={{ marginBottom: 24 }}>
                <h3 style={{ fontSize: 20, fontWeight: 900, color: theme.text, marginBottom: 4 }}>Apply for Leave</h3>
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
                <form onSubmit={(e) => { e.preventDefault(); setLeaveSubmitted(true); }} style={{ display: "flex", flexDirection: "column", gap: 24 }}>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
                    <div className="form-group">
                      <label style={{ display: "block", fontSize: 11, fontWeight: 800, color: theme.textMuted, marginBottom: 8, textTransform: "uppercase" }}>Start Date</label>
                      <input type="date" required style={{ width: "100%", padding: "12px 14px", borderRadius: 12, border: `1px solid ${theme.border}`, background: theme.isDark ? "rgba(255,255,255,0.03)" : "#F8FAFC", outline: "none", fontSize: 13, fontWeight: 600, color: theme.text }} />
                    </div>
                    <div className="form-group">
                      <label style={{ display: "block", fontSize: 11, fontWeight: 800, color: theme.textMuted, marginBottom: 8, textTransform: "uppercase" }}>End Date</label>
                      <input type="date" required style={{ width: "100%", padding: "12px 14px", borderRadius: 12, border: `1px solid ${theme.border}`, background: theme.isDark ? "rgba(255,255,255,0.03)" : "#F8FAFC", outline: "none", fontSize: 13, fontWeight: 600, color: theme.text }} />
                    </div>
                  </div>
                  
                  <div className="form-group">
                    <label style={{ display: "block", fontSize: 11, fontWeight: 800, color: theme.textMuted, marginBottom: 8, textTransform: "uppercase" }}>Reason for Leave</label>
                    <textarea rows={3} required placeholder="Please provide a valid reason..." style={{ width: "100%", padding: "12px 14px", borderRadius: 12, border: `1px solid ${theme.border}`, background: theme.isDark ? "rgba(255,255,255,0.03)" : "#F8FAFC", outline: "none", fontSize: 13, fontWeight: 600, resize: "none", color: theme.text }} />
                  </div>

                  <div className="form-group">
                    <label style={{ display: "block", fontSize: 11, fontWeight: 800, color: theme.textMuted, marginBottom: 8, textTransform: "uppercase" }}>Supporting Documents (Optional)</label>
                    <input type="file" ref={fileInputRef} onChange={(e) => setAttachedFile(e.target.files?.[0] || null)} style={{ display: "none" }} />
                    <div 
                      onClick={() => fileInputRef.current?.click()}
                      style={{ 
                        width: "100%", 
                        padding: "20px", 
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

                  <button type="submit" style={{ padding: "14px", borderRadius: 14, background: "linear-gradient(135deg, #FF7F50, #e66a3e)", color: "white", border: "none", cursor: "pointer", fontWeight: 900, fontSize: 15, boxShadow: "0 8px 24px rgba(255,127,80,0.25)" }}>Submit Leave Application</button>
                </form>
              )}
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

function InfoField({ icon, label, value, theme }: any) {
  return (
    <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
      <div style={{ width: 44, height: 44, borderRadius: 12, background: theme.primary + "10", color: theme.primary, display: "flex", alignItems: "center", justifyContent: "center" }}>{icon}</div>
      <div>
        <p style={{ fontSize: 11, fontWeight: 800, color: theme.textMuted, textTransform: "uppercase", letterSpacing: "0.05em" }}>{label}</p>
        <p style={{ fontSize: 16, fontWeight: 800, color: theme.text }}>{value}</p>
      </div>
    </div>
  );
}

function SummaryCard({ label, value, icon, theme }: any) {
  return (
    <div style={{ padding: "24px", borderRadius: 20, background: theme.isDark ? "rgba(255,255,255,0.03)" : "#F8FAFC", border: `1px solid ${theme.border}`, display: "flex", alignItems: "center", gap: 20 }}>
      <div style={{ width: 52, height: 52, borderRadius: 14, background: theme.primary + "15", color: theme.primary, display: "flex", alignItems: "center", justifyContent: "center" }}>{icon}</div>
      <div>
        <p style={{ fontSize: 12, fontWeight: 800, color: theme.textMuted, textTransform: "uppercase" }}>{label}</p>
        <p style={{ fontSize: 24, fontWeight: 900, color: theme.text }}>{value}</p>
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

function CalendarGrid({ theme, date, onPrev, onNext, data, type }: any) {
  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const weekDays = ["SUNDAY", "MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY"];
  
  const firstDay = new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  const daysInMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  
  // Example events for May 2026 as per image
  const events: Record<number, { label: string, color: string, category: string }[]> = {
    1: [{ label: "LABOR DAY HOLIDAY", color: "#FFDEE2", category: "holiday" }],
    15: [{ label: "MID-TERM EXAMINATION", color: "#FFF4CC", category: "exam" }],
    22: [{ label: "ANNUAL SPORTS MEET", color: "#D9F9E6", category: "event" }],
    28: [{ label: "PARENT TEACHER MEETING", color: "#E0F2FE", category: "academic" }],
  };

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
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 32 }}>
        <div style={{ display: "flex", alignItems: "flex-start", gap: 16 }}>
          <div style={{ 
            width: 48, height: 48, borderRadius: 12, 
            background: "rgba(255,127,80,0.1)", color: "#FF7F50",
            display: "flex", alignItems: "center", justifyContent: "center"
          }}>
            <CalendarBlank size={24} weight="bold" />
          </div>
          <div>
            <h3 style={{ fontSize: 28, fontWeight: 900, color: "#1e293b", fontFamily: "var(--font-poppins)", letterSpacing: "-0.02em", textTransform: "uppercase" }}>
              SCHOOL SCHEDULE
            </h3>
            <p style={{ color: "#64748b", fontSize: 14, fontWeight: 500 }}>
              Academic events, exams and holidays for the current year.
            </p>
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
          <div style={{ textAlign: "right" }}>
            <span style={{ fontSize: 32, fontWeight: 900, color: "#1e293b" }}>{monthNames[date.getMonth()]}</span>
            <span style={{ fontSize: 32, fontWeight: 900, color: "#cbd5e1", marginLeft: 8 }}>{date.getFullYear()}</span>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <button onClick={onPrev} style={{ width: 44, height: 44, borderRadius: 12, border: "1px solid #e2e8f0", background: "white", cursor: "pointer", color: "#64748b", display: "flex", alignItems: "center", justifyContent: "center" }}><ChevronLeft size={20} weight="bold" /></button>
            <button onClick={onNext} style={{ width: 44, height: 44, borderRadius: 12, border: "1px solid #e2e8f0", background: "white", cursor: "pointer", color: "#64748b", display: "flex", alignItems: "center", justifyContent: "center" }}><ChevronRight size={20} weight="bold" /></button>
          </div>
        </div>
      </div>
      
      {/* Grid */}
      <div style={{ 
        display: "grid", 
        gridTemplateColumns: "repeat(7, 1fr)", 
        border: "1px solid #f1f5f9",
        borderRadius: "0 0 24px 24px",
        overflow: "hidden"
      }}>
        {weekDays.map(d => (
          <div key={d} style={{ 
            textAlign: "center", fontSize: 11, fontWeight: 900, color: "#94a3b8", 
            padding: "16px 0", borderBottom: "1px solid #f1f5f9", letterSpacing: "0.05em"
          }}>{d}</div>
        ))}
        
        {Array.from({ length: firstDay }).map((_, i) => (
          <div key={`offset-${i}`} style={{ borderRight: "1px solid #f1f5f9", borderBottom: "1px solid #f1f5f9", height: 120, background: "#fcfcfd" }} />
        ))}
        
        {days.map(d => {
          const dayEvents = events[d] || [];
          return (
            <div key={d} style={{ 
              height: 120, 
              borderRight: "1px solid #f1f5f9", 
              borderBottom: "1px solid #f1f5f9",
              padding: "12px",
              position: "relative",
              background: "white"
            }}>
              <span style={{ fontSize: 16, fontWeight: 700, color: "#64748b" }}>{d}</span>
              <div style={{ marginTop: 8, display: "flex", flexDirection: "column", gap: 4 }}>
                {dayEvents.map((ev, i) => (
                  <div key={i} style={{ 
                    padding: "4px 8px", 
                    borderRadius: 6, 
                    background: ev.color, 
                    fontSize: 9, 
                    fontWeight: 900, 
                    color: getCategoryColor(ev.category),
                    display: "flex",
                    alignItems: "center",
                    gap: 4
                  }}>
                    <div style={{ width: 4, height: 4, borderRadius: "50%", background: getCategoryColor(ev.category) }} />
                    {ev.label}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer: Next Events & Legend */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 32, marginTop: 40 }}>
        {/* Next Events Card */}
        <div style={{ 
          background: "linear-gradient(135deg, #FF7F50 0%, #FF6347 100%)", 
          borderRadius: 32, 
          padding: "32px",
          color: "white",
          boxShadow: "0 20px 40px rgba(255,127,80,0.2)"
        }}>
          <h4 style={{ fontSize: 24, fontWeight: 900, marginBottom: 8 }}>Next Events</h4>
          <span style={{ fontSize: 10, fontWeight: 800, background: "rgba(255,255,255,0.2)", padding: "4px 12px", borderRadius: 8, textTransform: "uppercase" }}>Academic Focus</span>
          
          <div style={{ marginTop: 24, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            {[
              { date: "MAY 1", title: "Labor Day Holiday", time: "Full Day" },
              { date: "MAY 15", title: "Mid-Term Exami...", time: "09:00 AM" },
              { date: "MAY 22", title: "Annual Sports M...", time: "08:30 AM" },
              { date: "MAY 28", title: "Parent Teacher...", time: "10:00 AM" },
            ].map((ev, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{ 
                  width: 44, height: 44, borderRadius: "50%", 
                  background: "rgba(255,255,255,0.2)", 
                  display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
                  fontSize: 9, fontWeight: 900
                }}>
                  <span>{ev.date.split(' ')[0]}</span>
                  <span style={{ fontSize: 14 }}>{ev.date.split(' ')[1]}</span>
                </div>
                <div>
                  <p style={{ fontSize: 14, fontWeight: 800 }}>{ev.title}</p>
                  <p style={{ fontSize: 11, opacity: 0.8 }}>{ev.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Legend Card */}
        <div style={{ 
          background: "white", 
          borderRadius: 32, 
          padding: "32px", 
          border: "1px solid #f1f5f9",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center"
        }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
            <LegendItem color="#3B82F6" label="ACADEMIC" theme={theme} />
            <LegendItem color="#F43F5E" label="HOLIDAY" theme={theme} />
            <LegendItem color="#F59E0B" label="EXAM" theme={theme} />
            <LegendItem color="#10B981" label="EVENT" theme={theme} />
          </div>
          <div style={{ marginTop: 32, display: "flex", justifyContent: "flex-end", opacity: 0.3 }}>
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

// Helper Components
function ChevronLeft({ size, weight }: any) { return <span style={{ fontSize: size, fontWeight: weight }}>&larr;</span>; }
function ChevronRight({ size, weight }: any) { return <span style={{ fontSize: size, fontWeight: weight }}>&rarr;</span>; }
