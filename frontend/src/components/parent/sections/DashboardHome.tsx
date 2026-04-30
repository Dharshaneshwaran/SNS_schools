"use client";

import { motion } from "framer-motion";
import { Users, Calendar, Clock, CheckCircle, ArrowUpRight, ArrowDownRight, DotsThreeOutlineVertical } from "@phosphor-icons/react";
import { DashboardTheme } from "../../../types/theme";

interface Props {
  theme: DashboardTheme;
}

const stats = [
  { label: "Attendance", value: "96.2%", change: "+1.2%", isUp: true, icon: Users, color: "#FF7F50" },
  { label: "Performance", value: "88.4%", change: "+4.5%", isUp: true, icon: CheckCircle, color: "#4f46e5" },
  { label: "Pending Tasks", value: "12", change: "-2", isUp: false, icon: Clock, color: "#ef4444" },
];

export default function DashboardHome({ theme }: Props) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
      {/* Stats Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24 }}>
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="premium-card"
              style={{ padding: "32px" }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
                <div style={{ 
                  width: 56, height: 56, borderRadius: 16, 
                  background: `${stat.color}15`, color: stat.color,
                  display: "flex", alignItems: "center", justifyContent: "center"
                }}>
                  <Icon size={28} weight="bold" />
                </div>
                <div style={{ 
                  display: "flex", alignItems: "center", gap: 4, 
                  padding: "6px 10px", borderRadius: 10,
                  background: stat.isUp ? theme.success + "15" : theme.danger + "15",
                  color: stat.isUp ? theme.success : theme.danger,
                  fontSize: 12, fontWeight: 700
                }}>
                  {stat.isUp ? <ArrowUpRight size={14} weight="bold" /> : <ArrowDownRight size={14} weight="bold" />}
                  {stat.change}
                </div>
              </div>
              <p style={{ color: theme.textMuted, fontWeight: 600, fontSize: 14, marginBottom: 8 }}>{stat.label}</p>
              <h3 style={{ fontSize: 32, fontWeight: 900, color: theme.text, letterSpacing: "-0.02em" }}>{stat.value}</h3>
            </motion.div>
          );
        })}
      </div>

      {/* Main Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "1.2fr 0.8fr", gap: 32 }}>
        {/* Schedule */}
        <div className="premium-card" style={{ padding: "32px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 32 }}>
            <h4 style={{ fontSize: 20, fontWeight: 800, color: theme.text }}>Today's Schedule</h4>
            <button style={{ color: theme.primary, fontSize: 13, fontWeight: 700, background: "none", border: "none", cursor: "pointer" }}>View All</button>
          </div>
          
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {[
              { time: "09:00 AM", subject: "Advanced Mathematics", class: "Grade 8-A", status: "active" },
              { time: "11:30 AM", subject: "Quantum Physics", class: "Grade 8-A", status: "upcoming" },
              { time: "02:00 PM", subject: "English Literature", class: "Grade 8-A", status: "upcoming" },
            ].map((item, i) => (
              <div key={i} style={{ 
                padding: "20px", borderRadius: 20, 
                background: item.status === "active" ? theme.primary + "10" : (theme.isDark ? "rgba(255,255,255,0.02)" : "#F8FAFC"),
                border: item.status === "active" ? `1px solid ${theme.primary}40` : `1px solid ${theme.border}`,
                display: "flex", alignItems: "center", gap: 24,
                transition: "0.2s"
              }}>
                <div style={{ fontSize: 13, fontWeight: 800, color: item.status === "active" ? theme.primary : theme.textMuted, minWidth: 80 }}>{item.time}</div>
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: 15, fontWeight: 800, color: theme.text }}>{item.subject}</p>
                  <p style={{ fontSize: 12, fontWeight: 600, color: theme.textMuted }}>{item.class}</p>
                </div>
                {item.status === "active" && <div style={{ width: 8, height: 8, borderRadius: "50%", background: theme.primary, boxShadow: `0 0 10px ${theme.primary}80` }} />}
              </div>
            ))}
          </div>
        </div>

        {/* Tasks */}
        <div className="premium-card" style={{ padding: "32px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 32 }}>
            <h4 style={{ fontSize: 20, fontWeight: 800, color: theme.text }}>Student Tasks</h4>
            <DotsThreeOutlineVertical size={20} weight="bold" style={{ color: theme.textMuted }} />
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            {[
              { title: "Math Worksheet #4", due: "Due Today, 5:00 PM", color: "#FF7F50" },
              { title: "Science Project Draft", due: "Due Tomorrow", color: "#4f46e5" },
              { title: "History Quiz Prep", due: "May 2, 10:00 AM", color: "#10b981" },
            ].map((task, i) => (
              <div key={i} style={{ display: "flex", gap: 16 }}>
                <div style={{ 
                  width: 24, height: 24, borderRadius: 8, 
                  border: `2px solid ${task.color}`, 
                  marginTop: 2, flexShrink: 0,
                  display: "flex", alignItems: "center", justifyContent: "center"
                }}>
                  {i === 0 && <CheckCircle size={14} weight="fill" style={{ color: task.color }} />}
                </div>
                <div>
                  <p style={{ fontSize: 14, fontWeight: 800, color: theme.text, marginBottom: 4 }}>{task.title}</p>
                  <p style={{ fontSize: 12, fontWeight: 600, color: theme.textMuted }}>{task.due}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
