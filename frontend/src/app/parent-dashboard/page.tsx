"use client";

import { useState } from "react";
import ParentSidebar from "../../components/parent/ParentSidebar";
import EventsGallery from "../../components/parent/sections/EventsGallery";
import ProfileSection from "../../components/parent/sections/ProfileSection";
import DiarySection from "../../components/parent/sections/DiarySection";
import AcademicSection from "../../components/parent/sections/AcademicSection";
import TransportSection from "../../components/parent/sections/TransportSection";
import SettingsSection from "../../components/parent/sections/SettingsSection";

import { DashboardTheme } from "../../types/theme";

export type MenuKey = "events" | "profile" | "diary" | "academic" | "transport" | "settings";

const students = [
  { id: 1, name: "Arjun Sharma", class: "8", section: "A", avatar: "AS" },
  { id: 2, name: "Priya Sharma", class: "5", section: "B", avatar: "PS" },
];

export default function ParentDashboard() {
  const [activeMenu, setActiveMenu] = useState<MenuKey>("events");
  const [activeStudent, setActiveStudent] = useState(students[0]);
  const [isDarkMode, setIsDarkMode] = useState(false);

  const theme: DashboardTheme = {
    isDark: isDarkMode,
    bg: isDarkMode ? "#0A0A0A" : "#f4f6fb",
    sidebarBg: isDarkMode ? "#121212" : "#ffffff",
    cardBg: isDarkMode ? "#1A1A1A" : "#ffffff",
    text: isDarkMode ? "#FFFFFF" : "#121212",
    textMuted: isDarkMode ? "#A0A0A0" : "#888888",
    border: isDarkMode ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.06)",
    accent: "#FF7F50",
  };

  const renderContent = () => {
    switch (activeMenu) {
      case "events":    return <EventsGallery theme={theme} />;
      case "profile":   return <ProfileSection student={activeStudent} theme={theme} />;
      case "diary":     return <DiarySection student={activeStudent} theme={theme} />;
      case "academic":  return <AcademicSection student={activeStudent} theme={theme} />;
      case "transport": return <TransportSection theme={theme} />;
      case "settings":  return <SettingsSection theme={theme} isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} />;
      default:          return <EventsGallery theme={theme} />;
    }
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: theme.bg, transition: "background 0.3s ease", fontFamily: "var(--font-inter,'Inter',sans-serif)" }}>
      <ParentSidebar
        students={students}
        activeStudent={activeStudent}
        setActiveStudent={setActiveStudent}
        activeMenu={activeMenu}
        setActiveMenu={setActiveMenu}
        theme={theme}
      />
      <main style={{ flex: 1, overflowY: "auto", padding: "32px 36px", minWidth: 0 }}>
        {renderContent()}
      </main>
    </div>
  );
}
