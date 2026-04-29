"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  GraduationCap, User, BookOpen, ChartBar,
  Bus, Gear, Images, CaretDown, SignOut,
} from "@phosphor-icons/react";
import { MenuKey } from "../../app/parent-dashboard/page";
import { DashboardTheme } from "../../types/theme";

const menuItems: { key: MenuKey; label: string; icon: React.ReactNode }[] = [
  { key: "events",    label: "Events Gallery", icon: <Images size={20} weight="duotone" /> },
  { key: "profile",   label: "Profile",        icon: <User size={20} weight="duotone" /> },
  { key: "diary",     label: "Diary",          icon: <BookOpen size={20} weight="duotone" /> },
  { key: "academic",  label: "Academic",       icon: <ChartBar size={20} weight="duotone" /> },
  { key: "transport", label: "Transport",      icon: <Bus size={20} weight="duotone" /> },
  { key: "settings",  label: "Settings",       icon: <Gear size={20} weight="duotone" /> },
];

type Student = { id: number; name: string; class: string; section: string; avatar: string };

interface Props {
  students: Student[];
  activeStudent: Student;
  setActiveStudent: (s: Student) => void;
  activeMenu: MenuKey;
  setActiveMenu: (m: MenuKey) => void;
  theme: DashboardTheme;
  onMenuClick?: () => void;
}

