"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  GraduationCap,
  Table,
  CloudArrowUp,
  CheckCircle,
  CaretLeft,
  FilePdf,
  Warning,
  SpinnerGap,
  Printer,
  X,
  DownloadSimple
} from "@phosphor-icons/react";
import { PageSection } from "./page-section";
import { getAllUsers } from "../../services/users-service";
import { bulkSaveResults, getReportCards, getTerms, type ReportCardsResponse } from "../../services/exam-service";
import { apiRequest } from "../../services/api-client";
import { exportMarksExcel } from "../../services/excel-service";

type Step = 1 | 2 | 3;

/** Marks are keyed by subject name so a class with 13 subjects works like one with 3. */
interface MarkEntry {
  name: string;
  studentProfileId: string;
  subjects: Record<string, string>;
}

interface ClassInfo {
  label: string;
  count: number;
  students: { name: string; profileId: string }[];
  rawClass: string;
  rawSection: string;
}

interface SubjectOption { name: string; type: string; }

/** Used when the class has no matching structure yet, so entry still works. */
const FALLBACK_SUBJECTS = ["English", "Mathematics", "Science"];

interface OverviewSubject {
  name: string;
  type: "scholastic" | "co-scholastic" | "assessment" | string;
}

interface OverviewClass {
  code: string;
  name: string;
  subjects: { subject: OverviewSubject }[];
}

interface AcademicsOverview {
  classes: OverviewClass[];
  examTypes: { name: string }[];
}

