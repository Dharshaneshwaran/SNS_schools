"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Search, 
  ChevronRight, 
  Mail, 
  Phone, 
  MapPin, 
  User, 
  X,
  FileText,
  Calendar,
  Award
} from "lucide-react";

const students = [
  { id: 1, name: "Aditi Sharma", roll: "10A01", class: "10-A", gender: "Female", blood: "O+", parent: "Rakesh Sharma", phone: "+91 98765 43210", email: "aditi.s@gmail.com", address: "Peelamedu, Coimbatore", performance: "Excellent" },
  { id: 2, name: "Rahul Varma", roll: "10A02", class: "10-A", gender: "Male", blood: "A+", parent: "Sunil Varma", phone: "+91 98765 43211", email: "rahul.v@gmail.com", address: "RS Puram, Coimbatore", performance: "Good" },
  { id: 3, name: "Sneha Kapoor", roll: "10A03", class: "10-A", gender: "Female", blood: "B+", parent: "Alok Kapoor", phone: "+91 98765 43212", email: "sneha.k@gmail.com", address: "Saravanampatti, Coimbatore", performance: "Average" },
];

export default function StudentsSection() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStudent, setSelectedStudent] = useState<typeof students[0] | null>(null);
  const [selectedClass, setSelectedClass] = useState("10");
  const [selectedSection, setSelectedSection] = useState("A");

  const filteredStudents = students.filter(s => 
    s.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    s.roll.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-8">
      {/* Header & Search */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-3xl font-black italic uppercase tracking-tight text-[var(--text-primary)]">
            Student <span className="text-[var(--accent)]">Database</span>
          </h2>
          <p className="text-sm text-[var(--text-secondary)] font-medium">Access student records and profiles</p>
        </div>

        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2 bg-[var(--bg-secondary)] p-1.5 rounded-2xl border border-[var(--border)]">
            <select 
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="bg-transparent text-sm font-bold px-4 py-2 outline-none appearance-none cursor-pointer"
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
              className="bg-transparent text-sm font-bold px-4 py-2 outline-none appearance-none cursor-pointer"
            >
              <option value="A">Section A</option>
              <option value="B">Section B</option>
              <option value="C">Section C</option>
            </select>
          </div>

          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-secondary)] group-hover:text-[var(--accent)] transition-colors" size={18} />
            <input 
              type="text" 
              placeholder="Search by name or roll no..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full md:w-80 bg-[var(--bg-secondary)] border border-[var(--border)] rounded-2xl py-3.5 pl-12 pr-6 text-sm font-medium outline-none focus:border-[var(--accent)] transition-all"
            />
          </div>
        </div>
      </div>

      {/* Student List Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredStudents.map((student, i) => (
          <motion.div
            key={student.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            onClick={() => setSelectedStudent(student)}
            className="p-6 rounded-[32px] bg-[var(--bg-secondary)] border border-[var(--border)] hover:border-[var(--accent)] transition-all group cursor-pointer"
          >
            <div className="flex items-center gap-5">
              <div className="w-16 h-16 rounded-2xl bg-[var(--bg-primary)] border border-[var(--border)] flex items-center justify-center text-2xl font-black italic text-[var(--accent)] group-hover:scale-110 transition-transform">
                {student.name.charAt(0)}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-lg font-black text-[var(--text-primary)] truncate tracking-tight">{student.name}</h3>
                <p className="text-xs font-bold text-[var(--text-secondary)] uppercase tracking-widest mt-0.5">Roll: {student.roll} · {student.class}</p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-[var(--bg-primary)] border border-[var(--border)] flex items-center justify-center text-[var(--text-secondary)] group-hover:text-[var(--accent)] transition-all">
                <ChevronRight size={20} />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Student Details Modal */}
      <AnimatePresence>
        {selectedStudent && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedStudent(null)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="w-full max-w-4xl bg-[var(--bg-secondary)] border border-[var(--border)] rounded-[48px] shadow-2xl relative overflow-hidden flex flex-col md:flex-row"
              onClick={e => e.stopPropagation()}
            >
              {/* Profile Sidebar */}
              <div className="w-full md:w-80 bg-[var(--bg-primary)] p-10 border-r border-[var(--border)] flex flex-col items-center text-center">
                <div className="w-32 h-32 rounded-[40px] bg-zinc-800 flex items-center justify-center text-5xl font-black italic text-white shadow-xl mb-6">
                  {selectedStudent.name.charAt(0)}
                </div>
                <h3 className="text-2xl font-black text-[var(--text-primary)] leading-tight mb-2">{selectedStudent.name}</h3>
                <p className="text-[var(--accent)] text-xs font-black uppercase tracking-widest mb-8">Roll No: {selectedStudent.roll}</p>
                
                <div className="w-full space-y-4">
                  <div className="p-4 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border)]">
                    <p className="text-[10px] font-black text-[var(--text-secondary)] uppercase tracking-widest mb-1">Performance</p>
                    <p className="text-sm font-bold text-[var(--text-primary)]">{selectedStudent.performance}</p>
                  </div>
                  <div className="p-4 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border)]">
                    <p className="text-[10px] font-black text-[var(--text-secondary)] uppercase tracking-widest mb-1">Attendance</p>
                    <p className="text-sm font-bold text-green-500">94.5%</p>
                  </div>
                </div>
              </div>

              {/* Details Content */}
              <div className="flex-1 p-10 relative">
                <button 
                  onClick={() => setSelectedStudent(null)}
                  className="absolute top-8 right-8 p-3 rounded-2xl bg-[var(--bg-primary)] border border-[var(--border)] text-[var(--text-secondary)] hover:text-red-500 transition-all"
                >
                  <X size={20} strokeWidth={3} />
                </button>

                <h4 className="text-sm font-black uppercase tracking-[0.2em] text-[var(--text-secondary)] mb-8">Detailed Information</h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                  {[
                    { label: "Parent Name", value: selectedStudent.parent, icon: User },
                    { label: "Phone Number", value: selectedStudent.phone, icon: Phone },
                    { label: "Email Address", value: selectedStudent.email, icon: Mail },
                    { label: "Date of Birth", value: "12th Oct 2011", icon: Calendar },
                    { label: "Gender / Blood", value: `${selectedStudent.gender} / ${selectedStudent.blood}`, icon: User },
                    { label: "Address", value: selectedStudent.address, icon: MapPin },
                  ].map((info, i) => (
                    <div key={i} className="flex gap-4">
                      <div className="w-10 h-10 rounded-xl bg-[var(--bg-primary)] border border-[var(--border)] flex items-center justify-center text-[var(--accent)] shrink-0">
                        <info.icon size={18} />
                      </div>
                      <div>
                        <p className="text-[10px] font-black text-[var(--text-secondary)] uppercase tracking-widest">{info.label}</p>
                        <p className="text-sm font-bold text-[var(--text-primary)] mt-0.5">{info.value}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-12 pt-8 border-t border-[var(--border)] flex gap-4">
                  <button className="flex-1 flex items-center justify-center gap-3 py-4 rounded-2xl bg-[var(--bg-primary)] border border-[var(--border)] text-[var(--text-primary)] font-black uppercase tracking-widest text-xs hover:border-[var(--accent)] transition-all">
                    <FileText size={16} /> View Reports
                  </button>
                  <button className="flex-1 flex items-center justify-center gap-3 py-4 rounded-2xl bg-[var(--accent)] text-white font-black uppercase tracking-widest text-xs hover:shadow-xl hover:shadow-[var(--accent-glow)] transition-all">
                    <Award size={16} /> Certificates
                  </button>
                </div>
              </div>

              <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-[var(--accent-glow)] rounded-full blur-3xl opacity-20 pointer-events-none" />
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
