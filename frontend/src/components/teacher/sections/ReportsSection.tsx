"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { 
  FileText, 
  Download, 
  CheckCircle2, 
  Clock, 
  Filter,
  BarChart3,
  Users,
  BookOpen
} from "lucide-react";

const reportTypes = [
  { 
    id: "attendance", 
    label: "Attendance Report", 
    desc: "Complete daily and monthly presence logs", 
    icon: Users,
    color: "#10B981"
  },
  { 
    id: "marks", 
    label: "Marks Report", 
    desc: "Examination results and subject-wise analytics", 
    icon: BarChart3,
    color: "#3B82F6"
  },
  { 
    id: "homework", 
    label: "Homework Report", 
    desc: "Assignment submission status and feedback", 
    icon: BookOpen,
    color: "#F59E0B"
  },
];

export default function ReportsSection() {
  const [selectedClass, setSelectedClass] = useState("10A");
  const [dateRange, setDateRange] = useState("Current Month");

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-black italic uppercase tracking-tight text-[var(--text-primary)]">
          Export <span className="text-[var(--accent)]">Reports</span>
        </h2>
        <p className="text-sm text-[var(--text-secondary)] font-medium">Generate and download academic performance documents</p>
      </div>

      {/* Global Config */}
      <div className="flex flex-wrap items-center gap-4 bg-[var(--bg-secondary)] p-4 px-6 rounded-[24px] border border-[var(--border)]">
        <div className="flex items-center gap-3">
          <Filter size={16} className="text-[var(--accent)]" />
          <span className="text-xs font-black uppercase tracking-widest text-[var(--text-secondary)]">Configuration:</span>
        </div>
        
        <select 
          value={selectedClass}
          onChange={(e) => setSelectedClass(e.target.value)}
          className="bg-[var(--bg-primary)] border border-[var(--border)] rounded-xl px-4 py-2 text-xs font-bold outline-none cursor-pointer"
        >
          <option value="10A">Grade 10 - Section A</option>
          <option value="11B">Grade 11 - Section B</option>
        </select>

        <select 
          value={dateRange}
          onChange={(e) => setDateRange(e.target.value)}
          className="bg-[var(--bg-primary)] border border-[var(--border)] rounded-xl px-4 py-2 text-xs font-bold outline-none cursor-pointer"
        >
          <option value="Current Month">Current Month</option>
          <option value="Last 3 Months">Last 3 Months</option>
          <option value="Current Academic Year">Current Academic Year</option>
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {reportTypes.map((report, i) => (
          <motion.div
            key={report.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="p-8 rounded-[40px] bg-[var(--bg-secondary)] border border-[var(--border)] hover:border-[var(--accent)] transition-all group relative overflow-hidden"
          >
            <div className="relative z-10">
              <div 
                className="w-16 h-16 rounded-2xl flex items-center justify-center mb-8 shadow-lg transition-transform group-hover:rotate-6"
                style={{ backgroundColor: `${report.color}15`, color: report.color }}
              >
                <report.icon size={32} strokeWidth={2.5} />
              </div>

              <h3 className="text-2xl font-black italic uppercase tracking-tight text-[var(--text-primary)] mb-2">
                {report.label}
              </h3>
              <p className="text-sm text-[var(--text-secondary)] font-medium leading-relaxed mb-10">
                {report.desc}
              </p>

              <div className="space-y-3">
                <button className="w-full flex items-center justify-center gap-3 py-4 rounded-2xl bg-[var(--accent)] text-white font-black uppercase tracking-widest text-xs hover:shadow-2xl hover:shadow-[var(--accent-glow)] transition-all active:scale-95">
                  <Download size={16} strokeWidth={3} /> Download PDF
                </button>
                <button className="w-full flex items-center justify-center gap-3 py-4 rounded-2xl bg-[var(--bg-primary)] border border-[var(--border)] text-[var(--text-primary)] font-black uppercase tracking-widest text-xs hover:border-[var(--accent)] transition-all active:scale-95">
                  <FileText size={16} strokeWidth={3} /> Export Excel (CSV)
                </button>
              </div>
            </div>

            <div 
              className="absolute -right-10 -bottom-10 w-40 h-40 rounded-full blur-3xl opacity-0 group-hover:opacity-10 transition-opacity"
              style={{ backgroundColor: report.color }}
            />
          </motion.div>
        ))}
      </div>

      {/* Recent Downloads */}
      <div className="mt-12">
        <h3 className="text-sm font-black uppercase tracking-[0.2em] text-[var(--text-secondary)] mb-6 ml-4">Recent Generations</h3>
        <div className="space-y-3">
          {[
            { name: "Attendance_10A_May_2026.pdf", time: "Just now", status: "Ready" },
            { name: "Marks_Final_Grade12.csv", time: "2 hours ago", status: "Ready" },
          ].map((item, i) => (
            <div key={i} className="flex items-center justify-between p-5 rounded-[24px] bg-[var(--bg-secondary)] border border-[var(--border)] group hover:border-[var(--accent)] transition-all">
              <div className="flex items-center gap-4">
                <div className="p-2.5 rounded-xl bg-[var(--bg-primary)] text-[var(--text-secondary)] group-hover:text-[var(--accent)] transition-colors">
                  <FileText size={20} />
                </div>
                <div>
                  <p className="text-sm font-bold text-[var(--text-primary)]">{item.name}</p>
                  <p className="text-[10px] font-medium text-[var(--text-secondary)]">{item.time}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-[10px] font-black uppercase px-3 py-1 rounded-full bg-green-500/10 text-green-500">{item.status}</span>
                <button className="p-2 rounded-xl text-[var(--text-secondary)] hover:text-[var(--accent)] transition-colors">
                  <Download size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
