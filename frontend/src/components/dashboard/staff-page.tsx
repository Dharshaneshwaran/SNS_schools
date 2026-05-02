"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ChalkboardTeacher, 
  IdentificationCard, 
  ShieldCheck, 
  CheckCircle,
  CaretRight,
  CaretLeft,
  UserGear,
  Plus
} from "@phosphor-icons/react";
import { PageSection } from "./page-section";

type Step = 1 | 2 | 3;

export function StaffPage() {
  const [step, setStep] = useState<Step>(1);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    department: "",
    role: "teacher",
    permissions: ["view_attendance", "view_reports"]
  });
  const [isSaving, setIsSaving] = useState(false);

  const nextStep = () => setStep((prev) => (prev + 1) as Step);
  const prevStep = () => setStep((prev) => (prev - 1) as Step);

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      setStep(3);
    }, 2000);
  };

  const togglePermission = (p: string) => {
    if (formData.permissions.includes(p)) {
      setFormData({...formData, permissions: formData.permissions.filter(x => x !== p)});
    } else {
      setFormData({...formData, permissions: [...formData.permissions, p]});
    }
  };

  return (
    <PageSection
      eyebrow="Faculty & Admin"
      title="Staff Management"
      description="Onboard new faculty members and configure their system access levels and responsibilities."
    >
      <div className="max-w-4xl mx-auto">
        <div className="rounded-[2.5rem] border border-[var(--border)] bg-white overflow-hidden shadow-[0_24px_70px_rgba(15,23,42,0.05)]">
          
          <div className="bg-slate-50 border-b border-slate-100 px-10 py-8 flex items-center justify-between">
             <div>
                <h3 className="text-xl font-bold text-slate-900">Faculty Registration</h3>
                <p className="text-sm text-slate-500 font-medium">Configure roles and permissions</p>
             </div>
             <div className="flex gap-2">
                {[1, 2, 3].map((s) => (
                  <div key={s} className={`h-1.5 w-12 rounded-full transition-all duration-500 ${step >= s ? "bg-[#FF7F50]" : "bg-slate-200"}`} />
                ))}
             </div>
          </div>

          <div className="p-10">
            <AnimatePresence mode="wait">
              {step === 1 && (
                <motion.div 
                  key="step1"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-8"
                >
                  <div className="flex items-center gap-3 text-[#FF7F50] mb-2">
                     <IdentificationCard size={24} weight="duotone" />
                     <h4 className="font-bold text-lg">Employee Details</h4>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <InputField 
                      label="Full Name" 
                      placeholder="e.g. Dr. Sarah Connor" 
                      value={formData.fullName}
                      onChange={(val) => setFormData({...formData, fullName: val})}
                    />
                    <InputField 
                      label="Professional Email" 
                      placeholder="sarah.c@sns-academy.edu" 
                      value={formData.email}
                      onChange={(val) => setFormData({...formData, email: val})}
                    />
                    <InputField 
                      label="Phone Number" 
                      placeholder="+91 XXXXX XXXXX" 
                      value={formData.phone}
                      onChange={(val) => setFormData({...formData, phone: val})}
                    />
                    <div>
                      <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Department</label>
                      <select 
                        className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 text-slate-900 outline-none focus:border-[#FF7F50] transition-colors appearance-none"
                        value={formData.department}
                        onChange={(e) => setFormData({...formData, department: e.target.value})}
                      >
                        <option value="">Select Department</option>
                        <option value="math">Mathematics</option>
                        <option value="science">Science</option>
                        <option value="humanities">Humanities</option>
                        <option value="admin">Administration</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex justify-end pt-4">
                    <button 
                      onClick={nextStep}
                      disabled={!formData.fullName || !formData.email}
                      className="flex items-center gap-2 px-10 py-4 bg-[#FF7F50] text-white rounded-2xl font-bold shadow-lg shadow-[#FF7F50]/30 hover:bg-[#e66a3e] transition-all disabled:opacity-50"
                    >
                      Set Permissions <CaretRight size={20} />
                    </button>
                  </div>
                </motion.div>
              )}

              {step === 2 && (
                <motion.div 
                  key="step2"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-8"
                >
                  <div className="flex items-center gap-3 text-[#FF7F50] mb-2">
                     <ShieldCheck size={24} weight="duotone" />
                     <h4 className="font-bold text-lg">Role & Access Control</h4>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                     <div className="space-y-4">
                        <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest">Select Primary Role</label>
                        <div className="flex flex-col gap-3">
                           {[
                             { id: "teacher", label: "Teacher", desc: "Access to classes & grading" },
                             { id: "dept_head", label: "Department Head", desc: "Approve leaves & syllabus" },
                             { id: "admin", label: "Office Admin", desc: "Manage fees & admissions" },
                           ].map((r) => (
                             <button 
                               key={r.id}
                               onClick={() => setFormData({...formData, role: r.id})}
                               className={`flex items-center gap-4 p-4 rounded-2xl border-2 text-left transition-all ${formData.role === r.id ? "border-[#FF7F50] bg-[#FF7F50]/5" : "border-slate-50 hover:border-slate-100"}`}
                             >
                               <div className={`h-10 w-10 rounded-xl flex items-center justify-center ${formData.role === r.id ? "bg-[#FF7F50] text-white" : "bg-slate-100 text-slate-400"}`}>
                                  <UserGear size={24} />
                               </div>
                               <div>
                                  <div className="text-sm font-bold text-slate-900">{r.label}</div>
                                  <p className="text-[10px] text-slate-500 font-medium">{r.desc}</p>
                               </div>
                             </button>
                           ))}
                        </div>
                     </div>
                     <div className="space-y-4">
                        <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest">Advanced Permissions</label>
                        <div className="grid grid-cols-1 gap-2">
                           {[
                             { id: "view_attendance", label: "Attendance Tracking" },
                             { id: "view_reports", label: "Generate Academic Reports" },
                             { id: "manage_students", label: "Edit Student Records" },
                             { id: "finance_access", label: "View Fee Status" },
                           ].map((p) => (
                             <button 
                               key={p.id}
                               onClick={() => togglePermission(p.id)}
                               className={`flex items-center justify-between p-3 rounded-xl border font-bold text-xs transition-all ${formData.permissions.includes(p.id) ? "border-[#FF7F50] bg-[#FF7F50]/5 text-[#FF7F50]" : "border-slate-100 text-slate-400"}`}
                             >
                               {p.label}
                               {formData.permissions.includes(p.id) ? <CheckCircle size={16} weight="fill" /> : <Plus size={16} />}
                             </button>
                           ))}
                        </div>
                     </div>
                  </div>

                  <div className="flex items-center justify-between pt-6 border-t border-slate-100">
                    <button onClick={prevStep} className="flex items-center gap-2 text-slate-500 font-bold hover:text-slate-900 transition-colors">
                      <CaretLeft size={20} /> Back
                    </button>
                    <button 
                      onClick={handleSave}
                      disabled={isSaving}
                      className="flex items-center gap-2 px-10 py-4 bg-slate-900 text-white rounded-2xl font-bold shadow-xl hover:bg-slate-800 transition-all disabled:opacity-50"
                    >
                      {isSaving ? "Creating Account..." : "Finalize Staff Record"}
                      <CheckCircle size={20} weight="fill" />
                    </button>
                  </div>
                </motion.div>
              )}

              {step === 3 && (
                <motion.div 
                  key="step3"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-10"
                >
                  <div className="inline-flex h-24 w-24 items-center justify-center rounded-full bg-emerald-50 text-emerald-500 mb-8">
                    <CheckCircle size={64} weight="fill" />
                  </div>
                  <h3 className="text-3xl font-bold text-slate-900 mb-4">Onboarding Complete</h3>
                  <p className="text-slate-500 max-w-sm mx-auto mb-10 leading-relaxed">
                    Account for <span className="font-bold text-slate-900">{formData.fullName}</span> has been created. Credentials have been sent to their email.
                  </p>
                  
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <button 
                      onClick={() => { setStep(1); setFormData({fullName: "", email: "", phone: "", department: "", role: "teacher", permissions: ["view_attendance", "view_reports"]}); }}
                      className="px-8 py-4 bg-[#FF7F50] text-white rounded-2xl font-bold shadow-lg shadow-[#FF7F50]/30 hover:bg-[#e66a3e] transition-all"
                    >
                      Add Another Member
                    </button>
                    <button className="px-8 py-4 bg-white border border-slate-200 text-slate-700 rounded-2xl font-bold hover:bg-slate-50 transition-all">
                      View Staff Directory
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </PageSection>
  );
}

function InputField({ label, placeholder, value, onChange, type = "text" }: { label: string, placeholder: string, value: string, onChange: (v: string) => void, type?: string }) {
  return (
    <div className="space-y-2">
      <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest">{label}</label>
      <input 
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 text-slate-900 placeholder:text-slate-300 outline-none focus:border-[#FF7F50] transition-colors"
      />
    </div>
  );
}
