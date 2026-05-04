"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Calendar as CalendarIcon, 
  ChevronLeft, 
  ChevronRight, 
  Star,
  CheckCircle2,
  Clock,
  AlertCircle
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
    <div className="space-y-6">
      {/* Compact Header */}
      <div className="flex items-center justify-between bg-[var(--bg-secondary)] p-3 px-6 rounded-[24px] border border-[var(--border)]">
        <div className="flex items-center gap-4">
          <div className="p-2 rounded-xl bg-[var(--accent)] text-white shadow-lg shadow-[var(--accent-glow)]">
            <CalendarIcon size={18} />
          </div>
          <h2 className="text-lg font-black italic uppercase tracking-tight text-[var(--text-primary)]">
            {activeTab === 'academic' ? 'Academic' : 'Attendance'} <span className="text-[var(--accent)]">Schedule</span>
          </h2>
        </div>

        <div className="flex items-center gap-1.5 bg-[var(--bg-primary)] p-1 rounded-xl border border-[var(--border)]">
          <button 
            onClick={() => setActiveTab("academic")}
            className={`px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${
              activeTab === "academic" ? "bg-[var(--accent)] text-white" : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
            }`}
          >
            Academic
          </button>
          <button 
            onClick={() => setActiveTab("attendance")}
            className={`px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${
              activeTab === "attendance" ? "bg-[var(--accent)] text-white" : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
            }`}
          >
            My Attendance
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Calendar Grid */}
        <div className="lg:col-span-2 p-8 rounded-[40px] bg-[var(--bg-secondary)] border border-[var(--border)] shadow-[var(--card-shadow)]">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-xl font-black text-[var(--text-primary)] uppercase tracking-tight italic">
              {monthName} <span className="text-[var(--accent)]">{year}</span>
            </h3>
            <div className="flex gap-2">
              <button className="p-2 rounded-xl bg-[var(--bg-primary)] border border-[var(--border)] hover:border-[var(--accent)] transition-all">
                <ChevronLeft size={18} />
              </button>
              <button className="p-2 rounded-xl bg-[var(--bg-primary)] border border-[var(--border)] hover:border-[var(--accent)] transition-all">
                <ChevronRight size={18} />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-7 gap-2 mb-2 text-center">
            {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map(d => (
              <div key={d} className="text-[10px] font-black text-[var(--text-secondary)] uppercase p-2">{d}</div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-2">
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
                  whileHover={{ scale: 1.05 }}
                  className={`aspect-square rounded-2xl border-2 flex flex-col items-center justify-center relative cursor-pointer transition-all ${
                    day === 4 
                      ? "bg-[var(--accent)] border-[var(--accent)] text-white shadow-lg shadow-[var(--accent-glow)]" 
                      : "bg-[var(--bg-primary)] border-[var(--border)] text-[var(--text-primary)] hover:border-[var(--accent)]"
                  }`}
                >
                  <span className="text-sm font-bold">{day}</span>
                  
                  {activeTab === 'academic' && event && (
                    <div className="absolute bottom-1.5 w-1.5 h-1.5 rounded-full bg-orange-500" />
                  )}

                  {activeTab === 'attendance' && attendanceStatus && (
                    <div className={`absolute bottom-1.5 w-1.5 h-1.5 rounded-full ${
                      attendanceStatus === 'present' ? 'bg-green-500' : 'bg-blue-500'
                    }`} />
                  )}
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Legend & Details */}
        <div className="space-y-6">
          <div className="p-8 rounded-[40px] bg-[var(--bg-secondary)] border border-[var(--border)] shadow-[var(--card-shadow)]">
            <h4 className="text-sm font-black uppercase tracking-widest text-[var(--text-primary)] mb-6">Legend</h4>
            <div className="space-y-4">
              {activeTab === 'academic' ? (
                <>
                  <div className="flex items-center gap-3">
                    <div className="w-4 h-4 rounded-full bg-orange-500" />
                    <span className="text-sm font-bold text-[var(--text-secondary)]">Examinations</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-4 h-4 rounded-full bg-blue-500" />
                    <span className="text-sm font-bold text-[var(--text-secondary)]">Public Holidays</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-4 h-4 rounded-full bg-green-500" />
                    <span className="text-sm font-bold text-[var(--text-secondary)]">School Events</span>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex items-center gap-3">
                    <div className="w-4 h-4 rounded-full bg-green-500" />
                    <span className="text-sm font-bold text-[var(--text-secondary)]">Present</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-4 h-4 rounded-full bg-red-500" />
                    <span className="text-sm font-bold text-[var(--text-secondary)]">Absent</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-4 h-4 rounded-full bg-blue-500" />
                    <span className="text-sm font-bold text-[var(--text-secondary)]">Leave Approved</span>
                  </div>
                </>
              )}
            </div>
          </div>

          <div className="p-8 rounded-[40px] bg-gradient-to-br from-[var(--bg-secondary)] to-[var(--bg-primary)] border border-[var(--border)] shadow-[var(--card-shadow)] relative overflow-hidden">
            <div className="relative z-10">
              <h4 className="text-sm font-black uppercase tracking-widest text-[var(--text-primary)] mb-4">Quick Insights</h4>
              {activeTab === 'academic' ? (
                <div className="space-y-4">
                  <div className="p-4 rounded-2xl bg-[var(--bg-primary)] border border-[var(--border)]">
                    <p className="text-[10px] font-black text-[var(--text-secondary)] uppercase mb-1">Next Event</p>
                    <p className="text-sm font-bold text-[var(--text-primary)]">Mid-Term Exams</p>
                    <p className="text-xs text-[var(--accent)] font-bold mt-1 italic">Starts in 11 days</p>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 rounded-2xl bg-[var(--bg-primary)] border border-[var(--border)]">
                    <p className="text-[10px] font-black text-[var(--text-secondary)] uppercase mb-1">Monthly %</p>
                    <p className="text-lg font-black text-green-500">98%</p>
                  </div>
                  <div className="p-4 rounded-2xl bg-[var(--bg-primary)] border border-[var(--border)]">
                    <p className="text-[10px] font-black text-[var(--text-secondary)] uppercase mb-1">Late Days</p>
                    <p className="text-lg font-black text-orange-500">01</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
