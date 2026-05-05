"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { 
  Calendar, 
  PencilSimple, 
  Plus, 
  Clock, 
  CheckCircle,
  X
} from "@phosphor-icons/react";
import { PageSection } from "./page-section";
import { useAuthResource } from "../../hooks/use-auth-resource";
import { getTimetable } from "../../services/mock-data-service";
import { ResourceLoading, ResourceError } from "./resource-states";

const initialSchedule = [
  { id: 1, day: "Monday", slots: [
    { time: "09:00 AM", subject: "Math", grade: "10-A", room: "Room 101" },
    { time: "10:30 AM", subject: "Math", grade: "9-B", room: "Room 102" },
    { time: "01:30 PM", subject: "Substitution", grade: "8-C", room: "Lab 1" },
  ]},
  { id: 2, day: "Tuesday", slots: [
    { time: "09:00 AM", subject: "Math", grade: "10-A", room: "Room 101" },
    { time: "11:30 AM", subject: "Math", grade: "10-C", room: "Room 103" },
  ]},
];

export function TimetablePage() {
  const [isEditing, setIsEditing] = useState(false);
  const [schedule] = useState(initialSchedule);
  const { data, isLoading, error } = useAuthResource(getTimetable);

  // Define headers for the periods
  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

  return (
    <PageSection
      eyebrow="Academic Schedule"
      title="Master Timetable"
      description="View your weekly schedule, manage class allocations, and coordinate with departments."
    >
      <div className="flex flex-col gap-8">
        
        {/* Header Actions */}
        <div className="flex flex-col md:flex-row justify-between items-center bg-[var(--bg-secondary)] p-6 rounded-[2rem] border border-[var(--border)] shadow-[var(--card-shadow)] gap-4">
           <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-2xl bg-[var(--bg-primary)] flex items-center justify-center text-[var(--accent)]">
                 <Calendar size={24} weight="duotone" />
              </div>
              <div>
                 <h4 className="text-lg font-bold text-[var(--text-primary)]">Weekly View</h4>
                 <p className="text-xs text-[var(--text-secondary)] font-medium">May 2024 • Term 1 Schedule</p>
              </div>
           </div>
           <div className="flex gap-2">
              <button 
                onClick={() => setIsEditing(!isEditing)}
                className={`px-6 py-3 rounded-xl font-bold text-sm transition-all flex items-center gap-2 ${
                  isEditing ? "bg-emerald-500 text-white" : "bg-slate-900 text-white"
                }`}
              >
                 {isEditing ? <CheckCircle size={18} /> : <PencilSimple size={18} />}
                 {isEditing ? "Save Schedule" : "Edit Timetable"}
              </button>
              <button className="p-3 bg-[var(--bg-primary)] text-[var(--text-muted)] rounded-xl hover:bg-[var(--bg-muted)] transition-all">
                 <Plus size={20} />
              </button>
           </div>
        </div>

        {isLoading ? <ResourceLoading label="timetable" /> : null}
        {error ? <ResourceError label="timetable" message={error} /> : null}

        {/* Timetable Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-5 gap-6">
           {days.slice(0, 5).map((day) => {
             const daySchedule = schedule.find(s => s.day === day);
             return (
               <div key={day} className="flex flex-col gap-4">
                  <div className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-[0.2em] text-center mb-2">{day}</div>
                  <div className="flex flex-col gap-4 min-h-[400px] p-4 rounded-[2.5rem] bg-[var(--bg-primary)]/50 border border-[var(--border)]/50 relative">
                     {daySchedule?.slots.map((slot, i) => (
                       <motion.div 
                         key={i}
                         whileHover={{ y: -5 }}
                         className="p-5 rounded-3xl bg-[var(--bg-secondary)] border border-[var(--border)] shadow-[var(--card-shadow)] group relative"
                       >
                          <div className="flex items-center justify-between mb-3">
                             <div className="flex items-center gap-2 text-[8px] font-bold text-[var(--accent)] uppercase tracking-tighter">
                                <Clock size={12} /> {slot.time}
                             </div>
                             {isEditing && (
                               <button className="text-rose-500 opacity-0 group-hover:opacity-100 transition-opacity">
                                  <X size={14} weight="bold" />
                               </button>
                             )}
                          </div>
                          <div className="font-bold text-[var(--text-primary)] mb-1">{slot.subject}</div>
                          <div className="text-[10px] text-[var(--text-muted)] font-bold uppercase mb-4">{slot.grade} • {slot.room}</div>
                          <div className="flex items-center gap-2 pt-4 border-t border-[var(--border)]">
                             <div className="h-6 w-6 rounded-full bg-[var(--bg-muted)]" />
                             <span className="text-[10px] text-[var(--text-secondary)] font-medium truncate">With Class {slot.grade}</span>
                          </div>
                       </motion.div>
                     ))}
                     {isEditing && (
                       <button className="w-full py-4 border-2 border-dashed border-[var(--border)] rounded-3xl text-[var(--text-muted)] hover:border-[var(--accent)] hover:text-[var(--accent)] transition-all flex items-center justify-center">
                          <Plus size={20} />
                       </button>
                     )}
                  </div>
               </div>
             );
           })}
        </div>

      </div>
    </PageSection>
  );
}
