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
import { motion, AnimatePresence } from "framer-motion";
import { Settings, BarChart3, HelpCircle } from "lucide-react";
import { AttendancePage } from "../../components/dashboard/attendance-page";
import { CalendarPage } from "../../components/dashboard/calendar-page";
import { ResultsPage } from "../../components/dashboard/results-page";
import { TransportPage } from "../../components/dashboard/transport-page";
import { ReportsPage } from "../../components/dashboard/reports-page";
import { SettingsPage } from "../../components/dashboard/settings-page";
import { NotificationsPage } from "../../components/dashboard/notifications-page";
import { ProfilePage } from "../../components/dashboard/profile-page";

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
      case "notifications": return <NotificationsPage />;
      case "attendance": return <AttendancePage />;
      case "schedule": return <ScheduleManager />;
      case "calendar": return <CalendarPage />;
      case "classes": return <ClassesSubjects />;
      case "results": return <ResultsPage />;
      case "transport": return <TransportPage />;
      case "tasks": return <ReportsPage />;
      case "communication": return <div className="h-[calc(100vh-160px)] -mx-6 lg:-mx-10 -mt-8"><ChatPage /></div>;
      case "settings": return <SettingsPage />;
      case "profile": return <ProfilePage />;
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
        <TeacherHeader 
          theme={theme} 
          toggleTheme={toggleTheme} 
          setActiveTab={setActiveTab}
        />
        
        <div className="p-6 lg:p-10 flex-1 max-w-[1600px] mx-auto w-full">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-black italic tracking-tight uppercase">
                {activeTab} <span className="text-[var(--accent)]">Dashboard</span>
              </h1>
              <p className="text-[var(--text-secondary)] text-sm font-medium mt-1 uppercase tracking-widest">Academic Year 2026-27</p>
            </div>
          </div>

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
