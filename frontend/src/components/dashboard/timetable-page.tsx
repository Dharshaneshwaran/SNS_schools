"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Calendar, 
  PencilSimple, 
  Plus, 
  Clock, 
  CheckCircle,
  X,
  CaretLeft,
  GraduationCap
} from "@phosphor-icons/react";
import { PageSection } from "./page-section";
import { useAuthResource } from "../../hooks/use-auth-resource";
import { getTimetable } from "../../services/mock-data-service";
import { ResourceLoading, ResourceError } from "./resource-states";

interface TimeSlot {
  id: number;
  time: string;
  subject: string;
  grade: string;
  room: string;
  teacher?: string;
}

interface DaySchedule {
  id: number;
  day: string;
  slots: TimeSlot[];
}

const initialSchedule: DaySchedule[] = [];

const DEFAULT_CLASSES = ["1-A", "1-B", "2-A", "2-B", "8-A", "8-B", "9-A", "9-B", "10-A", "10-B", "11-A", "12-A"];

export function TimetablePage() {
  const [selectedClass, setSelectedClass] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [schedule, setSchedule] = useState<DaySchedule[]>(initialSchedule);
  const [classes, setClasses] = useState<string[]>(DEFAULT_CLASSES);
  const [isAddClassModalOpen, setIsAddClassModalOpen] = useState(false);
  const [newClassName, setNewClassName] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newEntry, setNewEntry] = useState({
    day: "Monday",
    time: "",
    subject: "",
    grade: "",
    room: ""
  });

  const { data, isLoading, error } = useAuthResource(getTimetable);

  useEffect(() => {
    if (data?.schedule) {
      const formattedSchedule: DaySchedule[] = data.schedule.map((dayData, index) => ({
        id: index + 1,
        day: dayData.day,
        slots: dayData.periods.map((p, pIndex) => ({
          id: Number(`${index}${pIndex}`) || Date.now() + pIndex,
          time: p.time,
          subject: p.subject,
          grade: p.grade,
          room: p.room,
          teacher: p.teacher
        }))
      }));
      setSchedule(formattedSchedule);
    }
  }, [data]);

  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

  const handleAddEntry = () => {
    if (!newEntry.time || !newEntry.subject || !newEntry.grade || !newEntry.room) {
      alert("Please fill in all fields");
      return;
    }

    const daySchedule = schedule.find(s => s.day === newEntry.day);
    const newSlot: TimeSlot = {
      id: Date.now(),
      time: newEntry.time,
      subject: newEntry.subject,
      grade: newEntry.grade,
      room: newEntry.room
    };

    if (daySchedule) {
      setSchedule(schedule.map(s => 
        s.day === newEntry.day 
          ? { ...s, slots: [...s.slots, newSlot] }
          : s
      ));
    } else {
      setSchedule([...schedule, { 
        id: Date.now(), 
        day: newEntry.day, 
        slots: [newSlot] 
      }]);
    }
    setIsModalOpen(false);
    setNewEntry({ ...newEntry, time: "", subject: "", grade: "", room: "" });
  };

  const handleRemoveEntry = (day: string, index: number) => {
    setSchedule(schedule.map(s => 
      s.day === day 
        ? { ...s, slots: s.slots.filter((_, i) => i !== index) }
        : s
    ));
  };

  const handleAddClass = () => {
    const trimmed = newClassName.trim().toUpperCase();
    if (!trimmed) return;
    if (classes.includes(trimmed)) {
      alert(`Class "${trimmed}" already exists.`);
      return;
    }
    setClasses([...classes, trimmed]);
    setNewClassName("");
    setIsAddClassModalOpen(false);
  };

  return (
    <PageSection
      eyebrow="Academic Schedule"
      title={selectedClass ? `Timetable: ${selectedClass}` : "Master Timetable"}
      description={selectedClass 
        ? `Viewing detailed 8-period schedule for Class ${selectedClass}.` 
        : "Select a class to view its specific weekly schedule and coordinate with departments."}
    >
      <div className="flex flex-col gap-8">
        
        {/* Header Actions */}
        <div className="flex flex-col md:flex-row justify-between items-center bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm gap-4">
           <div className="flex items-center gap-4">
              {selectedClass ? (
                <button 
                  onClick={() => setSelectedClass(null)}
                  className="h-12 w-12 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400 hover:text-slate-900 transition-all"
                >
                  <CaretLeft size={24} weight="bold" />
                </button>
              ) : (
                <div className="h-12 w-12 rounded-2xl bg-slate-50 flex items-center justify-center text-[#FF7F50]">
                   <Calendar size={24} weight="duotone" />
                </div>
              )}
              <div>
                 <h4 className="text-lg font-bold text-slate-900">{selectedClass ? `Class ${selectedClass}` : "Weekly View"}</h4>
                 <p className="text-xs text-slate-500 font-medium">{data?.weekLabel || "May 2024 • Term 1 Schedule"}</p>
              </div>
           </div>
           {!selectedClass ? (
             <button
               onClick={() => setIsAddClassModalOpen(true)}
               className="flex items-center gap-2 px-6 py-3 bg-[#FF7F50] text-white rounded-xl font-bold text-sm shadow-lg shadow-[#FF7F50]/20 hover:bg-[#e66a3e] transition-all"
             >
               <Plus size={18} weight="bold" /> Add Class
             </button>
           ) : (
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
                <button 
                  onClick={() => setIsModalOpen(true)}
                  className="p-3 bg-slate-50 text-slate-400 rounded-xl hover:bg-slate-100 transition-all"
                >
                   <Plus size={20} />
                </button>
             </div>
           )}
        </div>

        {isLoading ? <ResourceLoading label="timetable" /> : null}
        {error ? <ResourceError label="timetable" message={error} /> : null}

        {!selectedClass ? (
          /* Class Selection Grid */
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
            {classes.map((cls) => (
              <motion.button
                key={cls}
                whileHover={{ y: -5, scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setSelectedClass(cls)}
                className="group flex flex-col items-center justify-center p-8 bg-white border border-slate-100 rounded-[2.5rem] shadow-sm hover:shadow-xl hover:shadow-slate-200/50 transition-all gap-4"
              >
                <div className="h-16 w-16 rounded-3xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-[#FF7F50] group-hover:text-white transition-all">
                  <GraduationCap size={32} weight="duotone" />
                </div>
                <div className="text-center">
                  <span className="text-2xl font-black text-slate-900">{cls}</span>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Grade {cls.split('-')[0]}</p>
                </div>
              </motion.button>
            ))}
            {/* Add Class card */}
            <motion.button
              whileHover={{ y: -5, scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setIsAddClassModalOpen(true)}
              className="flex flex-col items-center justify-center p-8 bg-slate-50 border-2 border-dashed border-slate-200 rounded-[2.5rem] hover:border-[#FF7F50] hover:bg-orange-50 transition-all gap-4"
            >
              <div className="h-16 w-16 rounded-3xl bg-white flex items-center justify-center text-slate-300 border border-slate-100">
                <Plus size={28} weight="bold" />
              </div>
              <div className="text-center">
                <span className="text-sm font-black text-slate-400">Add Class</span>
              </div>
            </motion.button>
          </div>
        ) : (
          /* Tabular Timetable Grid */
          <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden mt-4">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[800px]">
                <thead>
                  <tr className="bg-slate-50/80 text-[10px] uppercase tracking-widest text-slate-500 font-black border-b border-slate-100">
                    <th className="px-6 py-6 border-r border-slate-100 w-40 text-center">DAY / PERIOD</th>
                    <th className="px-4 py-6 text-center">I</th>
                    <th className="px-4 py-6 text-center">II</th>
                    <th className="px-4 py-6 text-center">III</th>
                    <th className="px-4 py-6 text-center text-sky-600 bg-sky-50/50">LUNCH</th>
                    <th className="px-4 py-6 text-center">IV</th>
                    <th className="px-4 py-6 text-center">V</th>
                    <th className="px-4 py-6 text-center">VI</th>
                    <th className="px-4 py-6 text-center text-[#FF7F50]">VII</th>
                  </tr>
                </thead>
                <tbody className="text-xs font-bold text-slate-900">
                  {days.map((day, rowIndex) => {
                    const daySchedule = schedule.find(s => s.day === day) || { slots: [] };
                    // Generate 7 mock periods for the table format based on existing slots or filler
                    const periods = [1, 2, 3, 4, 5, 6, 7].map(periodNum => {
                       // Find a slot corresponding to this period, or just pick one by index
                       return daySchedule.slots[periodNum - 1]?.subject || (rowIndex < 5 ? "Subject" : "-");
                    });
                    
                    return (
                      <tr key={day} className="border-b border-slate-100 last:border-b-0 hover:bg-slate-50/50 transition-colors">
                        <td className="px-6 py-5 border-r border-slate-100 uppercase tracking-wider font-black text-slate-800 text-center italic">
                          {day}
                        </td>
                        <td className="px-4 py-5 text-center text-slate-600">
                           {rowIndex === 5 ? "-" : periods[0] === "Subject" ? "Math" : periods[0]}
                        </td>
                        <td className="px-4 py-5 text-center text-slate-600">
                           {rowIndex === 5 ? "-" : periods[1] === "Subject" ? "Physics" : periods[1]}
                        </td>
                        <td className="px-4 py-5 text-center text-slate-600">
                           {rowIndex === 5 ? "-" : periods[2] === "Subject" ? "English" : periods[2]}
                        </td>
                        <td className="px-4 py-5 text-center text-sky-400 font-bold italic bg-sky-50/20 text-[10px] tracking-widest">
                           LUNCH
                        </td>
                        <td className="px-4 py-5 text-center text-slate-600">
                           {rowIndex === 5 ? "-" : periods[3] === "Subject" ? "Math" : periods[3]}
                        </td>
                        <td className="px-4 py-5 text-center text-slate-600">
                           {rowIndex === 5 ? "-" : periods[4] === "Subject" ? "CS" : periods[4]}
                        </td>
                        <td className="px-4 py-5 text-center text-slate-600">
                           {rowIndex === 5 ? "-" : periods[5] === "Subject" ? "CS" : periods[5]}
                        </td>
                        <td className="px-4 py-5 text-center text-[#FF7F50] font-bold">
                           {rowIndex === 5 ? "-" : "Yoga"}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            
            {isEditing && (
              <div className="p-6 bg-slate-50 border-t border-slate-100 flex justify-end">
                 <button 
                   onClick={() => setIsModalOpen(true)}
                   className="flex items-center gap-2 px-6 py-3 bg-[#FF7F50] text-white rounded-xl text-sm font-bold shadow-lg shadow-[#FF7F50]/20 hover:bg-[#e66a3e] transition-all"
                 >
                    <Plus size={18} weight="bold" /> Add Slot Override
                 </button>
              </div>
            )}
          </div>
        )}

      </div>

      {/* Add Slot Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="relative bg-white rounded-[2.5rem] w-full max-w-md shadow-2xl overflow-hidden"
            >
              <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                <h3 className="text-xl font-black text-slate-900">Add Time Slot</h3>
                <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-white rounded-xl text-slate-400 transition-all hover:rotate-90">
                  <X size={24} weight="bold" />
                </button>
              </div>
              
              <div className="p-8 space-y-5">
                <div className="space-y-2">
                  <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 ml-1">Day</label>
                  <select 
                    value={newEntry.day}
                    onChange={e => setNewEntry({...newEntry, day: e.target.value})}
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 text-sm font-bold focus:outline-none focus:ring-4 focus:ring-[#FF7F50]/10"
                  >
                    {days.map(d => <option key={d} value={d}>{d}</option>)}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 ml-1">Time</label>
                    <input 
                      type="text" 
                      placeholder="09:00 AM"
                      value={newEntry.time}
                      onChange={e => setNewEntry({...newEntry, time: e.target.value})}
                      className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 text-sm font-bold focus:outline-none focus:ring-4 focus:ring-[#FF7F50]/10"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 ml-1">Subject</label>
                    <input 
                      type="text" 
                      placeholder="Mathematics"
                      value={newEntry.subject}
                      onChange={e => setNewEntry({...newEntry, subject: e.target.value})}
                      className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 text-sm font-bold focus:outline-none focus:ring-4 focus:ring-[#FF7F50]/10"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 ml-1">Grade</label>
                    <input 
                      type="text" 
                      placeholder="10-A"
                      value={selectedClass || newEntry.grade}
                      disabled={!!selectedClass}
                      onChange={e => setNewEntry({...newEntry, grade: e.target.value})}
                      className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 text-sm font-bold focus:outline-none focus:ring-4 focus:ring-[#FF7F50]/10 disabled:opacity-50"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 ml-1">Room</label>
                    <input 
                      type="text" 
                      placeholder="Room 101"
                      value={newEntry.room}
                      onChange={e => setNewEntry({...newEntry, room: e.target.value})}
                      className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 text-sm font-bold focus:outline-none focus:ring-4 focus:ring-[#FF7F50]/10"
                    />
                  </div>
                </div>
              </div>

              <div className="p-8 bg-slate-50 border-t border-slate-100">
                <button 
                  onClick={handleAddEntry}
                  className="w-full bg-[#FF7F50] text-white py-4 rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl shadow-[#FF7F50]/20 hover:bg-[#e66a3e] transition-all transform active:scale-95"
                >
                  Add to Schedule
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Add Class Modal */}
      <AnimatePresence>
        {isAddClassModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsAddClassModalOpen(false)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="relative bg-white rounded-[2.5rem] w-full max-w-sm shadow-2xl overflow-hidden"
            >
              <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                <h3 className="text-xl font-black text-slate-900">Add New Class</h3>
                <button onClick={() => setIsAddClassModalOpen(false)} className="p-2 hover:bg-white rounded-xl text-slate-400 transition-all">
                  <X size={24} weight="bold" />
                </button>
              </div>
              <div className="p-8 space-y-4">
                <p className="text-sm text-slate-500">Enter the class name (e.g. <span className="font-bold text-slate-800">1-C</span>, <span className="font-bold text-slate-800">11-B</span>)</p>
                <input
                  type="text"
                  placeholder="e.g. 1-C"
                  value={newClassName}
                  onChange={e => setNewClassName(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleAddClass()}
                  autoFocus
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 text-lg font-black text-slate-900 focus:outline-none focus:ring-4 focus:ring-[#FF7F50]/10 uppercase tracking-widest"
                />
              </div>
              <div className="p-8 bg-slate-50 border-t border-slate-100">
                <button
                  onClick={handleAddClass}
                  className="w-full bg-[#FF7F50] text-white py-4 rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl shadow-[#FF7F50]/20 hover:bg-[#e66a3e] transition-all"
                >
                  Add Class
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </PageSection>
  );
}
