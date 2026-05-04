"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Building2, 
  ShieldCheck, 
  BellRing, 
  Database,
  Palette,
  Save,
  CheckCircle2,
  AlertCircle
} from "lucide-react";
import { PageSection } from "./page-section";

const TABS = [
  { id: "general", label: "General", icon: Building2, desc: "Institution & academic info" },
  { id: "security", label: "Security", icon: ShieldCheck, desc: "Authentication & access" },
  { id: "notifications", label: "Notifications", icon: BellRing, desc: "Alerts & messaging" },
  { id: "appearance", label: "Appearance", icon: Palette, desc: "Theme & branding" },
  { id: "data", label: "Data Management", icon: Database, desc: "Backups & exports" }
];

export function SettingsPage() {
  const [activeTab, setActiveTab] = useState("general");
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // Form States (Mock)
  const [generalState, setGeneralState] = useState({
    institutionName: "SNS Academy",
    academicYear: "2026-2027",
    timezone: "Asia/Kolkata",
    contactEmail: "admin@snsacademy.edu.in",
    contactPhone: "+91 80000 12345"
  });

  const [securityState, setSecurityState] = useState({
    mfaEnabled: true,
    passwordExpiry: "90",
    sessionTimeout: "30",
    enforceStrongPass: true
  });

  const [notificationState, setNotificationState] = useState({
    emailAlerts: true,
    smsAlerts: true,
    attendanceNotify: true,
    feeReminders: true,
    examResults: false
  });

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    }, 1200);
  };

  return (
    <PageSection
      eyebrow="System Administration"
      title="Global Settings"
      description="Manage institution configurations, security protocols, and system-wide preferences."
    >
      <div className="flex flex-col xl:flex-row gap-8">
        
        {/* Settings Navigation Sidebar */}
        <div className="w-full xl:w-80 shrink-0 space-y-2">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-start gap-4 p-5 rounded-[2rem] transition-all text-left group ${
                activeTab === tab.id 
                  ? "bg-white border-2 border-[#FF7F50] shadow-lg shadow-[#FF7F50]/10" 
                  : "bg-slate-50 border-2 border-transparent hover:bg-white hover:border-slate-200"
              }`}
            >
              <div className={`p-3 rounded-2xl transition-colors ${
                activeTab === tab.id ? "bg-[#FF7F50] text-white" : "bg-white text-slate-400 group-hover:text-[#FF7F50]"
              }`}>
                <tab.icon size={22} strokeWidth={2.5} />
              </div>
              <div>
                <h3 className={`font-bold ${activeTab === tab.id ? "text-slate-900" : "text-slate-600"}`}>
                  {tab.label}
                </h3>
                <p className="text-xs text-slate-400 mt-1 font-medium">{tab.desc}</p>
              </div>
            </button>
          ))}
        </div>

        {/* Settings Content Area */}
        <div className="flex-1">
          <div className="bg-white rounded-[2.5rem] border border-slate-100 p-8 md:p-12 shadow-[0_24px_70px_rgba(15,23,42,0.05)] relative overflow-hidden">
            
            <AnimatePresence mode="wait">
              {activeTab === "general" && (
                <motion.div
                  key="general"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-8"
                >
                  <div className="mb-10">
                    <h2 className="text-2xl font-black text-slate-900 mb-2">Institution Profile</h2>
                    <p className="text-slate-500 font-medium">Update the core details of your educational institution.</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-3">
                      <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Institution Name</label>
                      <input 
                        type="text" 
                        value={generalState.institutionName}
                        onChange={e => setGeneralState({...generalState, institutionName: e.target.value})}
                        className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 text-sm font-bold text-slate-900 outline-none focus:border-[#FF7F50] focus:ring-4 focus:ring-[#FF7F50]/10 transition-all"
                      />
                    </div>
                    <div className="space-y-3">
                      <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Academic Year</label>
                      <select 
                        value={generalState.academicYear}
                        onChange={e => setGeneralState({...generalState, academicYear: e.target.value})}
                        className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 text-sm font-bold text-slate-900 outline-none focus:border-[#FF7F50] focus:ring-4 focus:ring-[#FF7F50]/10 transition-all appearance-none cursor-pointer"
                      >
                        <option>2024-2025</option>
                        <option>2025-2026</option>
                        <option>2026-2027</option>
                      </select>
                    </div>
                    <div className="space-y-3">
                      <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Timezone</label>
                      <input 
                        type="text" 
                        value={generalState.timezone}
                        onChange={e => setGeneralState({...generalState, timezone: e.target.value})}
                        className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 text-sm font-bold text-slate-900 outline-none focus:border-[#FF7F50] focus:ring-4 focus:ring-[#FF7F50]/10 transition-all"
                      />
                    </div>
                    <div className="space-y-3">
                      <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Admin Email</label>
                      <input 
                        type="email" 
                        value={generalState.contactEmail}
                        onChange={e => setGeneralState({...generalState, contactEmail: e.target.value})}
                        className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 text-sm font-bold text-slate-900 outline-none focus:border-[#FF7F50] focus:ring-4 focus:ring-[#FF7F50]/10 transition-all"
                      />
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === "security" && (
                <motion.div
                  key="security"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-8"
                >
                  <div className="mb-10 flex items-start justify-between">
                    <div>
                      <h2 className="text-2xl font-black text-slate-900 mb-2">Security & Access</h2>
                      <p className="text-slate-500 font-medium">Configure multi-factor authentication and password policies.</p>
                    </div>
                    <div className="p-3 bg-emerald-50 text-emerald-500 rounded-2xl">
                      <ShieldCheck size={32} />
                    </div>
                  </div>

                  <div className="space-y-6">
                    {/* Toggle Item */}
                    <div className="flex items-center justify-between p-6 rounded-[2rem] border border-slate-100 bg-slate-50 hover:border-slate-200 transition-colors">
                      <div>
                        <h4 className="font-bold text-slate-900">Multi-Factor Authentication (MFA)</h4>
                        <p className="text-sm text-slate-500 mt-1">Require MFA for all administrative staff accounts.</p>
                      </div>
                      <button 
                        onClick={() => setSecurityState({...securityState, mfaEnabled: !securityState.mfaEnabled})}
                        className={`w-14 h-8 rounded-full flex items-center p-1 transition-colors ${securityState.mfaEnabled ? "bg-[#FF7F50]" : "bg-slate-300"}`}
                      >
                        <div className={`w-6 h-6 rounded-full bg-white shadow-md transform transition-transform ${securityState.mfaEnabled ? "translate-x-6" : ""}`} />
                      </button>
                    </div>

                    <div className="flex items-center justify-between p-6 rounded-[2rem] border border-slate-100 bg-slate-50 hover:border-slate-200 transition-colors">
                      <div>
                        <h4 className="font-bold text-slate-900">Enforce Strong Passwords</h4>
                        <p className="text-sm text-slate-500 mt-1">Require 12+ chars, numbers, and special symbols.</p>
                      </div>
                      <button 
                        onClick={() => setSecurityState({...securityState, enforceStrongPass: !securityState.enforceStrongPass})}
                        className={`w-14 h-8 rounded-full flex items-center p-1 transition-colors ${securityState.enforceStrongPass ? "bg-[#FF7F50]" : "bg-slate-300"}`}
                      >
                        <div className={`w-6 h-6 rounded-full bg-white shadow-md transform transition-transform ${securityState.enforceStrongPass ? "translate-x-6" : ""}`} />
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
                      <div className="space-y-3">
                        <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Password Expiry (Days)</label>
                        <input 
                          type="number" 
                          value={securityState.passwordExpiry}
                          onChange={e => setSecurityState({...securityState, passwordExpiry: e.target.value})}
                          className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 text-sm font-bold text-slate-900 outline-none focus:border-[#FF7F50] focus:ring-4 focus:ring-[#FF7F50]/10 transition-all"
                        />
                      </div>
                      <div className="space-y-3">
                        <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Session Timeout (Mins)</label>
                        <input 
                          type="number" 
                          value={securityState.sessionTimeout}
                          onChange={e => setSecurityState({...securityState, sessionTimeout: e.target.value})}
                          className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 text-sm font-bold text-slate-900 outline-none focus:border-[#FF7F50] focus:ring-4 focus:ring-[#FF7F50]/10 transition-all"
                        />
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === "notifications" && (
                <motion.div
                  key="notifications"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-8"
                >
                  <div className="mb-10">
                    <h2 className="text-2xl font-black text-slate-900 mb-2">Communication Preferences</h2>
                    <p className="text-slate-500 font-medium">Control automated messaging and notification channels.</p>
                  </div>

                  <div className="space-y-4">
                    {[
                      { id: "emailAlerts", title: "Global Email Alerts", desc: "Allow system to send automated emails." },
                      { id: "smsAlerts", title: "Global SMS Alerts", desc: "Enable SMS gateways for critical updates." },
                      { id: "attendanceNotify", title: "Automated Attendance Alerts", desc: "Notify parents immediately if a student is marked absent." },
                      { id: "feeReminders", title: "Automated Fee Reminders", desc: "Send invoice reminders 7 days before due dates." },
                      { id: "examResults", title: "Publish Exam Results", desc: "Automatically notify students when grades are posted." },
                    ].map((item) => (
                      <div key={item.id} className="flex items-center justify-between p-6 rounded-[2rem] border border-slate-100 bg-slate-50">
                        <div>
                          <h4 className="font-bold text-slate-900">{item.title}</h4>
                          <p className="text-sm text-slate-500 mt-1">{item.desc}</p>
                        </div>
                        <button 
                          onClick={() => setNotificationState({...notificationState, [item.id]: !(notificationState as any)[item.id]})}
                          className={`w-14 h-8 rounded-full flex items-center p-1 transition-colors ${(notificationState as any)[item.id] ? "bg-[#FF7F50]" : "bg-slate-300"}`}
                        >
                          <div className={`w-6 h-6 rounded-full bg-white shadow-md transform transition-transform ${(notificationState as any)[item.id] ? "translate-x-6" : ""}`} />
                        </button>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {(activeTab === "appearance" || activeTab === "data") && (
                <motion.div
                  key="placeholder"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="py-20 flex flex-col items-center justify-center text-center"
                >
                  <div className="w-24 h-24 rounded-full bg-slate-50 flex items-center justify-center text-slate-300 mb-6">
                    {activeTab === "appearance" ? <Palette size={40} /> : <Database size={40} />}
                  </div>
                  <h2 className="text-2xl font-black text-slate-900 mb-2">
                    {activeTab === "appearance" ? "Brand Customization" : "Database Management"}
                  </h2>
                  <p className="text-slate-500 max-w-sm">
                    This module is currently being provisioned for your tenant. Advanced {activeTab} settings will be available shortly.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Sticky Action Footer */}
            <div className="mt-12 pt-8 border-t border-slate-100 flex items-center justify-between">
               {showSuccess ? (
                 <motion.div 
                   initial={{ opacity: 0, x: -10 }}
                   animate={{ opacity: 1, x: 0 }}
                   className="flex items-center gap-3 text-emerald-500 font-bold"
                 >
                   <CheckCircle2 size={24} />
                   <span>Settings saved successfully!</span>
                 </motion.div>
               ) : (
                 <div className="flex items-center gap-2 text-slate-400 font-medium text-sm">
                   <AlertCircle size={16} />
                   <span>Unsaved changes will be lost.</span>
                 </div>
               )}

               <button
                 onClick={handleSave}
                 disabled={isSaving || showSuccess}
                 className="flex items-center gap-3 px-8 py-4 bg-[#FF7F50] hover:bg-[#FF6A00] text-white font-black uppercase tracking-widest text-xs rounded-2xl shadow-xl shadow-[#FF7F50]/20 transition-all disabled:opacity-50"
               >
                 {isSaving ? (
                   <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                 ) : (
                   <Save size={18} />
                 )}
                 {isSaving ? "Saving..." : "Save Settings"}
               </button>
            </div>

          </div>
        </div>
      </div>
    </PageSection>
  );
}
