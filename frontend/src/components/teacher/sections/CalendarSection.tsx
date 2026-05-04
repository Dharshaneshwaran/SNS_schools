"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Calendar as CalendarIcon, 
  ChevronLeft, 
  ChevronRight, 
} from "lucide-react";

const academicEvents = [
  { date: "2026-05-15", title: "Mid-Term Exams Start", type: "exam" },
  { date: "2026-05-22", title: "Teacher's Workshop", type: "event" },
  { date: "2026-06-01", title: "Summer Break Starts", type: "holiday" },
];

const teacherAttendance = {
  "2026-05-01": "present",
  "2026-05-02": "present",
  "2026-05-03": "holiday",
  "2026-05-04": "present",
  "2026-05-05": "present",
};

export default function CalendarSection() {
  const [activeTab, setActiveTab] = useState<"academic" | "attendance">("academic");
  const [currentDate, setCurrentDate] = useState(new Date(2026, 4, 1)); // May 2026

  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();

  const monthName = currentDate.toLocaleString('default', { month: 'long' });
  const year = currentDate.getFullYear();

  return (
    <div className="space-y-4 max-h-[calc(100vh-140px)] overflow-y-auto pr-2 scrollbar-hide">
      {/* Compact Header */}
      <div className="flex items-center justify-between bg-[var(--bg-secondary)] p-2 px-4 rounded-[20px] border border-[var(--border)] sticky top-0 z-20 backdrop-blur-md bg-opacity-80">
        <div className="flex items-center gap-3">
          <div className="p-1.5 rounded-lg bg-[var(--accent)] text-white shadow-md">
            <CalendarIcon size={14} />
          </div>
          <h2 className="text-sm font-black italic uppercase tracking-tight text-[var(--text-primary)]">
            {activeTab === 'academic' ? 'Academic' : 'Attendance'} <span className="text-[var(--accent)]">Hub</span>
          </h2>
        </div>

        <div className="flex items-center gap-1 bg-[var(--bg-primary)] p-0.5 rounded-lg border border-[var(--border)]">
          <button 
            onClick={() => setActiveTab("academic")}
            className={`px-3 py-1 rounded-md text-[9px] font-black uppercase tracking-widest transition-all ${
              activeTab === "academic" ? "bg-[var(--accent)] text-white" : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
            }`}
          >
            Academic
          </button>
          <button 
            onClick={() => setActiveTab("attendance")}
            className={`px-3 py-1 rounded-md text-[9px] font-black uppercase tracking-widest transition-all ${
              activeTab === "attendance" ? "bg-[var(--accent)] text-white" : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
            }`}
          >
            Attendance
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        {/* Calendar Grid */}
        <div className="lg:col-span-3 p-5 rounded-[32px] bg-[var(--bg-secondary)] border border-[var(--border)] shadow-[var(--card-shadow)]">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-black text-[var(--text-primary)] uppercase tracking-tight italic">
              {monthName} <span className="text-[var(--accent)]">{year}</span>
            </h3>
            <div className="flex gap-1.5">
              <button className="p-1.5 rounded-lg bg-[var(--bg-primary)] border border-[var(--border)] hover:border-[var(--accent)] transition-all">
                <ChevronLeft size={14} />
              </button>
              <button className="p-1.5 rounded-lg bg-[var(--bg-primary)] border border-[var(--border)] hover:border-[var(--accent)] transition-all">
                <ChevronRight size={14} />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-7 gap-1.5 mb-1 text-center">
            {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => (
              <div key={`${d}-${i}`} className="text-[9px] font-black text-[var(--text-secondary)] uppercase p-1">{d}</div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-1.5">
            {[...Array(firstDayOfMonth)].map((_, i) => (
              <div key={`empty-${i}`} className="aspect-square" />
            ))}
            {[...Array(daysInMonth)].map((_, i) => {
              const day = i + 1;
              const dateStr = `2026-05-${day.toString().padStart(2, '0')}`;
              const event = academicEvents.find(e => e.date === dateStr);
              const attendanceStatus = teacherAttendance[dateStr];

              return (
                <motion.div
                  key={day}
                  className={`aspect-square rounded-xl border flex flex-col items-center justify-center relative cursor-pointer transition-all ${
                    day === 4 
                      ? "bg-[var(--accent)] border-[var(--accent)] text-white shadow-md shadow-[var(--accent-glow)]" 
                      : "bg-[var(--bg-primary)] border-[var(--border)] text-[var(--text-primary)] hover:border-[var(--accent)]"
                  }`}
                >
                  <span className="text-xs font-bold">{day}</span>
                  
                  {activeTab === 'academic' && event && (
                    <div className="absolute bottom-1 w-1 h-1 rounded-full bg-orange-500" />
                  )}

                  {activeTab === 'attendance' && attendanceStatus && (
                    <div className={`absolute bottom-1 w-1 h-1 rounded-full ${
                      attendanceStatus === 'present' ? 'bg-green-500' : 'bg-blue-500'
                    }`} />
                  )}
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Legend & Details */}
        <div className="space-y-4">
          <div className="p-5 rounded-[32px] bg-[var(--bg-secondary)] border border-[var(--border)]">
            <h4 className="text-[10px] font-black uppercase tracking-widest text-[var(--text-primary)] mb-4">Legend</h4>
            <div className="space-y-3">
              {activeTab === 'academic' ? (
                <>
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-orange-500" />
                    <span className="text-[11px] font-bold text-[var(--text-secondary)]">Exams</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-blue-500" />
                    <span className="text-[11px] font-bold text-[var(--text-secondary)]">Holidays</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-green-500" />
                    <span className="text-[11px] font-bold text-[var(--text-secondary)]">Events</span>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-green-500" />
                    <span className="text-[11px] font-bold text-[var(--text-secondary)]">Present</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-red-500" />
                    <span className="text-[11px] font-bold text-[var(--text-secondary)]">Absent</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-blue-500" />
                    <span className="text-[11px] font-bold text-[var(--text-secondary)]">Leave</span>
                  </div>
                </>
              )}
            </div>
          </div>

          <div className="p-5 rounded-[32px] bg-[var(--bg-primary)] border border-[var(--border)]">
            <h4 className="text-[10px] font-black uppercase tracking-widest text-[var(--text-primary)] mb-3">Next Event</h4>
            <div className="p-3 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border)]">
              <p className="text-[11px] font-bold text-[var(--text-primary)]">Mid-Term Exams</p>
              <p className="text-[9px] text-[var(--accent)] font-black mt-0.5 uppercase">15 May 2026</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
