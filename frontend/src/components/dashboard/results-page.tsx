"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  GraduationCap, 
  Table, 
  CloudArrowUp, 
  CheckCircle,
  CaretRight,
  CaretLeft,
  FilePdf,
  Warning
} from "@phosphor-icons/react";
import { PageSection } from "./page-section";

type Step = 1 | 2 | 3;

export function ResultsPage() {
  const [step, setStep] = useState<Step>(1);
  const [selectedClass, setSelectedClass] = useState("");
  const [isPublishing, setIsPublishing] = useState(false);

  const [marks, setMarks] = useState([
    { name: "Arjun Sharma", math: "85", science: "92", english: "88" },
    { name: "Priya Patel", math: "94", science: "89", english: "91" },
    { name: "Rohan Gupta", math: "76", science: "82", english: "79" },
  ]);

  const updateMark = (index: number, subject: string, value: string) => {
    const newMarks = [...marks];
    (newMarks[index] as any)[subject] = value;
    setMarks(newMarks);
  };

  const handlePublish = () => {
    setIsPublishing(true);
    setTimeout(() => {
      setIsPublishing(false);
      setStep(3);
    }, 1800);
  };

  return (
    <PageSection
      eyebrow="Academic Performance"
      title="Results Flow"
      description="Record, validate, and publish academic results following the official grading workflow."
    >
      <div className="max-w-5xl mx-auto">
        <div className="rounded-[2.5rem] border border-[var(--border)] bg-white overflow-hidden shadow-[0_24px_70px_rgba(15,23,42,0.05)]">
          
          {/* Header */}
          <div className="bg-slate-50 border-b border-slate-100 px-8 py-6 flex items-center justify-between">
             <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-2xl bg-[#FF7F50] flex items-center justify-center text-white shadow-lg shadow-[#FF7F50]/20">
                   <GraduationCap size={28} weight="fill" />
                </div>
                <div>
                   <h3 className="text-lg font-bold text-slate-900">Result Management</h3>
                   <p className="text-xs text-slate-500 font-medium">Session 2024-25 • Term 1</p>
                </div>
             </div>
             <div className="flex gap-2">
                {[1, 2, 3].map((s) => (
                  <div key={s} className={`h-2 w-8 rounded-full transition-all duration-500 ${step >= s ? "bg-[#FF7F50]" : "bg-slate-200"}`} />
                ))}
             </div>
          </div>

          <div className="p-8">
            <AnimatePresence mode="wait">
              {step === 1 && (
                <motion.div 
                  key="step1"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-8"
                >
                  <div className="text-center max-w-md mx-auto py-6">
                    <h4 className="text-2xl font-bold text-slate-900 mb-2">Select Class</h4>
                    <p className="text-sm text-slate-500">Choose the class to begin mark entry for the current term.</p>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                     {["Class 8A", "Class 8B", "Class 9A", "Class 9B", "Class 10A", "Class 10B", "Class 11A", "Class 11B"].map((c) => (
                       <button 
                         key={c}
                         onClick={() => { setSelectedClass(c); setStep(2); }}
                         className={`p-6 rounded-3xl border-2 transition-all group ${
                           selectedClass === c ? "border-[#FF7F50] bg-[#FF7F50]/5" : "border-slate-100 hover:border-slate-200"
                         }`}
                       >
                         <Table size={32} className={`mb-3 transition-colors ${selectedClass === c ? "text-[#FF7F50]" : "text-slate-300 group-hover:text-slate-400"}`} />
                         <div className="font-bold text-slate-900">{c}</div>
                         <div className="text-[10px] font-bold text-slate-400 uppercase mt-1">42 Students</div>
                       </button>
                     ))}
                  </div>
                </motion.div>
              )}

              {step === 2 && (
                <motion.div 
                  key="step2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <div className="flex items-center justify-between">
                     <h4 className="text-xl font-bold text-slate-900">Entering Marks for {selectedClass}</h4>
                     <button className="flex items-center gap-2 text-xs font-bold text-[#FF7F50] uppercase tracking-widest hover:underline">
                        <CloudArrowUp size={18} /> Bulk Import CSV
                     </button>
                  </div>

                  <div className="overflow-hidden border border-slate-100 rounded-3xl">
                    <table className="w-full text-left">
                      <thead className="bg-slate-50 text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100">
                        <tr>
                          <th className="px-6 py-4">Student Name</th>
                          <th className="px-6 py-4">Mathematics</th>
                          <th className="px-6 py-4">Science</th>
                          <th className="px-6 py-4">English</th>
                          <th className="px-6 py-4">Total</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-50">
                        {marks.map((student, i) => (
                          <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                            <td className="px-6 py-4 font-bold text-slate-900">{student.name}</td>
                            <td className="px-6 py-4">
                               <input 
                                 type="text" 
                                 value={student.math} 
                                 onChange={(e) => updateMark(i, "math", e.target.value)}
                                 className="w-16 bg-slate-50 border border-slate-200 rounded-lg px-2 py-1.5 text-center font-bold text-slate-900 focus:border-[#FF7F50] outline-none"
                               />
                            </td>
                            <td className="px-6 py-4">
                               <input 
                                 type="text" 
                                 value={student.science} 
                                 onChange={(e) => updateMark(i, "science", e.target.value)}
                                 className="w-16 bg-slate-50 border border-slate-200 rounded-lg px-2 py-1.5 text-center font-bold text-slate-900 focus:border-[#FF7F50] outline-none"
                               />
                            </td>
                            <td className="px-6 py-4">
                               <input 
                                 type="text" 
                                 value={student.english} 
                                 onChange={(e) => updateMark(i, "english", e.target.value)}
                                 className="w-16 bg-slate-50 border border-slate-200 rounded-lg px-2 py-1.5 text-center font-bold text-slate-900 focus:border-[#FF7F50] outline-none"
                               />
                            </td>
                            <td className="px-6 py-4 font-bold text-[#FF7F50]">
                               {parseInt(student.math) + parseInt(student.science) + parseInt(student.english)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <div className="flex items-center justify-between pt-6">
                    <button onClick={() => setStep(1)} className="flex items-center gap-2 text-slate-500 font-bold hover:text-slate-900 transition-colors">
                      <CaretLeft size={20} /> Back
                    </button>
                    <div className="flex gap-4">
                       <button className="px-6 py-3 border border-slate-200 text-slate-600 rounded-2xl font-bold hover:bg-slate-50 transition-all">
                          Save Draft
                       </button>
                       <button 
                         onClick={handlePublish}
                         className="flex items-center gap-2 px-10 py-3 bg-slate-900 text-white rounded-2xl font-bold shadow-xl hover:bg-slate-800 transition-all"
                       >
                         {isPublishing ? "Publishing..." : "Publish Results"}
                         <CloudArrowUp size={20} weight="fill" />
                       </button>
                    </div>
                  </div>
                </motion.div>
              )}

              {step === 3 && (
                <motion.div 
                  key="step3"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-12"
                >
                  <div className="inline-flex h-24 w-24 items-center justify-center rounded-full bg-emerald-50 text-emerald-500 mb-8">
                    <CheckCircle size={64} weight="fill" />
                  </div>
                  <h3 className="text-3xl font-bold text-slate-900 mb-4">Results Published</h3>
                  <p className="text-slate-500 max-w-sm mx-auto mb-10 leading-relaxed">
                    Term 1 results for <span className="font-bold text-slate-900">{selectedClass}</span> have been sent to all students and parents.
                  </p>
                  
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <button 
                      onClick={() => { setStep(1); setSelectedClass(""); }}
                      className="flex items-center justify-center gap-2 px-8 py-4 bg-[#FF7F50] text-white rounded-2xl font-bold shadow-lg shadow-[#FF7F50]/30 hover:bg-[#e66a3e] transition-all"
                    >
                      Process Another Class
                    </button>
                    <button className="flex items-center justify-center gap-2 px-8 py-4 bg-white border border-slate-200 text-slate-700 rounded-2xl font-bold hover:bg-slate-50 transition-all">
                      <FilePdf size={20} /> Generate Report Cards
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Warning Panel */}
        {step === 2 && (
          <div className="mt-8 p-6 rounded-3xl bg-rose-50 border border-rose-100 flex gap-4">
             <Warning size={24} className="text-rose-500 shrink-0" />
             <p className="text-sm text-rose-700 leading-relaxed">
                <span className="font-bold">Attention:</span> Publishing results is an irreversible action. Ensure all marks have been cross-verified against the physical answer scripts before final submission.
             </p>
          </div>
        )}
      </div>
    </PageSection>
  );
}
