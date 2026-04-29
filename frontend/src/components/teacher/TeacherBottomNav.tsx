"use client";

import React from "react";
import { 
  LayoutDashboard, 
  Users, 
  Calendar, 
  FileText, 
  MessageCircle 
} from "lucide-react";
import { motion } from "framer-motion";

interface BottomNavProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const navItems = [
  { id: "overview", icon: LayoutDashboard },
  { id: "classes", icon: Users },
  { id: "schedule", icon: Calendar },
  { id: "tasks", icon: FileText },
  { id: "communication", icon: MessageCircle },
];

export default function TeacherBottomNav({ activeTab, setActiveTab }: BottomNavProps) {
  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 px-4 pb-4">
      <div className="bg-[var(--bg-secondary)]/90 backdrop-blur-2xl border border-[var(--border)] rounded-[24px] h-20 shadow-2xl flex items-center justify-around px-2 relative overflow-hidden">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className="flex flex-col items-center justify-center gap-1.5 w-14 h-14 relative"
          >
            {activeTab === item.id && (
              <motion.div 
                layoutId="bottom-nav-active"
                className="absolute inset-0 bg-[var(--accent-glow)] rounded-2xl"
                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
              />
            )}
            <item.icon 
              size={22} 
              className={`transition-all duration-300 ${
                activeTab === item.id ? "text-[var(--accent)] scale-110" : "text-[var(--text-secondary)]"
              }`} 
            />
            {activeTab === item.id && (
              <motion.div 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="w-1.5 h-1.5 rounded-full bg-[var(--accent)]"
              />
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
