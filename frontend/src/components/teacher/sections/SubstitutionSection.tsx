"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { UserCheck, Clock, Calendar as CalendarIcon, CheckCircle2, AlertCircle } from "lucide-react";

export default function SubstitutionSection() {
  const [activeTab, setActiveTab] = useState<"pending" | "history">("pending");

  const substitutions = [
    { id: 1, teacher: "Mr. Rajan (Physics)", class: "10-A", period: "Period 3", time: "10:30 AM - 11:15 AM", date: "Today", status: "pending" },
    { id: 2, teacher: "Mrs. Kavitha (Chemistry)", class: "9-B", period: "Period 5", time: "12:45 PM - 01:30 PM", date: "Tomorrow", status: "pending" },
  ];

  return (
    <div className="space-y-8 max-w-5xl">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-3xl font-black italic uppercase tracking-tight text-[var(--text-primary)]">
            Class <span className="text-[var(--accent)]">Substitution</span>
          </h2>
          <p className="text-sm text-[var(--text-secondary)] font-medium">Manage your assigned proxy classes</p>
        </div>

        <div className="flex bg-[var(--bg-secondary)] p-1 rounded-2xl border border-[var(--border)]">
          <button 
            onClick={() => setActiveTab("pending")}
            className={`px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
              activeTab === "pending" ? "bg-[var(--accent)] text-white shadow-lg shadow-[var(--accent-glow)]" : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
            }`}
          >
            Pending
          </button>
          <button 
            onClick={() => setActiveTab("history")}
            className={`px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
              activeTab === "history" ? "bg-[var(--accent)] text-white shadow-lg shadow-[var(--accent-glow)]" : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
            }`}
          >
            History
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {substitutions.map((sub, i) => (
          <motion.div 
            key={sub.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="p-6 rounded-[32px] bg-[var(--bg-secondary)] border border-[var(--border)] relative overflow-hidden group hover:border-[var(--accent)] transition-all"
          >
            <div className="flex justify-between items-start mb-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-[var(--bg-primary)] border border-[var(--border)] flex items-center justify-center text-[var(--accent)]">
                  <UserCheck size={24} />
                </div>
                <div>
                  <p className="text-[10px] font-black text-[var(--text-secondary)] uppercase tracking-widest mb-0.5">Absent Teacher</p>
                  <p className="text-lg font-bold text-[var(--text-primary)]">{sub.teacher}</p>
                </div>
              </div>
              <span className="px-3 py-1 bg-orange-500/10 text-orange-500 text-[10px] font-black uppercase tracking-widest rounded-full border border-orange-500/20">
                Action Required
              </span>
            </div>

            <div className="space-y-3 mb-8">
              <div className="flex items-center gap-3 text-sm font-medium text-[var(--text-secondary)]">
                <Clock size={16} className="text-[var(--accent)]" />
                <span><strong className="text-[var(--text-primary)]">{sub.period}</strong> ({sub.time})</span>
              </div>
              <div className="flex items-center gap-3 text-sm font-medium text-[var(--text-secondary)]">
                <CalendarIcon size={16} className="text-[var(--accent)]" />
                <span><strong className="text-[var(--text-primary)]">{sub.date}</strong> - Class <strong className="text-[var(--accent)]">{sub.class}</strong></span>
              </div>
            </div>

            <div className="flex gap-3">
              <button className="flex-1 py-3 rounded-xl bg-[var(--bg-primary)] border border-[var(--border)] text-[var(--text-primary)] font-black text-[10px] uppercase tracking-widest hover:border-[var(--accent)] transition-all flex items-center justify-center gap-2">
                <AlertCircle size={14} /> Request Change
              </button>
              <button className="flex-1 py-3 rounded-xl bg-[var(--accent)] text-white font-black text-[10px] uppercase tracking-widest hover:shadow-lg hover:shadow-[var(--accent-glow)] transition-all flex items-center justify-center gap-2">
                <CheckCircle2 size={14} /> Accept Proxy
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
