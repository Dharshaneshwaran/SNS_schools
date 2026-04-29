"use client";

import { useState } from "react";
import ParentSidebar from "../../components/parent/ParentSidebar";
import EventsGallery from "../../components/parent/sections/EventsGallery";
import ProfileSection from "../../components/parent/sections/ProfileSection";
import DiarySection from "../../components/parent/sections/DiarySection";
import AcademicSection from "../../components/parent/sections/AcademicSection";
import TransportSection from "../../components/parent/sections/TransportSection";
import SettingsSection from "../../components/parent/sections/SettingsSection";
import { List } from "@phosphor-icons/react";

import { DashboardTheme } from "../../types/theme";

export type MenuKey = "events" | "profile" | "diary" | "academic" | "transport" | "settings";

const students = [
  { id: 1, name: "Arjun Sharma", class: "8", section: "A", avatar: "AS" },
  { id: 2, name: "Priya Sharma", class: "5", section: "B", avatar: "PS" },
];

export default function ParentDashboard() {
  const [activeMenu, setActiveMenu] = useState<MenuKey>("events");
  const [activeStudent, setActiveStudent] = useState(students[0]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
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
    <div className="flex min-h-screen font-sans relative" style={{ background: theme.bg, transition: "background 0.3s ease" }}>
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar Wrapper */}
      <div 
        className={`fixed inset-y-0 left-0 z-50 transform ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"} md:relative md:translate-x-0 transition-transform duration-300 ease-in-out`}
        style={{ background: theme.sidebarBg }}
      >
        <ParentSidebar
          students={students}
          activeStudent={activeStudent}
          setActiveStudent={(s) => { setActiveStudent(s); setIsSidebarOpen(false); }}
          activeMenu={activeMenu}
          setActiveMenu={(m) => { setActiveMenu(m); setIsSidebarOpen(false); }}
          theme={theme}
        />
      </div>

      <main className="flex-1 h-screen overflow-y-auto w-full min-w-0">
        {/* Mobile Header Component */}
        <div 
          className="md:hidden flex items-center justify-between px-6 py-4 sticky top-0 z-30 shadow-sm"
          style={{ background: theme.sidebarBg, borderBottom: `1px solid ${theme.border}` }}
        >
          <button 
            onClick={() => setIsSidebarOpen(true)}
            className="p-2 -ml-2 text-[#FF7F50] rounded-md transition-colors"
          >
            <List size={32} weight="bold" />
          </button>
          <div className="flex flex-col items-center justify-center absolute left-1/2 -translate-x-1/2">
            <span className="font-bold text-base font-poppins" style={{ color: theme.text }}>SNS Academy</span>
            <span className="text-[10px] text-[#FF7F50] font-bold tracking-wider leading-none mt-0.5">PARENT</span>
          </div>
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#FF7F50] to-[#e66a3e] text-white flex items-center justify-center font-bold text-sm shadow-md">
            {activeStudent.avatar}
          </div>
        </div>

        {/* Dynamic Page Content */}
        <div className="p-4 md:p-8">
          {renderContent()}
        </div>
      </main>
    </div>
  );
}
