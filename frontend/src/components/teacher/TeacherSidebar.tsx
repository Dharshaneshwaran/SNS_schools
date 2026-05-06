"use client";

import React from "react";
import { 
  LayoutDashboard, 
  Users, 
  Calendar, 
  FileText, 
  MessageCircle, 
  FolderOpen, 
  Settings,
  LogOut,
  Bell,
  Clock,
  GraduationCap,
  Bus,
  BarChart3,
  User,
  CalendarDays
} from "lucide-react";
import { motion } from "framer-motion";
import { useAuth } from "../../hooks/use-auth";

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const menuItems = [
  { group: "MENU", items: [
    { id: "overview", label: "Dashboard", icon: LayoutDashboard },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "attendance", label: "Attendance", icon: Users },
    { id: "schedule", label: "Timetable", icon: Clock },
    { id: "calendar", label: "Calendar", icon: CalendarDays },
  ]},
  { group: "TOOLS", items: [
    { id: "classes", label: "Students", icon: GraduationCap },
    { id: "results", label: "Results", icon: BarChart3 },
    { id: "transport", label: "Transport", icon: Bus },
    { id: "tasks", label: "Reports", icon: FileText },
    { id: "communication", label: "Chat", icon: MessageCircle },
    { id: "settings", label: "Settings", icon: Settings },
  ]}
];

export default function TeacherSidebar({ activeTab, setActiveTab }: SidebarProps) {
  const { session, logout } = useAuth();
  const teacherName = session?.user.name || "Teacher";
  const teacherRole = session?.user.role || "Faculty";
  const teacherInitial = teacherName.charAt(0).toUpperCase();

  return (
    <div className="hidden lg:flex flex-col h-screen w-72 bg-[var(--bg-secondary)] border-r border-[var(--border)] p-6 fixed left-0 top-0 z-50">
      {/* Brand */}
      <div className="space-y-6 mb-10">
        {/* Brand */}
        <div className="flex items-center gap-3 px-2">
          <img src="/images/logo.png" alt="SNS Logo" className="w-10 h-10 object-contain" />
          <h1 className="text-2xl font-black text-[var(--text-primary)] italic tracking-tight leading-none">
            SNS <span className="text-[var(--accent)] not-italic font-bold">ERP</span>
          </h1>
        </div>

        {/* Staff Profile (Top) */}
        <button 
          onClick={() => setActiveTab("profile")}
          className="w-full px-4 py-4 rounded-2xl bg-[var(--bg-primary)] border border-[var(--border)] hover:border-[var(--accent)] hover:shadow-lg hover:shadow-[var(--accent-glow)] transition-all text-left group"
        >
          <p className="text-[10px] font-black text-[var(--text-secondary)] uppercase tracking-[0.2em] mb-1 group-hover:text-[var(--accent)] transition-colors">Active {teacherRole}</p>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <p className="text-lg font-black text-[var(--text-primary)] tracking-tight">{teacherName}</p>
            </div>
            <User size={16} className="text-[var(--text-secondary)] group-hover:text-[var(--accent)] transition-colors" />
          </div>
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 space-y-8 overflow-y-auto scrollbar-hide">
        {menuItems.map((group) => (
          <div key={group.group}>
            <p className="text-[10px] font-black text-[var(--text-secondary)] uppercase tracking-[0.2em] mb-4 px-4">{group.group}</p>
            <div className="space-y-1">
              {group.items.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center gap-4 px-4 py-3 rounded-2xl transition-all duration-300 group relative ${
                    activeTab === item.id 
                      ? "bg-[var(--accent-glow)] text-[var(--accent)] font-bold" 
                      : "text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-primary)]"
                  }`}
                >
                  <item.icon size={20} className={activeTab === item.id ? "text-[var(--accent)]" : "group-hover:scale-110 transition-transform"} />
                  <span className="text-sm font-semibold tracking-wide">{item.label}</span>
                  {activeTab === item.id && (
                    <div className="absolute right-4 w-1.5 h-1.5 rounded-full bg-[var(--accent)]" />
                  )}
                </button>
              ))}
            </div>
          </div>
        ))}
      </nav>

      {/* Bottom Profile & Logout */}
      <div className="pt-6 border-t border-[var(--border)]">
        <button 
          onClick={logout}
          className="w-full flex items-center justify-center gap-3 py-4 rounded-2xl bg-red-500 text-white font-black uppercase tracking-widest text-xs hover:bg-red-600 shadow-lg shadow-red-500/20 transition-all active:scale-95"
        >
          <LogOut size={16} strokeWidth={3} />
          Logout Account
        </button>
      </div>
    </div>
  );
}
