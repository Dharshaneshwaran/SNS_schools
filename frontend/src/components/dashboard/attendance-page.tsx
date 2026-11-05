"use client";

import { useCallback, useState } from "react";
import { useAuthResource } from "../../hooks/use-auth-resource";
import { getAttendance } from "../../services/mock-data-service";
import { DataTable } from "./data-table";
import { MetricCard } from "./metric-card";
import { PageSection } from "./page-section";
import { ResourceError, ResourceLoading } from "./resource-states";
import { Users, Student, CheckCircle, XCircle, GraduationCap, CaretLeft, UserCircle, FloppyDisk, SpinnerGap, CheckSquare } from "@phosphor-icons/react";
import { motion } from "framer-motion";
import { markAttendance, markTeacherAttendance } from "../../services/attendance-service";
import { useAuth } from "../../hooks/use-auth";

export function AttendancePage() {
  const { session } = useAuth();
  const [view, setView] = useState<"teacher" | "class" | "student">("teacher");
  const [selectedClass, setSelectedClass] = useState<string | null>(null);
  // localAttendance: keyed by class for students, "__TEACHERS__" for teachers
  const [localAttendance, setLocalAttendance] = useState<Record<string, Record<string, string>>>({});
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState<string | null>(null);

  const loadAttendance = useCallback(
    (accessToken: string) => getAttendance(accessToken),
    [],
  );
  const { data, error, isLoading } = useAuthResource(loadAttendance);

  const TEACHER_KEY = "__TEACHERS__";

  // ─── Student helpers ────────────────────────────────────────────
  const toggleStudentStatus = (rollNo: string) => {
    if (!selectedClass) return;
    const currentStatus = localAttendance[selectedClass]?.[rollNo] ||
      data?.studentsAttendance[selectedClass]?.find(s => s.rollNo === rollNo)?.status ||
      "Present";
    const newStatus = currentStatus === "Present" ? "Absent" : "Present";
    setLocalAttendance({
      ...localAttendance,
      [selectedClass]: { ...(localAttendance[selectedClass] || {}), [rollNo]: newStatus },
    });
  };

  const markAllStudentsPresent = () => {
    if (!selectedClass || !data) return;
    const students = data.studentsAttendance[selectedClass] || [];
    const all: Record<string, string> = {};
    students.forEach(s => { all[s.rollNo] = "Present"; });
    setLocalAttendance({ ...localAttendance, [selectedClass]: { ...(localAttendance[selectedClass] || {}), ...all } });
  };

  const markAllStudentsAbsent = () => {
    if (!selectedClass || !data) return;
    const students = data.studentsAttendance[selectedClass] || [];
    const all: Record<string, string> = {};
    students.forEach(s => { all[s.rollNo] = "Absent"; });
    setLocalAttendance({ ...localAttendance, [selectedClass]: { ...(localAttendance[selectedClass] || {}), ...all } });
  };

  const handleSaveStudentAttendance = async () => {
    if (!selectedClass || !data || !session?.accessToken) return;
    const students = data.studentsAttendance[selectedClass] || [];
    const [cls, sec] = selectedClass.split('-');
    const today = new Date().toISOString().split('T')[0];
    const records = students.map(s => ({
      studentId: s.rollNo,
      status: localAttendance[selectedClass]?.[s.rollNo] || s.status || "Present",
    }));
    setSaving(true); setSaveMsg(null);
    try {
      const res = await markAttendance({ date: today, class: cls, section: sec ?? '', records });
      setSaveMsg(`✓ Saved ${res.marked} student records`);
    } catch { setSaveMsg("Failed to save. Try again."); }
    finally { setSaving(false); setTimeout(() => setSaveMsg(null), 4000); }
  };

  const getStudentCount = () => {
    if (!selectedClass || !data) return { present: 0, absent: 0, notMarked: 0, total: 0 };
    const students = data.studentsAttendance[selectedClass] || [];
    let present = 0, absent = 0, notMarked = 0;
    students.forEach(s => {
      const st = localAttendance[selectedClass]?.[s.rollNo] || s.status;
      if (st === "Present") present++; else if (st === "Absent") absent++; else notMarked++;
    });
    return { present, absent, notMarked, total: students.length };
  };

  // ─── Teacher helpers ────────────────────────────────────────────
  const toggleTeacherStatus = (empId: string) => {
    const teacher = data?.teachers?.find(t => t.empId === empId);
    const currentStatus = localAttendance[TEACHER_KEY]?.[empId] || teacher?.status || "Not Marked";
    const newStatus = currentStatus === "Present" ? "Absent" : "Present";
    setLocalAttendance({
      ...localAttendance,
      [TEACHER_KEY]: { ...(localAttendance[TEACHER_KEY] || {}), [empId]: newStatus },
    });
  };

  const markAllTeachersPresent = () => {
    if (!data?.teachers) return;
    const all: Record<string, string> = {};
    data.teachers.forEach(t => { all[t.empId] = "Present"; });
    setLocalAttendance({ ...localAttendance, [TEACHER_KEY]: { ...(localAttendance[TEACHER_KEY] || {}), ...all } });
  };

  const markAllTeachersAbsent = () => {
    if (!data?.teachers) return;
    const all: Record<string, string> = {};
    data.teachers.forEach(t => { all[t.empId] = "Absent"; });
    setLocalAttendance({ ...localAttendance, [TEACHER_KEY]: { ...(localAttendance[TEACHER_KEY] || {}), ...all } });
  };

  const handleSaveTeacherAttendance = async () => {
    if (!data?.teachers || !session?.accessToken) return;
    const today = new Date().toISOString().split('T')[0];
    const records = data.teachers.map(t => ({
      teacherId: t.empId,
      status: localAttendance[TEACHER_KEY]?.[t.empId] || t.status || "Present",
      department: t.department,
    }));
    setSaving(true); setSaveMsg(null);
    try {
      const res = await markTeacherAttendance({ date: today, records });
      setSaveMsg(`✓ Saved ${res.marked} teacher records`);
    } catch { setSaveMsg("Failed to save. Try again."); }
    finally { setSaving(false); setTimeout(() => setSaveMsg(null), 4000); }
  };

  const getTeacherCount = () => {
    if (!data?.teachers) return { present: 0, absent: 0, notMarked: 0, total: 0 };
    let present = 0, absent = 0, notMarked = 0;
    data.teachers.forEach(t => {
      const st = localAttendance[TEACHER_KEY]?.[t.empId] || t.status;
      if (st === "Present") present++; else if (st === "Absent") absent++; else notMarked++;
    });
    return { present, absent, notMarked, total: data.teachers.length };
  };

  // Derive class list
  const CLASSES = data ? Object.keys(data.studentsAttendance ?? {}).filter(k => k !== 'Unassigned') : [];

  return (
    <PageSection
      eyebrow="Attendance"
      title={
        selectedClass ? `Attendance: Class ${selectedClass}` :
        view === "teacher" ? "Teacher Attendance" :
        "Attendance Management"
      }
      description="Manage presence for both faculty and students. Admins can mark and update records in real-time."
    >
      <div className="flex flex-wrap gap-4 mb-8">
        <button
          onClick={() => { setView("teacher"); setSelectedClass(null); }}
          className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-bold text-sm transition-all ${view === "teacher"
              ? "bg-slate-900 text-white shadow-lg"
              : "bg-white text-slate-500 border border-slate-200 hover:bg-slate-50"
            }`}
        >
          <Users size={20} weight="duotone" />
          Teacher Attendance
        </button>
        <button
          onClick={() => { setView("class"); setSelectedClass(null); }}
          className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-bold text-sm transition-all ${view === "class"
              ? "bg-slate-900 text-white shadow-lg"
              : "bg-white text-slate-500 border border-slate-200 hover:bg-slate-50"
            }`}
        >
          <GraduationCap size={20} weight="duotone" />
          Class-wise Summary
        </button>
        <button
          onClick={() => { setView("student"); setSelectedClass(null); }}
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

          {/* ═══════════════════════════════════════════════════════
              TEACHER ATTENDANCE TAB
              ═══════════════════════════════════════════════════════ */}
          {view === "teacher" && (
            <div className="space-y-6">
              {/* Teacher-specific metrics */}
              <div className="grid gap-4 md:grid-cols-4">
                <MetricCard label="Total Faculty" value={String(data.teacherSummary?.total ?? data.teachers?.length ?? 0)} />
                <MetricCard label="Present" value={String((() => { const c = getTeacherCount(); return c.present; })())} />
                <MetricCard label="Absent" value={String((() => { const c = getTeacherCount(); return c.absent; })())} />
                <MetricCard label="Not Marked" value={String((() => { const c = getTeacherCount(); return c.notMarked; })())} />
              </div>

              {/* Action bar */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 px-2">
                <div>
                  <h3 className="text-xl font-black text-slate-900 tracking-tight">Faculty Attendance</h3>
                  <p className="text-xs text-slate-500 font-medium">Mark attendance for all teachers · {new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'short', year: 'numeric' })}</p>
                </div>
                <div className="flex items-center gap-3 flex-wrap">
                  {/* Live counters */}
                  {(() => {
                    const counts = getTeacherCount();
                    return (
                      <div className="flex items-center gap-2 mr-2">
                        <span className="text-[10px] font-bold bg-emerald-50 text-emerald-600 px-2.5 py-1 rounded-lg">{counts.present}P</span>
                        <span className="text-[10px] font-bold bg-rose-50 text-rose-600 px-2.5 py-1 rounded-lg">{counts.absent}A</span>
                        {counts.notMarked > 0 && <span className="text-[10px] font-bold bg-slate-100 text-slate-500 px-2.5 py-1 rounded-lg">{counts.notMarked} unmarked</span>}
                      </div>
                    );
                  })()}

                  {saveMsg && <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-xl">{saveMsg}</span>}

                  <button onClick={markAllTeachersPresent}
                    className="flex items-center gap-2 px-4 py-2.5 bg-emerald-500 text-white rounded-2xl font-bold text-sm shadow-lg shadow-emerald-500/25 hover:bg-emerald-600 transition-all active:scale-95">
                    <CheckSquare size={16} weight="bold" /> All Present
                  </button>
                  <button onClick={markAllTeachersAbsent}
                    className="flex items-center gap-2 px-4 py-2.5 bg-rose-500 text-white rounded-2xl font-bold text-sm shadow-lg shadow-rose-500/25 hover:bg-rose-600 transition-all active:scale-95">
                    <XCircle size={16} weight="bold" /> All Absent
                  </button>
                  <button onClick={handleSaveTeacherAttendance} disabled={saving}
                    className="flex items-center gap-2 px-5 py-2.5 bg-[#FF7F50] text-white rounded-2xl font-bold text-sm shadow-lg shadow-[#FF7F50]/25 hover:bg-[#e66a3e] transition-all disabled:opacity-60">
                    {saving ? <SpinnerGap size={16} className="animate-spin" /> : <FloppyDisk size={16} weight="bold" />}
                    {saving ? "Saving..." : "Save Attendance"}
                  </button>
                </div>
              </div>

              {/* Teacher table */}
              {data.teachers && data.teachers.length > 0 ? (
                <DataTable
                  columns={["Photo", "Emp ID", "Teacher Name", "Department", "Status", "Action"]}
                  rows={data.teachers.map((teacher) => {
                    const currentStatus = localAttendance[TEACHER_KEY]?.[teacher.empId] || teacher.status;
                    return [
                      <div key={`photo-${teacher.id}`} className="h-10 w-10 rounded-2xl overflow-hidden bg-slate-100 border border-slate-200 flex items-center justify-center">
                        <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${teacher.name}`} alt={teacher.name} className="h-full w-full object-cover" />
                      </div>,
                      <span key={`emp-${teacher.id}`} className="font-bold text-slate-400 text-xs font-mono">#{teacher.empId.slice(0, 8)}</span>,
                      <div key={`name-${teacher.id}`}>
                        <div className="font-bold text-slate-900">{teacher.name}</div>
                        <div className="text-[10px] text-slate-400 font-medium">{teacher.designation}</div>
                      </div>,
                      <span key={`dept-${teacher.id}`} className="text-sm text-slate-600 font-medium">{teacher.department || 'N/A'}</span>,
                      <span key={`status-${teacher.id}`} className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                        currentStatus === 'Present' ? 'bg-emerald-50 text-emerald-600' :
                        currentStatus === 'Absent' ? 'bg-rose-50 text-rose-600' :
                        'bg-amber-50 text-amber-600'
                      }`}>
                        {currentStatus}
                      </span>,
                      <button
                        key={`btn-${teacher.id}`}
                        onClick={() => toggleTeacherStatus(teacher.empId)}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${
                          currentStatus === 'Present'
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
              ) : (
                <div className="text-center py-16">
                  <Users size={48} weight="duotone" className="mx-auto text-slate-300 mb-4" />
                  <p className="text-slate-400 font-bold text-sm">No teachers found in the database.</p>
                  <p className="text-slate-300 text-xs mt-1">Add teacher accounts to see them here.</p>
                </div>
              )}
            </div>
          )}

          {/* ═══════════════════════════════════════════════════════
              CLASS-WISE SUMMARY TAB
              ═══════════════════════════════════════════════════════ */}
          {view === "class" && (
            <div className="space-y-4">
              <div className="grid gap-4 md:grid-cols-3">
                <MetricCard label="Total Present" value={String(data.summary.present)} />
                <MetricCard label="On Leave/Absent" value={String(data.summary.onLeave)} />
                <MetricCard label="Late arrivals" value={String(data.summary.lateArrivals)} />
              </div>
              <h3 className="text-lg font-bold text-slate-900 px-2">Class-wise Report</h3>
              <DataTable
                columns={["Class", "Total Students", "Present", "Absent", "Percentage"]}
                rows={(data.classWiseAttendance || []).map((entry) => [
                  <button
                    key={entry.class}
                    onClick={() => { setSelectedClass(entry.class); setView("student"); }}
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

          {/* ═══════════════════════════════════════════════════════
              STUDENT ATTENDANCE TAB
              ═══════════════════════════════════════════════════════ */}
          {view === "student" && (
            !selectedClass ? (
              <div className="space-y-6">
                <div className="grid gap-4 md:grid-cols-3">
                  <MetricCard label="Total Present" value={String(data.summary.present)} />
                  <MetricCard label="On Leave/Absent" value={String(data.summary.onLeave)} />
                  <MetricCard label="Late arrivals" value={String(data.summary.lateArrivals)} />
                </div>
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
                      <span className="text-[10px] text-slate-400 font-bold">
                        {data.studentsAttendance[cls]?.length || 0} students
                      </span>
                    </motion.button>
                  ))}
                </div>
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
                  <div className="flex items-center gap-3 flex-wrap">
                    {(() => {
                      const counts = getStudentCount();
                      return (
                        <div className="flex items-center gap-2 mr-2">
                          <span className="text-[10px] font-bold bg-emerald-50 text-emerald-600 px-2.5 py-1 rounded-lg">{counts.present}P</span>
                          <span className="text-[10px] font-bold bg-rose-50 text-rose-600 px-2.5 py-1 rounded-lg">{counts.absent}A</span>
                          {counts.notMarked > 0 && <span className="text-[10px] font-bold bg-slate-100 text-slate-500 px-2.5 py-1 rounded-lg">{counts.notMarked} unmarked</span>}
                        </div>
                      );
                    })()}
                    {saveMsg && <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-xl">{saveMsg}</span>}
                    <button onClick={markAllStudentsPresent}
                      className="flex items-center gap-2 px-4 py-2.5 bg-emerald-500 text-white rounded-2xl font-bold text-sm shadow-lg shadow-emerald-500/25 hover:bg-emerald-600 transition-all active:scale-95">
                      <CheckSquare size={16} weight="bold" /> All Present
                    </button>
                    <button onClick={markAllStudentsAbsent}
                      className="flex items-center gap-2 px-4 py-2.5 bg-rose-500 text-white rounded-2xl font-bold text-sm shadow-lg shadow-rose-500/25 hover:bg-rose-600 transition-all active:scale-95">
                      <XCircle size={16} weight="bold" /> All Absent
                    </button>
                    <button onClick={handleSaveStudentAttendance} disabled={saving}
                      className="flex items-center gap-2 px-5 py-2.5 bg-[#FF7F50] text-white rounded-2xl font-bold text-sm shadow-lg shadow-[#FF7F50]/25 hover:bg-[#e66a3e] transition-all disabled:opacity-60">
                      {saving ? <SpinnerGap size={16} className="animate-spin" /> : <FloppyDisk size={16} weight="bold" />}
                      {saving ? "Saving..." : "Save Attendance"}
                    </button>
                  </div>
                </div>

                <DataTable
                  columns={["Photo", "Roll No", "Student Name", "Status", "Action"]}
                  rows={(data.studentsAttendance?.[selectedClass] || []).map((student) => {
                    const currentStatus = localAttendance[selectedClass]?.[student.rollNo] || student.status;
                    return [
                      <div key={`photo-${student.rollNo}`} className="h-10 w-10 rounded-2xl overflow-hidden bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-400">
                        {student.photo
                          ? <img src={student.photo} alt={student.name} className="h-full w-full object-cover" />
                          : <UserCircle size={28} weight="duotone" />}
                      </div>,
                      <span key={`roll-${student.rollNo}`} className="font-bold text-slate-400">#{student.rollNo}</span>,
                      <div key={`name-${student.rollNo}`} className="font-bold text-slate-900">{student.name}</div>,
                      <span key={`status-${student.rollNo}`} className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                        currentStatus === 'Present' || currentStatus === 'P' ? 'bg-emerald-50 text-emerald-600' :
                        currentStatus === 'Absent' || currentStatus === 'A' ? 'bg-rose-50 text-rose-600' :
                        currentStatus === 'L' || currentStatus === 'Leave' ? 'bg-blue-50 text-blue-600' :
                        'bg-amber-50 text-amber-600'
                      }`}>
                        {currentStatus === 'L' ? 'Leave' : currentStatus}
                      </span>,
                      <button
                        key={`btn-${student.rollNo}`}
                        onClick={() => toggleStudentStatus(student.rollNo)}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${
                          currentStatus === 'Present'
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
