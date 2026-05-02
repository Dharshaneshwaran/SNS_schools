"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  BookOpen, 
  Clock, 
  CalendarCheck, 
  Bell, 
  CalendarBlank,
  Filter,
  Funnel,
  CheckCircle,
  FileText,
  MapPin,
  CaretRight
} from "@phosphor-icons/react";

import { Student } from "../../../types/dashboard";
import { DashboardTheme } from "../../../types/theme";

type Tab = "homework" | "classtimetable" | "examtimetable" | "events" | "notifications";

const tabs: { key: Tab; label: string; icon: React.ReactNode }[] = [
  { key: "homework",       label: "Homework",        icon: <BookOpen size={16} /> },
  { key: "classtimetable", label: "Class Timetable", icon: <Clock size={16} /> },
  { key: "examtimetable",  label: "Exam Timetable",  icon: <CalendarCheck size={16} /> },
  { key: "events",         label: "Upcoming Events", icon: <CalendarBlank size={16} /> },
];

const hwData = [
  { subject: "Mathematics", task: "Complete Exercise 5.3 – Trigonometry", due: "Tomorrow" },
  { subject: "Science",     task: "Draw diagram of the human digestive system", due: "Apr 30" },
  { subject: "English",     task: "Write a 200-word essay on 'My School'", due: "May 1" },
  { subject: "Mathematics", task: "Solve Linear Equations worksheet", due: "May 5" },
  { subject: "Social",      task: "Map work: Identify major rivers in India", due: "May 3" },
];

const classTT = [
  { day: "Monday",    periods: ["Math", "Science", "English", "Hindi", "Social", "PT"] },
  { day: "Tuesday",   periods: ["English", "Math", "Science", "Art", "Hindi", "Library"] },
  { day: "Wednesday", periods: ["Science", "Social", "Math", "English", "PT", "Hindi"] },
  { day: "Thursday",  periods: ["Hindi", "Math", "Art", "Science", "English", "Social"] },
  { day: "Friday",    periods: ["Math", "English", "Science", "Social", "Hindi", "Music"] },
];

