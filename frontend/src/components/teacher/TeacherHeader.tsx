"use client";

import React from "react";
import { 
  Bell, 
  Search, 
  User, 
  Settings,
  Menu,
  ChevronDown
} from "lucide-react";

export default function TeacherHeader() {
  return (
    <header className="h-20 bg-[var(--bg-primary)]/80 backdrop-blur-xl border-b border-[var(--border)] sticky top-0 z-40 px-6 lg:px-10 flex items-center justify-between">
      {/* Mobile Menu Toggle & Brand (Hidden on desktop) */}
      <div className="flex lg:hidden items-center gap-3">
        <button className="p-2 rounded-xl bg-[var(--bg-secondary)] text-[var(--text-primary)]">
          <Menu size={20} />
        </button>
        <h1 className="text-lg font-black italic tracking-tight text-[var(--text-primary)]">SNS</h1>
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
      <div className="flex items-center gap-3 sm:gap-6">
        <button className="p-3 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border)] text-[var(--text-secondary)] hover:text-[var(--accent)] hover:border-[var(--accent)] transition-all relative group">
          <Bell size={20} />
          <span className="absolute top-3 right-3 w-2 h-2 bg-[var(--accent)] rounded-full border-2 border-[var(--bg-secondary)] shadow-[0_0_8px_var(--accent)] group-hover:scale-125 transition-transform" />
        </button>

        <div className="h-10 w-px bg-[var(--border)] hidden sm:block" />

        <button className="flex items-center gap-3 p-1.5 pr-4 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border)] hover:border-[var(--accent)] transition-all group">
          <div className="w-10 h-10 rounded-xl bg-[var(--accent-glow)] flex items-center justify-center text-[var(--accent)] overflow-hidden">
            <User size={24} />
          </div>
          <div className="hidden sm:block text-left">
            <h4 className="text-sm font-bold text-[var(--text-primary)] leading-tight">Sarah Jenkins</h4>
            <p className="text-[10px] font-bold text-[var(--text-secondary)] uppercase tracking-wider">Senior Teacher</p>
          </div>
          <ChevronDown size={14} className="text-[var(--text-secondary)] group-hover:text-[var(--accent)] transition-colors" />
        </button>
      </div>
    </header>
  );
}
