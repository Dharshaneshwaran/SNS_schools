"use client";

import { useCallback, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Stack,
  Books,
  BookOpen,
  Percent,
  CalendarBlank,
  Translate,
  Plus,
  PencilSimple,
  Trash,
  X,
  Check,
} from "@phosphor-icons/react";
import { PageSection } from "./page-section";
import { apiRequest } from "../../services/api-client";
import { ResourceLoading, ResourceError } from "./resource-states";

type Wing = {
  id: string;
  name: string;
  gradeRange: string;
  coordinatorName: string;
  sortOrder: number;
  _count?: { classes: number };
};

type Section = { id: string; name: string };

type ClassSubject = {
  id: string;
  optional: boolean;
  subject: { id: string; name: string; type: string };
};

type SchoolClass = {
  id: string;
  name: string;
  code: string;
  sortOrder: number;
  wingId: string | null;
  sections: Section[];
  subjects: ClassSubject[];
};

type Subject = { id: string; name: string; type: string };

type GradeBand = {
  id?: string;
  minMark: number;
  maxMark: number;
  grade: string;
  remark?: string;
};

type GradingScale = {
  id: string;
  name: string;
  isDefault: boolean;
  passMark: number;
  bands: GradeBand[];
};

type ExamType = {
  id: string;
  name: string;
  appliesTo: string;
  isTerm: boolean;
  sortOrder: number;
};

type Medium = {
  mediumOfInstruction: string;
  secondLanguage: string;
  board: string;
};

type Overview = {
  wings: Wing[];
  classes: SchoolClass[];
  subjects: Subject[];
  gradingScales: GradingScale[];
  examTypes: ExamType[];
  medium: Medium;
};

type TabKey = "wings" | "classes" | "subjects" | "grading" | "exams" | "medium";

const TABS: { key: TabKey; label: string; icon: React.ReactNode }[] = [
  { key: "wings", label: "Wings", icon: <Stack size={16} weight="duotone" /> },
  { key: "classes", label: "Classes", icon: <Books size={16} weight="duotone" /> },
  { key: "subjects", label: "Subjects", icon: <BookOpen size={16} weight="duotone" /> },
  { key: "grading", label: "Grading", icon: <Percent size={16} weight="duotone" /> },
  { key: "exams", label: "Exams", icon: <CalendarBlank size={16} weight="duotone" /> },
  { key: "medium", label: "Medium", icon: <Translate size={16} weight="duotone" /> },
];

const SUBJECT_TYPES = ["scholastic", "co-scholastic", "assessment"];

