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

import { DashboardTheme } from "../../../types/theme";

export default function AcademicSection({ student, theme }: { student: Student; theme: DashboardTheme }) {
  const [activeTab, setActiveTab] = useState<Tab>("attendance");
  const [leaveFrom, setLeaveFrom] = useState("");
  const [leaveTo, setLeaveTo] = useState("");
  const [leaveReason, setLeaveReason] = useState("");
  const [leaveSubmitted, setLeaveSubmitted] = useState(false);

  const attended = 82, total = 90;
  const pct = Math.round((attended / total) * 100);

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
          <ChartBar size={26} weight="duotone" color="#FF7F50" />
          <h1 style={{ fontFamily: "var(--font-poppins,'Poppins',sans-serif)", fontSize: 24, fontWeight: 700, color: theme.text }}>Academic</h1>
        </div>
        <p style={{ color: theme.textMuted, fontSize: 14 }}>Reports, attendance and schedules for {student.name}</p>
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 24 }}>
        {tabs.map((tab) => {
          const isActive = activeTab === tab.key;
          return (
            <button key={tab.key} onClick={() => setActiveTab(tab.key)}
              style={{
                display: "flex", alignItems: "center", gap: 6,
                padding: "9px 16px", borderRadius: 10, cursor: "pointer",
                fontSize: 13, fontWeight: isActive ? 600 : 500,
                background: isActive ? "#FF7F50" : theme.cardBg,
                color: isActive ? "white" : theme.textMuted,
                boxShadow: isActive ? "0 4px 12px rgba(255,127,80,0.3)" : theme.isDark ? "none" : "0 1px 6px rgba(0,0,0,0.06)",
                border: isActive ? "none" : `1px solid ${theme.border}`,
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
          <div>
            {/* Stat cards */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16, marginBottom: 24 }}>
              {[
                { label: "Days Present", value: attended, color: "#10B981" },
                { label: "Days Absent",  value: total - attended, color: "#EF4444" },
                { label: "Attendance %", value: `${pct}%`, color: pct >= 75 ? "#10B981" : "#F59E0B" },
              ].map((s, i) => (
                <div key={i} style={{ background: theme.cardBg, borderRadius: 14, padding: "20px", boxShadow: theme.isDark ? "none" : "0 2px 12px rgba(0,0,0,0.06)", border: `1px solid ${theme.border}`, textAlign: "center", transition: "all 0.3s ease" }}>
                  <p style={{ fontSize: 28, fontWeight: 700, color: s.color, fontFamily: "var(--font-poppins,'Poppins',sans-serif)" }}>{s.value}</p>
                  <p style={{ fontSize: 13, color: theme.textMuted, marginTop: 4 }}>{s.label}</p>
                </div>
              ))}
            </div>
            {/* Progress bar */}
            <div style={{ background: theme.cardBg, borderRadius: 14, padding: "20px 24px", boxShadow: theme.isDark ? "none" : "0 2px 12px rgba(0,0,0,0.06)", border: `1px solid ${theme.border}`, transition: "all 0.3s ease" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
                <span style={{ fontSize: 14, fontWeight: 600, color: theme.text }}>Overall Attendance</span>
                <span style={{ fontSize: 14, fontWeight: 700, color: pct >= 75 ? "#10B981" : "#F59E0B" }}>{pct}%</span>
              </div>
              <div style={{ height: 10, borderRadius: 10, background: theme.isDark ? "rgba(255,255,255,0.05)" : "#f0f0f0", overflow: "hidden" }}>
                <motion.div
                  initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ duration: 1, ease: "easeOut" }}
                  style={{ height: "100%", borderRadius: 10, background: pct >= 75 ? "linear-gradient(90deg,#10B981,#059669)" : "linear-gradient(90deg,#F59E0B,#d97706)" }}
                />
              </div>
              <p style={{ fontSize: 12, color: theme.textMuted, marginTop: 8 }}>Minimum required: 75%</p>
            </div>
          </div>
        )}

        {activeTab === "exam" && (
          <div style={{ background: theme.cardBg, borderRadius: 16, overflow: "hidden", boxShadow: theme.isDark ? "none" : "0 4px 20px rgba(0,0,0,0.07)", border: `1px solid ${theme.border}`, transition: "all 0.3s ease" }}>
            <div style={{ padding: "18px 20px", borderBottom: `1px solid ${theme.border}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <p style={{ fontFamily: "var(--font-poppins,'Poppins',sans-serif)", fontWeight: 700, fontSize: 15, color: theme.text }}>Term 2 Exam Report</p>
              <span style={{ fontSize: 13, color: theme.textMuted }}>Total: {subjects.reduce((a, s) => a + s.marks, 0)}/{subjects.reduce((a, s) => a + s.max, 0)}</span>
            </div>
            {subjects.map((s, i) => (
              <div key={i} style={{ padding: "16px 20px", borderBottom: `1px solid ${theme.border}`, display: "flex", alignItems: "center", gap: 16 }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                    <span style={{ fontSize: 14, fontWeight: 600, color: theme.text }}>{s.name}</span>
                    <span style={{ fontSize: 14, fontWeight: 700, color: "#FF7F50" }}>{s.marks}/{s.max}</span>
                  </div>
                  <div style={{ height: 6, borderRadius: 10, background: theme.isDark ? "rgba(255,255,255,0.05)" : "#f0f0f0", overflow: "hidden" }}>
                    <motion.div
                      initial={{ width: 0 }} animate={{ width: `${(s.marks / s.max) * 100}%` }} transition={{ delay: i * 0.1, duration: 0.8, ease: "easeOut" }}
                      style={{ height: "100%", borderRadius: 10, background: "linear-gradient(90deg,#FF7F50,#e66a3e)" }}
                    />
                  </div>
                </div>
                <span style={{ padding: "4px 12px", borderRadius: 20, fontSize: 13, fontWeight: 700, background: "rgba(255,127,80,0.1)", color: "#FF7F50", minWidth: 40, textAlign: "center" }}>{s.grade}</span>
              </div>
            ))}
          </div>
        )}

        {activeTab === "calendar" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {calendarEvents.map((m, i) => (
              <div key={i} style={{ background: theme.cardBg, borderRadius: 14, padding: "20px", boxShadow: theme.isDark ? "none" : "0 2px 12px rgba(0,0,0,0.06)", border: `1px solid ${theme.border}`, transition: "all 0.3s ease" }}>
                <p style={{ fontFamily: "var(--font-poppins,'Poppins',sans-serif)", fontWeight: 700, color: "#FF7F50", fontSize: 15, marginBottom: 12 }}>{m.month}</p>
                {m.events.map((ev, j) => (
                  <div key={j} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 0", borderBottom: j < m.events.length - 1 ? `1px solid ${theme.border}` : "none" }}>
                    <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#FF7F50", flexShrink: 0 }} />
                    <p style={{ fontSize: 14, color: theme.text }}>{ev}</p>
                  </div>
                ))}
              </div>
            ))}
          </div>
        )}

        {activeTab === "schedule" && (
          <div style={{ background: theme.cardBg, borderRadius: 16, overflow: "hidden", boxShadow: theme.isDark ? "none" : "0 4px 20px rgba(0,0,0,0.07)", border: `1px solid ${theme.border}`, transition: "all 0.3s ease" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ background: "linear-gradient(90deg,#FF7F50,#e66a3e)" }}>
                  {["Subject","Date","Hall","Seat"].map(h => <th key={h} style={{ padding: "14px 16px", textAlign: "left", color: "white", fontSize: 13, fontWeight: 600 }}>{h}</th>)}
                </tr>
              </thead>
              <tbody>
                {examSchedule.map((e, i) => (
                  <tr key={i} style={{ borderBottom: `1px solid ${theme.border}`, background: i % 2 === 0 ? theme.isDark ? "rgba(255,255,255,0.02)" : "#fafafa" : "transparent" }}>
                    <td style={{ padding: "13px 16px", fontSize: 14, fontWeight: 600, color: theme.text }}>{e.subject}</td>
                    <td style={{ padding: "13px 16px", fontSize: 13, color: theme.textMuted }}>{e.date}</td>
                    <td style={{ padding: "13px 16px", fontSize: 13, color: theme.textMuted }}>{e.hall}</td>
                    <td style={{ padding: "13px 16px", fontSize: 13, color: theme.textMuted }}>{e.seat}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === "leave" && (
          <div style={{ background: theme.cardBg, borderRadius: 16, padding: "28px", boxShadow: theme.isDark ? "none" : "0 4px 20px rgba(0,0,0,0.07)", border: `1px solid ${theme.border}`, maxWidth: 540, transition: "all 0.3s ease" }}>
            <p style={{ fontFamily: "var(--font-poppins,'Poppins',sans-serif)", fontWeight: 700, fontSize: 16, color: theme.text, marginBottom: 20 }}>Apply for Leave</p>
            {leaveSubmitted ? (
              <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                style={{ textAlign: "center", padding: "40px 20px" }}>
                <div style={{ fontSize: 48, marginBottom: 12 }}>✅</div>
                <p style={{ fontWeight: 700, fontSize: 16, color: "#10B981" }}>Leave Application Submitted!</p>
                <p style={{ color: theme.textMuted, fontSize: 13, marginTop: 6 }}>The school will review and respond within 24 hours.</p>
                <button onClick={() => { setLeaveSubmitted(false); setLeaveFrom(""); setLeaveTo(""); setLeaveReason(""); }}
                  style={{ marginTop: 20, padding: "10px 24px", borderRadius: 10, background: "#FF7F50", color: "white", border: "none", cursor: "pointer", fontWeight: 600 }}>
                  Apply Again
                </button>
              </motion.div>
            ) : (
              <form onSubmit={(e) => { e.preventDefault(); setLeaveSubmitted(true); }}>
                {[
                  { label: "From Date", value: leaveFrom, setter: setLeaveFrom, type: "date" },
                  { label: "To Date",   value: leaveTo,   setter: setLeaveTo,   type: "date" },
                ].map((field, i) => (
                  <div key={i} style={{ marginBottom: 16 }}>
                    <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: theme.textMuted, marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.04em" }}>{field.label}</label>
                    <input type={field.type} value={field.value} onChange={(e) => field.setter(e.target.value)} required
                      style={{ width: "100%", padding: "12px 14px", borderRadius: 10, border: `1px solid ${theme.border}`, fontSize: 14, outline: "none", fontFamily: "var(--font-inter,'Inter',sans-serif)", color: theme.text, background: theme.isDark ? "rgba(255,255,255,0.03)" : "#fafafa" }} />
                  </div>
                ))}
                <div style={{ marginBottom: 20 }}>
                  <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: theme.textMuted, marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.04em" }}>Reason</label>
                  <textarea value={leaveReason} onChange={(e) => setLeaveReason(e.target.value)} required rows={4}
                    placeholder="Please describe the reason for leave..."
                    style={{ width: "100%", padding: "12px 14px", borderRadius: 10, border: `1px solid ${theme.border}`, fontSize: 14, outline: "none", resize: "vertical", fontFamily: "var(--font-inter,'Inter',sans-serif)", color: theme.text, background: theme.isDark ? "rgba(255,255,255,0.03)" : "#fafafa" }} />
                </div>
                <button type="submit"
                  style={{ width: "100%", padding: "14px", borderRadius: 12, background: "linear-gradient(90deg,#FF7F50,#e66a3e)", color: "white", border: "none", cursor: "pointer", fontWeight: 600, fontSize: 15, display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
                  <PaperPlaneTilt size={18} weight="bold" /> Submit Application
                </button>
              </form>
            )}
          </div>
        )}
      </motion.div>
    </div>
  );
}
