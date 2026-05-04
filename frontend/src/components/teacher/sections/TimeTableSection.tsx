"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Clock, BookOpen, MapPin, User, Calendar } from "lucide-react";

const teacherTimetable = [
  { day: "Monday", periods: [
    { time: "09:00 - 10:00", subject: "Mathematics", class: "Grade 10A", room: "Room 402", color: "#3B82F6" },
    { time: "10:15 - 11:15", subject: "Advanced Physics", class: "Grade 12C", room: "Lab 2", color: "#8B5CF6" },
    { time: "11:30 - 12:30", subject: "Mathematics", class: "Grade 10B", room: "Room 405", color: "#3B82F6" },
  ]},
  { day: "Tuesday", periods: [
    { time: "09:00 - 10:00", subject: "Computer Science", class: "Grade 11A", room: "CS Lab 1", color: "#10B981" },
    { time: "11:30 - 12:30", subject: "Mathematics", class: "Grade 10A", room: "Room 402", color: "#3B82F6" },
  ]},
  // ... more days
];

const classTimetable = [
  { day: "Monday", periods: [
    { time: "09:00 - 10:00", subject: "Mathematics", teacher: "Mr. Yukesh", color: "#3B82F6" },
    { time: "10:15 - 11:15", subject: "English", teacher: "Ms. Sarah", color: "#EC4899" },
    { time: "11:30 - 12:30", subject: "Chemistry", teacher: "Dr. Rao", color: "#F59E0B" },
  ]},
  // ... more days
];

export default function TimeTableSection() {
  const [activeView, setActiveView] = useState<"personal" | "class">("personal");
  const [selectedDay, setSelectedDay] = useState("Monday");

  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

  const currentData = activeView === "personal" ? teacherTimetable : classTimetable;
  const dayData = currentData.find(d => d.day === selectedDay)?.periods || [];

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-3xl font-black italic uppercase tracking-tight text-[var(--text-primary)]">
            Schedule <span className="text-[var(--accent)]">Planner</span>
          </h2>
          <p className="text-sm text-[var(--text-secondary)] font-medium">Manage your classes and class-teacher responsibilities</p>
        </div>

        <div className="flex items-center gap-2 bg-[var(--bg-secondary)] p-1.5 rounded-2xl border border-[var(--border)]">
          <button 
            onClick={() => setActiveView("personal")}
            className={`px-6 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
              activeView === "personal" ? "bg-[var(--accent)] text-white shadow-lg shadow-[var(--accent-glow)]" : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
            }`}
          >
            My Timetable
          </button>
          <button 
            onClick={() => setActiveView("class")}
            className={`px-6 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
              activeView === "class" ? "bg-[var(--accent)] text-white shadow-lg shadow-[var(--accent-glow)]" : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
            }`}
          >
            Class 10A Timetable
          </button>
        </div>
      </div>

      {/* Day Selector */}
      <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-hide">
        {days.map((day) => (
          <button
            key={day}
            onClick={() => setSelectedDay(day)}
            className={`px-6 py-3 rounded-2xl text-sm font-bold transition-all whitespace-nowrap border-2 ${
              selectedDay === day 
                ? "bg-[var(--accent-glow)] border-[var(--accent)] text-[var(--accent)]" 
                : "bg-[var(--bg-secondary)] border-[var(--border)] text-[var(--text-secondary)] hover:border-[var(--accent)]"
            }`}
          >
            {day}
          </button>
        ))}
      </div>

      {/* Timetable Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence mode="wait">
          {dayData.map((period, i) => (
            <motion.div
              key={`${selectedDay}-${i}`}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ delay: i * 0.05 }}
              className="p-8 rounded-[40px] bg-[var(--bg-secondary)] border border-[var(--border)] hover:border-[var(--accent)] transition-all group relative overflow-hidden"
            >
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-3 rounded-2xl bg-[var(--bg-primary)] text-[var(--accent)]">
                    <Clock size={20} strokeWidth={2.5} />
                  </div>
                  <span className="text-xs font-black text-[var(--text-secondary)] uppercase tracking-widest">{period.time}</span>
                </div>

                <h3 className="text-2xl font-black italic uppercase tracking-tight text-[var(--text-primary)] mb-6">
                  {period.subject}
                </h3>

                <div className="space-y-3">
                  {activeView === "personal" ? (
                    <>
                      <div className="flex items-center gap-3 text-[var(--text-secondary)]">
                        <Calendar size={16} />
                        <span className="text-sm font-bold">{period.class}</span>
                      </div>
                      <div className="flex items-center gap-3 text-[var(--text-secondary)]">
                        <MapPin size={16} />
                        <span className="text-sm font-bold">{period.room}</span>
                      </div>
                    </>
                  ) : (
                    <div className="flex items-center gap-3 text-[var(--text-secondary)]">
                      <User size={16} />
                      <span className="text-sm font-bold">Teacher: {period.teacher}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Decorative element */}
              <div 
                className="absolute -right-4 -bottom-4 w-24 h-24 rounded-full opacity-10 blur-2xl group-hover:opacity-20 transition-opacity"
                style={{ backgroundColor: period.color }}
              />
            </motion.div>
          ))}
        </AnimatePresence>

        {dayData.length === 0 && (
          <div className="col-span-full py-20 text-center">
            <p className="text-[var(--text-secondary)] font-bold italic uppercase tracking-widest">No classes scheduled for {selectedDay}</p>
          </div>
        )}
      </div>
    </div>
  );
}
