"use client";

import { useState, useEffect } from "react";
import ParentSidebar from "../../components/parent/ParentSidebar";
import EventsGallery from "../../components/parent/sections/EventsGallery";
import ProfileSection from "../../components/parent/sections/ProfileSection";
import DiarySection from "../../components/parent/sections/DiarySection";
import AcademicSection from "../../components/parent/sections/AcademicSection";
import TransportSection from "../../components/parent/sections/TransportSection";
import SettingsSection from "../../components/parent/sections/SettingsSection";
import NotificationsSection from "../../components/parent/sections/NotificationsSection";
import DashboardHome from "../../components/parent/sections/DashboardHome";
import MobileBottomNav from "../../components/parent/MobileBottomNav";
import { ChatPage } from "../../components/dashboard/chat-page";
import {
  Bell, Sun, Moon, List, GraduationCap,
  CalendarBlank, CalendarCheck, Clock, ChartBar, ClipboardText, PaperPlaneTilt,
  BookOpen, IdentificationCard, Bus, Gear,
} from "@phosphor-icons/react";

import { DashboardTheme } from "../../types/theme";
import { MenuKey, Student, AcademicTab } from "../../types/dashboard";
import { useAuth } from "../../hooks/use-auth";
import { notificationService } from "../../services/notification-service";


function readLinkedStudents(): Student[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = JSON.parse(localStorage.getItem("sns-linked-students") || "[]") as {
      id: string; name: string; studentId: string; class?: string; section?: string;
    }[];
    return raw.map((s) => ({
      id: s.id,
      studentId: s.studentId,
      name: s.name,
      class: s.class || "N/A",
      section: s.section || "N/A",
      avatar: s.name.split(" ").map((n: string) => n[0]).join("").toUpperCase(),
      schoolName: "SNS Academy, Coimbatore",
      classTeacher: "Assigning...",
      teacherEmail: "contact@school.com",
    }));
  } catch { return []; }
}

