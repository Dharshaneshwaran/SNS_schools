"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  CalendarCheck, 
  Plus, 
  CaretLeft, 
  CaretRight, 
  Clock, 
  MapPin,
  Tag,
  CheckCircle,
  X
} from "@phosphor-icons/react";
import { PageSection } from "./page-section";

const events = [
  { id: 1, title: "Annual Sports Meet", date: "May 15, 2024", time: "09:00 AM", location: "School Grounds", category: "Sports", color: "emerald" },
  { id: 2, title: "Parent-Teacher Meeting", date: "May 22, 2024", time: "10:30 AM", location: "Main Hall", category: "Meeting", color: "sky" },
  { id: 3, title: "Final Term Exams", date: "June 01, 2024", time: "08:30 AM", location: "Classrooms", category: "Academic", color: "rose" },
  { id: 4, title: "Summer Workshop", date: "June 15, 2024", time: "11:00 AM", location: "IT Lab", category: "Activity", color: "amber" },
];

export function CalendarPage() {
  const [isAdding, setIsAdding] = useState(false);
  const [newEvent, setNewEvent] = useState({ title: "", date: "", time: "", location: "", category: "Academic" });

  return (
    <PageSection
      eyebrow="Schedule & Events"
      title="School Calendar"
      description="Manage the official school timeline, schedule events, and broadcast academic dates to the community."
    >
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
        
        {/* Left: Interactive Calendar Mockup */}
        <div className="xl:col-span-8 space-y-6">
           <div className="rounded-[2.5rem] border border-slate-100 bg-white p-10 shadow-[0_24px_70px_rgba(15,23,42,0.05)]">
              <div className="flex items-center justify-between mb-10">
                 <div>
                    <h4 className="text-2xl font-bold text-slate-900">May 2024</h4>
                    <p className="text-sm text-slate-500 font-medium">8 Upcoming events this month</p>
                 </div>
                 <div className="flex gap-2">
                    <button className="p-3 bg-slate-50 rounded-xl text-slate-400 hover:text-slate-900 transition-all"><CaretLeft size={20} /></button>
                    <button className="p-3 bg-slate-50 rounded-xl text-slate-400 hover:text-slate-900 transition-all"><CaretRight size={20} /></button>
                    <button 
                      onClick={() => setIsAdding(true)}
                      className="flex items-center gap-2 px-6 py-3 bg-[#FF7F50] text-white rounded-xl font-bold text-sm shadow-lg shadow-[#FF7F50]/20 hover:bg-[#e66a3e] transition-all"
                    >
                       <Plus size={18} weight="bold" /> Add Event
                    </button>
                 </div>
              </div>

              {/* Grid Mockup */}
              <div className="grid grid-cols-7 gap-px bg-slate-100 border border-slate-100 rounded-3xl overflow-hidden">
                 {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(day => (
                   <div key={day} className="bg-slate-50 py-4 text-center text-[10px] font-bold text-slate-400 uppercase tracking-widest">{day}</div>
                 ))}
                 {Array.from({ length: 31 }).map((_, i) => {
                   const day = i + 1;
                   const hasEvent = day === 15 || day === 22;
                   return (
                     <div key={i} className="bg-white min-h-[100px] p-3 hover:bg-slate-50 transition-colors relative group">
                        <span className={`text-xs font-bold ${day > 0 ? 'text-slate-400' : 'text-slate-200'}`}>{day}</span>
                        {hasEvent && (
                          <div className={`mt-2 p-1.5 rounded-lg text-[8px] font-bold uppercase tracking-tighter truncate ${
                            day === 15 ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-sky-50 text-sky-600 border border-sky-100'
                          }`}>
                            {day === 15 ? 'Sports Meet' : 'PTM Meeting'}
                          </div>
                        )}
                        <button className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                           <div className="h-6 w-6 rounded-full bg-slate-900 text-white flex items-center justify-center"><Plus size={12} /></div>
                        </button>
                     </div>
                   );
                 })}
              </div>
           </div>
        </div>

        {/* Right: Upcoming Events List */}
        <div className="xl:col-span-4 space-y-6">
           <div className="rounded-[2.5rem] border border-slate-100 bg-white p-8 shadow-[0_24px_70px_rgba(15,23,42,0.05)]">
              <h4 className="font-bold text-slate-900 mb-8 flex items-center gap-2">
                 <Clock size={20} className="text-[#FF7F50]" />
                 Upcoming Feed
              </h4>
              <div className="space-y-4">
                 {events.map((event) => (
                   <div key={event.id} className="p-6 rounded-3xl bg-slate-50 border border-slate-100 hover:border-[#FF7F50]/20 hover:bg-white hover:shadow-xl transition-all group">
                      <div className="flex items-center justify-between mb-4">
                         <span className={`px-3 py-1 rounded-full text-[8px] font-bold uppercase tracking-widest ${
                           event.color === 'emerald' ? 'bg-emerald-50 text-emerald-600' : 
                           event.color === 'sky' ? 'bg-sky-50 text-sky-600' :
                           event.color === 'rose' ? 'bg-rose-50 text-rose-600' : 'bg-amber-50 text-amber-600'
                         }`}>
                            {event.category}
                         </span>
                         <Tag size={16} className="text-slate-300 group-hover:text-[#FF7F50] transition-colors" />
                      </div>
                      <h5 className="font-bold text-slate-900 mb-4">{event.title}</h5>
                      <div className="space-y-2">
                         <div className="flex items-center gap-3 text-xs text-slate-500">
                            <CalendarCheck size={16} /> {event.date}
                         </div>
                         <div className="flex items-center gap-3 text-xs text-slate-500">
                            <MapPin size={16} /> {event.location}
                         </div>
                      </div>
                   </div>
                 ))}
              </div>
              <button className="w-full mt-8 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest hover:text-[#FF7F50] transition-colors">
                 View Full Timeline
              </button>
           </div>
        </div>

      </div>

      {/* Add Event Modal Mockup */}
      <AnimatePresence>
         {isAdding && (
           <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsAdding(false)}
                className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
              />
              <motion.div 
                initial={{ scale: 0.95, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.95, opacity: 0, y: 20 }}
                className="relative w-full max-w-lg bg-white rounded-[3rem] p-10 shadow-2xl"
              >
                 <div className="flex items-center justify-between mb-8">
                    <h4 className="text-xl font-bold text-slate-900">Add New Event</h4>
                    <button onClick={() => setIsAdding(false)} className="p-2 hover:bg-slate-50 rounded-xl transition-all"><X size={20} /></button>
                 </div>
                 <div className="space-y-6">
                    <div className="space-y-2">
                       <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Event Title</label>
                       <input 
                         type="text" 
                         placeholder="e.g. Science Fair 2024" 
                         className="w-full bg-slate-50 border-none rounded-2xl px-6 py-4 text-sm focus:ring-2 focus:ring-[#FF7F50]/20 transition-all outline-none"
                       />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                       <div className="space-y-2">
                          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Date</label>
                          <input type="date" className="w-full bg-slate-50 border-none rounded-2xl px-6 py-4 text-sm outline-none" />
                       </div>
                       <div className="space-y-2">
                          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Category</label>
                          <select className="w-full bg-slate-50 border-none rounded-2xl px-6 py-4 text-sm outline-none appearance-none">
                             <option>Academic</option>
                             <option>Sports</option>
                             <option>Meeting</option>
                             <option>Cultural</option>
                          </select>
                       </div>
                    </div>
                    <button 
                      onClick={() => setIsAdding(false)}
                      className="w-full py-5 bg-slate-900 text-white rounded-[2rem] font-bold flex items-center justify-center gap-2 hover:bg-slate-800 transition-all shadow-xl"
                    >
                       <CheckCircle size={24} weight="fill" /> Save Event
                    </button>
                 </div>
              </motion.div>
           </div>
         )}
      </AnimatePresence>
    </PageSection>
  );
}