export function ResultsPage() {
  const [step, setStep] = useState<Step>(1);
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedClassInfo, setSelectedClassInfo] = useState<ClassInfo | null>(null);
  const [term, setTerm] = useState("Term 1");
  const [isPublishing, setIsPublishing] = useState(false);
  const [publishError, setPublishError] = useState<string | null>(null);
  const [classes, setClasses] = useState<ClassInfo[]>([]);
  const [isLoadingClasses, setIsLoadingClasses] = useState(true);
  const [marks, setMarks] = useState<MarkEntry[]>([]);

  // Academic structure: which subjects a class takes, and which terms exist.
  const [subjectNames, setSubjectNames] = useState<string[]>(FALLBACK_SUBJECTS);
  const [examTypes, setExamTypes] = useState<string[]>([]);
  const [recordedTerms, setRecordedTerms] = useState<string[]>([]);

  // Report cards
  const [cards, setCards] = useState<ReportCardsResponse | null>(null);
  const [isGeneratingCards, setIsGeneratingCards] = useState(false);
  const [cardsError, setCardsError] = useState<string | null>(null);
  const [showCards, setShowCards] = useState(false);

  const [exporting, setExporting] = useState(false);

  /** Terms that already carry marks, so the office can see what exists.
   *  Declared before the mount effect that calls it. */
  const getTermsSafe = async () => {
    try {
      const terms = await getTerms();
      if (terms.length) setRecordedTerms(terms.map((t) => t.term));
    } catch {
      /* no marks recorded yet */
    }
  };

  useEffect(() => {
    getAllUsers()
      .then((data) => {
        const grouped: Record<string, { students: { name: string; profileId: string }[]; rawClass: string; rawSection: string }> = {};
        for (const u of data) {
          if (u.role !== 'parent') continue;
          const profile = u.studentProfile;
          if (!profile?.class) continue;
          const cls = profile.section ? `Class ${profile.class}${profile.section}` : `Class ${profile.class}`;
          if (!grouped[cls]) grouped[cls] = { students: [], rawClass: profile.class, rawSection: profile.section ?? '' };
          grouped[cls].students.push({ name: u.name, profileId: profile.id });
        }
        setClasses(
          Object.entries(grouped).map(([label, info]) => ({ label, count: info.students.length, students: info.students, rawClass: info.rawClass, rawSection: info.rawSection }))
        );
      })
      .catch(console.error)
      .finally(() => setIsLoadingClasses(false));

    // Subject columns and the term list come from the configured structure,
    // not from hardcoded strings.
    apiRequest<AcademicsOverview>("/academics/overview")
      .then((overview) => {
        const types: string[] = (overview?.examTypes ?? []).map((t) => t.name);
        if (types.length) {
          setExamTypes(types);
          setTerm((prev) => (types.includes(prev) ? prev : types[0]));
        }
      })
      .catch(() => { /* structure unavailable - the fallbacks still work */ });

    getTermsSafe();
  }, []);

  /** Scholastic subjects for the chosen class, in configured order. */
  const loadSubjectsFor = async (classCode: string) => {
    try {
      const overview = await apiRequest<AcademicsOverview>("/academics/overview");
      const match = (overview?.classes ?? []).find((c) => String(c.code) === String(classCode));
      const scholastic: SubjectOption[] = (match?.subjects ?? [])
        .filter((s) => s?.subject?.type === "scholastic")
        .map((s) => ({ name: s.subject.name, type: s.subject.type }));
      setSubjectNames(scholastic.length ? scholastic.map((s) => s.name) : FALLBACK_SUBJECTS);
    } catch {
      setSubjectNames(FALLBACK_SUBJECTS);
    }
  };

  const handleSelectClass = (info: ClassInfo) => {
    setSelectedClass(info.label);
    setSelectedClassInfo(info);
    void loadSubjectsFor(info.rawClass);
    setMarks(info.students.map((s) => ({ name: s.name, studentProfileId: s.profileId, subjects: {} })));
    setCards(null);
    setShowCards(false);
    setCardsError(null);
    setStep(2);
  };

  const updateMark = (index: number, subject: string, value: string) => {
    setMarks((prev) =>
      prev.map((m, i) => (i === index ? { ...m, subjects: { ...m.subjects, [subject]: value } } : m)),
    );
  };

  const safeTotal = (m: MarkEntry) => {
    const values = Object.values(m.subjects)
      .map((v) => parseInt(v, 10))
      .filter((n) => !Number.isNaN(n));
    if (!values.length) return "—";
    return values.reduce((a, b) => a + b, 0);
  };

  const handlePublish = async () => {
    if (!selectedClassInfo) return;
    setIsPublishing(true);
    setPublishError(null);
    try {
      const students = marks
        .map((m) => ({
          studentId: m.studentProfileId,
          name: m.name,
          subjects: Object.entries(m.subjects)
            .filter(([, v]) => v !== "" && v != null)
            .map(([subject, v]) => {
              const total = parseInt(v, 10) || 0;
              return { subject, internal: 0, exam: total, total };
            }),
        }))
        .filter((s) => s.subjects.length > 0);

      if (!students.length) {
        setPublishError("Enter at least one mark before publishing.");
        return;
      }

      const year = new Date().getFullYear();
      await bulkSaveResults({
        class: selectedClassInfo.rawClass,
        section: selectedClassInfo.rawSection,
        term,
        academicYear: `${year}-${year + 1}`,
        students,
      });
      await getTermsSafe();
      setStep(3);
    } catch (err) {
      setPublishError(err instanceof Error ? err.message : "Failed to publish results.");
    } finally {
      setIsPublishing(false);
    }
  };

  const handleGenerateCards = async () => {
    if (!selectedClassInfo) return;
    setIsGeneratingCards(true);
    setCardsError(null);
    try {
      const res = await getReportCards(
        selectedClassInfo.rawClass,
        selectedClassInfo.rawSection,
        term,
      );
      setCards(res);
      setShowCards(true);
    } catch (err) {
      setCardsError(err instanceof Error ? err.message : "Could not build the report cards.");
      setShowCards(true);
    } finally {
      setIsGeneratingCards(false);
    }
  };

  const handleExportMarks = async () => {
    if (!selectedClassInfo) return;
    setExporting(true);
    try {
      await exportMarksExcel(selectedClassInfo.rawClass, selectedClassInfo.rawSection, term);
    } catch (err) {
      alert(`Export failed: ${err instanceof Error ? err.message : "Unknown error"}`);
    } finally {
      setExporting(false);
    }
  };

  /** Only subjects with marks entered are published, so optional rows stay empty. */
  const enteredCount = marks.reduce(
    (n, m) => n + Object.values(m.subjects).filter((v) => v !== "" && v != null).length,
    0,
  );

  const resetFlow = () => {
    setStep(1);
    setSelectedClass("");
    setSelectedClassInfo(null);
    setCards(null);
    setShowCards(false);
    setCardsError(null);
    setSubjectNames(FALLBACK_SUBJECTS);
  };

  return (
    <PageSection
      eyebrow="Academic Performance"
      title="Results Flow"
      description="Record, validate, and publish academic results following the official grading workflow."
    >
      {/* Keeps the report cards readable when the office prints to PDF. */}
      <style>{`
        @media print {
          body * { visibility: hidden !important; }
          #report-cards-print, #report-cards-print * { visibility: visible !important; }
          #report-cards-print {
            position: absolute !important;
            left: 0 !important;
            top: 0 !important;
            width: 100% !important;
            max-width: none !important;
            margin: 0 !important;
            padding: 0 !important;
            box-shadow: none !important;
            border: 0 !important;
            background: #fff !important;
          }
          #report-cards-print .no-print { display: none !important; }
          @page { margin: 12mm; }
        }
      `}</style>

      <div className="max-w-5xl mx-auto">
        <div className="rounded-[2.5rem] border border-[var(--border)] bg-white overflow-hidden shadow-[0_24px_70px_rgba(15,23,42,0.05)]">

          {/* Header */}
          <div className="bg-slate-50 border-b border-slate-100 px-8 py-6 flex items-center justify-between">
             <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-2xl bg-[#FF7F50] flex items-center justify-center text-white shadow-lg shadow-[#FF7F50]/20">
                   <GraduationCap size={28} weight="fill" />
                </div>
                <div>
                   <h3 className="text-lg font-bold text-slate-900">Result Management</h3>
                   <p className="text-xs text-slate-500 font-medium">
                     Session {new Date().getFullYear()}-{String(new Date().getFullYear() + 1).slice(2)} • {term}
                   </p>
                </div>
             </div>
             <div className="flex gap-2">
                {[1, 2, 3].map((s) => (
                  <div key={s} className={`h-2 w-8 rounded-full transition-all duration-500 ${step >= s ? "bg-[#FF7F50]" : "bg-slate-200"}`} />
                ))}
             </div>
          </div>

          <div className="p-8">
            <AnimatePresence mode="wait">
              {step === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-8"
                >
                  <div className="text-center max-w-md mx-auto py-6">
                    <h4 className="text-2xl font-bold text-slate-900 mb-2">Select Class</h4>
                    <p className="text-sm text-slate-500">Choose the class to begin mark entry for the current term.</p>
                  </div>

                  {isLoadingClasses ? (
                    <div className="flex items-center justify-center py-12">
                      <SpinnerGap size={32} className="animate-spin text-[#FF7F50]" />
                    </div>
                  ) : classes.length === 0 ? (
                    <p className="text-center text-slate-400 py-12">No classes found. Add students via Admission first.</p>
                  ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                      {classes.map((c) => (
                        <button
                          key={c.label}
                          onClick={() => handleSelectClass(c)}
                          className={`p-6 rounded-3xl border-2 transition-all group ${
                            selectedClass === c.label ? "border-[#FF7F50] bg-[#FF7F50]/5" : "border-slate-100 hover:border-slate-200"
                          }`}
                        >
                          <Table size={32} className={`mb-3 transition-colors ${selectedClass === c.label ? "text-[#FF7F50]" : "text-slate-300 group-hover:text-slate-400"}`} />
                          <div className="font-bold text-slate-900">{c.label}</div>
                          <div className="text-[10px] font-bold text-slate-400 uppercase mt-1">{c.count} {c.count === 1 ? "Student" : "Students"}</div>
                        </button>
                      ))}
                    </div>
                  )}
                </motion.div>
              )}

              {step === 2 && (
                <motion.div 
                  key="step2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <div className="flex items-center justify-between flex-wrap gap-3">
                     <div>
                       <h4 className="text-xl font-bold text-slate-900">Entering Marks for {selectedClass}</h4>
                       <p className="text-xs text-slate-400 font-medium mt-1">
                         {subjectNames.length} scholastic subject{subjectNames.length === 1 ? "" : "s"} for this class
                       </p>
                     </div>
                     <div className="flex items-center gap-2">
                       <select value={term} onChange={e => setTerm(e.target.value)} title="Terms marked ✓ already have marks recorded" className="px-3 py-2 border border-slate-200 rounded-xl text-sm font-bold text-slate-700 outline-none">
                         {(examTypes.length ? examTypes : [term]).map(t => (
                           <option key={t} value={t}>{t}{recordedTerms.includes(t) ? " ✓" : ""}</option>
                         ))}
                       </select>
                       <button
                         onClick={handleExportMarks}
                         disabled={exporting}
                         title="Download the mark sheet as .xlsx"
                         className="flex items-center gap-1.5 px-3 py-2 border border-slate-200 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-50 transition-all disabled:opacity-60"
                       >
                         {exporting ? <SpinnerGap size={15} className="animate-spin" /> : <DownloadSimple size={15} weight="bold" />}
                         Excel
                       </button>
                     </div>
                  </div>
                  {publishError && <p className="text-sm font-bold text-rose-600 bg-rose-50 px-4 py-2 rounded-xl">{publishError}</p>}

                  <div className="overflow-x-auto border border-slate-100 rounded-3xl">
                    <table className="w-full text-left min-w-[640px]">
                      <thead className="bg-slate-50 text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100">
                        <tr>
                          <th className="px-6 py-4 sticky left-0 bg-slate-50">Student Name</th>
                          {subjectNames.map((s) => (
                            <th key={s} className="px-4 py-4 whitespace-nowrap">{s}</th>
                          ))}
                          <th className="px-6 py-4">Total</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-50">
                        {marks.map((student, i) => (
                          <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                            <td className="px-6 py-4 font-bold text-slate-900 sticky left-0 bg-white">{student.name}</td>
                            {subjectNames.map((s) => (
                              <td key={s} className="px-4 py-4">
                                 <input 
                                   type="number"
                                   min={0}
                                   inputMode="numeric"
                                   value={student.subjects[s] ?? ""} 
                                   onChange={(e) => updateMark(i, s, e.target.value)}
                                   placeholder="—"
                                   className="w-16 bg-slate-50 border border-slate-200 rounded-lg px-2 py-1.5 text-center font-bold text-slate-900 focus:border-[#FF7F50] outline-none"
                                 />
                              </td>
                            ))}
                            <td className="px-6 py-4 font-bold text-[#FF7F50]">
                               {safeTotal(student)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <div className="flex items-center justify-between pt-6">
                    <button onClick={() => setStep(1)} className="flex items-center gap-2 text-slate-500 font-bold hover:text-slate-900 transition-colors">
                      <CaretLeft size={20} /> Back
                    </button>
                    <div className="flex gap-4">
                       <span className="self-center text-[11px] font-bold text-slate-400">
                         {enteredCount} mark{enteredCount === 1 ? "" : "s"} entered
                       </span>
                       <button 
                         onClick={handlePublish}
                         disabled={isPublishing}
                         className="flex items-center gap-2 px-10 py-3 bg-slate-900 text-white rounded-2xl font-bold shadow-xl hover:bg-slate-800 transition-all disabled:opacity-60"
                       >
                         {isPublishing ? "Publishing..." : "Publish Results"}
                         <CloudArrowUp size={20} weight="fill" />
                       </button>
                    </div>
                  </div>
                </motion.div>
              )}

              {step === 3 && (
                <motion.div 
                  key="step3"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-12"
                >
                  <div className="inline-flex h-24 w-24 items-center justify-center rounded-full bg-emerald-50 text-emerald-500 mb-8">
                    <CheckCircle size={64} weight="fill" />
                  </div>
                  <h3 className="text-3xl font-bold text-slate-900 mb-4">Results Published</h3>
                  <p className="text-slate-500 max-w-sm mx-auto mb-10 leading-relaxed">
                    <span className="font-bold text-slate-900">{term}</span> results for <span className="font-bold text-slate-900">{selectedClass}</span> have been recorded.
                  </p>
                  
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <button 
                      onClick={resetFlow}
                      className="flex items-center justify-center gap-2 px-8 py-4 bg-[#FF7F50] text-white rounded-2xl font-bold shadow-lg shadow-[#FF7F50]/30 hover:bg-[#e66a3e] transition-all"
                    >
                      Process Another Class
                    </button>
                    <button
                      onClick={handleGenerateCards}
                      disabled={isGeneratingCards}
                      className="flex items-center justify-center gap-2 px-8 py-4 bg-white border border-slate-200 text-slate-700 rounded-2xl font-bold hover:bg-slate-50 transition-all disabled:opacity-60"
                    >
                      {isGeneratingCards ? <SpinnerGap size={20} className="animate-spin" /> : <FilePdf size={20} />}
                      {isGeneratingCards ? "Building..." : "Generate Report Cards"}
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Warning Panel */}
        {step === 2 && (
          <div className="mt-8 p-6 rounded-3xl bg-rose-50 border border-rose-100 flex gap-4">
             <Warning size={24} className="text-rose-500 shrink-0" />
             <p className="text-sm text-rose-700 leading-relaxed">
                <span className="font-bold">Attention:</span> Publishing results is an irreversible action. Ensure all marks have been cross-verified against the physical answer scripts before final submission.
             </p>
          </div>
        )}

        {/* ═══════════ Report cards (printable) ═══════════ */}
        {showCards && (
          <div
            id="report-cards-print"
            className="mt-8 rounded-[2.5rem] border border-slate-100 bg-white p-8"
          >
            <div className="no-print flex items-center justify-between mb-6 pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowCards(false)}
                  className="flex items-center gap-1.5 text-sm font-bold text-slate-500 hover:text-slate-900 transition-colors"
                >
                  <X size={16} weight="bold" /> Close
                </button>
              </div>
              <button
                onClick={() => window.print()}
                className="flex items-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-2xl font-bold text-sm hover:bg-slate-800 transition-all"
              >
                <Printer size={18} weight="bold" /> Print / Save as PDF
              </button>
            </div>

            {cardsError && (
              <p className="text-sm font-bold text-rose-600 bg-rose-50 px-4 py-3 rounded-xl mb-6">
                {cardsError}
              </p>
            )}

            {cards && (
              <>
                <div className="text-center mb-6">
                  <h3 className="text-2xl font-black text-slate-900">{cards.school.name}</h3>
                  <p className="text-xs font-bold text-slate-500 mt-1">
                    {cards.school.address ? `${cards.school.address} · ` : ""}
                    {cards.school.board} · {cards.school.mediumOfInstruction} medium
                  </p>
                  <p className="text-[11px] font-bold uppercase tracking-widest text-slate-400 mt-1">
                    Academic Year {cards.academicYear} · Class {cards.class}-{cards.section} · {cards.term}
                  </p>
                </div>

                {cards.summary.withResults === 0 ? (
                  <p className="text-center text-sm text-slate-400 py-10">
                    No marks have been recorded for {cards.term} in Class {cards.class}-{cards.section} yet.
                  </p>
                ) : (
                  <div className="space-y-6">
                    <div className="flex flex-wrap gap-4 text-[11px] font-bold">
                      <span className="text-slate-500 bg-slate-50 px-3 py-1.5 rounded-lg">{cards.summary.withResults} report card{cards.summary.withResults === 1 ? "" : "s"}</span>
                      <span className="text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-lg">{cards.summary.passed} passed</span>
                      <span className="text-rose-600 bg-rose-50 px-3 py-1.5 rounded-lg">{cards.summary.failed} failed</span>
                      {cards.gradingScale && (
                        <span className="text-slate-500 bg-slate-50 px-3 py-1.5 rounded-lg">
                          Scale: {cards.gradingScale.name} (pass {cards.gradingScale.passMark})
                        </span>
                      )}
                    </div>

                    {cards.students.map((card) => (
                      <ReportCardView key={card.student.profileId} card={card} />
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        )}
      </div>
    </PageSection>
  );
}

/** One pupil's printable report card. */
function ReportCardView({ card }: { card: ReportCardsResponse["students"][number] }) {
  const { student, subjects, summary, school, gradingScale } = card;

  return (
    <div className="rounded-3xl border border-slate-200 overflow-hidden">
      {/* Card header */}
      <div className="bg-slate-50 px-6 py-4 border-b border-slate-100 flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-sm font-black text-slate-900">{student.name}</p>
          <p className="text-[11px] font-bold text-slate-500">
            Roll {student.rollNo}{student.admissionNo ? ` · ADM ${student.admissionNo}` : ""}
          </p>
        </div>
        <div className="flex items-center gap-3 text-[11px] font-bold text-slate-500">
          <span>Class {student.class}-{student.section}</span>
          <span
            className={`px-3 py-1 rounded-full font-black uppercase tracking-widest text-[10px] ${
              summary.passed ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-600"
            }`}
          >
            {summary.passed ? "Pass" : "Fail"}
          </span>
        </div>
      </div>

      {subjects.length === 0 ? (
        <p className="px-6 py-5 text-xs text-slate-400 font-medium">No marks recorded for this term.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="text-[10px] uppercase tracking-widest text-slate-400 font-black border-b border-slate-50">
              <tr>
                <th className="px-6 py-3">Subject</th>
                <th className="px-4 py-3 text-center">Internal</th>
                <th className="px-4 py-3 text-center">Exam</th>
                <th className="px-4 py-3 text-center">Total</th>
                <th className="px-4 py-3 text-center">Out of</th>
                <th className="px-4 py-3 text-center">Grade</th>
                <th className="px-6 py-3">Remark</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {subjects.map((s) => (
                <tr key={s.subject}>
                  <td className="px-6 py-3 font-bold text-slate-900">{s.subject}</td>
                  <td className="px-4 py-3 text-center text-slate-500">{s.internal}</td>
                  <td className="px-4 py-3 text-center text-slate-500">{s.exam}</td>
                  <td className="px-4 py-3 text-center font-black text-slate-900">{s.total}</td>
                  <td className="px-4 py-3 text-center text-slate-400">{s.maxMark}</td>
                  <td className="px-4 py-3 text-center font-black text-[#FF7F50]">{s.grade}</td>
                  <td className="px-6 py-3 text-slate-500">{s.remark || (s.passed ? "" : "Needs improvement")}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="bg-slate-50 font-black text-slate-900">
                <td className="px-6 py-3 uppercase tracking-widest text-[10px]">Aggregate</td>
                <td colSpan={2} />
                <td className="px-4 py-3 text-center">{summary.totalObtained}</td>
                <td className="px-4 py-3 text-center text-slate-500">{summary.totalMax}</td>
                <td className="px-4 py-3 text-center text-[#FF7F50]">{summary.overallGrade}</td>
                <td className="px-6 py-3 text-slate-600 font-bold">
                  {summary.percentage.toFixed(2)}%
                  {summary.subjectsFailed.length > 0 && (
                    <span className="text-rose-500"> · failed: {summary.subjectsFailed.join(", ")}</span>
                  )}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      )}

      {/* Grading key, printed on every card */}
      {gradingScale && (
        <div className="px-6 py-3 bg-slate-50 border-t border-slate-100 flex flex-wrap gap-x-4 gap-y-1 text-[10px] font-bold text-slate-400">
          <span className="uppercase tracking-widest text-slate-500">{gradingScale.name}:</span>
          {gradingScale.bands.map((b) => (
            <span key={b.grade}>{b.minMark}–{b.maxMark}: {b.grade}</span>
          ))}
          <span>Pass mark {gradingScale.passMark}</span>
        </div>
      )}

      <div className="px-6 py-2 bg-white border-t border-slate-50 text-[10px] text-slate-300 font-medium">
        {school.name} · Class {student.class}-{student.section} · {card.term}
        {school.contactPhone ? ` · ${school.contactPhone}` : ""}
      </div>
    </div>
  );
}
