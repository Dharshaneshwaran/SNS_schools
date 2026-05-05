"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Users, 
  CheckCircle2, 
  XCircle, 
  Check
} from "lucide-react";

const students = [
  { id: 1, name: "Aditi Sharma", roll: "10A01", image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Aditi" },
  { id: 2, name: "Rahul Varma", roll: "10A02", image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Rahul" },
  { id: 3, name: "Sneha Kapoor", roll: "10A03", image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sneha" },
  { id: 4, name: "Vikram Singh", roll: "10A04", image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Vikram" },
  { id: 5, name: "Priya Mani", roll: "10A05", image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Priya" },
  { id: 6, name: "Arjun Das", roll: "10A06", image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Arjun" },
  { id: 7, name: "Meera Nair", roll: "10A07", image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Meera" },
  { id: 8, name: "Karan Johar", roll: "10A08", image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Karan" },
  { id: 9, name: "Sanya Malhotra", roll: "10A09", image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sanya" },
  { id: 10, name: "Ishaan Khattar", roll: "10A10", image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Ishaan" },
  { id: 11, name: "Ananya Pandey", roll: "10A11", image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Ananya" },
  { id: 12, name: "Varun Dhawan", roll: "10A12", image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Varun" },
];

export default function AttendanceSection() {
  const [selectedClass, setSelectedClass] = useState("10");
  const [selectedSection, setSelectedSection] = useState("A");
  const [attendance, setAttendance] = useState<Record<number, boolean>>({});
  const [isVerifying, setIsVerifying] = useState(false);
  const [isMarkingMode, setIsMarkingMode] = useState(false);

  const toggleAttendance = (id: number) => {
    if (!isMarkingMode) return;
    setAttendance(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const markAllPresent = () => {
    const allPresent: Record<number, boolean> = {};
    students.forEach(s => allPresent[s.id] = true);
    setAttendance(allPresent);
  };

  const handleSubmit = () => {
    setIsVerifying(true);
    setTimeout(() => {
      setIsVerifying(false);
      setIsMarkingMode(false);
      alert("Attendance submitted successfully!");
    }, 1500);
  };

  return (
    <div className="space-y-6">
      {/* Header & Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-end gap-6">

        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2 bg-[var(--bg-secondary)] p-1.5 rounded-2xl border border-[var(--border)]">
            <select 
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="bg-transparent text-sm font-bold px-4 py-2 outline-none appearance-none cursor-pointer text-[var(--text-primary)]"
            >
              <option value="9">Grade 9</option>
              <option value="10">Grade 10</option>
              <option value="11">Grade 11</option>
              <option value="12">Grade 12</option>
            </select>
            <div className="w-px h-6 bg-[var(--border)]" />
            <select 
              value={selectedSection}
              onChange={(e) => setSelectedSection(e.target.value)}
              className="bg-transparent text-sm font-bold px-4 py-2 outline-none appearance-none cursor-pointer text-[var(--text-primary)]"
            >
              <option value="A">Section A</option>
              <option value="B">Section B</option>
              <option value="C">Section C</option>
            </select>
          </div>

          {!isMarkingMode ? (
            <button 
              onClick={() => setIsMarkingMode(true)}
              className="px-8 py-3.5 rounded-2xl bg-[var(--accent)] text-white font-black uppercase tracking-widest text-xs hover:shadow-2xl hover:shadow-[var(--accent-glow)] transition-all active:scale-95"
            >
              Start Marking
            </button>
          ) : (
            <div className="flex items-center gap-3">
              <button 
                onClick={markAllPresent}
                className="px-6 py-3.5 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border)] text-[var(--text-primary)] font-black uppercase tracking-widest text-xs hover:border-[var(--accent)] transition-all"
              >
                Mark All Present
              </button>
              <button 
                onClick={handleSubmit}
                disabled={isVerifying}
                className="px-8 py-3.5 rounded-2xl bg-green-500 text-white font-black uppercase tracking-widest text-xs hover:bg-green-600 shadow-lg shadow-green-500/20 transition-all active:scale-95 disabled:opacity-50 flex items-center gap-2"
              >
                {isVerifying ? (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : <Check size={16} strokeWidth={3} />}
                Verify & Submit
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: "Total Students", value: students.length, color: "var(--text-primary)" },
          { label: "Present", value: Object.values(attendance).filter(v => v).length, color: "#10B981" },
          { label: "Absent", value: isMarkingMode ? students.length - Object.values(attendance).filter(v => v).length : 0, color: "#EF4444" },
        ].map((stat, i) => (
          <div key={i} className="p-5 rounded-[24px] bg-[var(--bg-secondary)] border border-[var(--border)] shadow-[var(--card-shadow)]">
            <p className="text-[9px] font-black text-[var(--text-secondary)] uppercase tracking-[0.2em] mb-1">{stat.label}</p>
            <p className="text-2xl font-black italic" style={{ color: stat.color }}>{stat.value.toString().padStart(2, '0')}</p>
          </div>
        ))}
      </div>

      {/* Student Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
        {students.map((student, i) => (
          <motion.div
            key={student.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.02 }}
            onClick={() => toggleAttendance(student.id)}
            className={`group relative p-3 rounded-[32px] border-2 transition-all cursor-pointer ${
              !isMarkingMode 
                ? "bg-[var(--bg-secondary)] border-[var(--border)] opacity-60 cursor-default" 
                : attendance[student.id]
                  ? "bg-green-500/10 border-green-500 shadow-md shadow-green-500/10"
                  : "bg-[var(--bg-secondary)] border-[var(--border)] hover:border-[var(--accent)]"
            }`}
          >
            <div className="relative aspect-square rounded-[24px] overflow-hidden mb-3 border border-[var(--border)] bg-zinc-800">
              <img 
                src={student.image} 
                alt={student.name} 
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              
              <AnimatePresence>
                {attendance[student.id] && (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.5 }}
                    className="absolute inset-0 bg-green-500/40 backdrop-blur-[1px] flex items-center justify-center"
                  >
                    <div className="w-10 h-10 rounded-full bg-[var(--bg-secondary)] text-green-500 flex items-center justify-center shadow-lg">
                      <Check size={24} strokeWidth={4} />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="text-center">
              <p className="text-[11px] font-black text-[var(--text-primary)] truncate px-1 uppercase italic tracking-tight">{student.name}</p>
              <p className="text-[9px] font-bold text-[var(--text-secondary)] uppercase tracking-widest mt-0.5">{student.roll}</p>
            </div>

            {isMarkingMode && (
              <div className={`absolute -top-1 -right-1 w-6 h-6 rounded-full border-2 border-[var(--bg-primary)] flex items-center justify-center shadow-md transition-colors ${
                attendance[student.id] ? "bg-green-500 text-white" : "bg-red-500 text-white"
              }`}>
                {attendance[student.id] ? <Check size={12} strokeWidth={4} /> : <XCircle size={12} strokeWidth={4} />}
              </div>
            )}
          </motion.div>
        ))}
      </div>

      {!isMarkingMode && (
        <div className="p-8 rounded-[40px] bg-[var(--bg-secondary)] border-2 border-dashed border-[var(--border)] flex flex-col items-center justify-center text-center">
          <div className="w-16 h-16 rounded-2xl bg-[var(--bg-primary)] text-[var(--text-secondary)] flex items-center justify-center mb-4">
            <Users size={32} />
          </div>
          <h3 className="text-lg font-black italic uppercase tracking-tight text-[var(--text-primary)] mb-1">Ready to take attendance?</h3>
          <p className="text-[var(--text-secondary)] text-xs font-medium mb-6">Click 'Start Marking' to record presence for today.</p>
          <button 
            onClick={() => setIsMarkingMode(true)}
            className="px-8 py-3 rounded-xl bg-[var(--accent)] text-white font-black uppercase tracking-widest text-[10px] hover:shadow-2xl hover:shadow-[var(--accent-glow)] transition-all"
          >
            Enable Marking Mode
          </button>
        </div>
      )}
    </div>
  );
}
