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
  GraduationCap,
  X
} from "@phosphor-icons/react";
import { PageSection } from "./page-section";

const alumni = [
  { name: "Rahul Verma", batch: "2018", stream: "Science", status: "Employed", company: "Google", role: "Software Engineer" },
  { name: "Anjali Mehta", batch: "2019", stream: "Commerce", status: "Higher Studies", company: "IIM Ahmedabad", role: "MBA Student" },
  { name: "Siddharth Rao", batch: "2017", stream: "Humanities", status: "Employed", company: "The Hindu", role: "Journalist" },
  { name: "Pooja Hegde", batch: "2020", stream: "Science", status: "Employed", company: "Tesla", role: "UI Designer" },
  { name: "Arjun Nair", batch: "2021", stream: "Science", status: "Higher Studies", company: "IIT Bombay", role: "M.Tech Student" },
  { name: "Sneha Krishnan", batch: "2018", stream: "Commerce", status: "Employed", company: "HDFC Bank", role: "Financial Analyst" },
  { name: "Vikram Pandey", batch: "2016", stream: "Science", status: "Employed", company: "Infosys", role: "Sr. Engineer" },
  { name: "Meera Subramanian", batch: "2022", stream: "Humanities", status: "Employed", company: "Wipro", role: "HR Executive" },
];

const inactivatedStudents = [
  { name: "Rahul Sharma", class: "8-A", status: "Transferred", reason: "Relocation" },
  { name: "Priya Patel", class: "9-B", status: "Dropped", reason: "Health Issues" },
  { name: "Aarav Kumar", class: "10-A", status: "Transferred", reason: "Parent Transfer" },
  { name: "Deepa Nair", class: "7-A", status: "Dropped", reason: "Financial Constraints" },
  { name: "Karthik Rajan", class: "11-B", status: "Transferred", reason: "City Change" },
];

