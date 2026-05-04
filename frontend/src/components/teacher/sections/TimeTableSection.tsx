"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";

export default function TimeTableSection() {
  const [activeView, setActiveView] = useState<"personal" | "class">("personal");

  const periodHeaders = ["I", "II", "III", "LUNCH", "IV", "V", "VI", "VII"];
  
  const timeTableData = activeView === 'personal' ? [
    { day: "Monday", periods: ["Math", "Physics", "English", "LUNCH", "Math", "CS", "CS", "Yoga"] },
    { day: "Tuesday", periods: ["Math", "Physics", "English", "LUNCH", "Math", "CS", "CS", "Yoga"] },
    { day: "Wednesday", periods: ["Math", "Physics", "English", "LUNCH", "Math", "CS", "CS", "Yoga"] },
    { day: "Thursday", periods: ["Math", "Physics", "English", "LUNCH", "Math", "CS", "CS", "Yoga"] },
    { day: "Friday", periods: ["Math", "Physics", "English", "LUNCH", "Math", "CS", "CS", "Yoga"] },
    { day: "Saturday", periods: ["-", "-", "-", "LUNCH", "-", "-", "-", "-"] },
  ] : [
    { day: "Monday", periods: ["English", "Math", "Science", "LUNCH", "Math", "CS", "CS", "Yoga"] },
    { day: "Tuesday", periods: ["Math", "Science", "CS", "LUNCH", "English", "History", "History", "Games"] },
    { day: "Wednesday", periods: ["Science", "English", "Math", "LUNCH", "Math", "CS", "CS", "Yoga"] },
    { day: "Thursday", periods: ["Math", "Science", "CS", "LUNCH", "English", "History", "History", "Games"] },
    { day: "Friday", periods: ["Science", "English", "Math", "LUNCH", "Math", "CS", "CS", "Yoga"] },
    { day: "Saturday", periods: ["Math", "Science", "CS", "LUNCH", "English", "History", "History", "Games"] },
  ];

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-3xl font-black italic uppercase tracking-tight text-[var(--text-primary)]">
            Time <span className="text-[var(--accent)]">Table</span>
          </h2>
          <p className="text-sm text-[var(--text-secondary)] font-medium">Manage your weekly teaching schedule</p>
        </div>

        <div className="flex bg-[var(--bg-secondary)] p-1 rounded-2xl border border-[var(--border)]">
          <button 
            onClick={() => setActiveView("personal")}
            className={`px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
              activeView === "personal" ? "bg-[var(--accent)] text-white shadow-lg shadow-[var(--accent-glow)]" : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
            }`}
          >
            Personal View
          </button>
          <button 
            onClick={() => setActiveView("class")}
            className={`px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
              activeView === "class" ? "bg-[var(--accent)] text-white shadow-lg shadow-[var(--accent-glow)]" : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
            }`}
          >
            Class 10A View
          </button>
        </div>
      </div>

      <div className="bg-[var(--bg-secondary)] rounded-[40px] border border-[var(--border)] shadow-[var(--card-shadow)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-[var(--bg-primary)]/50">
                <th className="p-6 text-left text-[10px] font-black text-[var(--text-secondary)] uppercase tracking-[0.2em] border-b border-[var(--border)]">Day / Period</th>
                {periodHeaders.map(h => (
                  <th key={h} className="p-6 text-center text-xs font-black text-[var(--text-primary)] uppercase tracking-widest border-b border-[var(--border)]">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {timeTableData.map((row, ri) => (
                <tr key={ri} className="border-b border-[var(--border)] last:border-0 hover:bg-[var(--bg-primary)]/30 transition-colors">
                  <td className="p-6 text-sm font-black text-[var(--text-primary)] italic uppercase bg-[var(--bg-primary)]/20">{row.day}</td>
                  {row.periods.map((p, pi) => {
                    const isLunch = p === "LUNCH";
                    const isSpecial = ["L A B", "L I B R A R Y", "S E M I N A R", "SPORTS", "Yoga", "Games"].includes(p);
                    return (
                      <td key={pi} className={`p-6 text-center text-xs font-bold transition-all ${
                        isLunch ? "text-[var(--text-secondary)] opacity-50 font-black italic" : (isSpecial ? "text-[var(--accent)] font-black" : "text-[var(--text-primary)]")
                      }`}>
                        {p}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
