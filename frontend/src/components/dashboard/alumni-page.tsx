"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { 
  Student, 
  MagnifyingGlass, 
  Funnel, 
  LinkedinLogo, 
  EnvelopeSimple,
  Briefcase,
  GraduationCap
} from "@phosphor-icons/react";
import { PageSection } from "./page-section";

const alumni = [
  { name: "Rahul Verma", batch: "2018", stream: "Science", status: "Employed", company: "Google", role: "Software Engineer" },
  { name: "Anjali Mehta", batch: "2019", stream: "Commerce", status: "Higher Studies", company: "IIM Ahmedabad", role: "MBA Student" },
  { name: "Siddharth Rao", batch: "2017", stream: "Humanities", status: "Employed", company: "The Hindu", role: "Journalist" },
  { name: "Pooja Hegde", batch: "2020", stream: "Science", status: "Employed", company: "Tesla", role: "UI Designer" },
];

export function AlumniPage() {
  const [search, setSearch] = useState("");

  return (
    <PageSection
      eyebrow="School Legacy"
      title="Alumni Directory"
      description="Stay connected with SNS Academy graduates. Track their career progress and academic achievements."
    >
      <div className="flex flex-col gap-8">
        
        {/* Search & Stats */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
           <div className="lg:col-span-8 flex items-center gap-4 bg-[var(--bg-secondary)] p-4 rounded-[2rem] border border-[var(--border)] shadow-[var(--card-shadow)]">
              <div className="relative flex-1">
                 <MagnifyingGlass size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
                 <input 
                   type="text" 
                   placeholder="Search alumni by name, batch, or company..." 
                   value={search}
                   onChange={(e) => setSearch(e.target.value)}
                   className="w-full bg-[var(--bg-primary)] border-none rounded-2xl pl-12 pr-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[var(--accent)]/20 transition-all"
                 />
              </div>
              <button className="flex items-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800 transition-all">
                 <Funnel size={18} /> Filters
              </button>
           </div>
           <div className="lg:col-span-4 bg-[var(--accent)] rounded-[2rem] p-6 text-white flex items-center justify-between shadow-lg shadow-[var(--accent)]/20">
              <div>
                 <div className="text-[10px] font-bold uppercase tracking-widest opacity-80 mb-1">Total Alumni</div>
                 <div className="text-3xl font-bold">4,280+</div>
              </div>
              <GraduationCap size={48} weight="duotone" className="opacity-40" />
           </div>
        </div>

        {/* Alumni Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
           {alumni.map((person, i) => (
             <motion.div 
               key={i}
               whileHover={{ y: -5 }}
               className="bg-[var(--bg-secondary)] rounded-[2.5rem] border border-[var(--border)] p-8 shadow-[0_20px_50px_rgba(0,0,0,0.03)] group"
             >
                <div className="h-16 w-16 rounded-3xl bg-[var(--bg-primary)] flex items-center justify-center text-[var(--text-muted)] mb-6 group-hover:bg-[var(--accent)] group-hover:text-white transition-all duration-500">
                   <Student size={32} weight="duotone" />
                </div>
                <div className="mb-6">
                   <h4 className="text-lg font-bold text-[var(--text-primary)] mb-1">{person.name}</h4>
                   <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold uppercase bg-[var(--bg-muted)] text-[var(--text-secondary)] px-2 py-0.5 rounded-full">{person.batch} Batch</span>
                      <span className="text-[10px] font-bold uppercase text-[var(--accent)]">{person.stream}</span>
                   </div>
                </div>

                <div className="space-y-3 mb-8">
                   <div className="flex items-center gap-3 text-sm text-[var(--text-secondary)]">
                      <Briefcase size={18} className="text-[var(--text-muted)]" />
                      <span className="truncate">{person.role} @ {person.company}</span>
                   </div>
                   <div className="flex items-center gap-3 text-sm text-[var(--text-secondary)]">
                      <GraduationCap size={18} className="text-[var(--text-muted)]" />
                      <span>{person.status}</span>
                   </div>
                </div>

                <div className="flex gap-2 pt-6 border-t border-[var(--border)]">
                   <button className="flex-1 flex items-center justify-center gap-2 py-3 bg-[var(--bg-primary)] text-[var(--text-secondary)] rounded-xl text-xs font-bold hover:bg-sky-50 hover:text-sky-600 transition-all">
                      <LinkedinLogo size={18} /> LinkedIn
                   </button>
                   <button className="p-3 bg-[var(--bg-primary)] text-[var(--text-muted)] rounded-xl hover:bg-[var(--bg-muted)] hover:text-[var(--text-primary)] transition-all">
                      <EnvelopeSimple size={18} />
                   </button>
                </div>
             </motion.div>
           ))}
        </div>

      </div>
    </PageSection>
  );
}
