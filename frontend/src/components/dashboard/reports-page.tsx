"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { 
  FileText, 
  DownloadSimple, 
  ChartLineUp, 
  ChartPieSlice,
  FilePdf,
  FileXls,
  CheckCircle,
  ClockCounterClockwise
} from "@phosphor-icons/react";
import { PageSection } from "./page-section";

const reportTypes = [
  { id: "attendance", title: "Monthly Attendance", icon: <ChartLineUp size={28} />, desc: "Summary of student/staff presence by grade.", color: "emerald" },
  { id: "academic", title: "Term Result Analysis", icon: <ChartPieSlice size={28} />, desc: "Performance breakdown by subject and class.", color: "sky" },
  { id: "finance", title: "Fee Collection Status", icon: <FileText size={28} />, desc: "Tracking paid, pending, and overdue fees.", color: "amber" },
  { id: "demographic", title: "Student Demographics", icon: <FilePdf size={28} />, desc: "Distribution of students by gender and area.", color: "rose" },
];

export function ReportsPage() {
  const [isGenerating, setIsGenerating] = useState<string | null>(null);

  const handleGenerate = (id: string) => {
    setIsGenerating(id);
    setTimeout(() => {
      setIsGenerating(null);
    }, 2000);
  };

  return (
    <PageSection
      eyebrow="Data & Insights"
      title="Reporting Center"
      description="Generate comprehensive academic and administrative reports. Export data in professional PDF or Excel formats."
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left: Report Selection */}
        <div className="lg:col-span-8 flex flex-col gap-6">
           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {reportTypes.map((report) => (
                <div key={report.id} className="p-8 rounded-[2.5rem] bg-[var(--bg-secondary)] border border-[var(--border)] shadow-[0_20px_50px_rgba(0,0,0,0.03)] hover:shadow-2xl hover:border-[var(--accent)]/30 transition-all group">
                   <div className={`h-14 w-14 rounded-2xl flex items-center justify-center mb-6 transition-colors ${
                     report.color === 'emerald' ? 'bg-emerald-50 text-emerald-500 group-hover:bg-emerald-500 group-hover:text-white' : 
                     report.color === 'sky' ? 'bg-sky-50 text-sky-500 group-hover:bg-sky-500 group-hover:text-white' :
                     report.color === 'amber' ? 'bg-amber-50 text-amber-500 group-hover:bg-amber-500 group-hover:text-white' : 
                     'bg-rose-50 text-rose-500 group-hover:bg-rose-500 group-hover:text-white'
                   }`}>
                      {report.icon}
                   </div>
                   <h4 className="text-xl font-bold text-[var(--text-primary)] mb-2">{report.title}</h4>
                   <p className="text-sm text-[var(--text-secondary)] leading-relaxed mb-8">{report.desc}</p>
                   
                   <div className="flex gap-2">
                      <button 
                        onClick={() => handleGenerate(report.id)}
                        className="flex-1 flex items-center justify-center gap-2 py-3 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800 transition-all shadow-lg shadow-slate-900/20"
                      >
                         {isGenerating === report.id ? "Processing..." : "Generate PDF"}
                         <DownloadSimple size={18} />
                      </button>
                      <button className="p-3 bg-[var(--bg-primary)] text-[var(--text-muted)] rounded-xl hover:bg-[var(--bg-muted)] hover:text-[var(--text-primary)] transition-all">
                         <FileXls size={20} />
                      </button>
                   </div>
                </div>
              ))}
           </div>
        </div>

        {/* Right: History & Downloads */}
        <div className="lg:col-span-4 space-y-6">
           <div className="rounded-[2.5rem] border border-[var(--border)] bg-[var(--bg-secondary)] p-8 shadow-[0_24px_70px_rgba(15,23,42,0.05)]">
              <h4 className="font-bold text-[var(--text-primary)] mb-8 flex items-center gap-2">
                 <ClockCounterClockwise size={20} className="text-[var(--accent)]" />
                 Recent Exports
              </h4>
              <div className="space-y-4">
                 {[
                   { name: "May_Attendance_Final.pdf", size: "2.4 MB", date: "Today, 10:15 AM" },
                   { name: "Term1_Subject_Stats.xlsx", size: "1.1 MB", date: "Yesterday" },
                   { name: "New_Admissions_Q2.pdf", size: "4.8 MB", date: "May 28" },
                 ].map((file, i) => (
                   <div key={i} className="p-4 rounded-2xl bg-[var(--bg-primary)] border border-[var(--border)] flex items-center justify-between group">
                      <div className="min-w-0">
                         <div className="text-xs font-bold text-[var(--text-primary)] truncate">{file.name}</div>
                         <div className="text-[10px] text-[var(--text-muted)] font-bold uppercase mt-0.5">{file.size} • {file.date}</div>
                      </div>
                      <button className="h-8 w-8 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border)] text-[var(--text-muted)] flex items-center justify-center hover:text-[var(--accent)] hover:border-[var(--accent)]/30 transition-all">
                         <DownloadSimple size={16} />
                      </button>
                   </div>
                 ))}
              </div>
           </div>

           <div className="rounded-[2.5rem] bg-slate-900 p-8 text-white">
              <div className="flex items-center gap-3 mb-6">
                 <div className="h-10 w-10 rounded-xl bg-emerald-500/20 text-emerald-500 flex items-center justify-center">
                    <CheckCircle size={24} weight="fill" />
                 </div>
                 <h4 className="font-bold">System Status</h4>
              </div>
              <p className="text-xs text-[var(--text-muted)] leading-relaxed mb-6">
                 All data nodes are synchronized. Academic reports reflect the latest marks published as of 12:00 PM today.
              </p>
              <button className="w-full py-3 bg-[var(--bg-secondary)]/10 rounded-xl text-xs font-bold hover:bg-[var(--bg-secondary)]/20 transition-all">
                 Verify Data Consistency
              </button>
           </div>
        </div>

      </div>
    </PageSection>
  );
}
