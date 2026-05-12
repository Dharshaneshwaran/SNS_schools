"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { 
  MagnifyingGlass, 
  Command, 
  Layout, 
  Users, 
  Bell, 
  Calendar, 
  GraduationCap, 
  Gear,
  FileText,
  IdentificationCard,
  UserPlus,
  ArrowRight
} from "@phosphor-icons/react";
import { motion, AnimatePresence } from "framer-motion";

interface CommandItem {
  id: string;
  label: string;
  href: string;
  icon: React.ReactNode;
  category: string;
}

const COMMANDS: CommandItem[] = [
  { id: "dashboard", label: "Dashboard", href: "/dashboard", icon: <Layout size={18} />, category: "General" },
  { id: "notifications", label: "Notifications", href: "/dashboard/notifications", icon: <Bell size={18} />, category: "General" },
  { id: "users", label: "User Directory", href: "/dashboard/users", icon: <Users size={18} />, category: "Management" },
  { id: "staff", label: "Staff Management", href: "/dashboard/staff", icon: <IdentificationCard size={18} />, category: "Management" },
  { id: "admission", label: "Admissions", href: "/dashboard/admission", icon: <UserPlus size={18} />, category: "Management" },
  { id: "attendance", label: "Attendance", href: "/dashboard/attendance", icon: <Calendar size={18} />, category: "Tools" },
  { id: "timetable", label: "Timetable", href: "/dashboard/timetable", icon: <Calendar size={18} />, category: "Tools" },
  { id: "results", label: "Results", href: "/dashboard/results", icon: <GraduationCap size={18} />, category: "Tools" },
  { id: "reports", label: "Reports", href: "/dashboard/reports", icon: <FileText size={18} />, category: "Tools" },
  { id: "settings", label: "Settings", href: "/dashboard/settings", icon: <Gear size={18} />, category: "System" },
];

export function CommandPalette() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const router = useRouter();

  const filteredCommands = COMMANDS.filter(cmd => 
    cmd.label.toLowerCase().includes(query.toLowerCase()) ||
    cmd.category.toLowerCase().includes(query.toLowerCase())
  );

  const toggle = useCallback(() => setIsOpen(prev => !prev), []);

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        toggle();
      }
      if (e.key === "Escape") {
        setIsOpen(false);
      }
    };

    window.addEventListener("keydown", down);
    return () => window.removeEventListener("keydown", down);
  }, [toggle]);

  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  const handleSelect = (href: string) => {
    router.push(href);
    setIsOpen(false);
    setQuery("");
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex(prev => (prev + 1) % filteredCommands.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex(prev => (prev - 1 + filteredCommands.length) % filteredCommands.length);
    } else if (e.key === "Enter" && filteredCommands.length > 0) {
      handleSelect(filteredCommands[selectedIndex].href);
    }
  };

  // Add event listener to open from sidebar
  useEffect(() => {
    const handleOpenCommandPalette = () => setIsOpen(true);
    window.addEventListener("open-command-palette", handleOpenCommandPalette);
    return () => window.removeEventListener("open-command-palette", handleOpenCommandPalette);
  }, []);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[100]"
          />

          {/* Dialog */}
          <div className="fixed inset-0 z-[101] flex items-start justify-center pt-[15vh] px-4 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -20 }}
              className="w-full max-w-xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden pointer-events-auto"
            >
              <div className="flex items-center px-4 py-4 border-b border-slate-100 bg-slate-50/50">
                <MagnifyingGlass size={20} className="text-slate-400 mr-3 shrink-0" />
                <input
                  autoFocus
                  placeholder="Type a command or search..."
                  className="w-full bg-transparent border-none outline-none text-slate-900 placeholder:text-slate-400 text-sm font-medium"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={onKeyDown}
                />
                <div className="flex items-center gap-1 shrink-0 ml-2">
                  <span className="px-1.5 py-0.5 rounded border border-slate-200 bg-white text-[10px] font-bold text-slate-400 flex items-center gap-0.5 shadow-sm">
                    <Command size={10} /> K
                  </span>
                </div>
              </div>

              <div className="max-h-[360px] overflow-y-auto p-2">
                {filteredCommands.length > 0 ? (
                  <div className="space-y-1">
                    {filteredCommands.map((cmd, index) => (
                      <button
                        key={cmd.id}
                        onClick={() => handleSelect(cmd.href)}
                        onMouseEnter={() => setSelectedIndex(index)}
                        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all ${
                          index === selectedIndex 
                            ? "bg-[#FF7F50] text-white shadow-lg shadow-[#FF7F50]/20" 
                            : "text-slate-600 hover:bg-slate-50"
                        }`}
                      >
                        <span className={`${index === selectedIndex ? "text-white" : "text-slate-400"}`}>
                          {cmd.icon}
                        </span>
                        <div className="flex-1 text-left">
                          <p className="text-[13px] font-bold leading-none">{cmd.label}</p>
                          <p className={`text-[10px] font-medium mt-1 ${index === selectedIndex ? "text-white/70" : "text-slate-400"}`}>
                            {cmd.category}
                          </p>
                        </div>
                        {index === selectedIndex && (
                          <ArrowRight size={14} weight="bold" className="text-white/80" />
                        )}
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="py-12 flex flex-col items-center justify-center text-slate-400">
                    <MagnifyingGlass size={32} weight="duotone" className="mb-2 opacity-20" />
                    <p className="text-sm font-medium">No results found for "{query}"</p>
                  </div>
                )}
              </div>

              <div className="px-4 py-3 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1.5">
                    <span className="px-1 py-0.5 rounded border border-slate-200 bg-white shadow-sm">↑↓</span>
                    Navigate
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="px-1 py-0.5 rounded border border-slate-200 bg-white shadow-sm">Enter</span>
                    Select
                  </div>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="px-1 py-0.5 rounded border border-slate-200 bg-white shadow-sm">ESC</span>
                  Close
                </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
