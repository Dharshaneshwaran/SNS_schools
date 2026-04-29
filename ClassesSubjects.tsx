"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ChevronDown, 
  Users, 
  ClipboardCheck, 
  BarChart3, 
  BookOpen, 
  MoreVertical,
  GraduationCap,
  MessageSquare
} from "lucide-react";

interface ClassCardProps {
  title: string;
  subtitle: string;
  students: number;
  type: "Class Teacher" | "Subject Teacher";
  isOpen: boolean;
  onToggle: () => void;
}

const ClassCard = ({ title, subtitle, students, type, isOpen, onToggle }: ClassCardProps) => {
  return (
    <div style={{
      backgroundColor: "var(--card-bg)",
      borderRadius: "24px",
      border: "1px solid var(--border-color)",
      overflow: "hidden",
      marginBottom: "16px",
    }}>
      <div 
        onClick={onToggle}
        style={{
          padding: "24px",
          display: "flex",
          alignItems: "center",
          gap: "20px",
          cursor: "pointer",
          transition: "background-color 0.2s",
        }}
        onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "var(--card-hover)"; }}
        onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "transparent"; }}
      >
        <div style={{
          width: "56px",
          height: "56px",
          borderRadius: "16px",
          backgroundColor: type === "Class Teacher" ? "rgba(255, 106, 0, 0.1)" : "rgba(59, 130, 246, 0.1)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: type === "Class Teacher" ? "#FF7A1A" : "#3B82F6"
        }}>
          {type === "Class Teacher" ? <Users size={28} /> : <BookOpen size={28} />}
        </div>

        <div style={{ flex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <h4 style={{ color: "var(--text-primary)", fontSize: "18px", fontWeight: 600, margin: 0 }}>{title}</h4>
            <span style={{ 
              fontSize: "11px", 
              fontWeight: 700, 
              padding: "4px 8px", 
              borderRadius: "6px", 
              backgroundColor: type === "Class Teacher" ? "rgba(255, 106, 0, 0.15)" : "var(--border-color)",
              color: type === "Class Teacher" ? "#FF7A1A" : "var(--text-secondary)",
              textTransform: "uppercase"
            }}>
              {type}
            </span>
          </div>
          <p style={{ color: "var(--text-secondary)", fontSize: "14px", margin: "4px 0 0" }}>{subtitle} • {students} Students</p>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <div style={{ textAlign: "right" }} className="card-stats">
            <p style={{ color: "#10B981", fontSize: "14px", fontWeight: 600, margin: 0 }}>94% Attendance</p>
            <p style={{ color: "var(--text-secondary)", fontSize: "12px", margin: 0 }}>Avg Grade: A-</p>
          </div>
          <motion.div animate={{ rotate: isOpen ? 180 : 0 }}>
            <ChevronDown size={20} color="var(--text-secondary)" />
          </motion.div>
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            style={{ overflow: "hidden" }}
          >
            <div className="actions-grid">
              {[
                { label: "Students", icon: Users, color: "#A855F7" },
                { label: "Attendance", icon: ClipboardCheck, color: "#10B981" },
                { label: "Marks", icon: GraduationCap, color: "#FF6A00" },
                { label: "Analytics", icon: BarChart3, color: "#3B82F6" }
              ].map((action, i) => (
                <motion.button
                  key={i}
                  whileHover={{ y: -4, backgroundColor: "var(--card-hover)" }}
                  whileTap={{ scale: 0.98 }}
                  style={{
                    backgroundColor: "var(--card-hover)",
                    border: "1px solid var(--border-color)",
                    borderRadius: "16px",
                    padding: "16px",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: "10px",
                    cursor: "pointer",
                    color: "var(--text-primary)"
                  }}
                >
                  <div style={{
                    width: "36px",
                    height: "36px",
                    borderRadius: "10px",
                    backgroundColor: `${action.color}15`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: action.color
                  }}>
                    <action.icon size={18} />
                  </div>
                  <span style={{ fontSize: "12px", fontWeight: 500 }}>{action.label}</span>
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <style jsx>{`
        .actions-grid {
          padding: 0 24px 24px;
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 16px;
        }

        @media (max-width: 640px) {
          .actions-grid {
            grid-template-columns: repeat(2, 1fr);
            padding: 0 16px 20px;
            gap: 12px;
          }
          .card-stats {
            display: none;
          }
        }
      `}</style>
    </div>
  );
};

export default function ClassesSubjects() {
  const [openClass, setOpenClass] = useState<string | null>("grade-10a");

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <h2 style={{ color: "var(--text-primary)", fontSize: "24px", fontWeight: 700, margin: "0 0 4px" }}>Classes & Subjects</h2>
          <p style={{ color: "var(--text-secondary)", fontSize: "14px", margin: 0 }}>Manage your assigned classes and student records.</p>
        </div>
        <button style={{
          backgroundColor: "var(--card-bg)",
          color: "var(--text-primary)",
          padding: "10px 16px",
          borderRadius: "12px",
          border: "1px solid var(--border-color)",
          fontSize: "14px",
          fontWeight: 600,
          cursor: "pointer"
        }} className="desktop-only">
          View All
        </button>
      </div>

      <div style={{ marginTop: "8px" }}>
        <p style={{ color: "var(--text-secondary)", fontSize: "11px", opacity: 0.7, fontWeight: 700, letterSpacing: "1px", textTransform: "uppercase", marginBottom: "16px" }}>Class Teacher Section</p>
        <ClassCard 
          title="Grade 10 - A" 
          subtitle="Mathematics & Ethics" 
          students={42} 
          type="Class Teacher"
          isOpen={openClass === "grade-10a"}
          onToggle={() => setOpenClass(openClass === "grade-10a" ? null : "grade-10a")}
        />

        <p style={{ color: "var(--text-secondary)", fontSize: "11px", opacity: 0.7, fontWeight: 700, letterSpacing: "1px", textTransform: "uppercase", margin: "32px 0 16px" }}>Subject Teacher Section</p>
        <ClassCard 
          title="Grade 12 - C" 
          subtitle="Advanced Calculus" 
          students={38} 
          type="Subject Teacher"
          isOpen={openClass === "grade-12c"}
          onToggle={() => setOpenClass(openClass === "grade-12c" ? null : "grade-12c")}
        />
        <ClassCard 
          title="Grade 11 - B" 
          subtitle="Algebra & Geometry" 
          students={45} 
          type="Subject Teacher"
          isOpen={openClass === "grade-11b"}
          onToggle={() => setOpenClass(openClass === "grade-11b" ? null : "grade-11b")}
        />
      </div>
    </div>
  );
}
