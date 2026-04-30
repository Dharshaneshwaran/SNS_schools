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
import { ChatPage } from "../../components/dashboard/chat-page";
import { Bell, MagnifyingGlass, Sun, Moon, ChatCircleDots, List } from "@phosphor-icons/react";

import { DashboardTheme } from "../../types/theme";

export type MenuKey = "dashboard" | "events" | "profile" | "diary" | "notifications" | "academic" | "transport" | "settings" | "chat";

const students = [
  { id: 1, name: "Arjun Sharma", class: "8", section: "A", avatar: "AS" },
  { id: 2, name: "Priya Sharma", class: "5", section: "B", avatar: "PS" },
];

export default function ParentDashboard() {
  const [activeMenu, setActiveMenu] = useState<MenuKey>("dashboard");
  const [activeStudent, setActiveStudent] = useState(students[0]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
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
      case "chat":          return <div className="h-[calc(100vh-130px)] -mt-4"><ChatPage /></div>;
      default:              return <EventsGallery theme={theme} />;
    }
  };

  return (
    <div className={`mesh-bg${isDarkMode ? " dark-mode" : ""} flex min-h-screen font-sans relative overflow-hidden`} style={{ background: theme.bg, transition: "background 0.3s ease" }}>
      {/* Background Decorative Elements */}
      <div className="bg-glow" style={{ top: "-10%", left: "-10%", width: 700, height: 700, background: "radial-gradient(circle, rgba(255, 127, 80, 0.12), transparent 70%)", position: "absolute", zIndex: 0 }} />
      <div className="bg-glow" style={{ bottom: "-10%", right: "-10%", width: 600, height: 600, background: "radial-gradient(circle, rgba(79, 70, 229, 0.1), transparent 70%)", animationDelay: "-5s", position: "absolute", zIndex: 0 }} />
      
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-[60] md:hidden backdrop-blur-sm"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar Wrapper */}
      <div 
        className={`fixed inset-y-0 left-0 z-[70] transform ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"} md:relative md:translate-x-0 transition-transform duration-300 ease-in-out`}
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

      <main className="flex-1 h-screen overflow-y-auto w-full min-w-0 hide-scrollbar relative z-10 flex flex-col">
        {/* Top Bar - Clean & Modern (Desktop) */}
        <header className="hidden md:flex sticky top-0 h-[90px] backdrop-blur-xl border-b px-10 items-center justify-between z-40" style={{ 
          background: theme.isDark ? "rgba(18,18,18,0.7)" : "rgba(255,255,255,0.7)", 
          borderColor: theme.border
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

        {/* Premium Mobile Header Component */}
        <div 
          className="md:hidden grid grid-cols-3 items-center px-5 py-3 sticky top-0 z-30 shadow-[0_2px_12px_rgba(0,0,0,0.03)]"
          style={{ background: theme.sidebarBg, borderBottom: `1px solid ${theme.border}` }}
        >
          <div className="flex justify-start">
            <button 
              onClick={() => setIsSidebarOpen(true)}
              className="p-1.5 -ml-1.5 text-[#FF7F50] rounded-xl active:bg-orange-50 active:scale-95 transition-all"
            >
              <List size={28} weight="bold" />
            </button>
          </div>
          
          <div className="flex flex-col items-center justify-center">
            <span className="font-extrabold text-[15px] tracking-tight font-poppins leading-none" style={{ color: theme.text }}>
              SNS Academy
            </span>
            <span className="text-[9px] text-[#FF7F50] font-bold tracking-[0.15em] uppercase mt-1">
              Parent
            </span>
          </div>

          <div className="flex justify-end">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#FF7F50] to-[#e66a3e] text-white flex items-center justify-center font-bold text-xs shadow-[0_2px_8px_rgba(255,127,80,0.3)] ring-2 ring-white">
              {activeStudent.avatar}
            </div>
          </div>
        </div>

        {/* Dynamic Page Content */}
        <div className="p-4 md:p-8 lg:p-10">
          <div className="mb-8 md:mb-10">
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
