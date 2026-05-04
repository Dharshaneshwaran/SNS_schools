"use client";

import React from "react";
import { motion } from "framer-motion";
import { 
  Calendar, 
  Clock, 
  CheckCircle2, 
  Users, 
  BookOpen, 
  TrendingUp,
  ChevronRight,
  Bell,
  MessageCircle
} from "lucide-react";

export default function DashboardOverview() {
  return (
    <div className="space-y-10">
      {/* Quick Action Buttons */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: "Mark Attendance", icon: CheckCircle2, color: "#10B981", bg: "rgba(16, 185, 129, 0.1)", desc: "Record student daily presence" },
          { label: "Exam Reports", icon: BookOpen, color: "#F59E0B", bg: "rgba(245, 158, 11, 0.1)", desc: "Update and view student marks" },
          { label: "Send Homework", icon: MessageCircle, color: "#3B82F6", bg: "rgba(59, 130, 246, 0.1)", desc: "Share assignments with students" },
          { label: "Notifications", icon: Bell, color: "#FF7F50", bg: "rgba(255, 127, 80, 0.1)", desc: "View administrative updates" },
        ].map((action, i) => (
          <motion.button
            key={i}
            whileHover={{ y: -8, scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="p-8 rounded-[32px] bg-[var(--bg-secondary)] border border-[var(--border)] shadow-[var(--card-shadow)] hover:border-[var(--accent)] transition-all text-left flex flex-col gap-4 group"
          >
            <div 
              className="w-14 h-14 rounded-2xl flex items-center justify-center transition-transform group-hover:rotate-6"
              style={{ background: action.bg, color: action.color }}
            >
              <action.icon size={28} strokeWidth={3} />
            </div>
            <div>
              <h3 className="text-xl font-black text-[var(--text-primary)] mb-1 tracking-tight">{action.label}</h3>
              <p className="text-sm text-[var(--text-secondary)] font-medium">{action.desc}</p>
            </div>
          </motion.button>
        ))}
      </div>

      {/* School-wide Statistics & Birthdays */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* School Attendance Summary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-8 rounded-[40px] bg-[var(--bg-secondary)] border border-[var(--border)] shadow-[var(--card-shadow)]"
        >
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-2xl font-black text-[var(--text-primary)] uppercase italic tracking-tight">School Presence</h3>
              <p className="text-[var(--text-secondary)] font-medium text-sm mt-1">Daily Overview (All Grades)</p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-blue-500/10 text-blue-500 flex items-center justify-center">
              <TrendingUp size={24} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="p-6 rounded-[32px] bg-[var(--bg-primary)] border border-[var(--border)] relative overflow-hidden group">
              <p className="text-[10px] font-black text-[var(--text-secondary)] uppercase tracking-widest mb-2">Total Present</p>
              <p className="text-4xl font-black text-[#10B981]">942</p>
              <div className="mt-4 flex items-center gap-2 text-xs font-bold text-[#10B981]">
                <TrendingUp size={14} />
                <span>+2.4% from yesterday</span>
              </div>
            </div>
            <div className="p-6 rounded-[32px] bg-[var(--bg-primary)] border border-[var(--border)] relative overflow-hidden group">
              <p className="text-[10px] font-black text-[var(--text-secondary)] uppercase tracking-widest mb-2">Total Absent</p>
              <p className="text-4xl font-black text-[#EF4444]">58</p>
              <div className="mt-4 flex items-center gap-2 text-xs font-bold text-[#EF4444]">
                <TrendingUp size={14} className="rotate-180" />
                <span>-1.2% from yesterday</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Birthdays List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="p-8 rounded-[40px] bg-[var(--bg-secondary)] border border-[var(--border)] shadow-[var(--card-shadow)] xl:col-span-2"
        >
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-2xl font-black text-[var(--text-primary)] uppercase italic tracking-tight">Celebrations</h3>
              <p className="text-[var(--text-secondary)] font-medium text-sm mt-1">Birthdays this week</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Student Birthdays */}
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 rounded-xl bg-orange-500/10 text-orange-500">
                  <Users size={18} strokeWidth={3} />
                </div>
                <h4 className="text-sm font-black uppercase tracking-widest text-[var(--text-primary)]">Student Birthdays</h4>
              </div>
              <div className="space-y-4">
                {[
                  { name: "Aditi Sharma", grade: "Grade 10A", date: "Today", color: "#FF7F50" },
                  { name: "Rahul Varma", grade: "Grade 8B", date: "Tomorrow", color: "#3B82F6" },
                  { name: "Sneha Kapoor", grade: "Grade 12C", date: "May 5th", color: "#10B981" },
                ].map((student, i) => (
                  <div key={i} className="flex items-center gap-4 p-4 rounded-2xl bg-[var(--bg-primary)] border border-[var(--border)] hover:border-[var(--accent)] transition-all group">
                    <div className="w-10 h-10 rounded-xl bg-zinc-800 flex items-center justify-center font-bold text-white group-hover:scale-110 transition-transform">
                      {student.name.charAt(0)}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-bold text-[var(--text-primary)]">{student.name}</p>
                      <p className="text-[10px] font-medium text-[var(--text-secondary)]">{student.grade}</p>
                    </div>
                    <span className={`text-[10px] font-black uppercase px-3 py-1 rounded-full ${student.date === 'Today' ? 'bg-orange-500 text-white' : 'bg-[var(--bg-secondary)] text-[var(--text-secondary)]'}`}>
                      {student.date}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Staff Birthdays */}
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 rounded-xl bg-purple-500/10 text-purple-500">
                  <BookOpen size={18} strokeWidth={3} />
                </div>
                <h4 className="text-sm font-black uppercase tracking-widest text-[var(--text-primary)]">Staff Birthdays</h4>
              </div>
              <div className="space-y-4">
                {[
                  { name: "Dr. Ananya Rao", role: "Science Head", date: "Today" },
                  { name: "Mr. David Miller", role: "PT Instructor", date: "May 6th" },
                  { name: "Ms. Priya Mani", role: "Arts Dept", date: "May 8th" },
                ].map((staff, i) => (
                  <div key={i} className="flex items-center gap-4 p-4 rounded-2xl bg-[var(--bg-primary)] border border-[var(--border)] hover:border-[var(--accent)] transition-all group">
                    <div className="w-10 h-10 rounded-xl bg-zinc-800 flex items-center justify-center font-bold text-white group-hover:scale-110 transition-transform">
                      {staff.name.charAt(0)}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-bold text-[var(--text-primary)]">{staff.name}</p>
                      <p className="text-[10px] font-medium text-[var(--text-secondary)]">{staff.role}</p>
                    </div>
                    <span className={`text-[10px] font-black uppercase px-3 py-1 rounded-full ${staff.date === 'Today' ? 'bg-purple-500 text-white' : 'bg-[var(--bg-secondary)] text-[var(--text-secondary)]'}`}>
                      {staff.date}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Reports Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Upcoming Class */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-8 rounded-[40px] bg-gradient-to-br from-[#FF6A00] to-[#FF9E22] text-white shadow-2xl shadow-orange-500/20 col-span-1 lg:col-span-2 relative overflow-hidden"
        >
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 rounded-2xl bg-white/20 backdrop-blur-md">
                <Clock size={24} className="text-white" />
              </div>
              <span className="text-sm font-black uppercase tracking-widest">Upcoming Class</span>
            </div>
            
            <h2 className="text-4xl font-black italic uppercase tracking-tighter mb-4">
              Advanced Mathematics <span className="text-white/60">—</span> Grade 10A
            </h2>
            
            <div className="flex flex-wrap gap-6 mt-8">
              <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm px-5 py-3 rounded-2xl border border-white/20">
                <Calendar size={20} />
                <span className="font-bold">Today, 09:00 AM</span>
              </div>
              <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm px-5 py-3 rounded-2xl border border-white/20">
                <Users size={20} />
                <span className="font-bold">42 Students</span>
              </div>
            </div>
          </div>
          
          <div className="absolute -right-20 -top-20 w-80 h-80 bg-white/10 rounded-full blur-3xl" />
        </motion.div>

        {/* Class Attendance Summary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="p-8 rounded-[40px] bg-[var(--bg-secondary)] border border-[var(--border)] shadow-[var(--card-shadow)] flex flex-col justify-between"
        >
          <div>
            <h3 className="text-2xl font-black text-[var(--text-primary)] mb-2 uppercase italic tracking-tight">Class Attendance</h3>
            <p className="text-[var(--text-secondary)] font-medium text-sm mb-8">Weekly Performance Overview</p>
            
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <span className="font-bold text-[var(--text-primary)]">Grade 10A</span>
                <span className="text-[var(--accent)] font-black">94.2%</span>
              </div>
              <div className="w-full h-3 bg-[var(--bg-primary)] rounded-full overflow-hidden">
                <div className="h-full bg-[var(--accent)] rounded-full" style={{ width: '94.2%' }} />
              </div>
              
              <div className="grid grid-cols-2 gap-4 mt-8">
                <div className="p-4 rounded-3xl bg-[var(--bg-primary)] border border-[var(--border)]">
                  <p className="text-[var(--text-secondary)] text-[10px] font-black uppercase mb-1">Present</p>
                  <p className="text-xl font-black text-[#10B981]">38</p>
                </div>
                <div className="p-4 rounded-3xl bg-[var(--bg-primary)] border border-[var(--border)]">
                  <p className="text-[var(--text-secondary)] text-[10px] font-black uppercase mb-1">Absent</p>
                  <p className="text-xl font-black text-[#EF4444]">04</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Important Note from Admin */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="p-8 rounded-[40px] bg-[var(--bg-secondary)] border-2 border-dashed border-[var(--accent)] shadow-xl lg:col-span-3"
        >
          <div className="flex items-start gap-6">
            <div className="w-16 h-16 rounded-3xl bg-[var(--accent-glow)] flex items-center justify-center text-[var(--accent)] shrink-0">
              <Bell size={32} />
            </div>
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h3 className="text-2xl font-black text-[var(--text-primary)] uppercase italic tracking-tight">Important Note from Admin</h3>
                <span className="px-3 py-1 rounded-full bg-red-500 text-white text-[10px] font-black uppercase tracking-widest">Urgent</span>
              </div>
              <p className="text-[var(--text-secondary)] font-medium leading-relaxed">
                Dear Faculty, please ensure all mid-term grades are finalized in the system by Friday evening. 
                The Parent-Teacher Meeting is scheduled for next Monday, and updated reports are mandatory for all core subjects. 
                Contact the IT department if you encounter any sync issues.
              </p>
              <div className="mt-6 flex items-center gap-4 text-sm font-bold text-[var(--text-primary)]">
                <div className="w-8 h-8 rounded-full bg-[var(--bg-primary)] border border-[var(--border)] flex items-center justify-center text-[var(--accent)]">S</div>
                <span>Principal's Office · Posted 2 hours ago</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
