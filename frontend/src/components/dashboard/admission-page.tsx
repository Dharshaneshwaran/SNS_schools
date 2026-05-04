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
  Info,
  UsersThree,
  GraduationCap
} from "@phosphor-icons/react";
import { PageSection } from "./page-section";
import { createStudent } from "../../services/users-service";

type Step = 1 | 2 | 3 | 4;

export function AdmissionPage() {
  const [step, setStep] = useState<Step>(1);
  const [formData, setFormData] = useState({
    admissionNo: "",
    applicationNo: "",
    firstName: "",
    lastName: "",
    gender: "",
    grade: "", // Class to which admission is sought
    section: "A", // Default section
    dob: "",
    birthCertNo: "",
    nationality: "",
    religion: "",
    community: "",
    bloodGroup: "",
    presentSchool: "",
    previousGrade: "",
    boardOfEducation: "",
    motherTongue: "",
    // Father Details
    fatherName: "",
    fatherContact: "",
    fatherEmail: "",
    fatherEducation: "",
    fatherOccupation: "",
    fatherOrganization: "",
    fatherDesignation: "",
    fatherOfficeAddress: "",
    // Mother Details
    motherName: "",
    motherContact: "",
    motherEmail: "",
    motherEducation: "",
    motherOccupation: "",
    motherOrganization: "",
    motherDesignation: "",
    motherOfficeAddress: "",
  });
  const [isSaving, setIsSaving] = useState(false);

  const nextStep = () => setStep((prev) => (prev + 1) as Step);
  const prevStep = () => setStep((prev) => (prev - 1) as Step);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await createStudent({
        name: `${formData.firstName} ${formData.lastName}`.trim(),
        email: formData.fatherEmail || formData.motherEmail || `${formData.firstName.toLowerCase()}${Math.floor(Math.random()*1000)}@sns.edu`,
        department: "Academic",
        studentId: formData.admissionNo || `STU-${Math.floor(Math.random() * 10000)}`,
        class: formData.grade,
        section: formData.section,
        // Pass all other fields
        admissionNo: formData.admissionNo,
        applicationNo: formData.applicationNo,
        gender: formData.gender,
        dob: formData.dob,
        birthCertNo: formData.birthCertNo,
        nationality: formData.nationality,
        religion: formData.religion,
        community: formData.community,
        bloodGroup: formData.bloodGroup,
        presentSchool: formData.presentSchool,
        previousGrade: formData.previousGrade,
        boardOfEducation: formData.boardOfEducation,
        motherTongue: formData.motherTongue,
        fatherName: formData.fatherName,
        fatherContact: formData.fatherContact,
        fatherEmail: formData.fatherEmail,
        fatherEducation: formData.fatherEducation,
        fatherOccupation: formData.fatherOccupation,
        fatherOrganization: formData.fatherOrganization,
        fatherDesignation: formData.fatherDesignation,
        fatherOfficeAddress: formData.fatherOfficeAddress,
        motherName: formData.motherName,
        motherContact: formData.motherContact,
        motherEmail: formData.motherEmail,
        motherEducation: formData.motherEducation,
        motherOccupation: formData.motherOccupation,
        motherOrganization: formData.motherOrganization,
        motherDesignation: formData.motherDesignation,
        motherOfficeAddress: formData.motherOfficeAddress,
      });
      setStep(4);
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
      description="Register new students into the SNS Academy database using the official application form data."
    >
      <div className="max-w-5xl mx-auto">
        <div className="rounded-[2.5rem] border border-[var(--border)] bg-white overflow-hidden shadow-[0_24px_70px_rgba(15,23,42,0.05)]">
          
          {/* Header Area */}
          <div className="bg-slate-50 border-b border-slate-100 px-10 py-8">
             <div className="flex items-center justify-between">
                <div>
                   <h3 className="text-xl font-bold text-slate-900">Student Enrollment</h3>
                   <p className="text-sm text-slate-500">Step {step} of 4</p>
                </div>
                <div className="flex gap-2">
                   {[1, 2, 3, 4].map((s) => (
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
                  <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                    <div className="flex items-center gap-3 text-[#FF7F50]">
                       <IdentificationCard size={24} weight="duotone" />
                       <h4 className="font-bold text-lg">Student Data</h4>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <InputField label="Admission No" placeholder="e.g. ADM-2026-001" value={formData.admissionNo} onChange={(val) => setFormData({...formData, admissionNo: val})} />
                    <InputField label="Application No" placeholder="e.g. APP-89234" value={formData.applicationNo} onChange={(val) => setFormData({...formData, applicationNo: val})} />
                    
                    <InputField label="First Name" placeholder="e.g. Arjun" value={formData.firstName} onChange={(val) => setFormData({...formData, firstName: val})} />
                    <InputField label="Last Name" placeholder="e.g. Sharma" value={formData.lastName} onChange={(val) => setFormData({...formData, lastName: val})} />
                    
                    <div>
                      <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Gender</label>
                      <select 
                        className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 text-slate-900 outline-none focus:border-[#FF7F50] transition-colors appearance-none"
                        value={formData.gender}
                        onChange={(e) => setFormData({...formData, gender: e.target.value})}
                      >
                        <option value="">Select</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Others">Others</option>
                      </select>
                    </div>

                    <InputField label="Class for Admission" placeholder="e.g. Grade 8" value={formData.grade} onChange={(val) => setFormData({...formData, grade: val})} />
                    
                    <InputField label="Date of Birth" placeholder="DD/MM/YY" type="date" value={formData.dob} onChange={(val) => setFormData({...formData, dob: val})} />
                    <InputField label="Birth Certificate No" placeholder="e.g. BC-123456" value={formData.birthCertNo} onChange={(val) => setFormData({...formData, birthCertNo: val})} />
                    
                    <InputField label="Nationality" placeholder="e.g. Indian" value={formData.nationality} onChange={(val) => setFormData({...formData, nationality: val})} />
                    <InputField label="Religion" placeholder="e.g. Hindu" value={formData.religion} onChange={(val) => setFormData({...formData, religion: val})} />
                    
                    <div>
                      <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Community</label>
                      <select 
                        className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 text-slate-900 outline-none focus:border-[#FF7F50] transition-colors appearance-none"
                        value={formData.community}
                        onChange={(e) => setFormData({...formData, community: e.target.value})}
                      >
                        <option value="">Select</option>
                        <option value="BC">BC</option>
                        <option value="MBC">MBC</option>
                        <option value="SC">SC</option>
                        <option value="ST">ST</option>
                        <option value="Others">Others</option>
                      </select>
                    </div>
                    
                    <InputField label="Blood Group" placeholder="e.g. O+" value={formData.bloodGroup} onChange={(val) => setFormData({...formData, bloodGroup: val})} />
                    <InputField label="Mother Tongue" placeholder="e.g. Tamil" value={formData.motherTongue} onChange={(val) => setFormData({...formData, motherTongue: val})} />
                  </div>

                  <div className="flex justify-end pt-4 border-t border-slate-100">
                    <button 
                      onClick={nextStep}
                      disabled={!formData.firstName}
                      className="flex items-center gap-2 px-10 py-4 bg-[#FF7F50] text-white rounded-2xl font-bold shadow-lg shadow-[#FF7F50]/30 hover:bg-[#e66a3e] transition-all disabled:opacity-50"
                    >
                      Next: Education Details <CaretRight size={20} />
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
                  <div className="flex items-center gap-3 text-[#FF7F50] mb-2 border-b border-slate-100 pb-4">
                     <GraduationCap size={24} weight="duotone" />
                     <h4 className="font-bold text-lg">Previous Education Details</h4>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <InputField label="Name of Present School" placeholder="e.g. ABC Public School" value={formData.presentSchool} onChange={(val) => setFormData({...formData, presentSchool: val})} />
                    <InputField label="Currently Studying in Grade" placeholder="e.g. Grade 7" value={formData.previousGrade} onChange={(val) => setFormData({...formData, previousGrade: val})} />
                    <InputField label="Board of Education" placeholder="e.g. CBSE" value={formData.boardOfEducation} onChange={(val) => setFormData({...formData, boardOfEducation: val})} />
                  </div>

                  <div className="flex items-center justify-between pt-6 border-t border-slate-100">
                    <button onClick={prevStep} className="flex items-center gap-2 text-slate-500 font-bold hover:text-slate-900 transition-colors">
                      <CaretLeft size={20} /> Back
                    </button>
                    <button 
                      onClick={nextStep}
                      className="flex items-center gap-2 px-10 py-4 bg-[#FF7F50] text-white rounded-2xl font-bold shadow-lg shadow-[#FF7F50]/30 hover:bg-[#e66a3e] transition-all"
                    >
                      Next: Parent Details <CaretRight size={20} />
                    </button>
                  </div>
                </motion.div>
              )}

              {step === 3 && (
                <motion.div 
                  key="step3"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-8"
                >
                  <div className="flex items-center gap-3 text-[#FF7F50] mb-2 border-b border-slate-100 pb-4">
                     <UsersThree size={24} weight="duotone" />
                     <h4 className="font-bold text-lg">Parent's Details</h4>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    {/* Father Details */}
                    <div className="space-y-6">
                      <h5 className="font-black text-slate-800 uppercase tracking-widest text-sm bg-slate-50 p-3 rounded-lg border border-slate-100">Father/Guardian</h5>
                      <InputField label="Name" placeholder="Name" value={formData.fatherName} onChange={(val) => setFormData({...formData, fatherName: val})} />
                      <InputField label="Contact No" placeholder="+91 XXXXX" value={formData.fatherContact} onChange={(val) => setFormData({...formData, fatherContact: val})} />
                      <InputField label="Email" placeholder="email@example.com" value={formData.fatherEmail} onChange={(val) => setFormData({...formData, fatherEmail: val})} />
                      <InputField label="Educational Qualification" placeholder="e.g. M.Sc" value={formData.fatherEducation} onChange={(val) => setFormData({...formData, fatherEducation: val})} />
                      <InputField label="Occupation" placeholder="e.g. Engineer" value={formData.fatherOccupation} onChange={(val) => setFormData({...formData, fatherOccupation: val})} />
                      <InputField label="Organization" placeholder="Company Name" value={formData.fatherOrganization} onChange={(val) => setFormData({...formData, fatherOrganization: val})} />
                      <InputField label="Designation" placeholder="Job Title" value={formData.fatherDesignation} onChange={(val) => setFormData({...formData, fatherDesignation: val})} />
                      <InputField label="Office Address" placeholder="Address" value={formData.fatherOfficeAddress} onChange={(val) => setFormData({...formData, fatherOfficeAddress: val})} />
                    </div>

                    {/* Mother Details */}
                    <div className="space-y-6">
                      <h5 className="font-black text-slate-800 uppercase tracking-widest text-sm bg-slate-50 p-3 rounded-lg border border-slate-100">Mother/Guardian</h5>
                      <InputField label="Name" placeholder="Name" value={formData.motherName} onChange={(val) => setFormData({...formData, motherName: val})} />
                      <InputField label="Contact No" placeholder="+91 XXXXX" value={formData.motherContact} onChange={(val) => setFormData({...formData, motherContact: val})} />
                      <InputField label="Email" placeholder="email@example.com" value={formData.motherEmail} onChange={(val) => setFormData({...formData, motherEmail: val})} />
                      <InputField label="Educational Qualification" placeholder="e.g. B.Tech" value={formData.motherEducation} onChange={(val) => setFormData({...formData, motherEducation: val})} />
                      <InputField label="Occupation" placeholder="e.g. Doctor" value={formData.motherOccupation} onChange={(val) => setFormData({...formData, motherOccupation: val})} />
                      <InputField label="Organization" placeholder="Hospital Name" value={formData.motherOrganization} onChange={(val) => setFormData({...formData, motherOrganization: val})} />
                      <InputField label="Designation" placeholder="Job Title" value={formData.motherDesignation} onChange={(val) => setFormData({...formData, motherDesignation: val})} />
                      <InputField label="Office Address" placeholder="Address" value={formData.motherOfficeAddress} onChange={(val) => setFormData({...formData, motherOfficeAddress: val})} />
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
                      {isSaving ? "Saving..." : "Submit Application"}
                      <CheckCircle size={20} weight="fill" />
                    </button>
                  </div>
                </motion.div>
              )}

              {step === 4 && (
                <motion.div 
                  key="step4"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-10"
                >
                  <div className="inline-flex h-24 w-24 items-center justify-center rounded-full bg-emerald-50 text-emerald-500 mb-8">
                    <CheckCircle size={64} weight="fill" />
                  </div>
                  <h3 className="text-3xl font-bold text-slate-900 mb-4">Application Submitted</h3>
                  <p className="text-slate-500 max-w-sm mx-auto mb-10 leading-relaxed">
                    <span className="font-bold text-slate-900">{formData.firstName} {formData.lastName}</span> has been officially enrolled in {formData.grade}.
                  </p>
                  
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <button 
                      onClick={() => { 
                        setStep(1); 
                        setFormData({
                          admissionNo: "", applicationNo: "", firstName: "", lastName: "", gender: "", grade: "", section: "A", dob: "", birthCertNo: "", nationality: "", religion: "", community: "", bloodGroup: "", presentSchool: "", previousGrade: "", boardOfEducation: "", motherTongue: "", fatherName: "", fatherContact: "", fatherEmail: "", fatherEducation: "", fatherOccupation: "", fatherOrganization: "", fatherDesignation: "", fatherOfficeAddress: "", motherName: "", motherContact: "", motherEmail: "", motherEducation: "", motherOccupation: "", motherOrganization: "", motherDesignation: "", motherOfficeAddress: ""
                        }); 
                      }}
                      className="px-8 py-4 bg-[#FF7F50] text-white rounded-2xl font-bold shadow-lg shadow-[#FF7F50]/30 hover:bg-[#e66a3e] transition-all"
                    >
                      New Application
                    </button>
                    <button className="px-8 py-4 bg-white border border-slate-200 text-slate-700 rounded-2xl font-bold hover:bg-slate-50 transition-all">
                      Print Form
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
