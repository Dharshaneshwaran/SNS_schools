"use client";

import { motion } from "framer-motion";
import { User, Phone, Envelope, MapPin, GraduationCap, PencilSimple } from "@phosphor-icons/react";

import { DashboardTheme } from "../../../types/theme";

type Student = { id: number; name: string; class: string; section: string; avatar: string };

export default function ProfileSection({ student, theme }: { student: Student; theme: DashboardTheme }) {
  const details = [
    { label: "Full Name", value: student.name, icon: <User size={18} /> },
    { label: "Class", value: `Class ${student.class} – Section ${student.section}`, icon: <GraduationCap size={18} /> },
    { label: "School", value: "SNS Academy, Coimbatore", icon: <MapPin size={18} /> },
    { label: "Parent Email", value: "parent@snsacademy.org", icon: <Envelope size={18} /> },
    { label: "Mobile", value: "+91 98765 43210", icon: <Phone size={18} /> },
  ];

  return (
    <div style={{ display: "grid", gridTemplateColumns: "340px 1fr", gap: 32, alignItems: "start" }}>
      {/* Avatar Card */}
      <motion.div 
        initial={{ opacity: 0, x: -30 }} 
        animate={{ opacity: 1, x: 0 }} 
        className="premium-card"
        style={{ padding: "48px 32px", textAlign: "center" }}
      >
        <div style={{
          width: 140, height: 140, borderRadius: 40,
          background: "linear-gradient(135deg,#FF7F50,#e66a3e)",
          color: "white", fontWeight: 900, fontSize: 48,
          display: "flex", alignItems: "center", justifyContent: "center",
          margin: "0 auto 24px",
          boxShadow: "0 20px 40px rgba(255,127,80,0.25)",
          border: `4px solid ${theme.border}`
        }}>{student.avatar}</div>
        
        <h2 style={{ fontSize: 24, fontWeight: 900, color: theme.text, marginBottom: 8, letterSpacing: "-0.02em" }}>{student.name}</h2>
        <p style={{ color: "#FF7F50", fontSize: 14, fontWeight: 800, marginBottom: 32, letterSpacing: "0.05em", textTransform: "uppercase" }}>Class {student.class}-{student.section}</p>
        
        <button style={{
          width: "100%", padding: "16px 0", borderRadius: 16,
          background: theme.isDark ? "rgba(255,255,255,0.1)" : "#1e293b",
          color: "white", border: "none", cursor: "pointer",
          fontSize: 14, fontWeight: 800, display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
          transition: "all 0.3s"
        }}>
          <PencilSimple size={20} weight="bold" /> Edit Details
        </button>
      </motion.div>

      {/* Details Card */}
      <motion.div 
        initial={{ opacity: 0, x: 30 }} 
        animate={{ opacity: 1, x: 0 }} 
        className="premium-card"
        style={{ padding: "40px" }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 32 }}>
          <h3 style={{ fontSize: 20, fontWeight: 800, color: theme.text, letterSpacing: "-0.01em" }}>Personal Information</h3>
        </div>
        
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
          {details.map((d, i) => (
            <div key={i}
              style={{ 
                display: "flex", alignItems: "center", gap: 20, padding: "24px", 
                borderRadius: 20, background: theme.isDark ? "rgba(255,255,255,0.02)" : "#F8FAFC", 
                border: `1px solid ${theme.border}`,
                transition: "all 0.3s"
              }}
            >
              <div style={{ 
                width: 52, height: 52, borderRadius: 14, 
                background: theme.isDark ? "rgba(255,255,255,0.05)" : "#fff", 
                display: "flex", alignItems: "center", justifyContent: "center", 
                color: "#FF7F50", flexShrink: 0,
                boxShadow: "0 4px 10px rgba(0,0,0,0.03)"
              }}>{d.icon}</div>
              <div>
                <p style={{ fontSize: 12, color: theme.textMuted, fontWeight: 800, letterSpacing: "0.05em", textTransform: "uppercase", marginBottom: 4 }}>{d.label}</p>
                <p style={{ fontSize: 16, fontWeight: 700, color: theme.text }}>{d.value}</p>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