export function AlumniPage() {
  const [search, setSearch] = useState("");
  const [view, setView] = useState<"passed-out" | "inactivated">("passed-out");

  const filteredAlumni = alumni.filter(a =>
    !search ||
    a.name.toLowerCase().includes(search.toLowerCase()) ||
    a.batch.includes(search) ||
    a.company.toLowerCase().includes(search.toLowerCase()) ||
    a.stream.toLowerCase().includes(search.toLowerCase())
  );

  const filteredInactive = inactivatedStudents.filter(s =>
    !search ||
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    s.class.toLowerCase().includes(search.toLowerCase()) ||
    s.reason.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <PageSection
      eyebrow="Student Records"
      title="Alumni & Inactive Students"
      description="Track graduated students and those who have left the institution."
    >
      <div className="flex flex-col gap-8">

        {/* Tab Switcher */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center gap-4">
          <div className="flex gap-3 shrink-0">
            <button
              onClick={() => { setView("passed-out"); setSearch(""); }}
              className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-bold text-sm transition-all ${
                view === "passed-out"
                  ? "bg-slate-900 text-white shadow-lg"
                  : "bg-white text-slate-500 border border-slate-200 hover:bg-slate-50"
              }`}
            >
              <GraduationCap size={20} weight="duotone" />
              Passed Out Students
            </button>
            <button
              onClick={() => { setView("inactivated"); setSearch(""); }}
              className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-bold text-sm transition-all ${
                view === "inactivated"
                  ? "bg-slate-900 text-white shadow-lg"
                  : "bg-white text-slate-500 border border-slate-200 hover:bg-slate-50"
              }`}
            >
              <Student size={20} weight="duotone" />
              Inactivated Students
            </button>
          </div>

          {/* Search bar */}
          <div className="flex-1 flex items-center gap-3 bg-white px-4 py-3 rounded-2xl border border-slate-100 shadow-sm">
            <MagnifyingGlass size={18} className="text-slate-400 shrink-0" />
            <input
              type="text"
              placeholder={view === "passed-out" ? "Search by name, batch, company..." : "Search by name or class..."}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex-1 bg-transparent text-sm outline-none text-slate-900 placeholder:text-slate-400"
            />
            {search && (
              <button onClick={() => setSearch("")} className="text-slate-300 hover:text-slate-600 transition-colors">
                <X size={16} weight="bold" />
              </button>
            )}
          </div>
        </div>

        {/* Stats Banner */}
        <div className={`rounded-[2rem] p-6 text-white flex items-center justify-between shadow-lg ${
          view === "passed-out" ? "bg-[#FF7F50] shadow-[#FF7F50]/20" : "bg-slate-800 shadow-slate-900/20"
        }`}>
          <div>
            <div className="text-[10px] font-bold uppercase tracking-widest opacity-70 mb-1">
              {view === "passed-out" ? "Total Alumni" : "Inactive Records"}
            </div>
            <div className="text-4xl font-black">
              {view === "passed-out" ? `${filteredAlumni.length}` : `${filteredInactive.length}`}
            </div>
            <p className="text-xs opacity-60 mt-1">
              {search ? `Showing results for "${search}"` : view === "passed-out" ? "All graduates" : "Students who have left"}
            </p>
          </div>
          {view === "passed-out" ? (
            <GraduationCap size={64} weight="duotone" className="opacity-25" />
          ) : (
            <Student size={64} weight="duotone" className="opacity-25" />
          )}
        </div>

        {/* Cards — all students, no class filter */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          {view === "passed-out" ? (
            filteredAlumni.length > 0 ? filteredAlumni.map((person, i) => (
              <motion.div
                key={i}
                whileHover={{ y: -5 }}
                className="bg-white rounded-[2.5rem] border border-slate-100 p-8 shadow-[0_20px_50px_rgba(0,0,0,0.03)] group flex flex-col"
              >
                <div className="h-16 w-16 rounded-3xl bg-slate-50 flex items-center justify-center text-slate-400 mb-6 group-hover:bg-[#FF7F50] group-hover:text-white transition-all duration-500">
                  <Student size={32} weight="duotone" />
                </div>
                <div className="mb-5 flex-1">
                  <h4 className="text-lg font-bold text-slate-900 mb-2">{person.name}</h4>
                  <div className="flex items-center gap-2 flex-wrap mb-4">
                    <span className="text-[10px] font-bold uppercase bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full">{person.batch} Batch</span>
                    <span className="text-[10px] font-bold uppercase text-[#FF7F50]">{person.stream}</span>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                      <Briefcase size={16} className="text-slate-300 shrink-0" />
                      <span className="truncate">{person.role} @ {person.company}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                      <GraduationCap size={16} className="text-slate-300 shrink-0" />
                      <span>{person.status}</span>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2 pt-5 border-t border-slate-50 mt-auto">
                  <button className="flex-1 flex items-center justify-center gap-2 py-3 bg-slate-50 text-slate-600 rounded-xl text-xs font-bold hover:bg-sky-50 hover:text-sky-600 transition-all">
                    <LinkedinLogo size={16} /> LinkedIn
                  </button>
                  <button className="p-3 bg-slate-50 text-slate-400 rounded-xl hover:bg-slate-100 hover:text-slate-900 transition-all">
                    <EnvelopeSimple size={16} />
                  </button>
                </div>
              </motion.div>
            )) : (
              <div className="col-span-4 py-20 text-center text-slate-400 font-medium">
                No alumni found matching <span className="font-bold text-slate-600">"{search}"</span>
              </div>
            )
          ) : (
            filteredInactive.length > 0 ? filteredInactive.map((student, i) => (
              <motion.div
                key={i}
                whileHover={{ y: -5 }}
                className="bg-white rounded-[2.5rem] border border-slate-100 p-8 shadow-[0_20px_50px_rgba(0,0,0,0.03)] group flex flex-col"
              >
                <div className="h-16 w-16 rounded-3xl bg-rose-50 flex items-center justify-center text-rose-400 mb-6 group-hover:bg-rose-500 group-hover:text-white transition-all duration-500">
                  <Student size={32} weight="duotone" />
                </div>
                <div className="flex-1">
                  <h4 className="text-lg font-bold text-slate-900 mb-2">{student.name}</h4>
                  <div className="flex items-center gap-2 flex-wrap mb-4">
                    <span className="text-[10px] font-bold uppercase bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full">Class {student.class}</span>
                    <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                      student.status === "Transferred"
                        ? "text-amber-600 bg-amber-50"
                        : "text-rose-500 bg-rose-50"
                    }`}>{student.status}</span>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-2xl">
                    <p className="text-[10px] font-bold text-slate-400 uppercase mb-0.5">Reason for leaving</p>
                    <p className="text-sm font-semibold text-slate-900">{student.reason}</p>
                  </div>
                </div>
              </motion.div>
            )) : (
              <div className="col-span-4 py-20 text-center text-slate-400 font-medium">
                No inactive students found matching <span className="font-bold text-slate-600">"{search}"</span>
              </div>
            )
          )}
        </div>

      </div>
    </PageSection>
  );
}
