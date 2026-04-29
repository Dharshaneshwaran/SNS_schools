"use client";

import React from "react";
import { motion } from "framer-motion";
import { Clock, Download, ChevronLeft, ChevronRight } from "lucide-react";

const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const hours = ["08 AM", "09 AM", "10 AM", "11 AM", "12 PM", "01 PM", "02 PM"];

const timetable = [
  { day: "Mon", start: "09 AM", end: "10 AM", subject: "Mathematics", class: "10-A", color: "var(--accent)" },
  { day: "Tue", start: "10 AM", end: "11 AM", subject: "Physics", class: "11-C", color: "var(--accent)" },
  { day: "Wed", start: "08 AM", end: "09 AM", subject: "Science", class: "9-B", color: "var(--accent)" },
  { day: "Thu", start: "11 AM", end: "12 PM", subject: "Calculus", class: "12-B", color: "var(--accent)" },
  { day: "Fri", start: "09 AM", end: "10 AM", subject: "Math Lab", class: "10-A", color: "var(--accent)" },
];

export default function ScheduleManager() {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      className="p-6 rounded-[32px] bg-[var(--bg-secondary)] border border-[var(--border)] shadow-[var(--card-shadow)]"
    >
      <div className="flex flex-col sm:flex-row items-center justify-between mb-8 gap-4">
        <div>
          <h3 className="text-xl font-bold text-[var(--text-primary)]">Weekly Timetable</h3>
          <p className="text-sm text-[var(--text-secondary)]">Academic Session 2026-27</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center bg-[var(--bg-primary)] rounded-xl p-1">
            <button className="p-2 rounded-lg hover:bg-[var(--bg-secondary)] transition-colors text-[var(--text-secondary)]"><ChevronLeft size={16}/></button>
            <span className="px-4 text-xs font-bold text-[var(--text-primary)]">This Week</span>
            <button className="p-2 rounded-lg hover:bg-[var(--bg-secondary)] transition-colors text-[var(--text-secondary)]"><ChevronRight size={16}/></button>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[var(--accent)] text-white text-xs font-bold hover:shadow-lg hover:shadow-[var(--accent-glow)] transition-all">
            <Download size={14} /> PDF
          </button>
        </div>
      </div>

      <div className="overflow-x-auto pb-4 scrollbar-hide">
        <div className="min-w-[700px]">
          {/* Header */}
          <div className="grid grid-cols-[80px_1fr_1fr_1fr_1fr_1fr_1fr] border-b border-[var(--border)] pb-4">
            <div className="text-xs font-bold text-[var(--text-secondary)] uppercase">Time</div>
            {days.map(day => (
              <div key={day} className="text-center text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider">{day}</div>
            ))}
          </div>

          {/* Grid */}
          <div className="relative mt-4 space-y-2">
            {hours.map(hour => (
              <div key={hour} className="grid grid-cols-[80px_1fr_1fr_1fr_1fr_1fr_1fr] items-center h-16 group">
                <div className="text-xs font-medium text-[var(--text-secondary)] group-hover:text-[var(--accent)] transition-colors">{hour}</div>
                {days.map(day => {
                  const entry = timetable.find(t => t.day === day && t.start === hour);
                  return (
                    <div key={day} className="px-1 h-full">
                      {entry ? (
                        <motion.div 
                          whileHover={{ scale: 1.05 }}
                          className="h-full w-full rounded-xl p-2 bg-[var(--accent)] text-white shadow-lg shadow-[var(--accent-glow)] flex flex-col justify-center cursor-pointer"
                        >
                          <span className="text-[10px] font-bold leading-tight line-clamp-1">{entry.subject}</span>
                          <span className="text-[9px] opacity-80">{entry.class}</span>
                        </motion.div>
                      ) : (
                        <div className="h-full w-full rounded-xl border border-dashed border-[var(--border)] opacity-20 group-hover:opacity-100 transition-opacity" />
                      )}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
