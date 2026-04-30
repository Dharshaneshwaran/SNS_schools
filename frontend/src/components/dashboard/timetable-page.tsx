"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Calendar, 
  PencilSimple, 
  Plus, 
  Clock, 
  UserCircle,
  CheckCircle,
  X
} from "@phosphor-icons/react";
import { PageSection } from "./page-section";

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
  const [schedule, setSchedule] = useState(initialSchedule);

  return (
    <PageSection
      eyebrow="Academic Schedule"
      title="Teacher Timetable"
      description="View your weekly schedule, manage class assignments, and coordinate with other departments."
    >
      <div className="flex flex-col gap-8">
        
        {/* Header Actions */}
        <div className="flex flex-col md:flex-row justify-between items-center bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm gap-4">
           <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-2xl bg-slate-50 flex items-center justify-center text-[#FF7F50]">
                 <Calendar size={24} weight="duotone" />
              </div>
              <div>
                 <h4 className="text-lg font-bold text-slate-900">Weekly View</h4>
                 <p className="text-xs text-slate-500 font-medium">May 2024 • Term 1 Schedule</p>
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
              <button className="p-3 bg-slate-50 text-slate-400 rounded-xl hover:bg-slate-100 transition-all">
                 <Plus size={20} />
              </button>
           </div>
        </div>

        {/* Timetable Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-5 gap-6">
           {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"].map((day) => {
             const daySchedule = schedule.find(s => s.day === day);
             return (
               <div key={day} className="flex flex-col gap-4">
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] text-center mb-2">{day}</div>
                  <div className="flex flex-col gap-4 min-h-[400px] p-4 rounded-[2.5rem] bg-slate-50/50 border border-slate-100/50 relative">
                     {daySchedule?.slots.map((slot, i) => (
                       <motion.div 
                         key={i}
                         whileHover={{ y: -5 }}
                         className="p-5 rounded-3xl bg-white border border-slate-100 shadow-sm group relative"
                       >
                          <div className="flex items-center justify-between mb-3">
                             <div className="flex items-center gap-2 text-[8px] font-bold text-[#FF7F50] uppercase tracking-tighter">
                                <Clock size={12} /> {slot.time}
                             </div>
                             {isEditing && (
                               <button className="text-rose-500 opacity-0 group-hover:opacity-100 transition-opacity">
                                  <X size={14} weight="bold" />
                               </button>
                             )}
                          </div>
                          <div className="font-bold text-slate-900 mb-1">{slot.subject}</div>
                          <div className="text-[10px] text-slate-400 font-bold uppercase mb-4">{slot.grade} • {slot.room}</div>
                          <div className="flex items-center gap-2 pt-4 border-t border-slate-50">
                             <div className="h-6 w-6 rounded-full bg-slate-100" />
                             <span className="text-[10px] text-slate-500 font-medium truncate">With Class 10A</span>
                          </div>
                       </motion.div>
                     ))}
                     {isEditing && (
                       <button className="w-full py-4 border-2 border-dashed border-slate-200 rounded-3xl text-slate-300 hover:border-[#FF7F50] hover:text-[#FF7F50] transition-all flex items-center justify-center">
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
