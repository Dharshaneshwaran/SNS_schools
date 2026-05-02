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

export default function TeacherDashboard() {
  const [activeTab, setActiveTab] = useState("overview");
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const toggleTheme = () => setTheme(prev => prev === 'light' ? 'dark' : 'light');

  const renderContent = () => {
    switch (activeTab) {
      case "overview": return <DashboardOverview />;
      case "classes": return <ClassesSubjects />;
      case "schedule": return <ScheduleManager />;
      case "tasks": return <AssignmentsExams />;
      case "communication": return <div className="h-[calc(100vh-160px)] -mx-6 lg:-mx-10 -mt-8"><ChatPage /></div>;
      case "resources": return <LearningResources />;
      case "tools": return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            { label: "Performance Reports", icon: BarChart3, desc: "Detailed student analytics" },
            { label: "System Settings", icon: Settings, desc: "Notification & Privacy preferences" },
            { label: "Help & Support", icon: HelpCircle, desc: "Contact IT or administration" },
          ].map((tool, i) => (
            <motion.div 
              key={i}
              whileHover={{ y: -5 }}
              className="p-6 rounded-[32px] bg-[var(--bg-secondary)] border border-[var(--border)] shadow-[var(--card-shadow)] hover:border-[var(--accent)] transition-all cursor-pointer group"
            >
              <div className="p-4 rounded-2xl bg-[var(--bg-primary)] text-[var(--text-secondary)] group-hover:text-[var(--accent)] transition-all mb-4 w-fit">
                <tool.icon size={24} />
              </div>
              <h3 className="text-lg font-bold text-[var(--text-primary)] mb-1">{tool.label}</h3>
              <p className="text-sm text-[var(--text-secondary)]">{tool.desc}</p>
            </motion.div>
          ))}
        </div>
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
        theme={theme} 
        toggleTheme={toggleTheme} 
      />

      {/* Main Content Area */}
      <div className="flex-1 lg:ml-72 flex flex-col pb-24 lg:pb-0">
        <TeacherHeader />
        
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
