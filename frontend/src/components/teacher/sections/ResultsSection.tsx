"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  BarChart3, 
  Plus, 
  FileEdit, 
  Eye, 
  Download, 
  Search,
  CheckCircle2,
  TrendingUp,
  AlertCircle
} from "lucide-react";

const students = [
  { id: 1, name: "Aditi Sharma", roll: "10A01", math: 85, science: 92, english: 88 },
  { id: 2, name: "Rahul Varma", roll: "10A02", math: 78, science: 80, english: 75 },
  { id: 3, name: "Sneha Kapoor", roll: "10A03", math: 92, science: 95, english: 98 },
];

export default function ResultsSection() {
  const [activeTab, setActiveTab] = useState<"view" | "entry">("view");
  const [selectedClass, setSelectedClass] = useState("10");
  const [selectedExam, setSelectedExam] = useState("Mid-Term");

  return (
    <div className="space-y-8">
      {/* Header & Mode Toggle */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-3xl font-black italic uppercase tracking-tight text-[var(--text-primary)]">
            Academic <span className="text-[var(--accent)]">Results</span>
          </h2>
          <p className="text-sm text-[var(--text-secondary)] font-medium">Manage student performance and grade entry</p>
        </div>

        <div className="flex items-center gap-2 bg-[var(--bg-secondary)] p-1.5 rounded-2xl border border-[var(--border)]">
          <button 
            onClick={() => setActiveTab("view")}
            className={`flex items-center gap-2 px-6 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
              activeTab === "view" ? "bg-[var(--accent)] text-white shadow-lg" : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
            }`}
          >
            <Eye size={16} /> View Results
          </button>
          <button 
            onClick={() => setActiveTab("entry")}
            className={`flex items-center gap-2 px-6 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
              activeTab === "entry" ? "bg-[var(--accent)] text-white shadow-lg" : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
            }`}
          >
            <FileEdit size={16} /> Enter Marks
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-[var(--bg-secondary)] p-6 rounded-[32px] border border-[var(--border)]">
        <div>
          <p className="text-[10px] font-black text-[var(--text-secondary)] uppercase tracking-widest mb-2 ml-1">Academic Grade</p>
          <select 
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
            className="w-full bg-[var(--bg-primary)] border border-[var(--border)] rounded-2xl p-3.5 text-sm font-bold outline-none focus:border-[var(--accent)] appearance-none cursor-pointer"
          >
            <option value="10">Grade 10 - Section A</option>
            <option value="11">Grade 11 - Section B</option>
          </select>
        </div>
        <div>
          <p className="text-[10px] font-black text-[var(--text-secondary)] uppercase tracking-widest mb-2 ml-1">Examination Type</p>
          <select 
            value={selectedExam}
            onChange={(e) => setSelectedExam(e.target.value)}
            className="w-full bg-[var(--bg-primary)] border border-[var(--border)] rounded-2xl p-3.5 text-sm font-bold outline-none focus:border-[var(--accent)] appearance-none cursor-pointer"
          >
            <option value="Mid-Term">Mid-Term Assessment</option>
            <option value="Unit-1">Unit Test 1</option>
            <option value="Final">Annual Examination</option>
          </select>
        </div>
        <div className="flex items-end">
          <button className="w-full py-3.5 rounded-2xl bg-[var(--bg-primary)] border border-[var(--border)] text-[var(--text-primary)] font-black uppercase tracking-widest text-[10px] hover:border-[var(--accent)] transition-all">
            Download Template
          </button>
        </div>
      </div>

      {activeTab === 'view' ? (
        <div className="space-y-6">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              { label: "Class Average", value: "84.2%", icon: TrendingUp, color: "#3B82F6" },
              { label: "Highest Score", value: "98.5%", icon: CheckCircle2, color: "#10B981" },
              { label: "Needs Improvement", value: "04", icon: AlertCircle, color: "#EF4444" },
            ].map((stat, i) => (
              <div key={i} className="p-6 rounded-[32px] bg-[var(--bg-secondary)] border border-[var(--border)] flex items-center gap-5">
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center" style={{ backgroundColor: `${stat.color}15`, color: stat.color }}>
                  <stat.icon size={24} />
                </div>
                <div>
                  <p className="text-[10px] font-black text-[var(--text-secondary)] uppercase tracking-widest">{stat.label}</p>
                  <p className="text-2xl font-black italic text-[var(--text-primary)]">{stat.value}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Results Table */}
          <div className="rounded-[40px] bg-[var(--bg-secondary)] border border-[var(--border)] overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-[var(--bg-primary)] border-b border-[var(--border)]">
                    <th className="p-6 text-[10px] font-black text-[var(--text-secondary)] uppercase tracking-widest">Student</th>
                    <th className="p-6 text-[10px] font-black text-[var(--text-secondary)] uppercase tracking-widest">Roll No</th>
                    <th className="p-6 text-[10px] font-black text-[var(--text-secondary)] uppercase tracking-widest">Mathematics</th>
                    <th className="p-6 text-[10px] font-black text-[var(--text-secondary)] uppercase tracking-widest">Science</th>
                    <th className="p-6 text-[10px] font-black text-[var(--text-secondary)] uppercase tracking-widest">English</th>
                    <th className="p-6 text-[10px] font-black text-[var(--text-secondary)] uppercase tracking-widest">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--border)]">
                  {students.map((student) => (
                    <tr key={student.id} className="hover:bg-[var(--bg-primary)] transition-colors">
                      <td className="p-6 font-bold text-[var(--text-primary)]">{student.name}</td>
                      <td className="p-6 text-sm text-[var(--text-secondary)] font-medium">{student.roll}</td>
                      <td className="p-6"><span className="font-black text-[var(--accent)]">{student.math}</span>/100</td>
                      <td className="p-6"><span className="font-black text-[var(--accent)]">{student.science}</span>/100</td>
                      <td className="p-6"><span className="font-black text-[var(--accent)]">{student.english}</span>/100</td>
                      <td className="p-6">
                        <span className="px-3 py-1 rounded-full bg-green-500/10 text-green-500 text-[10px] font-black uppercase">Passed</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="rounded-[40px] bg-[var(--bg-secondary)] border border-[var(--border)] p-8">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-xl font-black text-[var(--text-primary)] uppercase italic tracking-tight">Data Entry Grid</h3>
              <button className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[var(--accent)] text-white text-[10px] font-black uppercase tracking-widest shadow-lg shadow-[var(--accent-glow)]">
                <Download size={14} /> Import CSV
              </button>
            </div>

            <div className="space-y-4">
              {students.map((student) => (
                <div key={student.id} className="flex flex-col md:flex-row md:items-center gap-6 p-6 rounded-3xl bg-[var(--bg-primary)] border border-[var(--border)] hover:border-[var(--accent)] transition-all">
                  <div className="md:w-64">
                    <p className="text-sm font-black text-[var(--text-primary)]">{student.name}</p>
                    <p className="text-[10px] font-bold text-[var(--text-secondary)] uppercase tracking-widest">Roll: {student.roll}</p>
                  </div>
                  
                  <div className="flex-1 grid grid-cols-3 gap-4">
                    <div className="relative">
                      <p className="absolute -top-2 left-3 px-2 bg-[var(--bg-primary)] text-[9px] font-black text-[var(--text-secondary)] uppercase">Math</p>
                      <input type="number" defaultValue={student.math} className="w-full bg-transparent border border-[var(--border)] rounded-xl p-3 text-sm font-black text-[var(--accent)] outline-none focus:border-[var(--accent)]" />
                    </div>
                    <div className="relative">
                      <p className="absolute -top-2 left-3 px-2 bg-[var(--bg-primary)] text-[9px] font-black text-[var(--text-secondary)] uppercase">Science</p>
                      <input type="number" defaultValue={student.science} className="w-full bg-transparent border border-[var(--border)] rounded-xl p-3 text-sm font-black text-[var(--accent)] outline-none focus:border-[var(--accent)]" />
                    </div>
                    <div className="relative">
                      <p className="absolute -top-2 left-3 px-2 bg-[var(--bg-primary)] text-[9px] font-black text-[var(--text-secondary)] uppercase">English</p>
                      <input type="number" defaultValue={student.english} className="w-full bg-transparent border border-[var(--border)] rounded-xl p-3 text-sm font-black text-[var(--accent)] outline-none focus:border-[var(--accent)]" />
                    </div>
                  </div>

                  <button className="p-3 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border)] text-green-500 hover:scale-110 transition-transform">
                    <CheckCircle2 size={20} />
                  </button>
                </div>
              ))}
            </div>

            <div className="mt-10 flex justify-end gap-4">
              <button className="px-10 py-4 rounded-2xl bg-[var(--bg-primary)] border border-[var(--border)] text-[var(--text-primary)] font-black uppercase tracking-widest text-xs hover:border-[var(--accent)] transition-all">
                Save Draft
              </button>
              <button className="px-10 py-4 rounded-2xl bg-[var(--accent)] text-white font-black uppercase tracking-widest text-xs hover:shadow-2xl hover:shadow-[var(--accent-glow)] transition-all">
                Final Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