const examTT = [
  { subject: "Mathematics", date: "May 10, 2026", time: "9:00 AM", duration: "2.5 hrs", hall: "Hall A" },
  { subject: "Science",     date: "May 12, 2026", time: "9:00 AM", duration: "2 hrs", hall: "Hall B" },
  { subject: "English",     date: "May 14, 2026", time: "9:00 AM", duration: "2 hrs", hall: "Hall A" },
  { subject: "Social",      date: "May 16, 2026", time: "9:00 AM", duration: "2 hrs", hall: "Hall C" },
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

export default function DiarySection({ student, theme, showOnlyNotifications = false }: { student: Student; theme: DashboardTheme; showOnlyNotifications?: boolean }) {
  const [activeTab, setActiveTab] = useState<Tab>(showOnlyNotifications ? "notifications" : "homework");
  const [hwFilter, setHwFilter] = useState<string>("All");

  const subjects = ["All", ...Array.from(new Set(hwData.map(h => h.subject)))];
  const filteredHw = hwFilter === "All" ? hwData : hwData.filter(h => h.subject === hwFilter);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
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
      <AnimatePresence mode="wait">
        <motion.div key={activeTab} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.3 }}>
          
          {activeTab === "homework" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
              {/* Filter Pills */}
              <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, color: theme.textMuted, marginRight: 8 }}>
                  <Funnel size={18} weight="bold" />
                  <span style={{ fontSize: 12, fontWeight: 800, textTransform: "uppercase" }}>Filter:</span>
                </div>
                {subjects.map(sub => (
                  <button 
                    key={sub}
                    onClick={() => setHwFilter(sub)}
                    style={{
                      padding: "8px 16px",
                      borderRadius: 100,
                      border: `1px solid ${hwFilter === sub ? theme.primary : theme.border}`,
                      background: hwFilter === sub ? theme.primary + "10" : "transparent",
                      color: hwFilter === sub ? theme.primary : theme.textMuted,
                      fontSize: 13,
                      fontWeight: 700,
                      cursor: "pointer",
                      transition: "all 0.2s"
                    }}
                  >
                    {sub}
                  </button>
                ))}
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                {filteredHw.map((hw, i) => (
                  <motion.div
                    key={i}
                    layout
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="premium-card"
                    style={{
                      padding: "16px 24px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <div>
                      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                        <span style={{ fontSize: 10, fontWeight: 800, color: theme.primary, textTransform: "uppercase", letterSpacing: "0.1em", background: theme.primary + "10", padding: "3px 8px", borderRadius: 6 }}>{hw.subject}</span>
                      </div>
                      <p style={{ fontSize: 16, fontWeight: 800, color: theme.text, marginBottom: 4 }}>{hw.task}</p>
                      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 6, color: theme.textMuted, fontSize: 13, fontWeight: 600 }}>
                          <CalendarBlank size={16} weight="bold" />
                          Due: {hw.due}
                        </div>
                      </div>
                    </div>
                    <motion.button 
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      style={{
                        padding: "10px 20px",
                        borderRadius: 12,
                        background: theme.text,
                        color: theme.bg,
                        border: "none",
                        fontSize: 13,
                        fontWeight: 700,
                        cursor: "pointer"
                      }}
                    >
                      View Details
                    </motion.button>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "classtimetable" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 24 }}>
                {classTT.map((day, di) => (
                  <div key={day.day} className="premium-card" style={{ padding: 0, overflow: "hidden" }}>
                    <div style={{ padding: "16px 24px", background: theme.primary + "10", borderBottom: `1px solid ${theme.border}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <h5 style={{ fontWeight: 800, color: theme.primary, fontSize: 16 }}>{day.day}</h5>
                      <Clock size={18} weight="bold" color={theme.primary} />
                    </div>
                    <div style={{ padding: "12px" }}>
                      {day.periods.map((p, pi) => (
                        <div key={pi} style={{ 
                          padding: "12px 16px", 
                          display: "flex", 
                          alignItems: "center", 
                          justifyContent: "space-between",
                          borderBottom: pi < day.periods.length - 1 ? `1px solid ${theme.border}` : "none"
                        }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                            <span style={{ fontSize: 11, fontWeight: 800, color: theme.textMuted, width: 24 }}>P{pi+1}</span>
                            <span style={{ fontSize: 14, fontWeight: 700, color: theme.text }}>{p}</span>
                          </div>
                          <CaretRight size={14} color={theme.textMuted} />
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "examtimetable" && (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 24 }}>
              {examTT.map((e, i) => (
                <motion.div
                  key={i}
                  className="premium-card"
                  style={{
                    padding: "24px",
                    display: "flex",
                    flexDirection: "column",
                    gap: 16,
                    border: `1px solid ${theme.border}`,
                    position: "relative"
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                    <div style={{ 
                      width: 44, height: 44, borderRadius: 14, 
                      background: "linear-gradient(135deg, #FF7F50, #e66a3e)", 
                      color: "white", display: "flex", alignItems: "center", justifyContent: "center", 
                      fontSize: 13, fontWeight: 900, flexShrink: 0, 
                      boxShadow: "0 6px 12px rgba(255,127,80,0.2)",
                    }}>
                      {e.subject.slice(0,1)}
                    </div>
                    <div style={{ background: theme.isDark ? "rgba(255,255,255,0.05)" : "#F1F5F9", padding: "4px 10px", borderRadius: 8, fontSize: 10, fontWeight: 800, color: theme.textMuted, textTransform: "uppercase" }}>
                      Box No: {100 + i}
                    </div>
                  </div>
                  
                  <div>
                    <h4 style={{ fontWeight: 900, fontSize: 20, color: theme.text, marginBottom: 6, letterSpacing: "-0.02em" }}>{e.subject}</h4>
                    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 10, color: theme.textMuted, fontSize: 14, fontWeight: 600 }}>
                        <CalendarBlank size={18} weight="bold" color={theme.primary} />
                        <span>{e.date}</span>
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: 10, color: theme.textMuted, fontSize: 14, fontWeight: 600 }}>
                        <Clock size={18} weight="bold" color={theme.primary} />
                        <span>{e.time} ({e.duration})</span>
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: 10, color: theme.textMuted, fontSize: 14, fontWeight: 600 }}>
                        <MapPin size={18} weight="bold" color={theme.primary} />
                        <span>Location: {e.hall}</span>
                      </div>
                    </div>
                  </div>

                  <div style={{ 
                    marginTop: 8, 
                    paddingTop: 20, 
                    borderTop: `1px solid ${theme.border}`,
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center"
                  }}>
                    <span style={{ fontSize: 12, fontWeight: 800, color: theme.primary, textTransform: "uppercase" }}>Instructions</span>
                    <CaretRight size={16} weight="bold" color={theme.primary} />
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
                    padding: "16px 24px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                    <div style={{ width: 44, height: 44, borderRadius: 14, background: "rgba(255,127,80,0.08)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <CalendarBlank size={24} color="#FF7F50" weight="bold" />
                    </div>
                    <div>
                      <p style={{ fontWeight: 800, fontSize: 16, color: theme.text }}>{ev.name}</p>
                      <p style={{ fontSize: 13, color: theme.textMuted, fontWeight: 600, marginTop: 2 }}>{ev.date}</p>
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
                    padding: "24px",
                    display: "flex",
                    alignItems: "flex-start",
                    gap: 16,
                  }}
                >
                  <div style={{ 
                    width: 44, height: 44, borderRadius: 14, 
                    background: n.type === "alert" ? "#fef2f2" : "rgba(255,127,80,0.08)", 
                    display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                  }}>
                    <Bell size={24} color={n.type === "alert" ? "#ef4444" : "#FF7F50"} weight="bold" />
                  </div>
                  <div style={{ flex: 1 }}>
                    <p style={{ fontSize: 16, fontWeight: 700, color: theme.text, lineHeight: 1.4 }}>{n.msg}</p>
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
      </AnimatePresence>
    </div>
  );
}
