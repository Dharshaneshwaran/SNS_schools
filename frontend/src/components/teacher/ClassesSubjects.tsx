"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ChevronDown, 
  Users, 
  ClipboardCheck, 
  BarChart3, 
  BookOpen, 
  MoreVertical,
  GraduationCap,
  MessageSquare
} from "lucide-react";

interface ClassCardProps {
  title: string;
  subtitle: string;
  students: number;
  type: "Class Teacher" | "Subject Teacher";
  isOpen: boolean;
  onToggle: () => void;
}

const ClassCard = ({ title, subtitle, students, type, isOpen, onToggle }: ClassCardProps) => {
  return (
    <div className="rounded-[24px] bg-[var(--bg-secondary)] border border-[var(--border)] shadow-[var(--card-shadow)] overflow-hidden transition-all duration-300">
      <div 
        onClick={onToggle}
        className="p-6 cursor-pointer flex items-center justify-between group"
      >
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-2xl bg-[var(--accent-glow)] text-[var(--accent)] group-hover:scale-110 transition-transform">
            <GraduationCap size={24} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-bold text-[var(--text-primary)]">{title}</h3>
              <span className="px-2 py-0.5 rounded-full bg-[var(--bg-primary)] text-[var(--text-secondary)] text-[10px] font-bold uppercase tracking-wider">
                {type}
              </span>
            </div>
            <p className="text-sm text-[var(--text-secondary)]">{subtitle}</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[var(--bg-primary)] text-[var(--text-secondary)] text-sm">
            <Users size={16} />
            <span>{students} Students</span>
          </div>
          <motion.div
            animate={{ rotate: isOpen ? 180 : 0 }}
            className="text-[var(--text-secondary)]"
          >
            <ChevronDown size={20} />
          </motion.div>
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            <div className="p-6 pt-0 border-t border-[var(--border)] bg-[var(--bg-primary)]/50">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-6">
                {[
                  { label: "Attendance", icon: ClipboardCheck, color: "#3B82F6" },
                  { label: "Marks Entry", icon: BookOpen, color: "#10B981" },
                  { label: "Insights", icon: BarChart3, color: "#8B5CF6" },
                  { label: "Contact", icon: MessageSquare, color: "#FF6A00" },
                ].map((action, i) => (
                  <button 
                    key={i}
                    className="flex flex-col items-center gap-3 p-4 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border)] hover:border-[var(--accent)] hover:shadow-lg transition-all group"
                  >
                    <div className="p-2.5 rounded-xl bg-[var(--bg-primary)] text-[var(--text-secondary)] group-hover:text-[var(--accent)] transition-colors">
                      <action.icon size={20} />
                    </div>
                    <span className="text-xs font-bold text-[var(--text-primary)]">{action.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default function ClassesSubjects() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const classes = [
    { title: "Grade 10-A", subtitle: "Mathematics & Science", students: 42, type: "Class Teacher" as const },
    { title: "Grade 11-C", subtitle: "Physics", students: 38, type: "Subject Teacher" as const },
    { title: "Grade 12-B", subtitle: "Advanced Calculus", students: 35, type: "Subject Teacher" as const },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-2xl font-bold text-[var(--text-primary)] px-2">Classes & Subjects</h2>
        <button className="p-2 rounded-xl text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)] transition-colors">
          <MoreVertical size={20} />
        </button>
      </div>
      {classes.map((cls, i) => (
        <ClassCard 
          key={i}
          {...cls}
          isOpen={openIndex === i}
          onToggle={() => setOpenIndex(openIndex === i ? null : i)}
        />
      ))}
    </div>
  );
}
