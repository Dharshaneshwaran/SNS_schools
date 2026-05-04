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
           <div className="lg:col-span-8 flex items-center gap-4 bg-white p-4 rounded-[2rem] border border-slate-100 shadow-sm">
              <div className="relative flex-1">
                 <MagnifyingGlass size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                 <input 
                   type="text" 
                   placeholder="Search alumni by name, batch, or company..." 
                   value={search}
                   onChange={(e) => setSearch(e.target.value)}
                   className="w-full bg-slate-50 border-none rounded-2xl pl-12 pr-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[#FF7F50]/20 transition-all"
                 />
              </div>
              <button className="flex items-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800 transition-all">
                 <Funnel size={18} /> Filters
              </button>
           </div>
           <div className="lg:col-span-4 bg-[#FF7F50] rounded-[2rem] p-6 text-white flex items-center justify-between shadow-lg shadow-[#FF7F50]/20">
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
               className="bg-white rounded-[2.5rem] border border-slate-100 p-8 shadow-[0_20px_50px_rgba(0,0,0,0.03)] group"
             >
                <div className="h-16 w-16 rounded-3xl bg-slate-50 flex items-center justify-center text-slate-400 mb-6 group-hover:bg-[#FF7F50] group-hover:text-white transition-all duration-500">
                   <Student size={32} weight="duotone" />
                </div>
                <div className="mb-6">
                   <h4 className="text-lg font-bold text-slate-900 mb-1">{person.name}</h4>
                   <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold uppercase bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full">{person.batch} Batch</span>
                      <span className="text-[10px] font-bold uppercase text-[#FF7F50]">{person.stream}</span>
                   </div>
                </div>

                <div className="space-y-3 mb-8">
                   <div className="flex items-center gap-3 text-sm text-slate-600">
                      <Briefcase size={18} className="text-slate-300" />
                      <span className="truncate">{person.role} @ {person.company}</span>
                   </div>
                   <div className="flex items-center gap-3 text-sm text-slate-600">
                      <GraduationCap size={18} className="text-slate-300" />
                      <span>{person.status}</span>
                   </div>
                </div>

                <div className="flex gap-2 pt-6 border-t border-slate-50">
                   <button className="flex-1 flex items-center justify-center gap-2 py-3 bg-slate-50 text-slate-600 rounded-xl text-xs font-bold hover:bg-sky-50 hover:text-sky-600 transition-all">
                      <LinkedinLogo size={18} /> LinkedIn
                   </button>
                   <button className="p-3 bg-slate-50 text-slate-400 rounded-xl hover:bg-slate-100 hover:text-slate-900 transition-all">
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
