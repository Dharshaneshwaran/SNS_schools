"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ChartBar, CalendarCheck, CalendarBlank, PaperPlaneTilt, ClipboardText } from "@phosphor-icons/react";

type Student = { id: number; name: string; class: string; section: string; avatar: string };
type Tab = "calendar" | "attendance" | "exam" | "schedule" | "leave";

const tabs: { key: Tab; label: string; icon: React.ReactNode }[] = [
  { key: "calendar",   label: "Academic Calendar", icon: <CalendarBlank size={15} /> },
  { key: "attendance", label: "Attendance",         icon: <CalendarCheck size={15} /> },
  { key: "exam",       label: "Exam Report",        icon: <ChartBar size={15} /> },
  { key: "schedule",   label: "Exam Schedule",      icon: <ClipboardText size={15} /> },
  { key: "leave",      label: "Leave Application",  icon: <PaperPlaneTilt size={15} /> },
];

const subjects = [
  { name: "Mathematics", marks: 92, max: 100, grade: "A+" },
  { name: "Science",     marks: 85, max: 100, grade: "A" },
  { name: "English",     marks: 88, max: 100, grade: "A" },
  { name: "Hindi",       marks: 78, max: 100, grade: "B+" },
  { name: "Social",      marks: 82, max: 100, grade: "A-" },
];

const calendarEvents = [
  { month: "April", events: ["Apr 20 – Sports Day", "Apr 30 – Unit Test"] },
  { month: "May",   events: ["May 1 – Labour Day Holiday", "May 10-16 – Term Exams", "May 20 – Results Day"] },
  { month: "June",  events: ["Jun 1 – Summer Break Begins", "Jun 20 – New Term Starts"] },
];

const examSchedule = [
  { subject: "Mathematics", date: "May 10", hall: "Hall A", seat: "25" },
  { subject: "Science",     date: "May 12", hall: "Hall B", seat: "12" },
  { subject: "English",     date: "May 14", hall: "Hall A", seat: "25" },
  { subject: "Hindi",       date: "May 15", hall: "Hall C", seat: "8" },
  { subject: "Social",      date: "May 16", hall: "Hall B", seat: "12" },
];

const attendanceData: Record<number, string> = {
  1: "P", 2: "P", 3: "P", 4: "H", 5: "H", 6: "P", 7: "P", 8: "A", 9: "P", 10: "P",
  11: "H", 12: "H", 13: "P", 14: "P", 15: "P", 16: "A", 17: "P", 18: "P", 19: "H", 20: "H",
  21: "P", 22: "P", 23: "P", 24: "P", 25: "P", 26: "A", 27: "H", 28: "H", 29: "P", 30: "P"
};

const academicEvents: Record<number, { label: string, color: string }> = {
  10: { label: "Term Exam", color: "#FF7F50" },
  15: { label: "Art Fest", color: "#3B82F6" },
  20: { label: "Sports Day", color: "#8B5CF6" },
  25: { label: "Holiday", color: "#10B981" },
};

import { DashboardTheme } from "../../../types/theme";