export default function ParentDashboard() {
  const { session, isBootstrapping } = useAuth();
  const [activeMenu, setActiveMenu] = useState<MenuKey>("dashboard");
  const [academicTab, setAcademicTab] = useState<AcademicTab | "timetable">("calendar");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [bellCount, setBellCount] = useState(0);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof window === 'undefined') return false;
    try {
      const saved = localStorage.getItem('sns-dark-mode');
      return saved ? JSON.parse(saved) : false;
    } catch {
      return false;
    }
  });

  // Persist dark mode preference to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('sns-dark-mode', JSON.stringify(isDarkMode));
      // Update document class and attribute for global CSS selectors
      if (typeof document !== 'undefined') {
        if (isDarkMode) {
          document.documentElement.classList.add('dark');
          document.documentElement.setAttribute('data-theme', 'dark');
        } else {
          document.documentElement.classList.remove('dark');
          document.documentElement.setAttribute('data-theme', 'light');
        }
      }
    } catch {
      // Silently fail if localStorage is not available
    }
  }, [isDarkMode]);

  // Primary student derived from session
  const studentProfile = session?.user?.studentProfile;
  const primaryStudent: Student = {
    id: studentProfile?.id || "N/A",
    studentId: studentProfile?.studentId || "N/A",
    name: session?.user?.name || "Student Name",
    class: studentProfile?.class || "N/A",
    section: studentProfile?.section || "N/A",
    avatar: (session?.user?.name || "S").split(" ").map(n => n[0]).join("").toUpperCase(),
    schoolName: studentProfile?.presentSchool || "SNS Academy, Coimbatore",
    fatherName: studentProfile?.fatherName || "Not Provided",
    fatherNumber: studentProfile?.fatherContact || "N/A",
    fatherEmail: studentProfile?.fatherEmail || "N/A",
    motherName: studentProfile?.motherName || "Not Provided",
    motherNumber: studentProfile?.motherContact || "N/A",
    motherEmail: studentProfile?.motherEmail || "N/A",
    guardianName: "Not Provided",
    guardianNumber: "N/A",
    relation: "Contact",
    address: studentProfile?.fatherOfficeAddress || "N/A",
    parentMobile: studentProfile?.fatherContact || "N/A",
    classTeacher: "Assigning...",
    teacherEmail: "contact@school.com"
  };

  // Linked students from localStorage — updates live via storage events
  const [linkedStudents, setLinkedStudents] = useState<Student[]>(() => readLinkedStudents());

  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === "sns-linked-students") setLinkedStudents(readLinkedStudents());
    };
    window.addEventListener("storage", onStorage);
    // Also poll when the tab regains focus (same-tab localStorage changes don't fire storage events)
    const onFocus = () => setLinkedStudents(readLinkedStudents());
    window.addEventListener("focus", onFocus);
    return () => { window.removeEventListener("storage", onStorage); window.removeEventListener("focus", onFocus); };
  }, []);

  const students: Student[] = [primaryStudent, ...linkedStudents.filter((s) => s.id !== primaryStudent.id)];

  // Active student state — defaults to primary, can be switched via dropdown
  const [activeStudent, setActiveStudent] = useState<Student>(primaryStudent);

  // When session loads (after bootstrap), ensure primary student is up to date
  useEffect(() => {
    if (session?.user && activeStudent.id === "N/A") {
      setActiveStudent(primaryStudent);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session?.user?.id]);

  // Fetch unread notification count for the bell badge
  useEffect(() => {
    if (!session?.accessToken) return;
    notificationService
      .getNotifications(session.accessToken)
      .then((list) => setBellCount(list.filter((n) => !n.isRead).length))
      .catch(() => {});
  }, [session?.accessToken]);

  if (isBootstrapping) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FF7F50]"></div>
      </div>
    );
  }

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
      case "dashboard":     return <DashboardHome theme={theme} onNavigate={(tab) => { setAcademicTab(tab); setActiveMenu("academic"); }} onNavigateMenu={setActiveMenu} />;
      case "events":        return <EventsGallery theme={theme} />;
      case "profile":       return <ProfileSection student={activeStudent} theme={theme} />;
      case "diary":         return <DiarySection student={activeStudent} theme={theme} />;
      case "notifications": return <NotificationsSection theme={theme} />;
      case "academic":      return <AcademicSection student={activeStudent} theme={theme} initialTab={academicTab} onTabChange={setAcademicTab} />;
      case "transport":     return <TransportSection theme={theme} />;
      case "settings":      return <SettingsSection theme={theme} isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} />;
      case "communication": return <div className="flex-1 min-h-0 min-w-0 overflow-hidden"><ChatPage /></div>;
      default:              return <EventsGallery theme={theme} />;
    }
  };

  /* ── Contextual page header: icon tile + what you're looking at + who it's for.
        Replaces the old "student name / class" block, which duplicated the top bar. ── */
  const academicMeta: Record<string, { title: string; icon: React.ReactNode }> = {
    calendar:   { title: "Academic Calendar", icon: <CalendarBlank size={24} weight="bold" /> },
    attendance: { title: "Attendance",        icon: <CalendarCheck size={24} weight="bold" /> },
    timetable:  { title: "Time Table",        icon: <Clock size={24} weight="bold" /> },
    exam:       { title: "Exam Report Card",  icon: <ChartBar size={24} weight="bold" /> },
    schedule:   { title: "Exam Schedule",     icon: <ClipboardText size={24} weight="bold" /> },
    leave:      { title: "Leave Application", icon: <PaperPlaneTilt size={24} weight="bold" /> },
  };
  const sectionMeta: { title: string; icon: React.ReactNode } | undefined =
    activeMenu === "academic"
      ? academicMeta[academicTab]
      : ({
          diary:         { title: "Diary & Homework",   icon: <BookOpen size={24} weight="bold" /> },
          profile:       { title: "Student Profile",    icon: <IdentificationCard size={24} weight="bold" /> },
          transport:     { title: "Transport Tracking", icon: <Bus size={24} weight="bold" /> },
          settings:      { title: "Settings",           icon: <Gear size={24} weight="bold" /> },
          notifications: { title: "Announcements",      icon: <Bell size={24} weight="bold" /> },
        } as Record<string, { title: string; icon: React.ReactNode }>)[activeMenu];

  return (
    <div className={`mesh-bg${isDarkMode ? " dark-mode" : ""} flex h-screen w-full max-w-full font-sans relative overflow-hidden`} style={{ background: theme.bg, transition: "background 0.3s ease", overflow: "clip" }}>
      {/* Background Decorative Elements — clipped in their own layer so they never
          widen the root box (an overflow:hidden root can still be scrolled
          programmatically by scrollIntoView, which shifted the whole page sideways). */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
        <div className="bg-glow" style={{ top: "-10%", left: "-10%", width: 700, height: 700, background: "radial-gradient(circle, rgba(255, 127, 80, 0.12), transparent 70%)", position: "absolute", zIndex: 0 }} />
        <div className="bg-glow" style={{ bottom: "-10%", right: "-10%", width: 600, height: 600, background: "radial-gradient(circle, rgba(79, 70, 229, 0.1), transparent 70%)", animationDelay: "-5s", position: "absolute", zIndex: 0 }} />
      </div>

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

      <main className="flex-1 h-screen min-w-0 max-w-full relative z-10 flex flex-col overflow-hidden pb-[calc(78px_+_env(safe-area-inset-bottom,0px))] lg:pb-0">
        {/* Global Dashboard Header */}
        <div
          className="flex items-center px-4 md:px-6 py-3 sm:py-4 shrink-0 z-30 shadow-[0_4px_20px_rgba(0,0,0,0.04)]"
          style={{
            background: theme.isDark ? "rgba(18,18,18,0.85)" : "rgba(255,255,255,0.85)",
            backdropFilter: "blur(16px)",
            borderBottom: `1px solid ${theme.border}`,
          }}
        >
          {/* Left slot — hamburger below lg, context label on desktop. Flex-1 on
              both sides keeps the student name dead-centre in the bar. */}
          <div className="flex-1 min-w-0 flex items-center gap-2">
            <button
              type="button"
              aria-label="Open menu"
              title="Open menu"
              onClick={() => setIsSidebarOpen(true)}
              className="icon-btn lg:hidden w-9 h-9 shrink-0 rounded-full flex items-center justify-center active:scale-95"
              style={{ background: "rgba(255,127,80,0.10)", color: "#FF7F50" }}
            >
              <List size={19} weight="bold" />
            </button>
            <span
              className="hidden lg:flex items-center gap-2 text-[11px] font-extrabold uppercase tracking-[0.14em] whitespace-nowrap"
              style={{ color: theme.textMuted }}
            >
              <CalendarBlank size={15} weight="bold" style={{ color: "#FF7F50" }} />
              {new Date().toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short", year: "numeric" })}
            </span>
          </div>

          {/* Centre — student identity */}
          <div className="min-w-0 max-w-[46%] flex flex-col items-center">
            <span
              className="w-full text-center truncate font-extrabold text-[15px] tracking-tight leading-none"
              style={{ color: theme.text, fontFamily: "var(--font-poppins,'Poppins',sans-serif)" }}
            >
              {activeStudent.name}
            </span>
            <span
              className="w-full text-center truncate text-[11px] font-semibold tracking-wide mt-1"
              style={{ color: theme.textMuted }}
            >
              Class {activeStudent.class}-{activeStudent.section}
            </span>
          </div>

          {/* Right controls */}
          <div className="flex-1 min-w-0 flex items-center justify-end gap-2">
            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              className="icon-btn w-9 h-9 shrink-0 rounded-full flex items-center justify-center active:scale-95"
              style={{ background: "rgba(255,127,80,0.10)", color: "#FF7F50" }}
              title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
              aria-label={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
            >
              {isDarkMode ? <Sun size={19} weight="bold" /> : <Moon size={19} weight="bold" />}
            </button>

            {/* Bell with live count badge */}
            <button
              onClick={() => setActiveMenu("notifications")}
              className="icon-btn relative w-9 h-9 shrink-0 rounded-full flex items-center justify-center active:scale-95"
              style={{ background: "rgba(255,127,80,0.10)", color: "#FF7F50" }}
              title="Notifications"
              aria-label="Notifications"
            >
              <Bell size={19} weight="bold" />
              {bellCount > 0 && (
                <span
                  className="absolute -top-1 -right-1 min-w-[17px] h-[17px] bg-[#EF4444] rounded-full flex items-center justify-center text-[9px] font-black text-white px-1"
                  style={{ boxShadow: `0 0 0 2px ${theme.isDark ? "#121212" : "#FFFFFF"}` }}
                >
                  {bellCount > 99 ? "99+" : bellCount}
                </span>
              )}
            </button>

            {/* Avatar — profile shortcut (menu opens from the hamburger below lg) */}
            <button
              type="button"
              aria-label="Open profile"
              title="Profile"
              onClick={() => setActiveMenu("profile")}
              className="w-9 h-9 shrink-0 rounded-full bg-gradient-to-br from-[#FF7F50] to-[#e66a3e] text-white flex items-center justify-center font-bold text-xs active:scale-95 transition-transform cursor-pointer"
              style={{ boxShadow: `0 2px 8px rgba(255,127,80,0.30), 0 0 0 2px ${theme.isDark ? "rgba(255,255,255,0.18)" : "#FFFFFF"}` }}
            >
              {activeStudent.avatar}
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className={`flex-1 min-h-0 min-w-0 custom-scrollbar flex flex-col ${activeMenu === 'communication' ? 'overflow-hidden' : 'overflow-y-auto pt-2 pb-8 px-4 md:px-6 lg:px-8'}`}>
          {sectionMeta && (
            <div className="mb-4 sm:mb-6 md:mb-8 shrink-0 flex items-center gap-3 sm:gap-4">
              {/* Gradient icon tile — swaps with the active section/tab */}
              <div
                className="shrink-0 w-12 h-12 sm:w-[52px] sm:h-[52px] rounded-2xl flex items-center justify-center text-white"
                style={{ background: "linear-gradient(135deg, #FF7F50, #e66a3e)", boxShadow: "0 10px 24px rgba(255,127,80,0.30)" }}
              >
                {sectionMeta.icon}
              </div>
              <div className="min-w-0 flex-1">
                <h2
                  className="truncate text-[21px] sm:text-[26px] md:text-[30px]"
                  style={{ fontWeight: 900, color: theme.text, fontFamily: "var(--font-poppins,'Poppins',sans-serif)", letterSpacing: "-0.03em", lineHeight: 1.15 }}
                >
                  {sectionMeta.title}
                </h2>
                <p className="truncate text-[13px] sm:text-[15px]" style={{ color: theme.textMuted, fontWeight: 600 }}>
                  {activeStudent.name}
                </p>
              </div>
              <span
                className="hidden sm:inline-flex shrink-0 items-center gap-1.5 px-3.5 py-2 rounded-full text-[12px] font-extrabold whitespace-nowrap"
                style={{ background: theme.isDark ? "rgba(255,127,80,0.14)" : "rgba(255,127,80,0.10)", color: "#FF7F50", border: "1px solid rgba(255,127,80,0.20)" }}
              >
                <GraduationCap size={15} weight="bold" />
                Class {activeStudent.class}-{activeStudent.section}
              </span>
            </div>
          )}
          {renderContent()}
        </div>
      </main>

      {/* Fixed mobile bottom navigation — Figma button placement */}
      <MobileBottomNav
        activeMenu={activeMenu}
        academicTab={academicTab}
        theme={theme}
        onNavigate={(menu, tab) => {
          if (tab) setAcademicTab(tab);
          setActiveMenu(menu);
          setIsSidebarOpen(false);
        }}
      />
    </div>
  );
}
