"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ArrowsLeftRight, 
  UserCircle, 
  MagnifyingGlass, 
  CheckCircle,
  Clock,
  Warning,
  Plus
} from "@phosphor-icons/react";
import { PageSection } from "./page-section";

const periods = [
  { id: 1, time: "09:00 AM - 09:45 AM", subject: "Mathematics", grade: "10-A" },
  { id: 2, time: "10:30 AM - 11:15 AM", subject: "Mathematics", grade: "9-B" },
  { id: 3, time: "01:30 PM - 02:15 PM", subject: "Free Period", grade: "N/A" },
];

const availableStaff = [
  { id: "T-201", name: "Mr. Vikram Rao", dept: "Physics", load: "Light" },
  { id: "T-205", name: "Ms. Anjali M.", dept: "Mathematics", load: "Medium" },
  { id: "T-310", name: "Dr. Karan S.", dept: "Computer Science", load: "Free" },
];

export function SubstitutionPage() {
  const [selectedPeriod, setSelectedPeriod] = useState<any>(null);
  const [isRequesting, setIsRequesting] = useState(false);
  const [isSent, setIsSent] = useState(false);

  const handleRequest = () => {
    setIsRequesting(true);
    setTimeout(() => {
      setIsRequesting(false);
      setIsSent(true);
    }, 1500);
  };

  return (
    <PageSection
      eyebrow="Schedule Coordination"
      title="Substitution Management"
      description="Request staff coverage for your periods or view pending substitution requests from your colleagues."
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left: Create Request */}
        <div className="lg:col-span-8 space-y-8">
           <div className="rounded-[2.5rem] border border-[var(--border)] bg-[var(--bg-secondary)] p-10 shadow-[0_24px_70px_rgba(15,23,42,0.05)]">
              <h3 className="text-xl font-bold text-[var(--text-primary)] mb-8 flex items-center gap-2">
                 <Plus size={24} className="text-[var(--accent)]" weight="bold" />
                 New Substitution Request
              </h3>

              {!isSent ? (
                <div className="space-y-10">
                   {/* Step 1: Select Period */}
                   <div>
                      <label className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest block mb-4">1. Select Your Period</label>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                         {periods.map((p) => (
                           <button 
                             key={p.id}
                             onClick={() => setSelectedPeriod(p)}
                             className={`p-6 rounded-3xl border-2 text-left transition-all ${
                               selectedPeriod?.id === p.id ? "border-[var(--accent)] bg-[var(--accent)]/5" : "border-[var(--border)] hover:border-[var(--border)]"
                             }`}
                           >
                              <div className="flex items-center justify-between mb-3">
                                 <Clock size={20} className={selectedPeriod?.id === p.id ? "text-[var(--accent)]" : "text-[var(--text-muted)]"} />
                                 <span className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-tighter">{p.time}</span>
                              </div>
                              <div className="font-bold text-[var(--text-primary)]">{p.subject}</div>
                              <div className="text-xs text-[var(--text-secondary)]">{p.grade}</div>
                           </button>
                         ))}
                      </div>
                   </div>

                   {/* Step 2: Select Staff */}
                   <div className={selectedPeriod ? "opacity-100" : "opacity-30 pointer-events-none transition-opacity"}>
                      <label className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest block mb-4">2. Assign Available Staff</label>
                      <div className="space-y-3">
                         {availableStaff.map((staff) => (
                           <div key={staff.id} className="flex items-center justify-between p-4 rounded-2xl bg-[var(--bg-primary)] border border-[var(--border)] group hover:bg-[var(--bg-secondary)] hover:shadow-lg transition-all">
                              <div className="flex items-center gap-4">
                                 <div className="h-10 w-10 rounded-full bg-[var(--bg-muted)] flex items-center justify-center text-[var(--text-muted)]">
                                    <UserCircle size={24} weight="duotone" />
                                 </div>
                                 <div>
                                    <div className="text-sm font-bold text-[var(--text-primary)]">{staff.name}</div>
                                    <div className="text-[10px] text-[var(--text-muted)] font-bold uppercase">{staff.dept} • Workload: {staff.load}</div>
                                 </div>
                              </div>
                              <button 
                                onClick={handleRequest}
                                className="px-6 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800 transition-all"
                              >
                                {isRequesting ? "Sending..." : "Request"}
                              </button>
                           </div>
                         ))}
                      </div>
                   </div>
                </div>
              ) : (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-10"
                >
                   <div className="h-20 w-20 rounded-full bg-emerald-50 text-emerald-500 flex items-center justify-center mx-auto mb-6">
                      <CheckCircle size={48} weight="fill" />
                   </div>
                   <h4 className="text-2xl font-bold text-[var(--text-primary)] mb-2">Request Sent</h4>
                   <p className="text-[var(--text-secondary)] max-w-sm mx-auto mb-8">
                      Your substitution request for {selectedPeriod?.subject} ({selectedPeriod?.grade}) has been sent to the staff members.
                   </p>
                   <button 
                     onClick={() => { setIsSent(false); setSelectedPeriod(null); }}
                     className="px-8 py-3 bg-[var(--accent)] text-white rounded-2xl font-bold text-sm shadow-lg shadow-[var(--accent)]/20 hover:bg-[#e66a3e] transition-all"
                   >
                      Create Another Request
                   </button>
                </motion.div>
              )}
           </div>
        </div>

        {/* Right: History & Logs */}
        <div className="lg:col-span-4 space-y-6">
           <div className="rounded-[2rem] border border-[var(--border)] bg-[var(--bg-secondary)] p-8 shadow-[0_24px_70px_rgba(15,23,42,0.05)]">
              <h3 className="text-lg font-bold text-[var(--text-primary)] mb-8 flex items-center gap-2">
                 <ArrowsLeftRight size={24} className="text-[var(--accent)]" weight="duotone" />
                 Recent History
              </h3>
              <div className="space-y-4">
                 {[
                   { name: "Mr. Somnath P.", role: "Covered your class", status: "Completed", date: "Yesterday" },
                   { name: "Ms. Anjali M.", role: "Requested you", status: "Declined", date: "2 days ago" },
                 ].map((log, i) => (
                   <div key={i} className="p-4 rounded-2xl bg-[var(--bg-primary)] border border-[var(--border)]">
                      <div className="flex justify-between items-start mb-2">
                         <div className="text-xs font-bold text-[var(--text-primary)]">{log.name}</div>
                         <span className="text-[10px] text-[var(--text-muted)] font-medium">{log.date}</span>
                      </div>
                      <div className="flex items-center justify-between">
                         <span className="text-[10px] text-[var(--text-secondary)] uppercase font-bold">{log.role}</span>
                         <span className={`text-[10px] font-bold uppercase tracking-widest ${log.status === 'Completed' ? 'text-emerald-500' : 'text-rose-500'}`}>{log.status}</span>
                      </div>
                   </div>
                 ))}
              </div>
           </div>

           <div className="rounded-[2rem] bg-slate-900 p-8 text-white">
              <div className="flex items-center gap-3 mb-4">
                 <Warning size={24} className="text-[var(--accent)]" />
                 <h4 className="font-bold">Urgent Need?</h4>
              </div>
              <p className="text-xs text-[var(--text-muted)] leading-relaxed mb-6">
                 If you have an emergency and need immediate coverage, please contact the Office Admin directly via the Chat system.
              </p>
              <button className="w-full py-3 bg-[var(--bg-secondary)]/10 rounded-xl text-xs font-bold hover:bg-[var(--bg-secondary)]/20 transition-all">
                 Contact Admin
              </button>
           </div>
        </div>

      </div>
    </PageSection>
  );
}
