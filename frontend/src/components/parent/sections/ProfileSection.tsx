"use client";

import { motion } from "framer-motion";
import { User, Phone, Envelope, MapPin, GraduationCap, PencilSimple } from "@phosphor-icons/react";

type Student = { id: number; name: string; class: string; section: string; avatar: string };

export default function ProfileSection({ student }: { student: Student }) {
  const details = [
    { label: "Full Name", value: student.name, icon: <User size={16} /> },
    { label: "Class", value: `Class ${student.class} – Section ${student.section}`, icon: <GraduationCap size={16} /> },
    { label: "School", value: "SNS Academy, Coimbatore", icon: <MapPin size={16} /> },
    { label: "Parent Email", value: "parent@snsacademy.org", icon: <Envelope size={16} /> },
    { label: "Mobile", value: "+91 98765 43210", icon: <Phone size={16} /> },
  ];

  return (
    <div>
      <div style={{ marginBottom: 28 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
          <User size={26} weight="duotone" color="#FF7F50" />
          <h1 style={{ fontFamily: "var(--font-poppins,'Poppins',sans-serif)", fontSize: 24, fontWeight: 700, color: "#121212" }}>Student Profile</h1>
        </div>
        <p style={{ color: "#888", fontSize: 14 }}>Manage and view student details</p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: 24, alignItems: "start" }}>
        {/* Avatar Card */}
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}
          style={{ background: "#fff", borderRadius: 20, padding: 28, textAlign: "center", boxShadow: "0 4px 24px rgba(0,0,0,0.07)", border: "1px solid rgba(0,0,0,0.05)" }}>
          <div style={{
            width: 90, height: 90, borderRadius: "50%",
            background: "linear-gradient(135deg,#FF7F50,#e66a3e)",
            color: "white", fontWeight: 700, fontSize: 28,
            display: "flex", alignItems: "center", justifyContent: "center",
            margin: "0 auto 16px",
            boxShadow: "0 8px 24px rgba(255,127,80,0.35)",
          }}>{student.avatar}</div>
          <p style={{ fontFamily: "var(--font-poppins,'Poppins',sans-serif)", fontWeight: 700, fontSize: 17, color: "#121212", marginBottom: 4 }}>{student.name}</p>
          <p style={{ color: "#FF7F50", fontSize: 13, fontWeight: 600, marginBottom: 16 }}>Class {student.class}-{student.section}</p>
          <button style={{
            width: "100%", padding: "10px 0", borderRadius: 10,
            background: "linear-gradient(90deg,#FF7F50,#e66a3e)",
            color: "white", border: "none", cursor: "pointer",
            fontSize: 13, fontWeight: 600, display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
          }}>
            <PencilSimple size={14} weight="bold" /> Edit Profile
          </button>
        </motion.div>

        {/* Details Card */}
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}
          style={{ background: "#fff", borderRadius: 20, padding: 28, boxShadow: "0 4px 24px rgba(0,0,0,0.07)", border: "1px solid rgba(0,0,0,0.05)" }}>
          <h3 style={{ fontFamily: "var(--font-poppins,'Poppins',sans-serif)", fontWeight: 700, fontSize: 16, color: "#121212", marginBottom: 20 }}>Personal Information</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {details.map((d, i) => (
              <motion.div key={i}
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08, duration: 0.4 }}
                style={{ display: "flex", alignItems: "center", gap: 14, padding: "14px 16px", borderRadius: 12, background: "#fafafa", border: "1px solid rgba(0,0,0,0.04)" }}>
                <div style={{ width: 34, height: 34, borderRadius: 10, background: "rgba(255,127,80,0.1)", display: "flex", alignItems: "center", justifyContent: "center", color: "#FF7F50", flexShrink: 0 }}>{d.icon}</div>
                <div>
                  <p style={{ fontSize: 11, color: "#bbb", fontWeight: 600, letterSpacing: "0.05em", textTransform: "uppercase", marginBottom: 2 }}>{d.label}</p>
                  <p style={{ fontSize: 14, fontWeight: 600, color: "#222" }}>{d.value}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
