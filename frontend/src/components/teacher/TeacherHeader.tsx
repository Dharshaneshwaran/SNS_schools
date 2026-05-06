"use client";

import React from "react";
import { 
  Bell, 
  Search, 
  User, 
  Settings,
  Menu,
  ChevronDown,
  Moon,
  Sun
} from "lucide-react";

interface HeaderProps {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  setActiveTab: (tab: string) => void;
}

export default function TeacherHeader({ theme, toggleTheme, setActiveTab }: HeaderProps) {
  return (
    <header className="h-20 bg-[var(--bg-primary)]/80 backdrop-blur-xl border-b border-[var(--border)] sticky top-0 z-40 px-6 lg:px-10 flex items-center justify-between">
      {/* Mobile Menu Toggle (Hidden on desktop) */}
      <div className="flex lg:hidden items-center gap-4">
        <button className="p-2 rounded-xl bg-[var(--bg-secondary)] text-[var(--text-primary)]">
          <Menu size={20} />
        </button>
      </div>

      {/* Search Bar (Desktop) */}
      <div className="hidden md:flex relative w-96">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-secondary)]" size={18} />
        <input 
          type="text" 
          placeholder="Search students, classes, or files..."
          className="w-full pl-12 pr-4 py-3 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border)] focus:border-[var(--accent)] text-sm transition-all text-[var(--text-primary)] outline-none"
        />
      </div>

      {/* Right Side Actions */}
      <div className="flex items-center gap-3 sm:gap-4">
        {/* Theme Toggle */}
        <button 
          onClick={toggleTheme}
          className="p-3 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border)] text-[var(--text-secondary)] hover:text-[var(--accent)] hover:border-[var(--accent)] transition-all"
        >
          {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
        </button>

        {/* Notifications */}
        <button 
          onClick={() => setActiveTab("notifications")}
          className="p-3 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border)] text-[var(--text-secondary)] hover:text-[var(--accent)] hover:border-[var(--accent)] transition-all relative group"
        >
          <Bell size={20} />
          <span className="absolute top-3 right-3 w-2 h-2 bg-[var(--accent)] rounded-full border-2 border-[var(--bg-secondary)] shadow-[0_0_8px_var(--accent)] group-hover:scale-125 transition-transform" />
        </button>
      </div>
    </header>
  );
}
