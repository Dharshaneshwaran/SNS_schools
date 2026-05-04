"use client";

import React, { useState, useEffect } from "react";
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
  Award,
  BookOpen,
  Users
} from "lucide-react";
import { getAllUsers } from "../../../services/users-service";

export default function StudentsSection() {
  const [searchQuery, setSearchQuery] = useState("");
  const [students, setStudents] = useState<any[]>([]);
  const [selectedStudent, setSelectedStudent] = useState<any | null>(null);
  const [selectedClass, setSelectedClass] = useState("all");
  const [selectedSection, setSelectedSection] = useState("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStudents() {
      try {
        const data = (await getAllUsers()) as any[];
        // Filter users that are students (role parent + has studentProfile)
        const studentUsers = data.filter((u: any) => u.role === "parent" && u.studentProfile);
        setStudents(studentUsers);
      } catch (e) {
        console.error("Failed to load students", e);
      } finally {
        setLoading(false);
      }
    }
    loadStudents();
  }, []);

  const filteredStudents = students.filter(s => {
    const profile = s.studentProfile;
    const matchesSearch = s.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          (profile?.studentId || "").toLowerCase().includes(searchQuery.toLowerCase());
    const matchesClass = selectedClass === "all" || profile?.class === selectedClass;
    const matchesSection = selectedSection === "all" || profile?.section === selectedSection;
    return matchesSearch && matchesClass && matchesSection;
  });

  return (
    <div className="space-y-8">
      {/* Header & Search */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-3xl font-black italic uppercase tracking-tight text-[var(--text-primary)]">
            Student <span className="text-[var(--accent)]">Database</span>
          </h2>
          <p className="text-sm text-[var(--text-secondary)] font-medium">Access detailed student records and admission profiles</p>
        </div>

        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2 bg-[var(--bg-secondary)] p-1.5 rounded-2xl border border-[var(--border)]">
            <select 
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="bg-transparent text-sm font-bold px-4 py-2 outline-none appearance-none cursor-pointer"
            >
              <option value="all">All Grades</option>
              {Array.from(new Set(students.map(s => s.studentProfile?.class).filter(Boolean))).map(c => (
                <option key={c as string} value={c as string}>{c as string}</option>
              ))}
            </select>
            <div className="w-px h-6 bg-[var(--border)]" />
            <select 
              value={selectedSection}
              onChange={(e) => setSelectedSection(e.target.value)}
              className="bg-transparent text-sm font-bold px-4 py-2 outline-none appearance-none cursor-pointer"
            >
              <option value="all">All Sections</option>
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
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--accent)]"></div>
        </div>
      ) : filteredStudents.length === 0 ? (
        <div className="text-center py-20 text-[var(--text-secondary)] font-bold">
          No students found matching your criteria.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredStudents.map((student, i) => (
            <motion.div
              key={student.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              onDoubleClick={() => setSelectedStudent(student)}
              className="p-6 rounded-[32px] bg-[var(--bg-secondary)] border border-[var(--border)] hover:border-[var(--accent)] transition-all group cursor-pointer"
            >
              <div className="flex items-center gap-5">
                <div className="w-16 h-16 rounded-2xl bg-[var(--bg-primary)] border border-[var(--border)] flex items-center justify-center text-2xl font-black italic text-[var(--accent)] group-hover:scale-110 transition-transform">
                  {student.name.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-black text-[var(--text-primary)] truncate tracking-tight">{student.name}</h3>
                  <p className="text-xs font-bold text-[var(--text-secondary)] uppercase tracking-widest mt-0.5">
                    {student.studentProfile?.studentId} · {student.studentProfile?.class}-{student.studentProfile?.section}
                  </p>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <span className="text-[10px] text-[var(--text-secondary)] font-bold uppercase">Double Click</span>
                  <div className="w-8 h-8 rounded-xl bg-[var(--bg-primary)] border border-[var(--border)] flex items-center justify-center text-[var(--text-secondary)] group-hover:text-[var(--accent)] transition-all">
                    <ChevronRight size={16} />
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Student Details Modal */}
      <AnimatePresence>
        {selectedStudent && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedStudent(null)}
              className="absolute inset-0 bg-black/90 backdrop-blur-md"
            />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="w-full max-w-5xl h-[85vh] bg-zinc-900 border border-zinc-800 rounded-[40px] shadow-[0_0_80px_rgba(0,0,0,0.8)] relative overflow-hidden flex flex-col lg:flex-row z-10"
              onClick={e => e.stopPropagation()}
            >
              {/* Profile Sidebar */}
              <div className="w-full lg:w-96 bg-zinc-950 p-8 lg:p-12 border-r border-zinc-800 flex flex-col items-center text-center overflow-y-auto">
                <div className="w-40 h-40 rounded-[48px] bg-zinc-800 flex items-center justify-center text-6xl font-black italic text-white shadow-2xl mb-8 shrink-0">
                  {selectedStudent.name.charAt(0)}
                </div>
                <h3 className="text-3xl font-black text-white leading-tight mb-3 italic uppercase tracking-tighter">{selectedStudent.name}</h3>
                <p className="text-orange-500 text-sm font-black uppercase tracking-[0.2em] mb-10">
                  {selectedStudent.studentProfile?.admissionNo || selectedStudent.studentProfile?.studentId || "N/A"}
                </p>
                
                <div className="w-full space-y-4 text-left">
                  <div className="p-5 rounded-3xl bg-zinc-900 border border-zinc-800 flex gap-4 items-center">
                     <BookOpen className="text-orange-500" size={24} />
                     <div>
                       <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Class & Section</p>
                       <p className="text-sm font-bold text-white">{selectedStudent.studentProfile?.class} - {selectedStudent.studentProfile?.section}</p>
                     </div>
                  </div>
                  <div className="p-5 rounded-3xl bg-zinc-900 border border-zinc-800 flex gap-4 items-center">
                     <Calendar className="text-orange-500" size={24} />
                     <div>
                       <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Date of Birth</p>
                       <p className="text-sm font-bold text-white">{selectedStudent.studentProfile?.dob || "Not Provided"}</p>
                     </div>
                  </div>
                  <div className="p-5 rounded-3xl bg-zinc-900 border border-zinc-800 flex gap-4 items-center">
                     <User className="text-orange-500" size={24} />
                     <div>
                       <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Gender & Blood</p>
                       <p className="text-sm font-bold text-white">{selectedStudent.studentProfile?.gender || "-"} / {selectedStudent.studentProfile?.bloodGroup || "-"}</p>
                     </div>
                  </div>
                </div>
              </div>

              {/* Details Content */}
              <div className="flex-1 p-8 lg:p-12 relative overflow-y-auto bg-zinc-900">
                <button 
                  onClick={() => setSelectedStudent(null)}
                  className="absolute top-8 right-8 p-3 rounded-2xl bg-zinc-800 border border-zinc-700 text-zinc-400 hover:text-white hover:border-white transition-all z-20"
                >
                  <X size={20} strokeWidth={3} />
                </button>

                <div className="mb-12">
                  <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-orange-500 mb-2">Admission Application Data</h4>
                  <h2 className="text-4xl font-black text-white italic uppercase tracking-tight">Full Details</h2>
                </div>

                <div className="space-y-12">
                  {/* Previous Education */}
                  <div>
                     <h3 className="flex items-center gap-2 text-zinc-400 font-bold uppercase tracking-widest text-xs mb-6 border-b border-zinc-800 pb-2">
                       <BookOpen size={16} /> Previous Education
                     </h3>
                     <div className="grid grid-cols-2 gap-6">
                        <div>
                           <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Present School</p>
                           <p className="text-sm text-zinc-200">{selectedStudent.studentProfile?.presentSchool || "N/A"}</p>
                        </div>
                        <div>
                           <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Previous Grade</p>
                           <p className="text-sm text-zinc-200">{selectedStudent.studentProfile?.previousGrade || "N/A"}</p>
                        </div>
                        <div>
                           <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Board of Education</p>
                           <p className="text-sm text-zinc-200">{selectedStudent.studentProfile?.boardOfEducation || "N/A"}</p>
                        </div>
                     </div>
                  </div>

                  {/* Parents Details */}
                  <div>
                     <h3 className="flex items-center gap-2 text-zinc-400 font-bold uppercase tracking-widest text-xs mb-6 border-b border-zinc-800 pb-2">
                       <Users size={16} /> Parents / Guardians
                     </h3>
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Father */}
                        <div className="space-y-4 bg-zinc-800/50 p-6 rounded-3xl">
                           <h4 className="text-orange-500 font-black text-xs uppercase tracking-widest">Father's Details</h4>
                           <div>
                              <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Name</p>
                              <p className="text-sm text-white font-bold">{selectedStudent.studentProfile?.fatherName || "N/A"}</p>
                           </div>
                           <div>
                              <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Contact & Email</p>
                              <p className="text-sm text-zinc-300">{selectedStudent.studentProfile?.fatherContact || "No Phone"} · {selectedStudent.studentProfile?.fatherEmail || "No Email"}</p>
                           </div>
                           <div>
                              <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Occupation / Organization</p>
                              <p className="text-sm text-zinc-300">{selectedStudent.studentProfile?.fatherOccupation || "N/A"} at {selectedStudent.studentProfile?.fatherOrganization || "N/A"}</p>
                           </div>
                        </div>

                        {/* Mother */}
                        <div className="space-y-4 bg-zinc-800/50 p-6 rounded-3xl">
                           <h4 className="text-orange-500 font-black text-xs uppercase tracking-widest">Mother's Details</h4>
                           <div>
                              <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Name</p>
                              <p className="text-sm text-white font-bold">{selectedStudent.studentProfile?.motherName || "N/A"}</p>
                           </div>
                           <div>
                              <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Contact & Email</p>
                              <p className="text-sm text-zinc-300">{selectedStudent.studentProfile?.motherContact || "No Phone"} · {selectedStudent.studentProfile?.motherEmail || "No Email"}</p>
                           </div>
                           <div>
                              <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Occupation / Organization</p>
                              <p className="text-sm text-zinc-300">{selectedStudent.studentProfile?.motherOccupation || "N/A"} at {selectedStudent.studentProfile?.motherOrganization || "N/A"}</p>
                           </div>
                        </div>
                     </div>
                  </div>

                  {/* Other Demographics */}
                  <div>
                     <h3 className="flex items-center gap-2 text-zinc-400 font-bold uppercase tracking-widest text-xs mb-6 border-b border-zinc-800 pb-2">
                       <MapPin size={16} /> Additional Info
                     </h3>
                     <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        <div>
                           <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Nationality</p>
                           <p className="text-sm text-zinc-200">{selectedStudent.studentProfile?.nationality || "N/A"}</p>
                        </div>
                        <div>
                           <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Religion</p>
                           <p className="text-sm text-zinc-200">{selectedStudent.studentProfile?.religion || "N/A"}</p>
                        </div>
                        <div>
                           <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Community</p>
                           <p className="text-sm text-zinc-200">{selectedStudent.studentProfile?.community || "N/A"}</p>
                        </div>
                        <div>
                           <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Mother Tongue</p>
                           <p className="text-sm text-zinc-200">{selectedStudent.studentProfile?.motherTongue || "N/A"}</p>
                        </div>
                     </div>
                  </div>
                </div>
              </div>

              {/* Decorative background glow */}
              <div className="absolute -right-20 -top-20 w-96 h-96 bg-orange-500 rounded-full blur-[120px] opacity-10 pointer-events-none" />
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