export default function ParentSidebar({ students, activeStudent, setActiveStudent, activeMenu, setActiveMenu, theme, onMenuClick }: Props) {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  return (
    <aside 
      className="w-[280px] flex flex-col h-[100dvh] flex-shrink-0 z-50 relative transition-colors duration-300"
      style={{
        background: theme.sidebarBg,
        borderRight: `1px solid ${theme.border}`,
        boxShadow: theme.isDark ? "none" : "4px 0 24px rgba(0,0,0,0.02)",
      }}
    >
      {/* Logo */}
      <div style={{ padding: "28px 24px 20px", borderBottom: `1px solid ${theme.border}` }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 38, height: 38, borderRadius: 10, background: theme.accent, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <GraduationCap size={22} weight="fill" color="white" />
          </div>
          <div>
            <p style={{ fontFamily: "var(--font-poppins,'Poppins',sans-serif)", fontWeight: 700, fontSize: 15, color: theme.text, lineHeight: 1 }}>SNS Academy</p>
            <p style={{ fontSize: 11, color: theme.accent, fontWeight: 600, letterSpacing: "0.05em", marginTop: 2 }}>PARENT PORTAL</p>
          </div>
        </div>
      </div>

      {/* Student Profile + Switcher */}
      <div style={{ padding: "20px 16px", borderBottom: `1px solid ${theme.border}` }}>
        <div
          onClick={() => setDropdownOpen(!dropdownOpen)}
          style={{
            borderRadius: 14,
            background: theme.isDark ? "rgba(255,255,255,0.03)" : "linear-gradient(135deg, #fff5f0, #fff)",
            border: theme.isDark ? `1px solid ${theme.border}` : "1px solid rgba(255,127,80,0.2)",
            padding: "14px 16px",
            cursor: "pointer",
            transition: "all 0.2s",
          }}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={activeStudent.id}
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 6 }}
              transition={{ duration: 0.25 }}
              style={{ display: "flex", alignItems: "center", gap: 12 }}
            >
              <div style={{
                width: 46, height: 46, borderRadius: "50%",
                background: "linear-gradient(135deg,#FF7F50,#e66a3e)",
                display: "flex", alignItems: "center", justifyContent: "center",
                color: "white", fontWeight: 700, fontSize: 16,
                boxShadow: "0 4px 12px rgba(255,127,80,0.35)",
                flexShrink: 0,
              }}>
                {activeStudent.avatar}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontWeight: 700, fontSize: 14, color: theme.text, fontFamily: "var(--font-poppins,'Poppins',sans-serif)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{activeStudent.name}</p>
                <p style={{ fontSize: 12, color: theme.textMuted, marginTop: 2 }}>Class {activeStudent.class} – Sec {activeStudent.section}</p>
              </div>
              <motion.div animate={{ rotate: dropdownOpen ? 180 : 0 }} transition={{ duration: 0.2 }}>
                <CaretDown size={16} color={theme.accent} weight="bold" />
              </motion.div>
            </motion.div>
          </AnimatePresence>

          <AnimatePresence>
            {dropdownOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.25 }}
                style={{ overflow: "hidden" }}
              >
                <div style={{ marginTop: 12, paddingTop: 12, borderTop: `1px solid ${theme.border}` }}>
                  <p style={{ fontSize: 10, fontWeight: 700, color: theme.textMuted, letterSpacing: "0.08em", marginBottom: 8 }}>SWITCH STUDENT</p>
                  {students.map((s) => (
                    <div
                      key={s.id}
                      onClick={(e) => { e.stopPropagation(); setActiveStudent(s); setDropdownOpen(false); }}
                      style={{
                        display: "flex", alignItems: "center", gap: 10,
                        padding: "8px 10px", borderRadius: 10, marginBottom: 4,
                        background: activeStudent.id === s.id ? "rgba(255,127,80,0.1)" : "transparent",
                        cursor: "pointer", transition: "background 0.2s",
                      }}
                    >
                      <div style={{ width: 30, height: 30, borderRadius: "50%", background: theme.accent, color: "white", fontWeight: 700, fontSize: 11, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>{s.avatar}</div>
                      <div>
                        <p style={{ fontSize: 13, fontWeight: 600, color: theme.text }}>{s.name}</p>
                        <p style={{ fontSize: 11, color: theme.textMuted }}>Class {s.class}-{s.section}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Nav Menu */}
      <nav style={{ flex: 1, padding: "16px 12px", overflowY: "auto" }}>
        <p style={{ fontSize: 10, fontWeight: 700, color: theme.textMuted, letterSpacing: "0.08em", padding: "0 12px", marginBottom: 10 }}>NAVIGATION</p>
        {menuItems.map((item) => {
          const isActive = activeMenu === item.key;
          return (
            <button
              key={item.key}
              onClick={() => { setActiveMenu(item.key); onMenuClick?.(); }}
              style={{
                width: "100%",
                display: "flex", alignItems: "center", gap: 12,
                padding: "11px 14px", borderRadius: 12, marginBottom: 4,
                background: isActive ? "linear-gradient(90deg,#FF7F50,#e66a3e)" : "transparent",
                color: isActive ? "white" : theme.isDark ? theme.textMuted : "#555",
                border: "none", cursor: "pointer",
                fontWeight: isActive ? 600 : 500,
                fontSize: 14, textAlign: "left",
                transition: "all 0.25s cubic-bezier(0.165,0.84,0.44,1)",
                boxShadow: isActive ? "0 4px 16px rgba(255,127,80,0.3)" : "none",
                fontFamily: "var(--font-inter,'Inter',sans-serif)",
              }}
              onMouseEnter={(e) => { if (!isActive) e.currentTarget.style.background = theme.isDark ? "rgba(255,255,255,0.05)" : "#fff5f0"; }}
              onMouseLeave={(e) => { if (!isActive) e.currentTarget.style.background = "transparent"; }}
            >
              <span style={{ opacity: isActive ? 1 : 0.7 }}>{item.icon}</span>
              {item.label}
              {item.key === "diary" && (
                <span style={{ marginLeft: "auto", width: 18, height: 18, borderRadius: "50%", background: isActive ? "rgba(255,255,255,0.3)" : theme.accent, color: "white", fontSize: 10, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center" }}>3</span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Bottom */}
      <div style={{ padding: "16px 12px", borderTop: `1px solid ${theme.border}` }}>
        <button 
          onClick={() => {
            // In a real app, clear auth tokens here before redirecting
            window.location.href = '/login';
          }}
          style={{
            width: "100%", display: "flex", alignItems: "center", gap: 12,
            padding: "11px 14px", borderRadius: 12, background: "transparent",
            color: theme.textMuted, border: "none", cursor: "pointer", fontSize: 14, fontWeight: 500,
            transition: "all 0.2s", fontFamily: "var(--font-inter,'Inter',sans-serif)",
          }}
          onMouseEnter={(e) => { e.currentTarget.style.background = theme.isDark ? "rgba(255,127,80,0.1)" : "#fff0ed"; e.currentTarget.style.color = theme.accent; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = theme.textMuted; }}
        >
          <SignOut size={20} weight="duotone" /> Sign Out
        </button>
      </div>
    </aside>
  );
}