export default function AcademicSection({ student, theme }: { student: Student; theme: DashboardTheme }) {
  const [activeTab, setActiveTab] = useState<Tab>("calendar");
  const [leaveSubmitted, setLeaveSubmitted] = useState(false);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
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

      <motion.div key={activeTab} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
        {activeTab === "attendance" && (
          <div className="premium-card" style={{ padding: "32px" }}>
            <CalendarGrid theme={theme} data={attendanceData} type="attendance" />
            <div style={{ display: "flex", gap: 24, marginTop: 32, justifyContent: "center" }}>
              <LegendItem color="#10b981" label="Present" theme={theme} />
              <LegendItem color="#ef4444" label="Absent" theme={theme} />
              <LegendItem color="#3B82F6" label="Leave" theme={theme} />
            </div>
          </div>
        )}

        {activeTab === "calendar" && (
          <div className="premium-card" style={{ padding: "32px" }}>
            <CalendarGrid theme={theme} data={academicEvents} type="events" />
            <div style={{ display: "flex", gap: 24, marginTop: 32, justifyContent: "center" }}>
              <LegendItem color="#FF7F50" label="Exam" theme={theme} />
              <LegendItem color="#4f46e5" label="Event" theme={theme} />
              <LegendItem color="#8b5cf6" label="Holiday" theme={theme} />
            </div>
          </div>
        )}

        {activeTab === "exam" && (
          <div className="premium-card" style={{ overflow: "hidden" }}>
            <div style={{ padding: "24px 32px", borderBottom: `1px solid ${theme.border}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <h3 style={{ fontSize: 18, fontWeight: 800, color: theme.text }}>Term 2 Exam Report</h3>
              <span style={{ fontSize: 14, fontWeight: 700, color: theme.textMuted }}>GPA: 3.8 / 4.0</span>
            </div>
            <div style={{ padding: "16px 32px 32px" }}>
              {subjects.map((s, i) => (
                <div key={i} style={{ padding: "16px 0", borderBottom: i < subjects.length - 1 ? `1px solid ${theme.border}` : "none", display: "flex", alignItems: "center", gap: 24 }}>
                   <div style={{ flex: 1 }}>
                     <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
                        <span style={{ fontSize: 15, fontWeight: 700, color: theme.text }}>{s.name}</span>
                        <span style={{ fontSize: 15, fontWeight: 800, color: "#FF7F50" }}>{s.marks}/{s.max}</span>
                     </div>
                     <div style={{ height: 8, borderRadius: 10, background: theme.isDark ? "rgba(255,255,255,0.05)" : "#F1F5F9", overflow: "hidden" }}>
                        <motion.div initial={{ width: 0 }} animate={{ width: `${(s.marks / s.max) * 100}%` }} transition={{ delay: i * 0.1, duration: 1 }}
                          style={{ height: "100%", borderRadius: 10, background: "linear-gradient(90deg,#FF7F50,#e66a3e)" }} />
                     </div>
                   </div>
                   <div style={{ width: 44, height: 44, borderRadius: 12, background: "rgba(255,127,80,0.08)", color: "#FF7F50", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 14 }}>{s.grade}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "schedule" && (
          <div className="premium-card" style={{ overflow: "hidden" }}>
             <table style={{ width: "100%", borderCollapse: "collapse" }}>
               <thead>
                 <tr style={{ background: theme.isDark ? "rgba(255,255,255,0.02)" : "#F8FAFC" }}>
                   {["Subject","Date","Hall","Seat"].map(h => <th key={h} style={{ padding: "20px 24px", textAlign: "left", color: theme.textMuted, fontSize: 12, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.05em" }}>{h}</th>)}
                 </tr>
               </thead>
               <tbody>
                 {examSchedule.map((e, i) => (
                   <tr key={i} style={{ borderBottom: `1px solid ${theme.border}` }}>
                     <td style={{ padding: "20px 24px", fontSize: 15, fontWeight: 700, color: theme.text }}>{e.subject}</td>
                     <td style={{ padding: "20px 24px", fontSize: 14, fontWeight: 600, color: theme.textMuted }}>{e.date}</td>
                     <td style={{ padding: "20px 24px", fontSize: 14, fontWeight: 600, color: theme.textMuted }}>{e.hall}</td>
                     <td style={{ padding: "20px 24px", fontSize: 14, fontWeight: 600, color: theme.textMuted }}>{e.seat}</td>
                   </tr>
                 ))}
               </tbody>
             </table>
          </div>
        )}

        {activeTab === "leave" && (
          <div className="premium-card" style={{ padding: "40px", maxWidth: 600 }}>
             <h3 style={{ fontSize: 20, fontWeight: 800, color: theme.text, marginBottom: 32 }}>Apply for Leave</h3>
             {leaveSubmitted ? (
               <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} style={{ textAlign: "center", padding: "20px 0" }}>
                  <div style={{ width: 80, height: 80, borderRadius: "50%", background: theme.isDark ? "rgba(16,185,129,0.1)" : "#eefdf3", color: "#10b981", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 40, margin: "0 auto 24px" }}>✓</div>
                  <p style={{ fontSize: 20, fontWeight: 800, color: theme.text, marginBottom: 8 }}>Submitted Successfully!</p>
                  <p style={{ color: theme.textMuted, fontWeight: 600, marginBottom: 32 }}>Your request is pending for approval.</p>
                  <button onClick={() => setLeaveSubmitted(false)} style={{ padding: "14px 32px", borderRadius: 16, background: theme.text, color: theme.bg, border: "none", cursor: "pointer", fontWeight: 700 }}>Apply Again</button>
               </motion.div>
             ) : (
               <form onSubmit={(e) => { e.preventDefault(); setLeaveSubmitted(true); }} style={{ display: "flex", flexDirection: "column", gap: 24 }}>
                 <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
                    <div>
                      <label style={{ display: "block", fontSize: 12, fontWeight: 800, color: theme.textMuted, marginBottom: 8, textTransform: "uppercase" }}>From Date</label>
                      <input type="date" required style={{ width: "100%", padding: "14px 16px", borderRadius: 12, border: `1px solid ${theme.border}`, background: theme.isDark ? "rgba(255,255,255,0.03)" : "#F8FAFC", outline: "none", fontSize: 14, fontWeight: 600, color: theme.text }} />
                    </div>
                    <div>
                      <label style={{ display: "block", fontSize: 12, fontWeight: 800, color: theme.textMuted, marginBottom: 8, textTransform: "uppercase" }}>To Date</label>
                      <input type="date" required style={{ width: "100%", padding: "14px 16px", borderRadius: 12, border: `1px solid ${theme.border}`, background: theme.isDark ? "rgba(255,255,255,0.03)" : "#F8FAFC", outline: "none", fontSize: 14, fontWeight: 600, color: theme.text }} />
                    </div>
                 </div>
                 <div>
                    <label style={{ display: "block", fontSize: 12, fontWeight: 800, color: theme.textMuted, marginBottom: 8, textTransform: "uppercase" }}>Reason</label>
                    <textarea rows={4} required placeholder="Describe the reason for leave..." style={{ width: "100%", padding: "14px 16px", borderRadius: 12, border: `1px solid ${theme.border}`, background: theme.isDark ? "rgba(255,255,255,0.03)" : "#F8FAFC", outline: "none", fontSize: 14, fontWeight: 600, resize: "none", color: theme.text }} />
                 </div>
                 <button type="submit" style={{ padding: "16px", borderRadius: 16, background: "linear-gradient(135deg, #FF7F50, #e66a3e)", color: "white", border: "none", cursor: "pointer", fontWeight: 800, fontSize: 16, boxShadow: "0 10px 25px rgba(255,127,80,0.25)" }}>Submit Application</button>
               </form>
             )}
          </div>
        )}
      </motion.div>
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

function CalendarGrid({ theme, data, type }: { theme: DashboardTheme, data: any, type: "attendance" | "events" }) {
  const days = Array.from({ length: 30 }, (_, i) => i + 1);
  const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  
  return (
    <div style={{ position: "relative" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 40 }}>
        <div>
          <h3 style={{ fontSize: 24, fontWeight: 900, color: theme.text, fontFamily: "var(--font-poppins,'Poppins',sans-serif)", letterSpacing: "-0.02em" }}>April 2026</h3>
          <p style={{ fontSize: 14, color: theme.textMuted, fontWeight: 600, marginTop: 4 }}>Academic Session 2025-26</p>
        </div>
        <div style={{ display: "flex", gap: 12 }}>
          <button style={{ width: 44, height: 44, borderRadius: 14, border: `1px solid ${theme.border}`, background: theme.cardBg, cursor: "pointer", color: theme.text }}>&larr;</button>
          <button style={{ width: 44, height: 44, borderRadius: 14, border: `1px solid ${theme.border}`, background: theme.cardBg, cursor: "pointer", color: theme.text }}>&rarr;</button>
        </div>
      </div>
      
      <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 16 }}>
        {weekDays.map(d => (
          <div key={d} style={{ textAlign: "center", fontSize: 12, fontWeight: 800, color: theme.textMuted, textTransform: "uppercase", letterSpacing: "0.05em", paddingBottom: 16 }}>{d}</div>
        ))}
        {/* Offset */}
        <div /><div /><div />
        {days.map(d => {
          const status = type === "attendance" ? data[d] : null;
          const event = type === "events" ? data[d] : null;
          
          return (
            <motion.div key={d} whileHover={{ y: -4 }}
              style={{ 
                height: 90, borderRadius: 20, border: `1px solid ${theme.border}`,
                background: type === "attendance" && status 
                  ? (status === "P" ? "#10b981" : status === "A" ? "#ef4444" : "#3B82F6")
                  : (theme.isDark ? "rgba(255,255,255,0.02)" : "#F8FAFC"), 
                display: "flex", flexDirection: "column",
                alignItems: "center", justifyContent: "center", gap: 8, transition: "0.2s"
              }}>
              <span style={{ 
                fontSize: 16, 
                fontWeight: 800, 
                color: type === "attendance" && status ? "#fff" : theme.text 
              }}>{d}</span>
              {type === "events" && event && (
                <div style={{ 
                  background: event.color, color: "white", fontSize: 10, fontWeight: 800,
                  padding: "4px 8px", borderRadius: 8, textAlign: "center", width: "85%",
                  overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap"
                }}>{event.label}</div>
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
