"use client";

import { useState } from "react";
import ParentSidebar from "../../components/parent/ParentSidebar";
import EventsGallery from "../../components/parent/sections/EventsGallery";
import ProfileSection from "../../components/parent/sections/ProfileSection";
import DiarySection from "../../components/parent/sections/DiarySection";
import AcademicSection from "../../components/parent/sections/AcademicSection";
import TransportSection from "../../components/parent/sections/TransportSection";
import SettingsSection from "../../components/parent/sections/SettingsSection";
import DashboardHome from "../../components/parent/sections/DashboardHome";
import { Bell, MagnifyingGlass, Sun, Moon, ChatCircleDots } from "@phosphor-icons/react";

import { DashboardTheme } from "../../types/theme";

export type MenuKey = "dashboard" | "events" | "profile" | "diary" | "notifications" | "academic" | "transport" | "settings";

const students = [
  { id: 1, name: "Arjun Sharma", class: "8", section: "A", avatar: "AS" },
  { id: 2, name: "Priya Sharma", class: "5", section: "B", avatar: "PS" },
];

export default function ParentDashboard() {
  const [activeMenu, setActiveMenu] = useState<MenuKey>("dashboard");
  const [activeStudent, setActiveStudent] = useState(students[0]);
  const [isDarkMode, setIsDarkMode] = useState(false);

  const theme: DashboardTheme = {
    isDark: isDarkMode,
    bg: isDarkMode ? "#0A0A0A" : "#f8fafc",
    sidebarBg: isDarkMode ? "#121212" : "#ffffff",
    cardBg: isDarkMode ? "#1A1A1A" : "#ffffff",
    text: isDarkMode ? "#FFFFFF" : "#1e293b",
    textMuted: isDarkMode ? "#A0A0A0" : "#94a3b8",
    border: isDarkMode ? "rgba(255,255,255,0.08)" : "#e2e8f0",
    accent: "#FF7F50",
    primary: "#FF7F50",
    success: "#10B981",
    danger: "#EF4444",
  };

  const renderContent = () => {
    switch (activeMenu) {
      case "dashboard":     return <DashboardHome theme={theme} />;
      case "events":        return <EventsGallery theme={theme} />;
      case "profile":       return <ProfileSection student={activeStudent} theme={theme} />;
      case "diary":         return <DiarySection student={activeStudent} theme={theme} />;
      case "notifications": return <DiarySection student={activeStudent} theme={theme} showOnlyNotifications={true} />; 
      case "academic":      return <AcademicSection student={activeStudent} theme={theme} />;
      case "transport":     return <TransportSection theme={theme} />;
      case "settings":      return <SettingsSection theme={theme} isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} />;
      default:              return <EventsGallery theme={theme} />;
    }
  };

  return (
    <div className={`mesh-bg${isDarkMode ? " dark-mode" : ""}`} style={{ display: "flex", height: "100vh", background: theme.bg, transition: "background 0.3s ease", position: "relative", overflow: "hidden" }}>
      {/* Background Decorative Elements */}
      <div className="bg-glow" style={{ top: "-10%", left: "-10%", width: 700, height: 700, background: "radial-gradient(circle, rgba(255, 127, 80, 0.12), transparent 70%)", position: "absolute", zIndex: 0 }} />
      <div className="bg-glow" style={{ bottom: "-10%", right: "-10%", width: 600, height: 600, background: "radial-gradient(circle, rgba(79, 70, 229, 0.1), transparent 70%)", animationDelay: "-5s", position: "absolute", zIndex: 0 }} />
      <div className="bg-glow" style={{ top: "20%", right: "10%", width: 450, height: 450, background: "radial-gradient(circle, rgba(255, 127, 80, 0.08), transparent 70%)", animationDuration: "20s", position: "absolute", zIndex: 0 }} />
      <div className="bg-glow" style={{ bottom: "20%", left: "30%", width: 300, height: 300, background: "radial-gradient(circle, rgba(79, 70, 229, 0.05), transparent 70%)", animationDelay: "-8s", animationDuration: "12s", position: "absolute", zIndex: 0 }} />

      <ParentSidebar
        students={students}
        activeStudent={activeStudent}
        setActiveStudent={setActiveStudent}
        activeMenu={activeMenu}
        setActiveMenu={setActiveMenu}
        theme={theme}
      />
      <main style={{ flex: 1, height: "100vh", overflowY: "auto", minWidth: 0, display: "flex", flexDirection: "column", position: "relative", zIndex: 1 }} className="hide-scrollbar">
        {/* Top Bar - Clean & Modern */}
        <header style={{ 
          height: 90, 
          background: theme.isDark ? "rgba(18,18,18,0.7)" : "rgba(255,255,255,0.7)", 
          backdropFilter: "blur(12px)",
          borderBottom: `1px solid ${theme.border}`,
          padding: "0 40px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          position: "sticky",
          top: 0,
          zIndex: 40
        }}>
          {/* Search Bar */}
          <div style={{ flex: 1, maxWidth: 400 }}>
            <div style={{ position: "relative" }}>
              <MagnifyingGlass size={20} style={{ position: "absolute", left: 16, top: "50%", transform: "translateY(-50%)", color: theme.textMuted }} />
              <input 
                type="text" 
                placeholder="Search everything..." 
                style={{
                  width: "100%",
                  padding: "12px 16px 12px 48px",
                  borderRadius: 14,
                  border: `1px solid ${theme.border}`,
                  background: theme.isDark ? "rgba(255,255,255,0.03)" : "#F8FAFC",
                  fontSize: 14,
                  outline: "none",
                  color: theme.text,
                  transition: "all 0.2s"
                }}
              />
            </div>
          </div>
          
          <div style={{ display: "flex", alignItems: "center", gap: 28 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
              <button style={{ background: "none", border: "none", color: theme.textMuted, cursor: "pointer" }} onClick={() => setIsDarkMode(!isDarkMode)}>
                {isDarkMode ? <Sun size={24} weight="bold" /> : <Moon size={24} weight="bold" />}
              </button>
              <button
                onClick={() => setActiveMenu("notifications")}
                style={{ background: "none", border: "none", color: activeMenu === "notifications" ? "#FF7F50" : theme.textMuted, cursor: "pointer", position: "relative" }}
              >
                <Bell size={24} weight={activeMenu === "notifications" ? "fill" : "regular"} />
                <span style={{ position: "absolute", top: 0, right: 0, width: 8, height: 8, borderRadius: "50%", background: "#FF7F50", border: `2px solid ${theme.bg}` }}></span>
              </button>
            </div>
          </div>
        </header>

        <div style={{ padding: "40px 60px", flex: 1, position: "relative", zIndex: 2 }}>
          <div style={{ marginBottom: 40 }}>
             <h2 style={{ fontSize: 32, fontWeight: 900, color: theme.text, fontFamily: "var(--font-poppins,'Poppins',sans-serif)", letterSpacing: "-0.03em" }}>
                {activeStudent.name}
             </h2>
             <p style={{ color: theme.textMuted, fontWeight: 600, fontSize: 16 }}>Class {activeStudent.class}-{activeStudent.section} Student</p>
          </div>
          {renderContent()}
        </div>
      </main>
    </div>
  );
}
