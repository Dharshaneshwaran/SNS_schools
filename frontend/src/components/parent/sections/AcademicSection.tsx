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

const tabs: { key: AcademicTab; label: string; icon: React.ReactNode }[] = [
  { key: "calendar",   label: "Academic Calendar", icon: <CalendarBlank size={15} /> },
  { key: "attendance", label: "Attendance",         icon: <CalendarCheck size={15} /> },
  { key: "exam",       label: "Exam Report Card",   icon: <ChartBar size={15} /> },
  { key: "schedule",   label: "Exam Schedule",      icon: <ClipboardText size={15} /> },
  { key: "leave",      label: "Leave Application",  icon: <PaperPlaneTilt size={15} /> },
];

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
    20: { status: "H", reason: "Sports Day" }, 25: { status: "H", reason: "Founder's Day" }
  },
  "2026-4": { // May
    1: { status: "H", reason: "Labour Day" },
    10: { status: "H", reason: "Term Exams Start" }
  }
};

export default function AcademicSection({ student, theme, initialTab }: { student: Student; theme: DashboardTheme; initialTab?: AcademicTab }) {
  const [activeTab, setActiveTab] = useState<AcademicTab>(initialTab || "calendar");
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

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      {/* Tabs */}
      <div style={{ display: "flex", gap: 12, flexWrap: "wrap", background: theme.isDark ? "rgba(255,255,255,0.05)" : "#f1f5f9", padding: "6px", borderRadius: 16, width: "fit-content" }}>
        {tabs.map((tab) => {
          const isActive = activeTab === tab.key;
          return (
            <button key={tab.key} onClick={() => setActiveTab(tab.key)}
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
              <CalendarGrid 
                theme={theme} 
                date={currentDate} 
                onPrev={handlePrevMonth} 
                onNext={handleNextMonth}
                data={attendanceData[`${currentDate.getFullYear()}-${currentDate.getMonth()}`] || {}} 
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
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, fontWeight: 600, color: theme.textMuted }}>
                      <span>Hall: <strong style={{ color: theme.text }}>{e.hall}</strong></span>
                      <span>Seat: <strong style={{ color: theme.text }}>{e.seat}</strong></span>
                    </div>
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
  const weekDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  
  const firstDay = new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  const offset = firstDay === 0 ? 6 : firstDay - 1; // Adjust for Monday start
  const daysInMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  
  return (
    <div style={{ position: "relative" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <CalendarBlank size={20} weight="bold" color={theme.primary} />
          <h3 style={{ fontSize: 20, fontWeight: 900, color: theme.text, fontFamily: "var(--font-poppins,'Poppins',sans-serif)", letterSpacing: "-0.02em" }}>
            {monthNames[date.getMonth()]} {date.getFullYear()}
          </h3>
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <button onClick={onPrev} style={{ width: 36, height: 36, borderRadius: 10, border: `1px solid ${theme.border}`, background: theme.cardBg, cursor: "pointer", color: theme.text, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14 }}>&larr;</button>
          <button onClick={onNext} style={{ width: 36, height: 36, borderRadius: 10, border: `1px solid ${theme.border}`, background: theme.cardBg, cursor: "pointer", color: theme.text, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14 }}>&rarr;</button>
        </div>
      </div>
      
      <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: "4px 0" }}>
        {weekDays.map(d => (
          <div key={d} style={{ textAlign: "center", fontSize: 12, fontWeight: 800, color: theme.textMuted, paddingBottom: 16, textTransform: "uppercase", letterSpacing: "0.05em" }}>{d}</div>
        ))}
        {Array.from({ length: offset }).map((_, i) => <div key={`offset-${i}`} />)}
        {days.map(d => {
          const item = data[d];
          const isHighlighted = !!item;
          
          let bgColor = "transparent";
          let textColor = theme.text;
          
          if (isHighlighted) {
            if (item.status === "P") { bgColor = theme.success + "15"; textColor = theme.success; }
            else if (item.status === "A") { bgColor = theme.danger + "15"; textColor = theme.danger; }
            else if (item.status === "H") { bgColor = theme.isDark ? "rgba(255,255,255,0.05)" : "#f1f5f9"; textColor = theme.textMuted; }
            else { bgColor = "#3B82F615"; textColor = "#3B82F6"; }
          }

          return (
            <div key={d} style={{ 
              height: 55,
              display: "flex", 
              flexDirection: "column",
              alignItems: "center", 
              justifyContent: "center", 
              position: "relative"
            }}>
              <motion.div 
                whileHover={{ scale: 1.1 }}
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 12,
                  background: bgColor,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 14,
                  fontWeight: isHighlighted ? 900 : 600,
                  color: textColor,
                  transition: "all 0.2s"
                }}
              >
                {d}
              </motion.div>
              {item?.reason && (
                <div style={{ 
                  marginTop: 4,
                  fontSize: 9,
                  fontWeight: 800,
                  color: theme.primary,
                  textTransform: "uppercase",
                  textAlign: "center",
                  maxWidth: 60,
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap"
                }}>
                  {item.reason}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
