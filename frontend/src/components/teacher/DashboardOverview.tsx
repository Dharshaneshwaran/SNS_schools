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
  ChevronRight
} from "lucide-react";

const stats = [
  { label: "Avg Attendance", value: "94%", icon: Users, color: "#FF6A00" },
  { label: "Assignments Pending", value: "12", icon: BookOpen, color: "#FF6A00" },
  { label: "Tasks Completed", value: "08/10", icon: CheckCircle2, color: "#FF6A00" },
];

export default function DashboardOverview() {
  return (
    <div className="space-y-6">
      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {stats.map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="p-6 rounded-[24px] bg-[var(--bg-secondary)] border border-[var(--border)] shadow-[var(--card-shadow)] hover:border-[var(--accent)] transition-all duration-300 group"
          >
            <div className="flex items-center justify-between">
              <div className="p-3 rounded-xl bg-[var(--accent-glow)] text-[var(--accent)]">
                <stat.icon size={24} />
              </div>
              <span className="text-2xl font-bold text-[var(--text-primary)]">{stat.value}</span>
            </div>
            <p className="mt-4 text-[var(--text-secondary)] text-sm font-medium">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Today's Schedule */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="p-6 rounded-[32px] bg-[var(--bg-secondary)] border border-[var(--border)] shadow-[var(--card-shadow)]"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-[var(--text-primary)]">Today's Schedule</h3>
            <button className="text-[var(--accent)] text-sm font-semibold flex items-center gap-1 hover:gap-2 transition-all">
              View Full <ChevronRight size={16} />
            </button>
          </div>
          
          <div className="space-y-4">
            {[
              { time: "09:00 AM", subject: "Advanced Mathematics", class: "Grade 10-A", active: true },
              { time: "11:30 AM", subject: "Physics Lab", class: "Grade 11-C", active: false },
              { time: "02:00 PM", subject: "Calculus", class: "Grade 12-B", active: false },
            ].map((item, i) => (
              <div 
                key={i}
                className={`p-4 rounded-2xl flex items-center gap-4 border transition-all ${
                  item.active 
                    ? "bg-[var(--accent-glow)] border-[var(--accent)]" 
                    : "bg-[var(--bg-primary)] border-transparent hover:border-[var(--border)]"
                }`}
              >
                <div className={`p-3 rounded-xl ${item.active ? "bg-[var(--accent)] text-white" : "bg-[var(--bg-secondary)] text-[var(--text-secondary)]"}`}>
                  <Clock size={20} />
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-[var(--text-primary)]">{item.subject}</h4>
                  <p className="text-sm text-[var(--text-secondary)]">{item.class}</p>
                </div>
                <div className="text-right">
                  <span className={`text-sm font-bold ${item.active ? "text-[var(--accent)]" : "text-[var(--text-secondary)]"}`}>
                    {item.time}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Pending Tasks */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="p-6 rounded-[32px] bg-[var(--bg-secondary)] border border-[var(--border)] shadow-[var(--card-shadow)]"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-[var(--text-primary)]">Pending Tasks</h3>
            <span className="px-3 py-1 rounded-full bg-[var(--accent-glow)] text-[var(--accent)] text-xs font-bold">4 Tasks</span>
          </div>

          <div className="space-y-4">
            {[
              { title: "Grade Math Mid-term", deadline: "Today", priority: "High" },
              { title: "Upload Physics Notes", deadline: "Tomorrow", priority: "Medium" },
              { title: "Parent-Teacher Meet prep", deadline: "May 2nd", priority: "Low" },
            ].map((task, i) => (
              <div key={i} className="group p-4 rounded-2xl bg-[var(--bg-primary)] hover:bg-[var(--accent-glow)] transition-all cursor-pointer border border-transparent hover:border-[var(--accent)]">
                <div className="flex justify-between items-start mb-1">
                  <h4 className="font-semibold text-[var(--text-primary)] group-hover:text-[var(--accent)] transition-colors">{task.title}</h4>
                  <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded ${
                    task.priority === 'High' ? 'bg-red-500/10 text-red-500' : 'bg-orange-500/10 text-orange-500'
                  }`}>
                    {task.priority}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-xs text-[var(--text-secondary)]">
                  <Calendar size={12} />
                  <span>Due {task.deadline}</span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
