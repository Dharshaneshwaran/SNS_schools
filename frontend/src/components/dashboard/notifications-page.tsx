"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Bell, 
  Users, 
  UserCircle, 
  PaperPlaneTilt, 
  CheckCircle,
  CaretRight,
  CaretLeft,
  ClockCounterClockwise
} from "@phosphor-icons/react";
import { PageSection } from "./page-section";

type Step = 1 | 2 | 3 | 4;

export function NotificationsPage() {
  const [step, setStep] = useState<Step>(1);
  const [type, setType] = useState<"general" | "class">("general");
  const [audience, setAudience] = useState<"parents" | "staff" | "both">("both");
  const [message, setMessage] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [isSent, setIsSent] = useState(false);

  const nextStep = () => setStep((prev) => (prev + 1) as Step);
  const prevStep = () => setStep((prev) => (prev - 1) as Step);

  const handleSend = () => {
    setIsSending(true);
    setTimeout(() => {
      setIsSending(false);
      setIsSent(true);
      setStep(4);
    }, 1500);
  };

  return (
    <PageSection
      eyebrow="Communication Hub"
      title="Notifications Flow"
      description="Broadcast important updates across SNS Academy following the structured multi-step flow."
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Step-by-Step Flow Container */}
        <div className="lg:col-span-8">
          <div className="rounded-[2rem] border border-[var(--border)] bg-white p-8 shadow-[0_24px_70px_rgba(15,23,42,0.05)]">
            
            {/* Progress Stepper */}
            <div className="flex items-center justify-between mb-12 px-4 relative">
              <div className="absolute top-1/2 left-0 w-full h-0.5 bg-slate-100 -translate-y-1/2 -z-0" />
              {[1, 2, 3, 4].map((s) => (
                <div 
                  key={s} 
                  className={`relative z-10 flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold transition-all duration-500 ${
                    step >= s ? "bg-[#FF7F50] text-white shadow-lg shadow-[#FF7F50]/30" : "bg-white border-2 border-slate-200 text-slate-400"
                  }`}
                >
                  {step > s ? <CheckCircle size={20} weight="fill" /> : s}
                </div>
              ))}
            </div>

            <AnimatePresence mode="wait">
              {step === 1 && (
                <motion.div 
                  key="step1"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <h3 className="text-xl font-bold text-slate-900">Step 1: Select Notification Type</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <button 
                      onClick={() => { setType("general"); nextStep(); }}
                      className={`p-6 rounded-3xl border-2 text-left transition-all ${
                        type === "general" ? "border-[#FF7F50] bg-[#FF7F50]/5" : "border-slate-100 hover:border-slate-200"
                      }`}
                    >
                      <Bell size={32} className="text-[#FF7F50] mb-4" weight="duotone" />
                      <div className="font-bold text-slate-900 text-lg">General Alert</div>
                      <p className="text-sm text-slate-500 mt-1">Broadcast to the entire school community.</p>
                    </button>
                    <button 
                      onClick={() => { setType("class"); nextStep(); }}
                      className={`p-6 rounded-3xl border-2 text-left transition-all ${
                        type === "class" ? "border-[#FF7F50] bg-[#FF7F50]/5" : "border-slate-100 hover:border-slate-200"
                      }`}
                    >
                      <Users size={32} className="text-[#FF7F50] mb-4" weight="duotone" />
                      <div className="font-bold text-slate-900 text-lg">Class-wise</div>
                      <p className="text-sm text-slate-500 mt-1">Target specific grades or sections.</p>
                    </button>
                  </div>
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
                  <h3 className="text-xl font-bold text-slate-900">Step 2: Select Audience</h3>
                  <div className="flex flex-col gap-3">
                    {[
                      { id: "parents", label: "Parents Only", desc: "Send to all registered parents", icon: <UserCircle size={24} /> },
                      { id: "staff", label: "Staff Only", desc: "Internal teacher & admin memo", icon: <Users size={24} /> },
                      { id: "both", label: "Parents & Staff", desc: "Unified school communication", icon: <CheckCircle size={24} /> },
                    ].map((opt) => (
                      <button 
                        key={opt.id}
                        onClick={() => { setAudience(opt.id as any); nextStep(); }}
                        className={`flex items-center gap-4 p-5 rounded-2xl border-2 text-left transition-all ${
                          audience === opt.id ? "border-[#FF7F50] bg-[#FF7F50]/5" : "border-slate-100 hover:border-slate-200"
                        }`}
                      >
                        <div className={`p-3 rounded-xl ${audience === opt.id ? "bg-[#FF7F50] text-white" : "bg-slate-100 text-slate-500"}`}>
                          {opt.icon}
                        </div>
                        <div>
                          <div className="font-bold text-slate-900">{opt.label}</div>
                          <p className="text-xs text-slate-500">{opt.desc}</p>
                        </div>
                        <CaretRight size={20} className="ml-auto text-slate-300" />
                      </button>
                    ))}
                  </div>
                  <button onClick={prevStep} className="flex items-center gap-2 text-slate-500 font-semibold text-sm mt-4 hover:text-slate-900 transition-colors">
                    <CaretLeft size={16} /> Go Back
                  </button>
                </motion.div>
              )}

              {step === 3 && (
                <motion.div 
                  key="step3"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <h3 className="text-xl font-bold text-slate-900">Step 3: Compose Message</h3>
                  <div className="space-y-4">
                    <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
                      <div className="flex items-center gap-2 mb-3">
                         <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Targeting:</span>
                         <span className="text-[10px] font-bold uppercase bg-[#FF7F50]/10 text-[#FF7F50] px-2 py-0.5 rounded-full">{type}</span>
                         <span className="text-[10px] font-bold uppercase bg-[#FF7F50]/10 text-[#FF7F50] px-2 py-0.5 rounded-full">{audience}</span>
                      </div>
                      <textarea 
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Type your official announcement here..."
                        className="w-full h-48 bg-transparent border-none focus:ring-0 text-slate-900 placeholder-slate-400 resize-none text-base"
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <button onClick={prevStep} className="flex items-center gap-2 text-slate-500 font-semibold text-sm hover:text-slate-900 transition-colors">
                        <CaretLeft size={16} /> Edit Settings
                      </button>
                      <button 
                        onClick={handleSend}
                        disabled={!message || isSending}
                        className="flex items-center gap-2 px-8 py-3 bg-[#FF7F50] text-white rounded-2xl font-bold shadow-lg shadow-[#FF7F50]/30 hover:bg-[#e66a3e] disabled:opacity-50 disabled:shadow-none transition-all"
                      >
                        {isSending ? "Delivering..." : "Send Notification"}
                        <PaperPlaneTilt size={20} weight="fill" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}

              {step === 4 && (
                <motion.div 
                  key="step4"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-12"
                >
                  <div className="inline-flex h-24 w-24 items-center justify-center rounded-full bg-emerald-50 text-emerald-500 mb-6">
                    <CheckCircle size={64} weight="fill" />
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900 mb-2">Notification Sent!</h3>
                  <p className="text-slate-500 max-w-sm mx-auto">
                    Your message has been delivered to {audience} and stored in the communication history.
                  </p>
                  <div className="mt-10 flex flex-col sm:flex-row gap-3 justify-center">
                    <button 
                      onClick={() => { setStep(1); setMessage(""); }}
                      className="px-6 py-3 bg-slate-900 text-white rounded-2xl font-bold hover:bg-slate-800 transition-colors"
                    >
                      New Notification
                    </button>
                    <button className="px-6 py-3 border border-slate-200 text-slate-600 rounded-2xl font-bold hover:bg-slate-50 transition-colors">
                      View History
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Sidebar: History Snippet */}
        <div className="lg:col-span-4 space-y-6">
          <div className="rounded-[2rem] border border-[var(--border)] bg-white p-6 shadow-[0_24px_70px_rgba(15,23,42,0.05)]">
            <h4 className="font-bold text-slate-900 mb-6 flex items-center gap-2">
              <ClockCounterClockwise size={20} className="text-[#FF7F50]" />
              Recent History
            </h4>
            <div className="space-y-4">
               {[
                 { title: "Annual Sports Day", time: "2h ago", to: "All" },
                 { title: "Exam Results Published", time: "Yesterday", to: "Parents" },
                 { title: "Staff Meeting @ 4PM", time: "2 days ago", to: "Staff" },
               ].map((item, i) => (
                 <div key={i} className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                    <div className="text-xs font-bold text-slate-900 mb-1">{item.title}</div>
                    <div className="flex items-center justify-between">
                       <span className="text-[10px] text-slate-500 uppercase tracking-wider">{item.time}</span>
                       <span className="text-[10px] font-bold text-[#FF7F50] uppercase tracking-wider">To: {item.to}</span>
                    </div>
                 </div>
               ))}
            </div>
            <button className="w-full mt-6 py-3 text-xs font-bold text-slate-400 uppercase tracking-widest hover:text-[#FF7F50] transition-colors">
              See Full Archive
            </button>
          </div>
        </div>
      </div>
    </PageSection>
  );
}
