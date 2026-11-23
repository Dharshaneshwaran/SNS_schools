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
  Plus,
  MagicWand,
  UserList,
  FileText,
  Users,
  UserPlus,
  Calendar,
  Bell,
  GraduationCap,
  Bus,
  Clock,
  CalendarCheck,
  ChatCircleDots,
  Gear,
  ChartBar
} from "@phosphor-icons/react";
import { PageSection } from "./page-section";
import { createTeacher } from "../../services/users-service";

type Step = 1 | 2 | 3;

export function StaffPage() {
  const [step, setStep] = useState<Step>(1);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    department: "",
    employeeId: "",
    password: "",
    dateOfBirth: "",
    weddingDate: "",
    role: "teacher",
    designation: "Faculty",
    permissions: ["view_attendance", "view_reports"]
  });
  const [isSaving, setIsSaving] = useState(false);

  const nextStep = () => setStep((prev) => (prev + 1) as Step);
  const prevStep = () => setStep((prev) => (prev - 1) as Step);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await createTeacher({
        name: formData.fullName,
        email: formData.email,
        department: formData.department,
        employeeId: formData.employeeId || `STAFF-${Math.floor(Math.random() * 10000)}`,
        designation: formData.designation || "Faculty",
        specialization: formData.department,
        password: formData.password,
        dateOfBirth: formData.dateOfBirth,
        weddingDate: formData.weddingDate,
      });
      setStep(3);
    } catch (error) {
      alert(error instanceof Error ? error.message : "Failed to create staff member");
    } finally {
      setIsSaving(false);
    }
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
                    <div className="relative group">
                      <InputField 
                        label="Employee ID" 
                        placeholder="e.g. SNS-T-2024" 
                        value={formData.employeeId}
                        onChange={(val) => setFormData({...formData, employeeId: val})}
                      />
                      <button 
                        onClick={() => setFormData({...formData, employeeId: `TCH-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`})}
                        className="absolute right-3 top-[34px] p-2 text-slate-300 hover:text-[#FF7F50] transition-colors"
                        title="Auto-generate ID"
                      >
                        <MagicWand size={18} weight="duotone" />
                      </button>
                    </div>
                    <div className="relative group">
                      <InputField 
                        label="Account Password" 
                        placeholder="••••••••" 
                        type="text"
                        value={formData.password}
                        onChange={(val) => setFormData({...formData, password: val})}
                      />
                      <button 
                        onClick={() => {
                          const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%";
                          let pass = "";
                          for(let i=0; i<10; i++) pass += chars[Math.floor(Math.random() * chars.length)];
                          setFormData({...formData, password: pass});
                        }}
                        className="absolute right-3 top-[34px] p-2 text-slate-300 hover:text-[#FF7F50] transition-colors"
                        title="Generate Secure Password"
                      >
                        <MagicWand size={18} weight="duotone" />
                      </button>
                    </div>
                    <InputField 
                      label="Phone Number" 
                      placeholder="+91 XXXXX XXXXX" 
                      value={formData.phone}
                      onChange={(val) => setFormData({...formData, phone: val})}
                    />
                    <InputField 
                      label="Date of Birth" 
                      type="date"
                      placeholder="YYYY-MM-DD" 
                      value={formData.dateOfBirth}
                      onChange={(val) => setFormData({...formData, dateOfBirth: val})}
                    />
                    <InputField 
                      label="Wedding Date (Anniversary)" 
                      type="date"
                      placeholder="YYYY-MM-DD" 
                      value={formData.weddingDate}
                      onChange={(val) => setFormData({...formData, weddingDate: val})}
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

                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Designation</label>
                    <select
                      className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 text-slate-900 outline-none focus:border-[#FF7F50] transition-colors appearance-none"
                      value={formData.designation}
                      onChange={(e) => setFormData({...formData, designation: e.target.value})}
                    >
                      <option value="Faculty">Faculty</option>
                      <option value="Principal">Principal</option>
                      <option value="Coordinator">Coordinator</option>
                      <option value="Head of Department">Head of Department</option>
                      <option value="Office Assistant">Office Assistant</option>
                      <option value="Support Staff">Support Staff</option>
                    </select>
                  </div>

                  <div className="flex justify-end pt-4">
                    <button 
                      onClick={nextStep}
                      disabled={!formData.fullName || !formData.email || !formData.employeeId || !formData.password}
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
                     <div className="space-y-6">
                        <div>
                           <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-3">Role Group Template</label>
                           <div className="relative group">
                             <select 
                               className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 text-sm font-bold text-slate-900 outline-none focus:border-[#FF7F50] transition-all appearance-none cursor-pointer"
                               onChange={(e) => {
                                 const selected = e.target.value;
                                 if (selected === "custom") return;
                                 const templates: Record<string, string[]> = {
                                   "senior": ["view_attendance", "view_reports", "timetable_edit"],
                                   "admin": ["manage_students", "admission_access", "finance_access", "staff_management"],
                                   "head": ["view_attendance", "view_reports", "staff_management", "exam_control", "broadcast_access"],
                                   "junior": ["view_attendance", "view_reports"]
                                 };
                                 setFormData({...formData, permissions: templates[selected] || []});
                               }}
                             >
                               <option value="custom">-- Select Assignment Group --</option>
                               <option value="senior">Senior Faculty Template</option>
                               <option value="admin">Office Administration Group</option>
                               <option value="head">Department Head Group</option>
                               <option value="junior">Junior Teacher Template</option>
                             </select>
                             <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                               <Plus size={16} weight="bold" />
                             </div>
                           </div>
                        </div>

                        <div className="space-y-4 pt-4 border-t border-slate-50">
                           <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest">Primary Identity Role</label>
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
                     </div>
                     <div className="space-y-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <label className="block text-xs font-black text-slate-400 uppercase tracking-widest">Advanced Feature Access</label>
                            <p className="text-[10px] text-slate-500 font-medium mt-1 italic">Assign module-level permissions for this faculty member.</p>
                          </div>
                          <div className="flex gap-2">
                            <button onClick={() => setFormData({...formData, permissions: [
                              "view_attendance", "view_reports", "manage_students", "admission_access", 
                              "staff_management", "timetable_edit", "finance_access", "broadcast_access", 
                              "exam_control", "transport_view"
                            ]})} className="text-[10px] font-black text-[#FF7F50] uppercase tracking-widest hover:underline">Select All</button>
                            <span className="text-slate-200">|</span>
                            <button onClick={() => setFormData({...formData, permissions: []})} className="text-[10px] font-black text-slate-400 uppercase tracking-widest hover:underline">Clear All</button>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                           {[
                             { id: "view_attendance", label: "Attendance", icon: <UserList size={24} weight="duotone" />, desc: "Track Presence" },
                             { id: "view_reports", label: "Reports", icon: <FileText size={24} weight="duotone" />, desc: "Generate Data" },
                             { id: "manage_students", label: "Students", icon: <GraduationCap size={24} weight="duotone" />, desc: "Class Directory" },
                             { id: "timetable_edit", label: "Timetable", icon: <Clock size={24} weight="duotone" />, desc: "Set Schedules" },
                             { id: "calendar_access", label: "Calendar", icon: <CalendarCheck size={24} weight="duotone" />, desc: "School Events" },
                             { id: "broadcast_access", label: "Notifications", icon: <Bell size={24} weight="duotone" />, desc: "Broadcast Hub" },
                             { id: "exam_control", label: "Results", icon: <ChartBar size={24} weight="duotone" />, desc: "Publish Marks" },
                             { id: "transport_view", label: "Transport", icon: <Bus size={24} weight="duotone" />, desc: "Track Routes" },
                             { id: "chat_access", label: "Chat", icon: <ChatCircleDots size={24} weight="duotone" />, desc: "Communication" },
                             { id: "settings_access", label: "Settings", icon: <Gear size={24} weight="duotone" />, desc: "User Preferences" },
                           ].map((p) => {
                             const isActive = formData.permissions.includes(p.id);
                             return (
                               <button 
                                 key={p.id}
                                 onClick={() => togglePermission(p.id)}
                                 className={`flex flex-col items-center gap-3 p-5 rounded-[2rem] border-2 transition-all text-center group relative ${
                                   isActive 
                                     ? "border-[#FF7F50] bg-white shadow-xl shadow-[#FF7F50]/10" 
                                     : "border-slate-50 bg-slate-50/50 hover:border-slate-100 hover:bg-white"
                                 }`}
                               >
                                 <div className={`transition-colors ${isActive ? "text-[#FF7F50]" : "text-slate-400 group-hover:text-slate-600"}`}>
                                   {p.icon}
                                 </div>
                                 <div>
                                   <div className={`text-xs font-bold transition-colors ${isActive ? "text-slate-900" : "text-slate-500"}`}>{p.label}</div>
                                   <div className="text-[8px] font-bold text-slate-400 uppercase tracking-tighter mt-0.5">{p.desc}</div>
                                 </div>
                                 
                                 {/* Minimal Toggle Switch at bottom */}
                                 <div className={`mt-2 w-8 h-4 rounded-full transition-colors relative ${isActive ? "bg-[#FF7F50]" : "bg-slate-200"}`}>
                                   <div className={`absolute top-0.5 w-3 h-3 rounded-full bg-white transition-all ${isActive ? "left-4.5" : "left-0.5"}`} />
                                 </div>
                               </button>
                             );
                           })}
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
                      onClick={() => { setStep(1); setFormData({fullName: "", email: "", phone: "", department: "", employeeId: "", password: "", dateOfBirth: "", weddingDate: "", role: "teacher", designation: "Faculty", permissions: ["view_attendance", "view_reports"]}); }}
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
