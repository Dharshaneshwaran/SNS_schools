"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { BookOpen, Clock, CalendarCheck, Bell, CalendarBlank } from "@phosphor-icons/react";

type Student = { id: number; name: string; class: string; section: string; avatar: string };
type Tab = "homework" | "classtimetable" | "examtimetable" | "events" | "notifications";

const tabs: { key: Tab; label: string; icon: React.ReactNode }[] = [
  { key: "homework",       label: "Homework",        icon: <BookOpen size={16} /> },
  { key: "classtimetable", label: "Class Timetable", icon: <Clock size={16} /> },
  { key: "examtimetable",  label: "Exam Timetable",  icon: <CalendarCheck size={16} /> },
  { key: "events",         label: "Upcoming Events", icon: <CalendarBlank size={16} /> },
  { key: "notifications",  label: "Notifications",   icon: <Bell size={16} /> },
];

const hwData = [
  { subject: "Mathematics", task: "Complete Exercise 5.3 – Trigonometry", due: "Tomorrow", status: "Pending" },
  { subject: "Science",     task: "Draw diagram of the human digestive system", due: "Apr 30", status: "Pending" },
  { subject: "English",     task: "Write a 200-word essay on 'My School'", due: "May 1",  status: "Submitted" },
];

const classTT = [
  { day: "Monday",    periods: ["Math", "Science", "English", "Hindi", "Social", "PT"] },
  { day: "Tuesday",   periods: ["English", "Math", "Science", "Art", "Hindi", "Library"] },
  { day: "Wednesday", periods: ["Science", "Social", "Math", "English", "PT", "Hindi"] },
  { day: "Thursday",  periods: ["Hindi", "Math", "Art", "Science", "English", "Social"] },
  { day: "Friday",    periods: ["Math", "English", "Science", "Social", "Hindi", "Music"] },
];

const examTT = [
  { subject: "Mathematics", date: "May 10, 2026", time: "9:00 AM", duration: "2.5 hrs" },
  { subject: "Science",     date: "May 12, 2026", time: "9:00 AM", duration: "2 hrs" },
  { subject: "English",     date: "May 14, 2026", time: "9:00 AM", duration: "2 hrs" },
  { subject: "Social",      date: "May 16, 2026", time: "9:00 AM", duration: "2 hrs" },
];

const upcomingEvents = [
  { name: "Unit Test – Math", date: "Apr 30", type: "Exam" },
  { name: "Sports Day Practice", date: "May 2", type: "Activity" },
  { name: "Holiday – Labour Day", date: "May 1", type: "Holiday" },
];

const notifications = [
  { msg: "Fee due date extended to May 15", time: "2 hrs ago", type: "info" },
  { msg: "Parent-Teacher meeting on May 5 at 10 AM", time: "1 day ago", type: "alert" },
  { msg: "Science project submission reminder", time: "2 days ago", type: "reminder" },
];

import { DashboardTheme } from "../../../types/theme";

