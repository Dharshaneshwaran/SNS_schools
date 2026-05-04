"use client";

import React, { useState, useEffect } from "react";
import TeacherSidebar from "../../components/teacher/TeacherSidebar";
import TeacherHeader from "../../components/teacher/TeacherHeader";
import TeacherBottomNav from "../../components/teacher/TeacherBottomNav";
import DashboardOverview from "../../components/teacher/DashboardOverview";
import ClassesSubjects from "../../components/teacher/ClassesSubjects";
import ScheduleManager from "../../components/teacher/ScheduleManager";
import AssignmentsExams from "../../components/teacher/AssignmentsExams";
import { ChatPage } from "../../components/dashboard/chat-page";
import LearningResources from "../../components/teacher/LearningResources";

// New Sections
import NotificationsSection from "../../components/teacher/sections/NotificationsSection";
import AttendanceSection from "../../components/teacher/sections/AttendanceSection";
import TimeTableSection from "../../components/teacher/sections/TimeTableSection";
import CalendarSection from "../../components/teacher/sections/CalendarSection";
import StudentsSection from "../../components/teacher/sections/StudentsSection";
import ResultsSection from "../../components/teacher/sections/ResultsSection";
import TransportSection from "../../components/teacher/sections/TransportSection";
import ReportsSection from "../../components/teacher/sections/ReportsSection";
import SettingsSection from "../../components/teacher/sections/SettingsSection";
import TeacherChatSection from "../../components/teacher/sections/TeacherChatSection";

import { motion, AnimatePresence } from "framer-motion";
import { Settings, BarChart3, HelpCircle } from "lucide-react";

export default function TeacherDashboard() {
  const [activeTab, setActiveTab] = useState("overview");
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const toggleTheme = () => setTheme(prev => prev === 'light' ? 'dark' : 'light');

  const renderContent = () => {
    switch (activeTab) {
      case "overview": return <DashboardOverview />;
      case "notifications": return <NotificationsSection />;
      case "attendance": return <AttendanceSection />;
      case "schedule": return <TimeTableSection />;
      case "calendar": return <CalendarSection />;
      case "classes": return <StudentsSection />;
      case "results": return <ResultsSection />;
      case "transport": return <TransportSection />;
      case "tasks": return <ReportsSection />;
      case "communication": return <TeacherChatSection />;
      case "settings": return <SettingsSection />;
      case "profile": return (
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-2xl p-10 rounded-[48px] bg-[var(--bg-secondary)] border border-[var(--border)] shadow-2xl relative overflow-hidden"
        >
          <div className="relative z-10">
            <div className="flex items-center gap-6 mb-10">
              <div className="w-24 h-24 rounded-[32px] bg-zinc-800 text-white flex items-center justify-center text-4xl font-black italic shadow-xl">
                Y
              </div>
              <div>
                <h2 className="text-4xl font-black italic text-[var(--text-primary)] tracking-tight">Yukesh</h2>
                <p className="text-[var(--accent)] font-black uppercase tracking-[0.2em] text-xs mt-1">Senior Teacher · Computer Science</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {[
                { label: "Mobile Number", value: "+91 98765 43210" },
                { label: "Email Address", value: "yukesh.v@snsacademy.org" },
                { label: "Employee ID", value: "SNS-T-2026-001" },
                { label: "Department", value: "Science & Engineering" },
                { label: "Address", value: "SNS Academy Campus, Coimbatore" },
                { label: "Joining Date", value: "15th August 2026" },
              ].map((info, i) => (
                <div key={i} className="space-y-1">
                  <p className="text-[10px] font-black text-[var(--text-secondary)] uppercase tracking-widest">{info.label}</p>
                  <p className="text-lg font-bold text-[var(--text-primary)]">{info.value}</p>
                </div>
              ))}
            </div>
          </div>
          
          <div className="absolute -right-20 -top-20 w-80 h-80 bg-[var(--accent-glow)] rounded-full blur-3xl opacity-30" />
        </motion.div>
      );
      default: return <DashboardOverview />;
    }
  };

  return (
    <main className="teacher-dashboard min-h-screen flex text-[var(--text-primary)]">
      {/* Sidebar (Desktop Only) */}
      <TeacherSidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
      />

      {/* Main Content Area */}
      <div className="flex-1 lg:ml-72 flex flex-col pb-24 lg:pb-0">
        <TeacherHeader theme={theme} toggleTheme={toggleTheme} />
        
        <div className="p-6 lg:p-10 flex-1 max-w-[1600px] mx-auto w-full">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {renderContent()}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Bottom Nav (Mobile Only) */}
      <TeacherBottomNav activeTab={activeTab} setActiveTab={setActiveTab} />
    </main>
  );
}
