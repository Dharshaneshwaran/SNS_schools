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

export default function DiarySection({ student, theme, showOnlyNotifications = false }: { student: Student; theme: DashboardTheme; showOnlyNotifications?: boolean }) {
  const [activeTab, setActiveTab] = useState<Tab>(showOnlyNotifications ? "notifications" : "homework");

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
      {/* Tabs */}
      {!showOnlyNotifications && (
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
      )}

      {/* Content */}
      <motion.div key={activeTab} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
        {activeTab === "homework" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            {hwData.map((hw, i) => (
              <motion.div
                key={i}
                className="premium-card"
                style={{
                  padding: "24px 32px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                    <div style={{ width: 10, height: 10, borderRadius: "50%", background: hw.status === "Submitted" ? "#10b981" : "#FF7F50" }} />
                    <span style={{ fontSize: 12, fontWeight: 800, color: theme.textMuted, textTransform: "uppercase", letterSpacing: "0.05em" }}>{hw.subject}</span>
                  </div>
                  <p style={{ fontSize: 18, fontWeight: 800, color: theme.text, marginBottom: 6 }}>{hw.task}</p>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, color: theme.textMuted, fontSize: 14, fontWeight: 600 }}>
                    <CalendarBlank size={16} />
                    Due: {hw.due}
                  </div>
                </div>
                <div style={{
                  padding: "10px 20px",
                  borderRadius: 14,
                  fontSize: 13,
                  fontWeight: 800,
                  background: hw.status === "Submitted" ? "rgba(16,185,129,0.08)" : "rgba(255,127,80,0.08)",
                  color: hw.status === "Submitted" ? "#10b981" : "#FF7F50",
                }}>
                  {hw.status}
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {activeTab === "classtimetable" && (
          <div className="premium-card" style={{ overflow: "hidden" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ background: theme.isDark ? "rgba(255,255,255,0.02)" : "#F8FAFC" }}>
                  <th style={{ padding: "20px 24px", textAlign: "left", color: theme.textMuted, fontSize: 12, fontWeight: 800, textTransform: "uppercase" }}>DAY</th>
                  {["P1","P2","P3","P4","P5","P6"].map(p => (
                    <th key={p} style={{ padding: "20px 12px", textAlign: "center", color: theme.textMuted, fontSize: 12, fontWeight: 800 }}>{p}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {classTT.map((row, i) => (
                  <tr key={i} style={{ borderBottom: `1px solid ${theme.border}` }}>
                    <td style={{ padding: "20px 24px", fontSize: 15, fontWeight: 800, color: theme.text }}>{row.day}</td>
                    {row.periods.map((p, j) => (
                      <td key={j} style={{ padding: "20px 12px", textAlign: "center" }}>
                        <span style={{ 
                          fontSize: 13, 
                          fontWeight: 700, 
                          color: theme.text,
                          padding: "6px 12px",
                          borderRadius: 10,
                          background: theme.isDark ? "rgba(255,255,255,0.05)" : "#F1F5F9"
                        }}>{p}</span>
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === "examtimetable" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            {examTT.map((e, i) => (
              <motion.div
                key={i}
                className="premium-card"
                style={{
                  padding: "24px 32px",
                  display: "flex",
                  alignItems: "center",
                  gap: 24,
                }}
              >
                <div style={{ 
                  width: 64, height: 64, borderRadius: 18, 
                  background: "linear-gradient(135deg, #FF7F50, #e66a3e)", 
                  color: "white", display: "flex", alignItems: "center", justifyContent: "center", 
                  fontSize: 14, fontWeight: 900, textAlign: "center", flexShrink: 0, 
                  boxShadow: "0 10px 20px rgba(255,127,80,0.25)",
                }}>{e.subject.slice(0,3).toUpperCase()}</div>
                <div style={{ flex: 1 }}>
                  <p style={{ fontWeight: 900, fontSize: 20, color: theme.text, letterSpacing: "-0.01em" }}>{e.subject}</p>
                  <div style={{ display: "flex", alignItems: "center", gap: 20, marginTop: 6 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 6, color: theme.textMuted, fontSize: 14, fontWeight: 600 }}>
                      <CalendarBlank size={16} /> {e.date}
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 6, color: theme.textMuted, fontSize: 14, fontWeight: 600 }}>
                      <Clock size={16} /> {e.time}
                    </div>
                  </div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <p style={{ fontSize: 12, fontWeight: 800, color: "#FF7F50", textTransform: "uppercase", marginBottom: 4 }}>Duration</p>
                  <p style={{ fontSize: 16, fontWeight: 700, color: theme.text }}>{e.duration}</p>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {activeTab === "events" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            {upcomingEvents.map((ev, i) => (
              <motion.div
                key={i}
                className="premium-card"
                style={{
                  padding: "24px 32px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
                  <div style={{ width: 52, height: 52, borderRadius: 16, background: "rgba(255,127,80,0.08)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <CalendarBlank size={28} color="#FF7F50" weight="bold" />
                  </div>
                  <div>
                    <p style={{ fontWeight: 800, fontSize: 18, color: theme.text }}>{ev.name}</p>
                    <p style={{ fontSize: 14, color: theme.textMuted, fontWeight: 600, marginTop: 4 }}>{ev.date}</p>
                  </div>
                </div>
                <span style={{ 
                  padding: "8px 16px", borderRadius: 12, fontSize: 13, fontWeight: 800, 
                  background: theme.isDark ? "rgba(255,255,255,0.05)" : "#F1F5F9",
                  color: "#FF7F50",
                }}>{ev.type}</span>
              </motion.div>
            ))}
          </div>
        )}

        {activeTab === "notifications" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            {notifications.map((n, i) => (
              <motion.div
                key={i}
                className="premium-card"
                style={{
                  padding: "32px",
                  display: "flex",
                  alignItems: "flex-start",
                  gap: 24,
                }}
              >
                <div style={{ 
                  width: 56, height: 56, borderRadius: 16, 
                  background: n.type === "alert" ? "#fef2f2" : "rgba(255,127,80,0.08)", 
                  display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                }}>
                  <Bell size={28} color={n.type === "alert" ? "#ef4444" : "#FF7F50"} weight="bold" />
                </div>
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: 18, fontWeight: 700, color: theme.text, lineHeight: 1.5 }}>{n.msg}</p>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 12 }}>
                    <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#FF7F50" }} />
                    <p style={{ fontSize: 13, fontWeight: 700, color: theme.textMuted, textTransform: "uppercase", letterSpacing: "0.05em" }}>{n.time}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
}