export default function DiarySection({ student, theme }: { student: Student; theme: DashboardTheme }) {
  const [activeTab, setActiveTab] = useState<Tab>("homework");

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
          <BookOpen size={26} weight="duotone" color="#FF7F50" />
          <h1 style={{ fontFamily: "var(--font-poppins,'Poppins',sans-serif)", fontSize: 24, fontWeight: 700, color: theme.text }}>Diary</h1>
        </div>
        <p style={{ color: theme.textMuted, fontSize: 14 }}>Homework, timetables & notifications for {student.name}</p>
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 24 }}>
        {tabs.map((tab) => {
          const isActive = activeTab === tab.key;
          return (
            <button key={tab.key} onClick={() => setActiveTab(tab.key)}
              style={{
                display: "flex", alignItems: "center", gap: 7,
                padding: "9px 16px", borderRadius: 10, cursor: "pointer",
                fontFamily: "var(--font-inter,'Inter',sans-serif)",
                fontSize: 13, fontWeight: isActive ? 600 : 500,
                background: isActive ? "#FF7F50" : theme.cardBg,
                color: isActive ? "white" : theme.textMuted,
                boxShadow: isActive ? "0 4px 12px rgba(255,127,80,0.3)" : theme.isDark ? "none" : "0 1px 6px rgba(0,0,0,0.06)",
                border: isActive ? "none" : `1px solid ${theme.border}`,
                transition: "all 0.2s",
              }}>
              {tab.icon} {tab.label}
            </button>
          );
        })}
      </div>

      {/* Content */}
      <motion.div key={activeTab} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
        {activeTab === "homework" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {hwData.map((hw, i) => (
              <div key={i} style={{ background: theme.cardBg, borderRadius: 14, padding: "18px 20px", boxShadow: theme.isDark ? "none" : "0 2px 12px rgba(0,0,0,0.06)", border: `1px solid ${theme.border}`, display: "flex", alignItems: "center", justifyContent: "space-between", transition: "all 0.3s ease" }}>
                <div>
                  <span style={{ fontSize: 11, fontWeight: 700, color: "#FF7F50", textTransform: "uppercase", letterSpacing: "0.05em" }}>{hw.subject}</span>
                  <p style={{ fontSize: 14, fontWeight: 600, color: theme.text, margin: "4px 0" }}>{hw.task}</p>
                  <p style={{ fontSize: 12, color: theme.textMuted }}>Due: {hw.due}</p>
                </div>
                <span style={{ padding: "5px 14px", borderRadius: 20, fontSize: 12, fontWeight: 600, background: hw.status === "Submitted" ? "rgba(16,185,129,0.1)" : "rgba(255,127,80,0.1)", color: hw.status === "Submitted" ? "#059669" : "#FF7F50" }}>{hw.status}</span>
              </div>
            ))}
          </div>
        )}

        {activeTab === "classtimetable" && (
          <div style={{ background: theme.cardBg, borderRadius: 16, overflow: "hidden", boxShadow: theme.isDark ? "none" : "0 4px 20px rgba(0,0,0,0.07)", border: `1px solid ${theme.border}`, transition: "all 0.3s ease" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ background: "linear-gradient(90deg,#FF7F50,#e66a3e)" }}>
                  <th style={{ padding: "14px 16px", textAlign: "left", color: "white", fontSize: 13, fontWeight: 600 }}>Day</th>
                  {["P1","P2","P3","P4","P5","P6"].map(p => <th key={p} style={{ padding: "14px 12px", textAlign: "center", color: "rgba(255,255,255,0.8)", fontSize: 12, fontWeight: 500 }}>{p}</th>)}
                </tr>
              </thead>
              <tbody>
                {classTT.map((row, i) => (
                  <tr key={i} style={{ borderBottom: `1px solid ${theme.border}`, background: i % 2 === 0 ? theme.isDark ? "rgba(255,255,255,0.02)" : "#fafafa" : "transparent" }}>
                    <td style={{ padding: "12px 16px", fontSize: 13, fontWeight: 600, color: theme.text }}>{row.day}</td>
                    {row.periods.map((p, j) => <td key={j} style={{ padding: "12px", textAlign: "center", fontSize: 12, color: theme.textMuted }}>{p}</td>)}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === "examtimetable" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {examTT.map((e, i) => (
              <div key={i} style={{ background: theme.cardBg, borderRadius: 14, padding: "18px 20px", boxShadow: theme.isDark ? "none" : "0 2px 12px rgba(0,0,0,0.06)", border: `1px solid ${theme.border}`, display: "flex", alignItems: "center", gap: 16, transition: "all 0.3s ease" }}>
                <div style={{ width: 48, height: 48, borderRadius: 12, background: "linear-gradient(135deg,#FF7F50,#e66a3e)", color: "white", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, textAlign: "center", flexShrink: 0, lineHeight: 1.2 }}>{e.subject.slice(0,3)}</div>
                <div style={{ flex: 1 }}>
                  <p style={{ fontWeight: 700, fontSize: 15, color: theme.text, fontFamily: "var(--font-poppins,'Poppins',sans-serif)" }}>{e.subject}</p>
                  <p style={{ fontSize: 13, color: theme.textMuted, marginTop: 2 }}>{e.date} · {e.time} · {e.duration}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === "events" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {upcomingEvents.map((ev, i) => (
              <div key={i} style={{ background: theme.cardBg, borderRadius: 14, padding: "16px 20px", boxShadow: theme.isDark ? "none" : "0 2px 12px rgba(0,0,0,0.06)", border: `1px solid ${theme.border}`, display: "flex", alignItems: "center", justifyContent: "space-between", transition: "all 0.3s ease" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <CalendarBlank size={20} color="#FF7F50" weight="duotone" />
                  <div>
                    <p style={{ fontWeight: 600, fontSize: 14, color: theme.text }}>{ev.name}</p>
                    <p style={{ fontSize: 12, color: theme.textMuted, marginTop: 2 }}>{ev.date}</p>
                  </div>
                </div>
                <span style={{ padding: "4px 12px", borderRadius: 20, fontSize: 12, fontWeight: 600, background: "rgba(255,127,80,0.1)", color: "#FF7F50" }}>{ev.type}</span>
              </div>
            ))}
          </div>
        )}

        {activeTab === "notifications" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {notifications.map((n, i) => (
              <div key={i} style={{ background: theme.cardBg, borderRadius: 14, padding: "16px 20px", boxShadow: theme.isDark ? "none" : "0 2px 12px rgba(0,0,0,0.06)", border: `1px solid ${theme.border}`, display: "flex", alignItems: "flex-start", gap: 14, transition: "all 0.3s ease" }}>
                <div style={{ width: 36, height: 36, borderRadius: 10, background: "rgba(255,127,80,0.1)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <Bell size={18} color="#FF7F50" weight="duotone" />
                </div>
                <div>
                  <p style={{ fontSize: 14, fontWeight: 500, color: theme.text }}>{n.msg}</p>
                  <p style={{ fontSize: 12, color: theme.textMuted, marginTop: 4 }}>{n.time}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
}
