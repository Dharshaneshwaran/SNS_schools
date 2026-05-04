"use client";

import { useCallback, useState } from "react";
import { useAuthResource } from "../../hooks/use-auth-resource";
import { getAttendance } from "../../services/mock-data-service";
import { DataTable } from "./data-table";
import { MetricCard } from "./metric-card";
import { PageSection } from "./page-section";
import { ResourceError, ResourceLoading } from "./resource-states";
import { Users, Student, CheckCircle, XCircle, GraduationCap, CaretLeft, User } from "@phosphor-icons/react";
import { motion } from "framer-motion";

export function AttendancePage() {
  const [view, setView] = useState<"teacher" | "class" | "student">("teacher");
  const [selectedClass, setSelectedClass] = useState<string | null>(null);
  const [selectedTeacher, setSelectedTeacher] = useState<string | null>(null);
  const [localAttendance, setLocalAttendance] = useState<Record<string, Record<string, string>>>({});

  const loadAttendance = useCallback(
    (accessToken: string) => getAttendance(accessToken),
    [],
  );
  const { data, error, isLoading } = useAuthResource(loadAttendance);

  const toggleStatus = (rollNo: string) => {
    if (!selectedClass) return;
    const currentStatus = localAttendance[selectedClass]?.[rollNo] ||
      data?.studentsAttendance[selectedClass]?.find(s => s.rollNo === rollNo)?.status ||
      "Present";

    const newStatus = currentStatus === "Present" ? "Absent" : "Present";

    setLocalAttendance({
      ...localAttendance,
      [selectedClass]: {
        ...(localAttendance[selectedClass] || {}),
        [rollNo]: newStatus
      }
    });
  };

  const CLASSES = ["8-A", "8-B", "9-A", "9-B", "10-A", "10-B"];

  return (
    <PageSection
      eyebrow="Attendance"
      title={
        selectedClass ? `Attendance: Class ${selectedClass}` :
        selectedTeacher ? `Attendance: ${selectedTeacher}` :
        "Attendance Management"
      }
      description="Manage presence for both faculty and students. Admins can mark and update records in real-time."
    >
      <div className="flex flex-wrap gap-4 mb-8">
        <button
          onClick={() => { setView("teacher"); setSelectedClass(null); setSelectedTeacher(null); }}
          className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-bold text-sm transition-all ${view === "teacher"
              ? "bg-slate-900 text-white shadow-lg"
              : "bg-white text-slate-500 border border-slate-200 hover:bg-slate-50"
            }`}
        >
          <Users size={20} weight="duotone" />
          Teacher Attendance
        </button>
        <button
          onClick={() => { setView("class"); setSelectedClass(null); setSelectedTeacher(null); }}
          className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-bold text-sm transition-all ${view === "class"
              ? "bg-slate-900 text-white shadow-lg"
              : "bg-white text-slate-500 border border-slate-200 hover:bg-slate-50"
            }`}
        >
          <GraduationCap size={20} weight="duotone" />
          Class-wise Summary
        </button>
        <button
          onClick={() => { setView("student"); setSelectedClass(null); setSelectedTeacher(null); }}
          className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-bold text-sm transition-all ${view === "student"
              ? "bg-slate-900 text-white shadow-lg"
              : "bg-white text-slate-500 border border-slate-200 hover:bg-slate-50"
            }`}
        >
          <Student size={20} weight="duotone" />
          Student Attendance
        </button>
      </div>

      {isLoading ? <ResourceLoading label="attendance" /> : null}
      {error ? <ResourceError label="attendance" message={error} /> : null}
      
      {data && (
        <div className="space-y-8">
          {(!selectedClass && !selectedTeacher) && (
            <div className="grid gap-4 md:grid-cols-3">
              <MetricCard label="Total Present" value={String(data.summary.present)} />
              <MetricCard label="On Leave/Absent" value={String(data.summary.onLeave)} />
              <MetricCard label="Late arrivals" value={String(data.summary.lateArrivals)} />
            </div>
          )}

          {view === "teacher" && (
            !selectedTeacher ? (
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
                {Array.from(new Set([
                  ...(data.lateArrivals || []).map(a => a.teacher),
                  ...(data.leaveRequests || []).map(r => r.teacher)
                ])).map((teacherName) => (
                  <motion.button
                    key={teacherName}
                    whileHover={{ y: -5 }}
                    onClick={() => setSelectedTeacher(teacherName)}
                    className="flex flex-col items-center p-6 bg-white border border-slate-100 rounded-[2rem] shadow-sm hover:shadow-xl transition-all gap-3"
                  >
                    <div className="h-12 w-12 rounded-full bg-slate-100 overflow-hidden">
                       <img src={`https://i.pravatar.cc/150?u=${teacherName}`} alt={teacherName} />
                    </div>
                    <div className="text-center">
                      <p className="font-bold text-slate-900 text-sm">{teacherName}</p>
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Faculty</p>
                    </div>
                  </motion.button>
                ))}
              </div>
            ) : (
              <div className="space-y-6">
                <button 
                  onClick={() => setSelectedTeacher(null)}
                  className="flex items-center gap-2 text-sm font-bold text-slate-400 hover:text-slate-900 transition-all"
                >
                  <CaretLeft size={16} weight="bold" /> Back to Teachers
                </button>
                <div className="grid gap-6 md:grid-cols-2">
                   <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm flex flex-col gap-4">
                      <div className="flex items-center gap-4 mb-2">
                        <div className="h-16 w-16 rounded-2xl bg-slate-50 overflow-hidden border border-slate-100">
                          <img src={`https://i.pravatar.cc/150?u=${selectedTeacher}`} alt={selectedTeacher} />
                        </div>
                        <div>
                          <h4 className="text-xl font-black text-slate-900 tracking-tight">{selectedTeacher}</h4>
                          <span className="px-2 py-0.5 bg-emerald-50 text-emerald-600 text-[10px] font-black uppercase tracking-widest rounded-full">Present Today</span>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 mt-2">
                        <div className="p-4 bg-slate-50 rounded-2xl">
                          <p className="text-[10px] font-black text-slate-400 uppercase mb-1">Check-in</p>
                          <p className="font-bold text-slate-900">08:29 AM</p>
                        </div>
                        <div className="p-4 bg-slate-50 rounded-2xl">
                          <p className="text-[10px] font-black text-slate-400 uppercase mb-1">Expected</p>
                          <p className="font-bold text-slate-900">08:20 AM</p>
                        </div>
                      </div>
                   </div>

                   <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
                      <h4 className="text-lg font-bold mb-4">Recent Activity</h4>
                      <div className="space-y-4">
                        {data.lateArrivals.find(l => l.teacher === selectedTeacher) && (
                          <div className="flex items-center gap-3 p-3 bg-rose-50 text-rose-600 rounded-xl">
                            <XCircle size={20} weight="fill" />
                            <div>
                              <p className="text-xs font-bold">Late Arrival Recorded</p>
                              <p className="text-[10px] font-medium opacity-80">Actual: {data.lateArrivals.find(l => l.teacher === selectedTeacher)?.actual}</p>
                            </div>
                          </div>
                        )}
                        {data.leaveRequests.find(l => l.teacher === selectedTeacher) && (
                          <div className="flex items-center gap-3 p-3 bg-blue-50 text-blue-600 rounded-xl">
                            <CheckCircle size={20} weight="fill" />
                            <div>
                              <p className="text-xs font-bold">Leave Request: {data.leaveRequests.find(l => l.teacher === selectedTeacher)?.type}</p>
                              <p className="text-[10px] font-medium opacity-80">Status: {data.leaveRequests.find(l => l.teacher === selectedTeacher)?.status}</p>
                            </div>
                          </div>
                        )}
                        <p className="text-[10px] text-slate-400 font-medium text-center py-2">No further records found for this period.</p>
                      </div>
                   </div>
                </div>
              </div>
            )
          )}

          {view === "class" && (
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-slate-900 px-2">Class-wise Report</h3>
              <DataTable
                columns={["Class", "Total Students", "Present", "Absent", "Percentage"]}
                rows={(data.classWiseAttendance || []).map((entry) => [
                  <button
                    key={entry.class}
                    onClick={() => {
                      setSelectedClass(entry.class);
                      setView("student");
                    }}
                    className="text-blue-600 font-bold hover:underline"
                  >
                    {entry.class}
                  </button>,
                  String(entry.total),
                  String(entry.present),
                  String(entry.absent),
                  entry.percentage,
                ])}
              />
            </div>
          )}

          {view === "student" && (
            !selectedClass ? (
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
                {CLASSES.map((cls) => (
                  <motion.button
                    key={cls}
                    whileHover={{ y: -5 }}
                    onClick={() => setSelectedClass(cls)}
                    className="flex flex-col items-center justify-center p-8 bg-white border border-slate-100 rounded-[2.5rem] shadow-sm hover:shadow-xl transition-all gap-4"
                  >
                    <div className="h-16 w-16 rounded-3xl bg-slate-50 flex items-center justify-center text-[#FF7F50]">
                      <GraduationCap size={32} weight="duotone" />
                    </div>
                    <span className="text-2xl font-black text-slate-900">{cls}</span>
                  </motion.button>
                ))}
              </div>
            ) : (
              <div className="space-y-6">
                <button 
                  onClick={() => setSelectedClass(null)}
                  className="flex items-center gap-2 text-sm font-bold text-slate-400 hover:text-slate-900 transition-all"
                >
                  <CaretLeft size={16} weight="bold" /> Back to Classes
                </button>
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 px-2">
                  <div>
                    <h3 className="text-xl font-black text-slate-900 tracking-tight">Student Attendance</h3>
                    <p className="text-xs text-slate-500 font-medium">Currently viewing records for <span className="text-blue-600 font-bold">Class {selectedClass}</span></p>
                  </div>
                </div>

                <DataTable
                  columns={["Photo", "Roll No", "Student Name", "Status", "Action"]}
                  rows={(data.studentsAttendance?.[selectedClass] || []).map((student) => {
                    const currentStatus = localAttendance[selectedClass]?.[student.rollNo] || student.status;
                    return [
                      <div key={`photo-${student.rollNo}`} className="h-10 w-10 rounded-2xl overflow-hidden bg-slate-100 border border-slate-200">
                        <img src={student.photo} alt={student.name} className="h-full w-full object-cover" />
                      </div>,
                      <span key={`roll-${student.rollNo}`} className="font-bold text-slate-400">#{student.rollNo}</span>,
                      <div key={`name-${student.rollNo}`} className="font-bold text-slate-900">{student.name}</div>,
                      <span key={`status-${student.rollNo}`} className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${currentStatus === 'Present' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'
                        }`}>
                        {currentStatus}
                      </span>,
                      <button
                        key={`btn-${student.rollNo}`}
                        onClick={() => toggleStatus(student.rollNo)}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${currentStatus === 'Present'
                            ? 'text-rose-500 hover:bg-rose-50'
                            : 'text-emerald-500 hover:bg-emerald-50'
                          }`}
                      >
                        {currentStatus === 'Present' ? <XCircle size={14} weight="bold" /> : <CheckCircle size={14} weight="bold" />}
                        {currentStatus === 'Present' ? 'Mark Absent' : 'Mark Present'}
                      </button>
                    ];
                  })}
                />
              </div>
            )
          )}
        </div>
      )}
    </PageSection>
  );
}
