"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { 
  Plus, 
  FileText, 
  Upload, 
  Eye, 
  Calendar,
  AlertCircle,
  MoreHorizontal,
  CheckCircle2
} from "lucide-react";

const items = [
  { id: 1, title: "Algebra Worksheet", type: "Assignment", class: "10-A", date: "Today", submissions: "32/42", status: "Active" },
  { id: 2, title: "Mid-term Physics Paper", type: "Exam", class: "11-C", date: "May 05", submissions: "0/38", status: "Upcoming" },
  { id: 3, title: "Biology Lab Report", type: "Assignment", class: "9-B", date: "Yesterday", submissions: "42/42", status: "Completed" },
];

export default function AssignmentsExams() {
  const [filter, setFilter] = useState("All");

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <h2 className="text-2xl font-bold text-[var(--text-primary)]">Assignments & Exams</h2>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-[var(--accent)] text-white font-bold text-sm hover:shadow-lg hover:shadow-[var(--accent-glow)] transition-all">
            <Plus size={18} /> Create New
          </button>
        </div>
      </div>

      <div className="flex items-center gap-2 p-1.5 bg-[var(--bg-secondary)] rounded-2xl border border-[var(--border)] w-fit">
        {["All", "Assignments", "Exams"].map(t => (
          <button
            key={t}
            onClick={() => setFilter(t)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              filter === t 
                ? "bg-[var(--accent)] text-white shadow-md shadow-[var(--accent-glow)]" 
                : "text-[var(--text-secondary)] hover:bg-[var(--bg-primary)]"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {items.filter(i => filter === "All" || i.type === filter.slice(0, -1) || i.type === filter).map((item, idx) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05 }}
            className="p-5 rounded-[28px] bg-[var(--bg-secondary)] border border-[var(--border)] hover:border-[var(--accent)] transition-all group"
          >
            <div className="flex justify-between items-start mb-4">
              <div className={`p-3 rounded-2xl ${item.type === 'Exam' ? 'bg-purple-500/10 text-purple-500' : 'bg-blue-500/10 text-blue-500'}`}>
                {item.type === 'Exam' ? <AlertCircle size={22} /> : <FileText size={22} />}
              </div>
              <button className="text-[var(--text-secondary)] hover:text-[var(--text-primary)]">
                <MoreHorizontal size={20} />
              </button>
            </div>
            
            <h4 className="text-lg font-bold text-[var(--text-primary)] mb-1">{item.title}</h4>
            <p className="text-xs font-medium text-[var(--text-secondary)] mb-4">{item.class} • {item.type}</p>

            <div className="flex items-center justify-between p-3 rounded-2xl bg-[var(--bg-primary)] mb-4">
              <div className="text-center">
                <p className="text-[10px] uppercase font-bold text-[var(--text-secondary)]">Date</p>
                <p className="text-xs font-bold text-[var(--text-primary)]">{item.date}</p>
              </div>
              <div className="w-px h-6 bg-[var(--border)]" />
              <div className="text-center">
                <p className="text-[10px] uppercase font-bold text-[var(--text-secondary)]">Submissions</p>
                <p className="text-xs font-bold text-[var(--text-primary)]">{item.submissions}</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button className="flex-1 py-2.5 rounded-xl border border-[var(--border)] text-xs font-bold text-[var(--text-primary)] hover:bg-[var(--bg-primary)] transition-all flex items-center justify-center gap-2">
                <Eye size={14} /> View
              </button>
              <button className="flex-1 py-2.5 rounded-xl bg-[var(--accent-glow)] text-[var(--accent)] text-xs font-bold hover:bg-[var(--accent)] hover:text-white transition-all flex items-center justify-center gap-2">
                <Upload size={14} /> Upload
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
