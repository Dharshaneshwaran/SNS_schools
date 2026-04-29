"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Bell, User, BookOpen, ChartBar,
  Bus, Gear, Images, CaretDown, SignOut,
} from "@phosphor-icons/react";
import { MenuKey } from "../../app/parent-dashboard/page";
import { DashboardTheme } from "../../types/theme";

type Student = { id: number; name: string; class: string; section: string; avatar: string };

interface Props {
  students: Student[];
  activeStudent: Student;
  setActiveStudent: (s: Student) => void;
  activeMenu: MenuKey;
  setActiveMenu: (m: MenuKey) => void;
  theme: DashboardTheme;
}

export default function ParentSidebar({ students, activeStudent, setActiveStudent, activeMenu, setActiveMenu, theme }: Props) {
  const [showStudentDropdown, setShowStudentDropdown] = useState(false);

  const sections: {
    title: string;
    items: {
      key: MenuKey;
      label: string;
      icon: any;
    }[];
  }[] = [
    {
      title: "MENU",
      items: [
        { key: "events",    label: "Events Gallery", icon: Images },
        { key: "diary",     label: "Diary & Homework", icon: BookOpen },
        { key: "notifications", label: "Notifications", icon: Bell },
      ]
    },
    {
      title: "TOOLS",
      items: [
        { key: "academic",  label: "Academic Reports", icon: ChartBar },
        { key: "transport", label: "Transport Tracking", icon: Bus },
        { key: "settings",  label: "Settings",       icon: Gear },
      ]
    }
  ];

  return (
    <aside className="hide-scrollbar" style={{
      width: 280,
      height: "100vh",
      background: theme.sidebarBg,
      borderRight: `1px solid ${theme.border}`,
      display: "flex",
      flexDirection: "column",
      flexShrink: 0,
      zIndex: 50,
      transition: "all 0.3s ease",
      overflow: "visible"
    }}>
      {/* Logo Section */}
      <div style={{ padding: "28px 24px 20px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ 
            width: 40, height: 40, 
            display: "flex", alignItems: "center", justifyContent: "center",
            background: "#fff",
            borderRadius: 12,
            boxShadow: "0 8px 20px rgba(0,0,0,0.06)",
            padding: 6,
            border: "1px solid rgba(0,0,0,0.04)"
          }}>
            <img src="/images/logo.png" alt="Logo" style={{ width: "100%", height: "auto", objectFit: "contain" }} />
          </div>
          <div>
            <p style={{ fontFamily: "var(--font-poppins,'Poppins',sans-serif)", fontWeight: 800, fontSize: 16, color: theme.text, lineHeight: 1.1 }}>SNS Academy</p>
            <p style={{ fontSize: 9, color: "#FF7F50", fontWeight: 800, letterSpacing: "0.08em", marginTop: 4, textTransform: "uppercase" }}>Parent Portal</p>
          </div>
        </div>
      </div>

      {/* Student Switcher */}
      <div style={{ padding: "0 16px 24px", position: "relative" }}>
        <div style={{
          width: "100%",
          display: "flex",
          alignItems: "center",
          background: theme.isDark ? "rgba(255,127,80,0.1)" : "rgba(255,127,80,0.05)",
          border: `1px solid ${theme.isDark ? "rgba(255,127,80,0.2)" : "rgba(255,127,80,0.1)"}`,
          borderRadius: 14,
          overflow: "hidden"
        }}>
          <button 
            onClick={() => setActiveMenu("profile")}
            style={{
              flex: 1,
              display: "flex",
              alignItems: "center",
              gap: 10,
              padding: "12px 0 12px 16px",
              background: "none",
              border: "none",
              cursor: "pointer",
              textAlign: "left"
            }}
          >
            <div style={{ 
              width: 32, height: 32, 
              borderRadius: 10, 
              background: "linear-gradient(135deg,#FF7F50,#e66a3e)",
              color: "white", fontWeight: 800, fontSize: 12,
              display: "flex", alignItems: "center", justifyContent: "center"
            }}>
              {activeStudent.avatar}
            </div>
            <div>
              <p style={{ fontSize: 13, fontWeight: 700, color: theme.text, lineHeight: 1.2 }}>{activeStudent.name}</p>
              <p style={{ fontSize: 10, color: theme.textMuted, fontWeight: 600 }}>Class {activeStudent.class}-{activeStudent.section}</p>
            </div>
          </button>
          
          <button 
            onClick={() => setShowStudentDropdown(!showStudentDropdown)}
            style={{
              padding: "12px 16px",
              background: "none",
              border: "none",
              cursor: "pointer",
              borderLeft: `1px solid ${theme.isDark ? "rgba(255,127,80,0.2)" : "rgba(255,127,80,0.1)"}`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center"
            }}
          >
            <CaretDown size={14} weight="bold" color={theme.accent} style={{ transform: showStudentDropdown ? "rotate(180deg)" : "none", transition: "transform 0.2s" }} />
          </button>
        </div>

        <AnimatePresence>
          {showStudentDropdown && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              style={{
                position: "absolute",
                top: "100%",
                left: 16,
                right: 16,
                background: theme.cardBg,
                borderRadius: 14,
                border: `1px solid ${theme.border}`,
                boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
                zIndex: 100,
                marginTop: 8,
                overflow: "hidden"
              }}
            >
              {students.map((student) => (
                <button
                  key={student.id}
                  onClick={() => {
                    setActiveStudent(student);
                    setShowStudentDropdown(false);
                  }}
                  style={{
                    width: "100%",
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    padding: "12px 16px",
                    background: activeStudent.id === student.id ? "rgba(255,127,80,0.05)" : "transparent",
                    border: "none",
                    borderBottom: `1px solid ${theme.border}`,
                    cursor: "pointer",
                    transition: "background 0.2s"
                  }}
                >
                  <div style={{ 
                    width: 28, height: 28, 
                    borderRadius: 8, 
                    background: activeStudent.id === student.id ? "linear-gradient(135deg,#FF7F50,#e66a3e)" : "#f1f5f9",
                    color: activeStudent.id === student.id ? "white" : "#94a3b8",
                    fontWeight: 800, fontSize: 10,
                    display: "flex", alignItems: "center", justifyContent: "center"
                  }}>
                    {student.avatar}
                  </div>
                  <div style={{ textAlign: "left" }}>
                    <p style={{ fontSize: 12, fontWeight: 700, color: theme.text }}>{student.name}</p>
                    <p style={{ fontSize: 10, color: theme.textMuted }}>Class {student.class}-{student.section}</p>
                  </div>
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Navigation Sections */}
      <div style={{ flex: 1, padding: "0 12px", overflowY: "auto", overflowX: "visible" }} className="hide-scrollbar">
        {sections.map((section) => (
          <div key={section.title} style={{ marginBottom: 24 }}>
            <p style={{ 
              fontSize: 10, 
              fontWeight: 800, 
              color: theme.textMuted, 
              letterSpacing: "0.12em", 
              padding: "0 16px", 
              marginBottom: 14 
            }}>{section.title}</p>
            
            {section.items.map((item) => {
              const isActive = activeMenu === item.key;
              const Icon = item.icon;
              return (
                <motion.button
                  key={item.key}
                  onClick={() => setActiveMenu(item.key)}
                  whileTap={{ scale: 0.98 }}
                  style={{
                    width: "100%",
                    display: "flex",
                    alignItems: "center",
                    gap: 14,
                    padding: "12px 16px",
                    borderRadius: 12,
                    border: "none",
                    background: isActive ? "rgba(255, 127, 80, 0.08)" : "transparent",
                    color: isActive ? "#FF7F50" : theme.textMuted,
                    cursor: "pointer",
                    marginBottom: 4,
                    transition: "all 0.2s",
                  }}
                >
                  <Icon size={20} weight={isActive ? "bold" : "regular"} />
                  <span style={{ 
                    fontSize: 14.5, 
                    fontWeight: isActive ? 700 : 600,
                  }}>
                    {item.label}
                  </span>
                </motion.button>
              );
            })}
          </div>
        ))}
      </div>

      {/* Footer / Sign Out */}
      <div style={{ padding: "16px", borderTop: `1px solid ${theme.border}` }}>
        <motion.button
          whileHover={{ background: theme.isDark ? "rgba(239,68,68,0.15)" : "#FEF2F2", color: theme.danger }}
          style={{
            width: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 10,
            padding: "14px",
            borderRadius: 14,
            border: "none",
            background: "transparent",
            color: theme.textMuted,
            cursor: "pointer",
            transition: "all 0.2s",
            fontWeight: 700,
            fontSize: 14
          }}
        >
          <SignOut size={20} weight="bold" />
          <span>Sign Out</span>
        </motion.button>
      </div>
    </aside>
  );
}
