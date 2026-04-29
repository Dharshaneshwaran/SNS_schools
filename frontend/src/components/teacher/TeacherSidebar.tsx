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
  Moon,
  Sun
} from "lucide-react";
import { motion } from "framer-motion";

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}

const menuItems = [
  { id: "overview", label: "Overview", icon: LayoutDashboard },
  { id: "classes", label: "Classes", icon: Users },
  { id: "schedule", label: "Schedule", icon: Calendar },
  { id: "tasks", label: "Assignments", icon: FileText },
  { id: "communication", label: "Messages", icon: MessageCircle },
  { id: "resources", label: "Resources", icon: FolderOpen },
  { id: "tools", label: "Tools", icon: Settings },
];

export default function TeacherSidebar({ activeTab, setActiveTab, theme, toggleTheme }: SidebarProps) {
  return (
    <div className="hidden lg:flex flex-col h-screen w-72 bg-[var(--bg-secondary)] border-r border-[var(--border)] p-6 fixed left-0 top-0 z-50">
      {/* Brand */}
      <div className="flex items-center gap-3 mb-10 px-2">
        <div className="w-10 h-10 rounded-2xl bg-[var(--accent)] flex items-center justify-center text-white shadow-lg shadow-[var(--accent-glow)]">
          <span className="font-black text-xl italic">S</span>
        </div>
        <h1 className="text-xl font-black text-[var(--text-primary)] italic tracking-tight">
          SNS <span className="text-[var(--accent)]">ERP</span>
        </h1>
      </div>

      {/* Nav */}
      <nav className="flex-1 space-y-1.5 overflow-y-auto scrollbar-hide">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all duration-300 group relative ${
              activeTab === item.id 
                ? "text-[var(--accent)] font-bold" 
                : "text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-primary)]"
            }`}
          >
            {activeTab === item.id && (
              <motion.div 
                layoutId="sidebar-active"
                className="absolute left-0 w-1.5 h-6 bg-[var(--accent)] rounded-r-full"
              />
            )}
            <item.icon size={20} className={activeTab === item.id ? "text-[var(--accent)]" : "group-hover:scale-110 transition-transform"} />
            <span className="text-sm tracking-wide">{item.label}</span>
          </button>
        ))}
      </nav>

      {/* Bottom Actions */}
      <div className="pt-6 border-t border-[var(--border)] space-y-2">
        <button 
          onClick={toggleTheme}
          className="w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl text-[var(--text-secondary)] hover:bg-[var(--bg-primary)] transition-all"
        >
          {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
          <span className="text-sm font-medium">{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>
        </button>
        <button className="w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl text-red-500 hover:bg-red-500/10 transition-all">
          <LogOut size={20} />
          <span className="text-sm font-medium">Logout</span>
        </button>
      </div>
    </div>
  );
}
