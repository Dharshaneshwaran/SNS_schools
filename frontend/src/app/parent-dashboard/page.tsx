"use client";

import { useState } from "react";
import ParentSidebar from "../../components/parent/ParentSidebar";
import EventsGallery from "../../components/parent/sections/EventsGallery";
import ProfileSection from "../../components/parent/sections/ProfileSection";
import DiarySection from "../../components/parent/sections/DiarySection";
import AcademicSection from "../../components/parent/sections/AcademicSection";
import TransportSection from "../../components/parent/sections/TransportSection";
import SettingsSection from "../../components/parent/sections/SettingsSection";
import MessagesSection from "../../components/parent/sections/MessagesSection";
import DashboardHome from "../../components/parent/sections/DashboardHome";
import { List, Bell, MagnifyingGlass, Sun, Moon } from "@phosphor-icons/react";

import { DashboardTheme } from "../../types/theme";
import { MenuKey, Student, AcademicTab } from "../../types/dashboard";

const students: Student[] = [
  { 
    id: 1, 
    name: "Arjun Sharma", 
    class: "8", 
    section: "A", 
    avatar: "AS",
    fatherNumber: "+91 00000 00000",
    fatherEmail: "father@email.com",
    motherNumber: "+91 00000 00000",
    motherEmail: "mother@email.com",
    guardianNumber: "+91 00000 00000",
    address: "Dummy Address, Street Name, City, State - Pincode",
    parentMobile: "+91 00000 00000",
    classTeacher: "Mrs. Sarah Jenkins",
    teacherEmail: "sarah.j@snsacademy.org"
  },
  { 
    id: 2, 
    name: "Priya Sharma", 
    class: "5", 
    section: "B", 
    avatar: "PS",
    fatherNumber: "+91 00000 00000",
    fatherEmail: "father@email.com",
    motherNumber: "+91 00000 00000",
    motherEmail: "mother@email.com",
    address: "Dummy Address, Street Name, City, State - Pincode",
    parentMobile: "+91 00000 00000",
    classTeacher: "Mr. Robert Wilson",
    teacherEmail: "robert.w@snsacademy.org"
  },
];

export default function ParentDashboard() {
  const [activeMenu, setActiveMenu] = useState<MenuKey>("dashboard");
  const [academicTab, setAcademicTab] = useState<AcademicTab>("calendar");
  const [activeStudent, setActiveStudent] = useState(students[0]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
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
      case "dashboard":     return <DashboardHome theme={theme} onNavigate={(tab) => { setAcademicTab(tab); setActiveMenu("academic"); }} />;
      case "events":        return <EventsGallery theme={theme} />;
      case "profile":       return <ProfileSection student={activeStudent} theme={theme} />;
      case "diary":         return <DiarySection student={activeStudent} theme={theme} />;
      case "notifications": return <DiarySection student={activeStudent} theme={theme} showOnlyNotifications={true} />; 
      case "academic":      return <AcademicSection student={activeStudent} theme={theme} initialTab={academicTab} />;
      case "transport":     return <TransportSection theme={theme} />;
      case "settings":      return <SettingsSection theme={theme} isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} />;
      case "messages":      return <MessagesSection theme={theme} />;
      default:              return <EventsGallery theme={theme} />;
    }
  };

  return (
    <div className={`mesh-bg${isDarkMode ? " dark-mode" : ""} flex min-h-screen font-sans relative overflow-hidden`} style={{ background: theme.bg, transition: "background 0.3s ease" }}>
      {/* Background Decorative Elements */}
      <div className="bg-glow" style={{ top: "-10%", left: "-10%", width: 700, height: 700, background: "radial-gradient(circle, rgba(255, 127, 80, 0.12), transparent 70%)", position: "absolute", zIndex: 0 }} />
      <div className="bg-glow" style={{ bottom: "-10%", right: "-10%", width: 600, height: 600, background: "radial-gradient(circle, rgba(79, 70, 229, 0.1), transparent 70%)", animationDelay: "-5s", position: "absolute", zIndex: 0 }} />
      
      {/* Sidebar Overlay for mobile */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-[60] lg:hidden backdrop-blur-sm"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar Wrapper */}
      <div 
        className={`fixed lg:relative inset-y-0 left-0 z-[70] transform ${isSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"} transition-transform duration-300 ease-in-out`}
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

      <main className="flex-1 h-screen lg:h-screen w-full min-w-0 relative z-10 flex flex-col overflow-hidden">
        {/* Global Dashboard Header */}
        <div 
          className="flex items-center px-5 py-3 shrink-0 z-30 shadow-[0_2px_12px_rgba(0,0,0,0.03)]"
          style={{ background: theme.isDark ? "rgba(18,18,18,0.7)" : "rgba(255,255,255,0.7)", backdropFilter: "blur(12px)", borderBottom: `1px solid ${theme.border}` }}
        >
          <button 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-1.5 -ml-1.5 mr-3 text-[#FF7F50] rounded-xl hover:bg-orange-50 active:scale-95 transition-all"
            title={isSidebarOpen ? "Hide Sidebar" : "Show Sidebar"}
          >
            <List size={28} weight="bold" />
          </button>
          
          <div className="flex-1 flex flex-col items-center justify-center">
            <span className="font-extrabold text-[15px] tracking-tight font-poppins leading-none" style={{ color: theme.text }}>
              {activeStudent.name}
            </span>
            <span className="text-[11px] font-semibold tracking-wide mt-0.5" style={{ color: theme.textMuted }}>
              Class {activeStudent.class}-{activeStudent.section}
            </span>
          </div>

          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#FF7F50] to-[#e66a3e] text-white flex items-center justify-center font-bold text-xs shadow-[0_2px_8px_rgba(255,127,80,0.3)] ring-2 ring-white">
            {activeStudent.avatar}
          </div>
        </div>

        {/* Content Area */}
        <div className={`flex-1 min-h-0 overflow-hidden flex flex-col ${activeMenu === 'messages' ? '' : 'p-4 md:p-8 lg:p-10'}`}>
          {activeMenu !== 'messages' && activeMenu !== 'dashboard' && (
            <div className="mb-8 md:mb-10 shrink-0">
              <h2 style={{ fontSize: 32, fontWeight: 900, color: theme.text, fontFamily: "var(--font-poppins,'Poppins',sans-serif)", letterSpacing: "-0.03em" }}>
                {activeStudent.name}
              </h2>
              <p style={{ color: theme.textMuted, fontWeight: 600, fontSize: 16 }}>Class {activeStudent.class}-{activeStudent.section} Student</p>
            </div>
          )}
          {renderContent()}
        </div>
      </main>
    </div>
  );
}