export function AcademicsPage() {
  const [data, setData] = useState<Overview | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tab, setTab] = useState<TabKey>("wings");
  const [isSaving, setIsSaving] = useState(false);

  const fetchAll = useCallback(async () => {
    setIsLoading(true);
    try {
      const result = await apiRequest<Overview>("/academics/overview");
      setData(result);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load academic structure.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchAll();
  }, [fetchAll]);

  /** Run a mutation, surface failures inline, then refresh. */
  const run = async (action: () => Promise<unknown>, failure: string) => {
    setIsSaving(true);
    try {
      await action();
      await fetchAll();
      return true;
    } catch (err) {
      alert(`${failure}: ${err instanceof Error ? err.message : "Unknown error"}`);
      return false;
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <PageSection
      eyebrow="Academics"
      title="Academic Structure"
      description="Wings, classes, subjects, grading scale and exam types."
    >
      <div className="flex flex-col gap-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-center bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm gap-4">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-2xl bg-slate-50 flex items-center justify-center text-[#FF7F50]">
              <Books size={24} weight="duotone" />
            </div>
            <div>
              <h4 className="text-lg font-bold text-slate-900">Academic Structure</h4>
              <p className="text-xs text-slate-500 font-medium">
                {data
                  ? `${data.wings.length} wings · ${data.classes.length} classes · ${data.subjects.length} subjects`
                  : "Loading structure"}
              </p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap gap-2 bg-white p-2 rounded-2xl border border-slate-100 shadow-sm">
          {TABS.map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
                tab === t.key
                  ? "bg-[#FF7F50] text-white shadow-md shadow-[#FF7F50]/20"
                  : "text-slate-500 hover:bg-slate-50"
              }`}
            >
              {t.icon}
              {t.label}
            </button>
          ))}
        </div>

        {isLoading ? <ResourceLoading label="academic structure" /> : null}
        {error ? <ResourceError label="academic structure" message={error} /> : null}

        {!isLoading && !error && data && (
          <>
            {tab === "wings" && <WingsTab data={data} run={run} isSaving={isSaving} />}
            {tab === "classes" && <ClassesTab data={data} run={run} isSaving={isSaving} />}
            {tab === "subjects" && <SubjectsTab data={data} run={run} isSaving={isSaving} />}
            {tab === "grading" && <GradingTab data={data} run={run} isSaving={isSaving} />}
            {tab === "exams" && <ExamsTab data={data} run={run} isSaving={isSaving} />}
            {tab === "medium" && <MediumTab data={data} run={run} isSaving={isSaving} />}
          </>
        )}
      </div>
    </PageSection>
  );
}

type TabProps = {
  data: Overview;
  run: (action: () => Promise<unknown>, failure: string) => Promise<boolean>;
  isSaving: boolean;
};

// ---------------------------------------------------------------- Wings ---

function WingsTab({ data, run, isSaving }: TabProps) {
  const [form, setForm] = useState({ name: "", gradeRange: "", coordinatorName: "" });
  const [showForm, setShowForm] = useState(false);

  const create = async () => {
    if (!form.name.trim()) return alert("Wing name is required.");
    const ok = await run(
      () =>
        apiRequest("/academics/wings", {
          method: "POST",
          body: JSON.stringify(form),
        }),
      "Failed to create wing",
    );
    if (ok) {
      setForm({ name: "", gradeRange: "", coordinatorName: "" });
      setShowForm(false);
    }
  };

  const remove = async (wing: Wing) => {
    if (!window.confirm(`Delete wing "${wing.name}"? Its classes will be kept but unassigned.`)) return;
    await run(() => apiRequest(`/academics/wings/${wing.id}`, { method: "DELETE" }), "Failed to delete wing");
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-end">
        <button
          onClick={() => setShowForm((v) => !v)}
          className="flex items-center gap-2 px-5 py-3 bg-[#FF7F50] text-white rounded-xl font-bold text-sm shadow-lg shadow-[#FF7F50]/20 hover:bg-[#e66a3e] transition-all"
        >
          {showForm ? <X size={16} weight="bold" /> : <Plus size={16} weight="bold" />}
          {showForm ? "Cancel" : "Add Wing"}
        </button>
      </div>

      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden"
          >
            <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-4">
              <Field
                label="Wing name"
                value={form.name}
                onChange={(v) => setForm({ ...form, name: v })}
                placeholder="e.g. Middle School"
              />
              <Field
                label="Grade range"
                value={form.gradeRange}
                onChange={(v) => setForm({ ...form, gradeRange: v })}
                placeholder="e.g. Grade 6 - 8"
              />
              <Field
                label="Coordinator"
                value={form.coordinatorName}
                onChange={(v) => setForm({ ...form, coordinatorName: v })}
                placeholder="e.g. Mrs. Gangadevi"
              />
            </div>
            <div className="px-6 pb-6">
              <button
                onClick={create}
                disabled={isSaving}
                className="px-6 py-3 bg-slate-900 text-white rounded-xl font-bold text-sm hover:bg-slate-800 transition-all disabled:opacity-50"
              >
                {isSaving ? "Saving..." : "Save Wing"}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {data.wings.map((wing) => (
          <motion.div
            key={wing.id}
            layout
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-[2rem] p-6 border border-slate-100 shadow-sm hover:shadow-xl transition-all"
          >
            <div className="flex justify-between items-start mb-3">
              <span className="text-[10px] font-black uppercase tracking-widest text-[#FF7F50] bg-[#FF7F50]/10 px-2.5 py-1 rounded-lg">
                Wing {wing.sortOrder}
              </span>
              <button
                onClick={() => remove(wing)}
                className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-colors"
              >
                <Trash size={16} weight="bold" />
              </button>
            </div>
            <h3 className="text-lg font-black text-slate-900">{wing.name}</h3>
            <p className="text-sm text-slate-500 mt-1">{wing.gradeRange || "No grade range set"}</p>
            <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-slate-500">
              <span>{wing.coordinatorName || "No coordinator"}</span>
              <span>{wing._count?.classes ?? 0} classes</span>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

// -------------------------------------------------------------- Classes ---

function ClassesTab({ data, run, isSaving }: TabProps) {
  const [form, setForm] = useState({ name: "", code: "", wingId: "", sections: "A" });
  const [showForm, setShowForm] = useState(false);
  const [sectionDrafts, setSectionDrafts] = useState<Record<string, string>>({});

  const create = async () => {
    if (!form.name.trim() || !form.code.trim()) return alert("Class name and code are required.");
    const sections = form.sections.split(",").map((s) => s.trim()).filter(Boolean);
    const ok = await run(
      () =>
        apiRequest("/academics/classes", {
          method: "POST",
          body: JSON.stringify({
            name: form.name,
            code: form.code,
            wingId: form.wingId || null,
            sections: sections.length ? sections : ["A"],
          }),
        }),
      "Failed to create class",
    );
    if (ok) {
      setForm({ name: "", code: "", wingId: "", sections: "A" });
      setShowForm(false);
    }
  };

  const remove = async (cls: SchoolClass) => {
    if (!window.confirm(`Delete ${cls.name} and its ${cls.sections.length} section(s)?`)) return;
    await run(() => apiRequest(`/academics/classes/${cls.id}`, { method: "DELETE" }), "Failed to delete class");
  };

  const addSection = async (cls: SchoolClass) => {
    const name = (sectionDrafts[cls.id] ?? "").trim().toUpperCase();
    if (!name) return;
    await run(
      () =>
        apiRequest(`/academics/classes/${cls.id}/sections`, {
          method: "POST",
          body: JSON.stringify({ name }),
        }),
      "Failed to add section",
    );
    setSectionDrafts((d) => ({ ...d, [cls.id]: "" }));
  };

  const removeSection = async (cls: SchoolClass, section: Section) => {
    if (!window.confirm(`Remove section ${section.name} from ${cls.name}?`)) return;
    await run(
      () => apiRequest(`/academics/classes/${cls.id}/sections/${section.id}`, { method: "DELETE" }),
      "Failed to remove section",
    );
  };

  const wingName = (id: string | null) =>
    data.wings.find((w) => w.id === id)?.name ?? "Unassigned";

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-end">
        <button
          onClick={() => setShowForm((v) => !v)}
          className="flex items-center gap-2 px-5 py-3 bg-[#FF7F50] text-white rounded-xl font-bold text-sm shadow-lg shadow-[#FF7F50]/20 hover:bg-[#e66a3e] transition-all"
        >
          {showForm ? <X size={16} weight="bold" /> : <Plus size={16} weight="bold" />}
          {showForm ? "Cancel" : "Add Class"}
        </button>
      </div>

      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden"
          >
            <div className="p-6 grid grid-cols-1 md:grid-cols-4 gap-4">
              <Field label="Class name" value={form.name} onChange={(v) => setForm({ ...form, name: v })} placeholder="e.g. Grade VI" />
              <Field label="Short code" value={form.code} onChange={(v) => setForm({ ...form, code: v })} placeholder="e.g. 6" />
              <div className="space-y-2">
                <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 ml-1">Wing</label>
                <select
                  value={form.wingId}
                  onChange={(e) => setForm({ ...form, wingId: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3.5 text-sm font-bold focus:outline-none focus:ring-4 focus:ring-[#FF7F50]/10"
                >
                  <option value="">Unassigned</option>
                  {data.wings.map((w) => (
                    <option key={w.id} value={w.id}>{w.name}</option>
                  ))}
                </select>
              </div>
              <Field
                label="Sections (comma separated)"
                value={form.sections}
                onChange={(v) => setForm({ ...form, sections: v })}
                placeholder="A, B, C"
              />
            </div>
            <div className="px-6 pb-6">
              <button
                onClick={create}
                disabled={isSaving}
                className="px-6 py-3 bg-slate-900 text-white rounded-xl font-bold text-sm hover:bg-slate-800 transition-all disabled:opacity-50"
              >
                {isSaving ? "Saving..." : "Save Class"}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {data.classes.map((cls) => (
          <motion.div
            key={cls.id}
            layout
            className="bg-white rounded-[2rem] p-6 border border-slate-100 shadow-sm hover:shadow-xl transition-all"
          >
            <div className="flex justify-between items-start mb-3">
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 bg-slate-50 px-2.5 py-1 rounded-lg">
                {cls.code}
              </span>
              <button
                onClick={() => remove(cls)}
                className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-colors"
              >
                <Trash size={16} weight="bold" />
              </button>
            </div>

            <h3 className="text-lg font-black text-slate-900">{cls.name}</h3>
            <p className="text-xs text-slate-400 font-semibold mt-0.5">{wingName(cls.wingId)}</p>

            <div className="mt-4 flex flex-wrap gap-1.5">
              {cls.sections.map((s) => (
                <button
                  key={s.id}
                  onClick={() => removeSection(cls, s)}
                  title={`Remove section ${s.name}`}
                  className="group flex items-center gap-1 text-xs font-black bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-600 hover:border-rose-300 hover:text-rose-600 transition-all"
                >
                  {s.name}
                  <X size={11} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                </button>
              ))}
            </div>

            <div className="mt-4 flex gap-2">
              <input
                value={sectionDrafts[cls.id] ?? ""}
                onChange={(e) => setSectionDrafts((d) => ({ ...d, [cls.id]: e.target.value }))}
                onKeyDown={(e) => e.key === "Enter" && addSection(cls)}
                placeholder="Add section"
                maxLength={4}
                className="flex-1 min-w-0 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs font-bold uppercase focus:outline-none focus:ring-2 focus:ring-[#FF7F50]/10"
              />
              <button
                onClick={() => addSection(cls)}
                disabled={isSaving}
                className="px-3 py-2 bg-slate-900 text-white rounded-lg text-xs font-bold hover:bg-slate-800 transition-all disabled:opacity-50"
              >
                <Plus size={14} weight="bold" />
              </button>
            </div>

            <div className="mt-4 pt-4 border-t border-slate-100 text-xs font-semibold text-slate-500">
              {cls.subjects.length} subjects
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

// ------------------------------------------------------------- Subjects ---

function SubjectsTab({ data, run, isSaving }: TabProps) {
  const [name, setName] = useState("");
  const [type, setType] = useState("scholastic");
  const [selectedClass, setSelectedClass] = useState<string>("");

  const cls = data.classes.find((c) => c.id === selectedClass) ?? null;
  const assigned = new Set(cls?.subjects.map((s) => s.subject.id) ?? []);

  const create = async () => {
    if (!name.trim()) return alert("Subject name is required.");
    const ok = await run(
      () =>
        apiRequest("/academics/subjects", {
          method: "POST",
          body: JSON.stringify({ name: name.trim(), type }),
        }),
      "Failed to create subject",
    );
    if (ok) setName("");
  };

  const remove = async (subject: Subject) => {
    if (!window.confirm(`Delete subject "${subject.name}"? It will be removed from every class.`)) return;
    await run(() => apiRequest(`/academics/subjects/${subject.id}`, { method: "DELETE" }), "Failed to delete subject");
  };

  const toggle = async (subjectId: string) => {
    if (!cls) return;
    const next = assigned.has(subjectId)
      ? [...assigned].filter((id) => id !== subjectId)
      : [...assigned, subjectId];
    await run(
      () =>
        apiRequest(`/academics/classes/${cls.id}/subjects`, {
          method: "POST",
          body: JSON.stringify({ subjectIds: next }),
        }),
      "Failed to update class subjects",
    );
  };

  const grouped = SUBJECT_TYPES.map((t) => ({
    type: t,
    items: data.subjects.filter((s) => s.type === t),
  })).filter((g) => g.items.length);

  return (
    <div className="flex flex-col gap-6">
      {/* Add subject */}
      <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm p-6 flex flex-col md:flex-row gap-4 md:items-end">
        <div className="flex-1 space-y-2">
          <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 ml-1">New subject</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && create()}
            placeholder="e.g. French"
            className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-3.5 text-sm font-bold focus:outline-none focus:ring-4 focus:ring-[#FF7F50]/10"
          />
        </div>
        <div className="space-y-2">
          <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 ml-1">Type</label>
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3.5 text-sm font-bold focus:outline-none focus:ring-4 focus:ring-[#FF7F50]/10"
          >
            {SUBJECT_TYPES.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </div>
        <button
          onClick={create}
          disabled={isSaving}
          className="flex items-center gap-2 px-6 py-3.5 bg-[#FF7F50] text-white rounded-xl font-bold text-sm shadow-lg shadow-[#FF7F50]/20 hover:bg-[#e66a3e] transition-all disabled:opacity-50"
        >
          <Plus size={16} weight="bold" /> Add
        </button>
      </div>

      {/* Assign to class */}
      <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-5">
          <div>
            <h4 className="text-base font-bold text-slate-900">Subjects per class</h4>
            <p className="text-xs text-slate-500">Pick a class, then toggle which subjects it offers.</p>
          </div>
          <select
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold focus:outline-none focus:ring-4 focus:ring-[#FF7F50]/10"
          >
            <option value="">Select a class...</option>
            {data.classes.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>

        {cls ? (
          <div className="flex flex-wrap gap-2">
            {data.subjects.map((subject) => {
              const on = assigned.has(subject.id);
              return (
                <button
                  key={subject.id}
                  onClick={() => toggle(subject.id)}
                  disabled={isSaving}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold border transition-all disabled:opacity-50 ${
                    on
                      ? "bg-[#FF7F50]/10 border-[#FF7F50]/40 text-[#FF7F50]"
                      : "bg-slate-50 border-slate-200 text-slate-400 hover:border-slate-300"
                  }`}
                >
                  {on ? <Check size={13} weight="bold" /> : <Plus size={13} />}
                  {subject.name}
                </button>
              );
            })}
          </div>
        ) : (
          <p className="text-sm text-slate-400 font-medium">Select a class to edit its subjects.</p>
        )}
      </div>

      {/* Catalogue */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {grouped.map((group) => (
          <div key={group.type} className="bg-white rounded-[2rem] border border-slate-100 shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <span className="text-[10px] font-black uppercase tracking-widest text-[#FF7F50] bg-[#FF7F50]/10 px-2.5 py-1 rounded-lg">
                {group.type}
              </span>
              <span className="text-xs font-bold text-slate-400">{group.items.length}</span>
            </div>
            <div className="flex flex-col gap-1.5">
              {group.items.map((subject) => (
                <div
                  key={subject.id}
                  className="group flex items-center justify-between px-3 py-2 rounded-lg hover:bg-slate-50 transition-colors"
                >
                  <span className="text-sm font-semibold text-slate-600">{subject.name}</span>
                  <button
                    onClick={() => remove(subject)}
                    className="p-1 text-slate-300 hover:text-red-500 rounded transition-colors opacity-0 group-hover:opacity-100"
                  >
                    <Trash size={14} weight="bold" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// -------------------------------------------------------------- Grading ---

function GradingTab({ data, run, isSaving }: TabProps) {
  const scale = data.gradingScales[0] ?? null;
  const [marks, setMarks] = useState("");
  const [result, setResult] = useState<{ grade: string; passed: boolean; passMark: number } | null>(null);

  const bands = [...(scale?.bands ?? [])].sort((a, b) => b.minMark - a.minMark);

  const lookUp = () => {
    const value = Number(marks);
    if (marks === "" || Number.isNaN(value) || value < 0 || value > 100) {
      return alert("Enter a percentage between 0 and 100.");
    }
    if (!scale) return;
    const band = bands.find((b) => value >= b.minMark && value <= b.maxMark);
    setResult({
      grade: band?.grade ?? "-",
      passed: value >= scale.passMark,
      passMark: scale.passMark,
    });
  };

  const updatePassMark = async (value: number) => {
    if (!scale) return;
    if (Number.isNaN(value) || value < 0 || value > 100) return alert("Pass mark must be 0-100.");
    await run(
      () =>
        apiRequest(`/academics/grading/${scale.id}`, {
          method: "PATCH",
          body: JSON.stringify({ passMark: value }),
        }),
      "Failed to update pass mark",
    );
  };

  if (!scale) return <ResourceError label="grading scale" message="No scale configured." />;

  return (
    <div className="flex flex-col gap-6">
      {/* Lookup */}
      <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm p-6 flex flex-col md:flex-row md:items-center gap-4">
        <div className="flex-1 space-y-2">
          <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 ml-1">
            Check a percentage
          </label>
          <div className="flex gap-2">
            <input
              type="number"
              min={0}
              max={100}
              value={marks}
              onChange={(e) => setMarks(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && lookUp()}
              placeholder="e.g. 85"
              className="w-32 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold focus:outline-none focus:ring-4 focus:ring-[#FF7F50]/10"
            />
            <button
              onClick={lookUp}
              className="px-5 py-3 bg-[#FF7F50] text-white rounded-xl font-bold text-sm hover:bg-[#e66a3e] transition-all"
            >
              Grade it
            </button>
          </div>
        </div>
        {result && (
          <div className="flex items-center gap-4 bg-slate-50 rounded-2xl px-5 py-4">
            <div className="text-center">
              <p className="text-2xl font-black text-[#FF7F50]">{result.grade}</p>
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Grade</p>
            </div>
            <div className="w-px h-10 bg-slate-200" />
            <div className="text-center">
              <p className={`text-lg font-black ${result.passed ? "text-emerald-500" : "text-rose-500"}`}>
                {result.passed ? "PASS" : "FAIL"}
              </p>
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                Pass {result.passMark}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Scale table */}
      <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-5">
          <div>
            <h4 className="text-base font-bold text-slate-900">{scale.name}</h4>
            <p className="text-xs text-slate-500">{bands.length} bands</p>
          </div>
          <div className="flex items-center gap-2">
            <label className="text-[11px] font-black uppercase tracking-widest text-slate-400">Pass mark</label>
            <input
              type="number"
              min={0}
              max={100}
              defaultValue={scale.passMark}
              key={scale.passMark}
              onBlur={(e) => {
                const next = Number(e.target.value);
                if (next !== scale.passMark) void updatePassMark(next);
              }}
              className="w-20 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm font-bold text-center focus:outline-none focus:ring-4 focus:ring-[#FF7F50]/10"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-[10px] font-black uppercase tracking-widest text-slate-400 border-b border-slate-100">
                <th className="pb-3 pr-4">Marks</th>
                <th className="pb-3 pr-4">Grade</th>
                <th className="pb-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {bands.map((band) => {
                const pass = band.minMark >= scale.passMark;
                return (
                  <tr key={band.id ?? band.minMark} className="border-b border-slate-50">
                    <td className="py-3 pr-4 font-bold text-slate-600">
                      {band.minMark} - {band.maxMark}
                    </td>
                    <td className="py-3 pr-4 font-black text-slate-900">{band.grade}</td>
                    <td className="py-3">
                      <span
                        className={`text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded ${
                          pass ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-500"
                        }`}
                      >
                        {pass ? "Pass" : "Fail"}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <p className="text-[11px] text-slate-400 font-medium mt-4">
          To edit the bands themselves, change them in the database — the API replaces bands only when the
          whole set is sent, which protects this scale from partial writes.
        </p>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------- Exams ---

function ExamsTab({ data, run, isSaving }: TabProps) {
  const [form, setForm] = useState({ name: "", appliesTo: "All grades (I - XII)", isTerm: false });
  const [showForm, setShowForm] = useState(false);

  const create = async () => {
    if (!form.name.trim()) return alert("Exam name is required.");
    const ok = await run(
      () =>
        apiRequest("/academics/exam-types", {
          method: "POST",
          body: JSON.stringify(form),
        }),
      "Failed to create exam type",
    );
    if (ok) {
      setForm({ name: "", appliesTo: "All grades (I - XII)", isTerm: false });
      setShowForm(false);
    }
  };

  const remove = async (exam: ExamType) => {
    if (!window.confirm(`Delete exam type "${exam.name}"?`)) return;
    await run(() => apiRequest(`/academics/exam-types/${exam.id}`, { method: "DELETE" }), "Failed to delete exam type");
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-end">
        <button
          onClick={() => setShowForm((v) => !v)}
          className="flex items-center gap-2 px-5 py-3 bg-[#FF7F50] text-white rounded-xl font-bold text-sm shadow-lg shadow-[#FF7F50]/20 hover:bg-[#e66a3e] transition-all"
        >
          {showForm ? <X size={16} weight="bold" /> : <Plus size={16} weight="bold" />}
          {showForm ? "Cancel" : "Add Exam Type"}
        </button>
      </div>

      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden"
          >
            <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
              <Field label="Exam name" value={form.name} onChange={(v) => setForm({ ...form, name: v })} placeholder="e.g. Periodic Test 4" />
              <div className="space-y-2">
                <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 ml-1">Applies to</label>
                <input
                  value={form.appliesTo}
                  onChange={(e) => setForm({ ...form, appliesTo: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-3.5 text-sm font-bold focus:outline-none focus:ring-4 focus:ring-[#FF7F50]/10"
                />
              </div>
              <label className="flex items-center gap-2 text-sm font-bold text-slate-600 pb-3.5">
                <input
                  type="checkbox"
                  checked={form.isTerm}
                  onChange={(e) => setForm({ ...form, isTerm: e.target.checked })}
                  className="w-4 h-4 accent-[#FF7F50]"
                />
                Counts as a term
              </label>
            </div>
            <div className="px-6 pb-6">
              <button
                onClick={create}
                disabled={isSaving}
                className="px-6 py-3 bg-slate-900 text-white rounded-xl font-bold text-sm hover:bg-slate-800 transition-all disabled:opacity-50"
              >
                {isSaving ? "Saving..." : "Save Exam Type"}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-[10px] font-black uppercase tracking-widest text-slate-400 bg-slate-50 border-b border-slate-100">
              <th className="px-6 py-3.5">#</th>
              <th className="px-6 py-3.5">Exam</th>
              <th className="px-6 py-3.5">Applies to</th>
              <th className="px-6 py-3.5">Term</th>
              <th className="px-6 py-3.5 text-right">Action</th>
            </tr>
          </thead>
          <tbody>
            {data.examTypes.map((exam, index) => (
              <tr key={exam.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                <td className="px-6 py-3.5 font-bold text-slate-400">{index + 1}</td>
                <td className="px-6 py-3.5 font-bold text-slate-700">{exam.name}</td>
                <td className="px-6 py-3.5 text-slate-500">{exam.appliesTo}</td>
                <td className="px-6 py-3.5">
                  {exam.isTerm ? (
                    <span className="text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded bg-[#FF7F50]/10 text-[#FF7F50]">
                      Term
                    </span>
                  ) : (
                    <span className="text-slate-300">—</span>
                  )}
                </td>
                <td className="px-6 py-3.5 text-right">
                  <button
                    onClick={() => remove(exam)}
                    className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-colors"
                  >
                    <Trash size={15} weight="bold" />
                  </button>
                </td>
              </tr>
            ))}
            {data.examTypes.length === 0 && (
              <tr>
                <td colSpan={5} className="px-6 py-10 text-center text-slate-400 font-medium">
                  No exam types defined yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// --------------------------------------------------------------- Medium ---

function MediumTab({ data, run, isSaving }: TabProps) {
  const [form, setForm] = useState<Medium>(data.medium);

  const save = async () => {
    await run(
      () =>
        apiRequest("/academics/medium", {
          method: "PATCH",
          body: JSON.stringify(form),
        }),
      "Failed to update medium of instruction",
    );
  };

  return (
    <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm p-6 max-w-2xl">
      <h4 className="text-base font-bold text-slate-900 mb-1">Medium of instruction</h4>
      <p className="text-xs text-slate-500 mb-6">
        Applies school-wide and appears on report cards and schedules.
      </p>

      <div className="space-y-5">
        <Field label="Primary medium" value={form.mediumOfInstruction} onChange={(v) => setForm({ ...form, mediumOfInstruction: v })} placeholder="English" />
        <Field label="Second language (from Grade 1)" value={form.secondLanguage} onChange={(v) => setForm({ ...form, secondLanguage: v })} placeholder="Tamil / Hindi / French" />
        <Field label="Board & curriculum" value={form.board} onChange={(v) => setForm({ ...form, board: v })} placeholder="CBSE" />
      </div>

      <button
        onClick={save}
        disabled={isSaving}
        className="mt-6 flex items-center gap-2 px-6 py-3 bg-[#FF7F50] text-white rounded-xl font-bold text-sm shadow-lg shadow-[#FF7F50]/20 hover:bg-[#e66a3e] transition-all disabled:opacity-50"
      >
        <Check size={16} weight="bold" /> {isSaving ? "Saving..." : "Save"}
      </button>
    </div>
  );
}

// ---------------------------------------------------------------- Field ---

function Field({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <div className="space-y-2">
      <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 ml-1">{label}</label>
      <input
        type="text"
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-3.5 text-sm font-bold focus:outline-none focus:ring-4 focus:ring-[#FF7F50]/10"
      />
    </div>
  );
}
