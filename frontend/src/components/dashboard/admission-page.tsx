"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  UserPlus, 
  IdentificationCard, 
  Books, 
  CheckCircle,
  CaretRight,
  CaretLeft,
  UploadSimple,
  Info
} from "@phosphor-icons/react";
import { PageSection } from "./page-section";
import { createStudent } from "../../services/users-service";

type Step = 1 | 2 | 3;

export function AdmissionPage() {
  const [step, setStep] = useState<Step>(1);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    dob: "",
    gender: "",
    parentName: "",
    phone: "",
    email: "",
    grade: "",
    section: ""
  });
  const [isSaving, setIsSaving] = useState(false);

  const nextStep = () => setStep((prev) => (prev + 1) as Step);
  const prevStep = () => setStep((prev) => (prev - 1) as Step);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await createStudent({
        name: `${formData.firstName} ${formData.lastName}`,
        email: formData.email || `${formData.firstName.toLowerCase()}${Math.floor(Math.random()*1000)}@sns.edu`,
        department: "Academic",
        studentId: `STU-${Math.floor(Math.random() * 10000)}`,
        class: formData.grade,
        section: formData.section,
      });
      setStep(3);
    } catch (error) {
      alert(error instanceof Error ? error.message : "Failed to enroll student");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <PageSection
      eyebrow="Enrollment Management"
      title="Admission Flow"
      description="Register new students into the SNS Academy database following the official 3-step validation flow."
    >
      <div className="max-w-4xl mx-auto">
        <div className="rounded-[2.5rem] border border-[var(--border)] bg-white overflow-hidden shadow-[0_24px_70px_rgba(15,23,42,0.05)]">
          
          {/* Header Area */}
          <div className="bg-slate-50 border-b border-slate-100 px-10 py-8">
             <div className="flex items-center justify-between">
                <div>
                   <h3 className="text-xl font-bold text-slate-900">Student Enrollment</h3>
                   <p className="text-sm text-slate-500">Step {step} of 3</p>
                </div>
                <div className="flex gap-2">
                   {[1, 2, 3].map((s) => (
                     <div key={s} className={`h-1.5 w-12 rounded-full transition-all duration-500 ${step >= s ? "bg-[#FF7F50]" : "bg-slate-200"}`} />
                   ))}
                </div>
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
                     <h4 className="font-bold text-lg">Personal Details</h4>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <InputField 
                      label="First Name" 
                      placeholder="e.g. Arjun" 
                      value={formData.firstName}
                      onChange={(val) => setFormData({...formData, firstName: val})}
                    />
                    <InputField 
                      label="Last Name" 
                      placeholder="e.g. Sharma" 
                      value={formData.lastName}
                      onChange={(val) => setFormData({...formData, lastName: val})}
                    />
                    <InputField 
                      label="Date of Birth" 
                      placeholder="YYYY-MM-DD" 
                      type="date"
                      value={formData.dob}
                      onChange={(val) => setFormData({...formData, dob: val})}
                    />
                    <div>
                      <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Gender</label>
                      <select 
                        className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 text-slate-900 outline-none focus:border-[#FF7F50] transition-colors appearance-none"
                        value={formData.gender}
                        onChange={(e) => setFormData({...formData, gender: e.target.value})}
                      >
                        <option value="">Select Gender</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-slate-100">
                    <h4 className="font-bold text-slate-900 mb-6">Parent/Guardian Information</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <InputField 
                        label="Guardian Name" 
                        placeholder="e.g. Rajesh Sharma" 
                        value={formData.parentName}
                        onChange={(val) => setFormData({...formData, parentName: val})}
                      />
                      <InputField 
                        label="Phone Number" 
                        placeholder="+91 XXXXX XXXXX" 
                        value={formData.phone}
                        onChange={(val) => setFormData({...formData, phone: val})}
                      />
                    </div>
                  </div>

                  <div className="flex justify-end pt-4">
                    <button 
                      onClick={nextStep}
                      disabled={!formData.firstName || !formData.lastName}
                      className="flex items-center gap-2 px-10 py-4 bg-[#FF7F50] text-white rounded-2xl font-bold shadow-lg shadow-[#FF7F50]/30 hover:bg-[#e66a3e] transition-all disabled:opacity-50"
                    >
                      Assign Class <CaretRight size={20} />
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
                     <Books size={24} weight="duotone" />
                     <h4 className="font-bold text-lg">Academic Assignment</h4>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                     <div className="space-y-4">
                        <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest">Select Grade</label>
                        <div className="grid grid-cols-3 gap-3">
                           {["Grade 8", "Grade 9", "Grade 10"].map((g) => (
                             <button 
                               key={g}
                               onClick={() => setFormData({...formData, grade: g})}
                               className={`py-3 rounded-xl border-2 font-bold text-sm transition-all ${formData.grade === g ? "border-[#FF7F50] bg-[#FF7F50]/5 text-[#FF7F50]" : "border-slate-100 text-slate-400 hover:border-slate-200"}`}
                             >
                               {g}
                             </button>
                           ))}
                        </div>
                     </div>
                     <div className="space-y-4">
                        <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest">Select Section</label>
                        <div className="grid grid-cols-3 gap-3">
                           {["Section A", "Section B", "Section C"].map((s) => (
                             <button 
                               key={s}
                               onClick={() => setFormData({...formData, section: s})}
                               className={`py-3 rounded-xl border-2 font-bold text-sm transition-all ${formData.section === s ? "border-[#FF7F50] bg-[#FF7F50]/5 text-[#FF7F50]" : "border-slate-100 text-slate-400 hover:border-slate-200"}`}
                             >
                               {s}
                             </button>
                           ))}
                        </div>
                     </div>
                  </div>

                  <div className="p-6 rounded-2xl bg-amber-50 border border-amber-100 flex gap-4">
                     <Info size={24} className="text-amber-500 shrink-0" />
                     <p className="text-sm text-amber-700 leading-relaxed">
                        Once assigned, the student will be automatically added to the {formData.grade || 'selected grade'} roster and notification groups.
                     </p>
                  </div>

                  <div className="flex items-center justify-between pt-6 border-t border-slate-100">
                    <button onClick={prevStep} className="flex items-center gap-2 text-slate-500 font-bold hover:text-slate-900 transition-colors">
                      <CaretLeft size={20} /> Back
                    </button>
                    <button 
                      onClick={handleSave}
                      disabled={!formData.grade || !formData.section || isSaving}
                      className="flex items-center gap-2 px-10 py-4 bg-slate-900 text-white rounded-2xl font-bold shadow-xl hover:bg-slate-800 transition-all disabled:opacity-50"
                    >
                      {isSaving ? "Adding to System..." : "Complete Enrollment"}
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
                  <h3 className="text-3xl font-bold text-slate-900 mb-4">Registration Successful</h3>
                  <p className="text-slate-500 max-w-sm mx-auto mb-10 leading-relaxed">
                    <span className="font-bold text-slate-900">{formData.firstName} {formData.lastName}</span> has been officially enrolled in {formData.grade} - {formData.section}.
                  </p>
                  
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <button 
                      onClick={() => { setStep(1); setFormData({firstName: "", lastName: "", dob: "", gender: "", parentName: "", phone: "", email: "", grade: "", section: ""}); }}
                      className="px-8 py-4 bg-[#FF7F50] text-white rounded-2xl font-bold shadow-lg shadow-[#FF7F50]/30 hover:bg-[#e66a3e] transition-all"
                    >
                      Add Another Student
                    </button>
                    <button className="px-8 py-4 bg-white border border-slate-200 text-slate-700 rounded-2xl font-bold hover:bg-slate-50 transition-all">
                      Print ID Card
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
