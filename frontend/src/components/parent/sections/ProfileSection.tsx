"use client";

import { motion } from "framer-motion";
import { User, Phone, Envelope, MapPin, GraduationCap, PencilSimple } from "@phosphor-icons/react";

import { DashboardTheme } from "../../../types/theme";

import { Student } from "../../../types/dashboard";

export default function ProfileSection({ student, theme }: { student: Student; theme: DashboardTheme }) {
  const studentInfo = [
    { label: "Full Name", value: student.name, icon: <User size={18} /> },
    { label: "Class", value: `Class ${student.class} – Section ${student.section}`, icon: <GraduationCap size={18} /> },
    { label: "School", value: student.schoolName || "SNS Academy, Coimbatore", icon: <MapPin size={18} /> },
    { label: "Student ID", value: student.studentId, icon: <PencilSimple size={18} /> },
  ];

  const parentDetails = [
    { 
      type: "Father", 
      name: student.fatherName || "Not Provided", 
      mobile: student.fatherNumber, 
      email: student.fatherEmail || "N/A" 
    },
    { 
      type: "Mother", 
      name: student.motherName || "Not Provided", 
      mobile: student.motherNumber, 
      email: student.motherEmail || "N/A" 
    },
  ];

  const guardianDetail = {
    name: student.guardianName || "Not Provided",
    mobile: student.guardianNumber || "Not Provided",
    relation: student.relation || "Emergency Contact"
  };

  const teacherDetails = [
    { label: "Class Teacher", value: student.classTeacher, icon: <User size={18} /> },
    { label: "Teacher Email", value: student.teacherEmail, icon: <Envelope size={18} /> },
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
        <p style={{ color: "#FF7F50", fontSize: 14, fontWeight: 800, marginBottom: 24, letterSpacing: "0.05em", textTransform: "uppercase" }}>Class {student.class}-{student.section}</p>
        
        <div style={{ padding: "16px", borderRadius: 16, background: theme.isDark ? "rgba(255,255,255,0.03)" : "#F8FAFC", border: `1px solid ${theme.border}`, textAlign: "left" }}>
          <p style={{ fontSize: 11, fontWeight: 800, color: theme.textMuted, textTransform: "uppercase", marginBottom: 8 }}>Permanent Address</p>
          <p style={{ fontSize: 13, fontWeight: 600, color: theme.text, lineHeight: 1.5 }}>{student.address}</p>
        </div>
      </motion.div>

      {/* Details Card */}
      <motion.div 
        initial={{ opacity: 0, x: 30 }} 
        animate={{ opacity: 1, x: 0 }} 
        className="premium-card"
        style={{ padding: "40px" }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
          {/* Student Info Group */}
          <div>
            <h3 style={{ fontSize: 16, fontWeight: 800, color: theme.text, letterSpacing: "-0.01em", marginBottom: 16, display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#FF7F50" }} /> Student Information
            </h3>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              {studentInfo.map((d, i) => (
                <div key={i} style={{ 
                  display: "flex", alignItems: "center", gap: 12, padding: "14px 18px", 
                  borderRadius: 14, background: theme.isDark ? "rgba(255,255,255,0.02)" : "#F8FAFC", 
                  border: `1px solid ${theme.border}`,
                }}>
                  <div style={{ color: "#FF7F50", flexShrink: 0 }}>{d.icon}</div>
                  <div>
                    <p style={{ fontSize: 9, color: theme.textMuted, fontWeight: 800, textTransform: "uppercase", marginBottom: 2 }}>{d.label}</p>
                    <p style={{ fontSize: 13, fontWeight: 700, color: theme.text }}>{d.value}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Combined Parent Details Group */}
          <div>
            <h3 style={{ fontSize: 16, fontWeight: 800, color: theme.text, letterSpacing: "-0.01em", marginBottom: 16, display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#FF7F50" }} /> Parent Information
            </h3>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
              {parentDetails.map((p, i) => (
                <div key={i} style={{ 
                  padding: "20px", borderRadius: 16, 
                  background: theme.isDark ? "rgba(255,255,255,0.03)" : "#FFFFFF", 
                  border: `1px solid ${theme.border}`,
                  boxShadow: "0 4px 12px rgba(0,0,0,0.02)"
                }}>
                  <p style={{ fontSize: 11, fontWeight: 900, color: theme.primary, textTransform: "uppercase", marginBottom: 12, display: "flex", alignItems: "center", gap: 8 }}>
                    <User size={14} weight="bold" /> {p.type}: {p.name}
                  </p>
                  <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <Phone size={14} color={theme.textMuted} />
                      <span style={{ fontSize: 13, fontWeight: 600, color: theme.text }}>{p.mobile}</span>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <Envelope size={14} color={theme.textMuted} />
                      <span style={{ fontSize: 13, fontWeight: 600, color: theme.text }}>{p.email}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Guardian Information Below */}
            <div style={{ 
              padding: "16px 20px", borderRadius: 16, 
              background: theme.isDark ? "rgba(255,127,80,0.05)" : "rgba(255,127,80,0.02)", 
              border: `1px dashed ${theme.accent}`,
              display: "flex", alignItems: "center", justifyContent: "space-between"
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{ width: 36, height: 36, borderRadius: 10, background: theme.accent, color: "white", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <User size={20} weight="fill" />
                </div>
                <div>
                  <p style={{ fontSize: 10, fontWeight: 800, color: theme.textMuted, textTransform: "uppercase" }}>Guardian / Emergency Contact</p>
                  <p style={{ fontSize: 14, fontWeight: 700, color: theme.text }}>{guardianDetail.name} ({guardianDetail.relation})</p>
                </div>
              </div>
              <div style={{ textAlign: "right" }}>
                <p style={{ fontSize: 10, fontWeight: 800, color: theme.textMuted, textTransform: "uppercase" }}>Contact Number</p>
                <p style={{ fontSize: 14, fontWeight: 700, color: theme.primary }}>{guardianDetail.mobile}</p>
              </div>
            </div>
          </div>

          {/* Academic Contact Group */}
          <div>
            <h3 style={{ fontSize: 16, fontWeight: 800, color: theme.text, letterSpacing: "-0.01em", marginBottom: 16, display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#FF7F50" }} /> Academic Contact
            </h3>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              {teacherDetails.map((d, i) => (
                <div key={i} style={{ 
                  display: "flex", alignItems: "center", gap: 12, padding: "14px 18px", 
                  borderRadius: 14, background: theme.isDark ? "rgba(255,255,255,0.02)" : "#F8FAFC", 
                  border: `1px solid ${theme.border}`,
                }}>
                  <div style={{ color: "#FF7F50", flexShrink: 0 }}>{d.icon}</div>
                  <div>
                    <p style={{ fontSize: 9, color: theme.textMuted, fontWeight: 800, textTransform: "uppercase", marginBottom: 2 }}>{d.label}</p>
                    <p style={{ fontSize: 13, fontWeight: 700, color: theme.text }}>{d.value}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
