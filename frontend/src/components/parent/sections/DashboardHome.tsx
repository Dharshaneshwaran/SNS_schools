"use client";

import { motion } from "framer-motion";
import { 
  Users, 
  CalendarCheck, 
  ChartBar, 
  ArrowRight, 
  PaperPlaneTilt,
  Info
} from "@phosphor-icons/react";
import { DashboardTheme } from "../../../types/theme";
import { AcademicTab } from "../../../types/dashboard";

interface Props {
  theme: DashboardTheme;
  onNavigate: (tab: AcademicTab) => void;
}

export default function DashboardHome({ theme, onNavigate }: Props) {
  const actions = [
    { 
      label: "Attendance", 
      value: "96.2%", 
      sub: "Month of April",
      icon: Users, 
      color: "#FF7F50",
      tab: "attendance" as AcademicTab
    },
    { 
      label: "Exam Reports", 
      value: "A Grade", 
      sub: "Term 1 Result",
      icon: ChartBar, 
      color: "#4f46e5",
      tab: "exam" as AcademicTab
    },
    { 
      label: "Leave Application", 
      value: "Apply Now", 
      sub: "Quick Request",
      icon: PaperPlaneTilt, 
      color: "#10b981",
      tab: "leave" as AcademicTab
    },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 40 }}>
      {/* Primary Action Buttons */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24 }}>
        {actions.map((action, i) => {
          const Icon = action.icon;
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ y: -5, boxShadow: "0 20px 40px rgba(0,0,0,0.08)" }}
              onClick={() => onNavigate(action.tab)}
              className="premium-card"
              style={{ 
                padding: "24px", 
                cursor: "pointer",
                position: "relative",
                overflow: "hidden"
              }}
            >
              <div style={{ 
                position: "absolute", 
                top: -20, 
                right: -20, 
                width: 100, 
                height: 100, 
                background: `${action.color}08`, 
                borderRadius: "50%" 
              }} />
              
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
                <div style={{ 
                  width: 52, height: 52, borderRadius: 16, 
                  background: `${action.color}15`, color: action.color,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  boxShadow: `0 6px 12px ${action.color}10`
                }}>
                  <Icon size={28} weight="bold" />
                </div>
                <div style={{ 
                  width: 32, height: 32, borderRadius: "50%", 
                  background: theme.isDark ? "rgba(255,255,255,0.03)" : "#F8FAFC",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  color: theme.textMuted
                }}>
                  <ArrowRight size={16} weight="bold" />
                </div>
              </div>
              
              <div>
                <p style={{ color: theme.textMuted, fontWeight: 700, fontSize: 11, marginBottom: 4, textTransform: "uppercase", letterSpacing: "0.05em" }}>{action.label}</p>
                <h3 style={{ fontSize: 24, fontWeight: 900, color: theme.text, letterSpacing: "-0.02em", marginBottom: 2 }}>{action.value}</h3>
                <p style={{ fontSize: 11, color: action.color, fontWeight: 700 }}>{action.sub}</p>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Basic Info / Summary Section */}
      <div style={{ display: "grid", gridTemplateColumns: "1.2fr 0.8fr", gap: 32 }}>
        {/* Simplified Schedule */}
        <div className="premium-card" style={{ padding: "24px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <CalendarCheck size={20} weight="bold" color={theme.primary} />
              <h4 style={{ fontSize: 18, fontWeight: 800, color: theme.text }}>Today's Schedule</h4>
            </div>
            <span style={{ fontSize: 11, fontWeight: 800, color: theme.textMuted, background: theme.isDark ? "rgba(255,255,255,0.05)" : "#F1F5F9", padding: "4px 10px", borderRadius: 8 }}>April 20, 2026</span>
          </div>
          
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {[
              { time: "09:00 AM", subject: "Advanced Mathematics", status: "In Progress" },
              { time: "11:30 AM", subject: "Quantum Physics", status: "Upcoming" },
              { time: "02:00 PM", subject: "English Literature", status: "Upcoming" },
            ].map((item, i) => (
              <div key={i} style={{ 
                padding: "18px 24px", borderRadius: 20, 
                background: item.status === "In Progress" ? theme.primary + "08" : "transparent",
                border: `1px solid ${item.status === "In Progress" ? theme.primary + "30" : theme.border}`,
                display: "flex", alignItems: "center", justifyContent: "space-between",
                transition: "0.2s"
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
                  <div style={{ fontSize: 13, fontWeight: 800, color: item.status === "In Progress" ? theme.primary : theme.textMuted, width: 70 }}>{item.time}</div>
                  <p style={{ fontSize: 15, fontWeight: 700, color: theme.text }}>{item.subject}</p>
                </div>
                <span style={{ 
                  fontSize: 11, 
                  fontWeight: 800, 
                  color: item.status === "In Progress" ? theme.primary : theme.textMuted,
                  textTransform: "uppercase",
                  letterSpacing: "0.05em"
                }}>{item.status}</span>
              </div>
            ))}
          </div>
        </div>

        {/* School Info / Announcements */}
        <div className="premium-card" style={{ padding: "24px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 24 }}>
            <span style={{ 
              width: 36, height: 36, borderRadius: 10, 
              background: "rgba(79, 70, 229, 0.1)", color: "#4f46e5",
              display: "flex", alignItems: "center", justifyContent: "center"
            }}>
              <Info size={20} weight="bold" />
            </span>
            <h4 style={{ fontSize: 18, fontWeight: 800, color: theme.text }}>Important Note</h4>
          </div>

          <div style={{ 
            padding: "24px", 
            borderRadius: 20, 
            background: theme.isDark ? "rgba(255,255,255,0.02)" : "#F8FAFC",
            border: `1px solid ${theme.border}`,
            marginBottom: 24
          }}>
            <p style={{ fontSize: 14, lineHeight: "1.6", color: theme.text, fontWeight: 600, marginBottom: 16 }}>
              The Annual Cultural Fest preparations are in full swing. Please ensure students carry their performance kits.
            </p>
            <div style={{ display: "flex", alignItems: "center", gap: 8, color: theme.primary, cursor: "pointer" }}>
              <span style={{ fontSize: 12, fontWeight: 800 }}>Read More</span>
              <ArrowRight size={14} weight="bold" />
            </div>
          </div>
          
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <p style={{ fontSize: 11, fontWeight: 800, color: theme.textMuted, textTransform: "uppercase", letterSpacing: "0.05em" }}>Upcoming Holiday</p>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 16px", borderRadius: 14, background: theme.isDark ? "rgba(255,255,255,0.03)" : "#f1f5f9" }}>
              <span style={{ fontSize: 14, fontWeight: 700, color: theme.text }}>Labour Day</span>
              <span style={{ fontSize: 13, fontWeight: 800, color: theme.primary }}>May 1</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
