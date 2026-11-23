"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Calendar, 
  PencilSimple, 
  Plus, 
  CheckCircle,
  X,
  CaretLeft,
  GraduationCap
} from "@phosphor-icons/react";
import { PageSection } from "./page-section";
import { apiRequest } from "../../services/api-client";
import { ResourceLoading, ResourceError } from "./resource-states";

interface TimeSlot {
  id: string;
  period: number;
  time: string;
  subject: string;
  grade: string;
  room: string;
  teacher?: string;
  teacherId?: string;
}

interface DaySchedule {
  id: number;
  day: string;
  slots: TimeSlot[];
}

const initialSchedule: DaySchedule[] = [];

const PERIODS = [1, 2, 3, 4, 5, 6, 7];

const initialNewEntry = {
  day: "Monday",
  period: 1,
  startTime: "",
  endTime: "",
  subject: "",
  teacherId: "",
  grade: "",
  room: ""
};

/** Mirror of the backend's label parsing: "10-A" -> { class: "10", section: "A" }. */
function parseClassLabel(label: string) {
  const idx = label.lastIndexOf("-");
  if (idx <= 0) return { class: label.trim(), section: "" };
  return {
    class: label.slice(0, idx).trim(),
    section: label.slice(idx + 1).trim()
  };
}

export function TimetablePage() {
  const [selectedClass, setSelectedClass] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [schedule, setSchedule] = useState<DaySchedule[]>(initialSchedule);
  const [classes, setClasses] = useState<string[]>([]);
  const [subjects, setSubjects] = useState<string[]>([]);
  const [teachers, setTeachers] = useState<{ id: string; name: string }[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newEntry, setNewEntry] = useState({ ...initialNewEntry });
  const [formError, setFormError] = useState<string | null>(null);
  const [isMutating, setIsMutating] = useState(false);

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<any>(null);

  const loadTimetable = async (classLabel: string | null, opts?: { silent?: boolean }) => {
    if (!opts?.silent) setIsLoading(true);
    try {
      const path = classLabel
        ? `/timetable?class=${encodeURIComponent(classLabel)}`
        : "/timetable";
      const res = await apiRequest<any>(path);
      setData(res);
      setSchedule(
        (res?.schedule || []).map((dayData: any, index: number) => ({
          id: index + 1,
          day: dayData.day,
          slots: (dayData.periods || []).map((p: any) => ({
            id: String(p.id),
            period: Number(p.period),
            time: p.time,
            subject: p.subject,
            grade: p.grade,
            room: p.room,
            teacher: p.teacher,
            teacherId: p.teacherId
          }))
        }))
      );
      if (res?.metadata?.classes) setClasses(res.metadata.classes);
      if (res?.metadata?.subjects) setSubjects(res.metadata.subjects);
      if (res?.metadata?.teachers) setTeachers(res.metadata.teachers);
      setError(null);
    } catch (err: any) {
      setError(err.message || "Failed to load the timetable.");
    } finally {
      if (!opts?.silent) setIsLoading(false);
    }
  };

  useEffect(() => {
    setIsEditing(false);
    loadTimetable(selectedClass);
    // Re-load whenever the class scope changes; mutations re-load silently.
  }, [selectedClass]);

  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

  const openAddModal = () => {
    setFormError(null);
    setIsModalOpen(true);
  };

  const handleAddEntry = async () => {
    const label = selectedClass || newEntry.grade.trim().toUpperCase();
    if (!label) {
      setFormError("Choose a class before adding a slot.");
      return;
    }
    if (!newEntry.startTime || !newEntry.endTime) {
      setFormError("Set the start and end time.");
      return;
    }
    if (!newEntry.subject) {
      setFormError("Choose a subject.");
      return;
    }
    if (!newEntry.teacherId) {
      setFormError("Choose a teacher.");
      return;
    }

    const { class: className, section } = parseClassLabel(label);
    setIsMutating(true);
    setFormError(null);
    try {
      await apiRequest("/timetable", {
        method: "POST",
        body: JSON.stringify({
          day: newEntry.day,
          period: Number(newEntry.period),
          startTime: newEntry.startTime,
          endTime: newEntry.endTime,
          class: className,
          section,
          subject: newEntry.subject,
          teacherId: newEntry.teacherId,
          room: newEntry.room
        })
      });
      await loadTimetable(selectedClass, { silent: true });
      setIsModalOpen(false);
      setFormError(null);
      setNewEntry({ ...initialNewEntry });
    } catch (err: any) {
      // Surface the backend's 400/409 message (e.g. day/period conflicts) inline.
      setFormError(err.message || "Failed to add the slot.");
    } finally {
      setIsMutating(false);
    }
  };

  const handleRemoveEntry = async (day: string, slot: TimeSlot) => {
    if (isMutating) return;
    if (!window.confirm(`Remove ${slot.subject} from ${day} period ${slot.period}?`)) return;
    setIsMutating(true);
    try {
      await apiRequest(`/timetable/${slot.id}`, { method: "DELETE" });
      await loadTimetable(selectedClass, { silent: true });
    } catch (err: any) {
      alert(`Failed to remove the slot: ${err.message}`);
    } finally {
      setIsMutating(false);
    }
  };

  const renderSlotCell = (day: string, slot: TimeSlot | undefined, cellClass: string) => (
    <td className={`px-4 py-5 text-center ${cellClass}`}>
      <div className="relative inline-flex flex-col items-center group">
        <span>{slot ? slot.subject : "-"}</span>
        {slot?.time ? (
          <span className="mt-1 text-[10px] font-medium text-slate-400">{slot.time}</span>
        ) : null}
        {isEditing && slot ? (
          <button
            type="button"
            onClick={() => handleRemoveEntry(day, slot)}
            aria-label={`Remove ${slot.subject}`}
            className="absolute -right-3 -top-1 p-1 rounded-md text-slate-300 opacity-0 group-hover:opacity-100 hover:text-red-500 hover:bg-red-50 transition-all"
          >
            <X size={10} weight="bold" />
          </button>
        ) : null}
      </div>
    </td>
  );

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
             <p className="text-xs font-bold text-slate-400">
               Classes are created from admissions
             </p>
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
                {isEditing && (
                  <button 
                    onClick={openAddModal}
                    className="p-3 bg-slate-50 text-slate-400 rounded-xl hover:bg-slate-100 transition-all"
                  >
                     <Plus size={20} />
                  </button>
                )}
             </div>
           )}
        </div>

        {isLoading ? <ResourceLoading label="timetable" /> : null}
        {error ? <ResourceError label="timetable" message={error} /> : null}

        {!isLoading && !error ? (
          !selectedClass ? (
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
              {/* New classes come from admissions, not from here */}
              <motion.div
                className="flex flex-col items-center justify-center p-8 bg-slate-50 border-2 border-dashed border-slate-200 rounded-[2.5rem] gap-4"
              >
                <div className="h-16 w-16 rounded-3xl bg-white flex items-center justify-center text-slate-300 border border-slate-100">
                  <Plus size={28} weight="bold" />
                </div>
                <div className="text-center">
                  <span className="text-sm font-black text-slate-400">New classes</span>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Created from admissions</p>
                </div>
              </motion.div>
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
                    {days.map((day) => {
                      const daySchedule = schedule.find(s => s.day === day);
                      // Look each period up by its real period number so period 1
                      // always lands in column I, whatever order the API returns.
                      const slotByPeriod = new Map<number, TimeSlot>();
                      (daySchedule?.slots || []).forEach(s => slotByPeriod.set(s.period, s));

                      return (
                        <tr key={day} className="border-b border-slate-100 last:border-b-0 hover:bg-slate-50/50 transition-colors">
                          <td className="px-6 py-5 border-r border-slate-100 uppercase tracking-wider font-black text-slate-800 text-center italic">
                            {day}
                          </td>
                          {renderSlotCell(day, slotByPeriod.get(1), "text-slate-600")}
                          {renderSlotCell(day, slotByPeriod.get(2), "text-slate-600")}
                          {renderSlotCell(day, slotByPeriod.get(3), "text-slate-600")}
                          <td className="px-4 py-5 text-center text-sky-400 font-bold italic bg-sky-50/20 text-[10px] tracking-widest">
                            LUNCH
                          </td>
                          {renderSlotCell(day, slotByPeriod.get(4), "text-slate-600")}
                          {renderSlotCell(day, slotByPeriod.get(5), "text-slate-600")}
                          {renderSlotCell(day, slotByPeriod.get(6), "text-slate-600")}
                          {renderSlotCell(day, slotByPeriod.get(7), "text-[#FF7F50] font-bold")}
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
              
              {isEditing && (
                <div className="p-6 bg-slate-50 border-t border-slate-100 flex justify-end">
                   <button 
                     onClick={openAddModal}
                     className="flex items-center gap-2 px-6 py-3 bg-[#FF7F50] text-white rounded-xl text-sm font-bold shadow-lg shadow-[#FF7F50]/20 hover:bg-[#e66a3e] transition-all"
                   >
                      <Plus size={18} weight="bold" /> Add Slot Override
                   </button>
                </div>
              )}
            </div>
          )
        ) : null}

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
                {formError ? (
                  <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-xs font-bold text-rose-600">
                    {formError}
                  </div>
                ) : null}

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
                    <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 ml-1">Start Time</label>
                    <input 
                      type="time" 
                      value={newEntry.startTime}
                      onChange={e => setNewEntry({...newEntry, startTime: e.target.value})}
                      className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 text-sm font-bold focus:outline-none focus:ring-4 focus:ring-[#FF7F50]/10"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 ml-1">End Time</label>
                    <input 
                      type="time" 
                      value={newEntry.endTime}
                      onChange={e => setNewEntry({...newEntry, endTime: e.target.value})}
                      className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 text-sm font-bold focus:outline-none focus:ring-4 focus:ring-[#FF7F50]/10"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 ml-1">Period</label>
                    <select 
                      value={newEntry.period}
                      onChange={e => setNewEntry({...newEntry, period: Number(e.target.value)})}
                      className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 text-sm font-bold focus:outline-none focus:ring-4 focus:ring-[#FF7F50]/10"
                    >
                      {PERIODS.map(p => <option key={p} value={p}>{p}</option>)}
                    </select>
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

                <div className="space-y-2">
                  <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 ml-1">Subject</label>
                  <select 
                    value={newEntry.subject}
                    onChange={e => setNewEntry({...newEntry, subject: e.target.value})}
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 text-sm font-bold focus:outline-none focus:ring-4 focus:ring-[#FF7F50]/10"
                  >
                    <option value="">Select subject</option>
                    {subjects.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 ml-1">Teacher</label>
                  <select 
                    value={newEntry.teacherId}
                    onChange={e => setNewEntry({...newEntry, teacherId: e.target.value})}
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 text-sm font-bold focus:outline-none focus:ring-4 focus:ring-[#FF7F50]/10"
                  >
                    <option value="">Select teacher</option>
                    {teachers.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                  </select>
                </div>

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
              </div>

              <div className="p-8 bg-slate-50 border-t border-slate-100">
                <button 
                  onClick={handleAddEntry}
                  disabled={isMutating}
                  className="w-full bg-[#FF7F50] text-white py-4 rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl shadow-[#FF7F50]/20 hover:bg-[#e66a3e] transition-all transform active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {isMutating ? "Adding..." : "Add to Schedule"}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </PageSection>
  );
}
