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
    <div className="space-y-3 h-full overflow-hidden">
      {/* Super Compact Header */}
      <div className="flex items-center justify-between bg-[var(--bg-secondary)] p-1.5 px-4 rounded-[16px] border border-[var(--border)]">
        <div className="flex items-center gap-2">
          <div className="p-1 rounded-md bg-[var(--accent)] text-white">
            <CalendarIcon size={12} />
          </div>
          <h2 className="text-[11px] font-black italic uppercase tracking-tight text-[var(--text-primary)]">
            {activeTab === 'academic' ? 'Academic' : 'Attendance'} <span className="text-[var(--accent)]">Hub</span>
          </h2>
        </div>

        <div className="flex items-center gap-1 bg-[var(--bg-primary)] p-0.5 rounded-md border border-[var(--border)]">
          <button 
            onClick={() => setActiveTab("academic")}
            className={`px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-widest transition-all ${
              activeTab === "academic" ? "bg-[var(--accent)] text-white" : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
            }`}
          >
            Academic
          </button>
          <button 
            onClick={() => setActiveTab("attendance")}
            className={`px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-widest transition-all ${
              activeTab === "attendance" ? "bg-[var(--accent)] text-white" : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
            }`}
          >
            Attendance
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-3 h-full">
        {/* Compact Calendar Grid */}
        <div className="lg:col-span-3 p-4 rounded-[24px] bg-[var(--bg-secondary)] border border-[var(--border)] shadow-[var(--card-shadow)] flex flex-col">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xs font-black text-[var(--text-primary)] uppercase tracking-tight italic">
              {monthName} <span className="text-[var(--accent)]">{year}</span>
            </h3>
            <div className="flex gap-1">
              <button className="p-1 rounded-md bg-[var(--bg-primary)] border border-[var(--border)] hover:border-[var(--accent)] transition-all">
                <ChevronLeft size={12} />
              </button>
              <button className="p-1 rounded-md bg-[var(--bg-primary)] border border-[var(--border)] hover:border-[var(--accent)] transition-all">
                <ChevronRight size={12} />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-7 gap-1 mb-1 text-center">
            {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => (
              <div key={`${d}-${i}`} className="text-[8px] font-black text-[var(--text-secondary)] uppercase p-0.5">{d}</div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-1 flex-1">
            {[...Array(firstDayOfMonth)].map((_, i) => (
              <div key={`empty-${i}`} className="h-10 md:h-12 lg:h-14" />
            ))}
            {[...Array(daysInMonth)].map((_, i) => {
              const day = i + 1;
              const dateStr = `2026-05-${day.toString().padStart(2, '0')}`;
              const event = academicEvents.find(e => e.date === dateStr);
              const attendanceStatus = teacherAttendance[dateStr];

              return (
                <div
                  key={day}
                  className={`h-10 md:h-12 lg:h-14 rounded-lg border flex flex-col items-center justify-center relative cursor-pointer transition-all ${
                    day === 4 
                      ? "bg-[var(--accent)] border-[var(--accent)] text-white shadow-sm" 
                      : "bg-[var(--bg-primary)] border-[var(--border)] text-[var(--text-primary)] hover:border-[var(--accent)]"
                  }`}
                >
                  <span className="text-[10px] font-bold">{day}</span>
                  
                  {activeTab === 'academic' && event && (
                    <div className="absolute bottom-1 w-0.5 h-0.5 rounded-full bg-orange-500" />
                  )}

                  {activeTab === 'attendance' && attendanceStatus && (
                    <div className={`absolute bottom-1 w-0.5 h-0.5 rounded-full ${
                      attendanceStatus === 'present' ? 'bg-green-500' : 'bg-blue-500'
                    }`} />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Super Compact Legend & Details */}
        <div className="flex lg:flex-col gap-3">
          <div className="flex-1 p-4 rounded-[24px] bg-[var(--bg-secondary)] border border-[var(--border)] flex flex-col justify-center">
            <h4 className="text-[8px] font-black uppercase tracking-widest text-[var(--text-primary)] mb-3">Legend</h4>
            <div className="grid grid-cols-1 gap-2">
              {activeTab === 'academic' ? (
                <>
                  <div className="flex items-center gap-1.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-orange-500" />
                    <span className="text-[9px] font-bold text-[var(--text-secondary)]">Exams</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                    <span className="text-[9px] font-bold text-[var(--text-secondary)]">Holidays</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                    <span className="text-[9px] font-bold text-[var(--text-secondary)]">Events</span>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex items-center gap-1.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                    <span className="text-[9px] font-bold text-[var(--text-secondary)]">Present</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-red-500" />
                    <span className="text-[9px] font-bold text-[var(--text-secondary)]">Absent</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                    <span className="text-[9px] font-bold text-[var(--text-secondary)]">Leave</span>
                  </div>
                </>
              )}
            </div>
          </div>

          <div className="flex-1 p-4 rounded-[24px] bg-[var(--bg-primary)] border border-[var(--border)] flex flex-col justify-center">
            <h4 className="text-[8px] font-black uppercase tracking-widest text-[var(--text-primary)] mb-2">Next Event</h4>
            <div className="p-2 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border)]">
              <p className="text-[9px] font-bold text-[var(--text-primary)] truncate">Mid-Term Exams</p>
              <p className="text-[7px] text-[var(--accent)] font-black uppercase mt-0.5">15 May</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
