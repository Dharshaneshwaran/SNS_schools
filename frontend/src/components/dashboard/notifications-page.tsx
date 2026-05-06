"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Bell, 
  Users, 
  UserCircle, 
  PaperPlaneTilt, 
  CheckCircle,
  ClockCounterClockwise,
  X,
  PencilLine,
  Trash,
  Plus,
  MagnifyingGlass,
  Funnel,
  Megaphone,
  Check
} from "@phosphor-icons/react";
import { PageSection } from "./page-section";
import { apiRequest } from "../../services/api-client";
import { useAuth } from "../../hooks/use-auth";
import { toast } from "sonner";

export function NotificationsPage() {
  const [step, setStep] = useState(1);
  const [history, setHistory] = useState<any[]>([]);
  const [isSending, setIsSending] = useState(false);
  const [audience, setAudience] = useState<"parents" | "staff" | "both" | "">("");
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");

  const fetchHistory = async () => {
    try {
      const data = await apiRequest<any[]>("/notifications");
      setHistory(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to fetch notification history", err);
      setHistory([]);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const handleSend = async () => {
    if (!message || !title) {
      toast.error("Please fill in both title and message");
      return;
    }
    setIsSending(true);
    try {
      await apiRequest("/notifications/broadcast", {
        method: "POST",
        body: JSON.stringify({
          audience: audience || "both",
          title,
          message,
        }),
      });
      setIsSending(false);
      setStep(4); // Success step
      setTitle("");
      setMessage("");
      setAudience("");
      toast.success("Broadcast delivered successfully!");
      fetchHistory();
    } catch (err) {
      setIsSending(false);
      toast.error("Delivery failed. Please try again.");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await apiRequest("/notifications/delete", {
        method: "POST",
        body: JSON.stringify({ id }),
      });
      toast.success("Notification removed from archive");
      fetchHistory();
    } catch (err) {
      toast.error("Failed to delete notification");
    }
  };

  return (
    <PageSection
      eyebrow="SNS COMMUNICATION"
      title="Notification Hub"
      description="Manage and broadcast real-time updates to the school community."
    >
      <div className="flex flex-col gap-8">

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Broadcast Wizard */}
          <div className="lg:col-span-8">
            <div className="bg-white border border-slate-100 rounded-[3rem] p-10 shadow-sm min-h-[600px] flex flex-col">
              
              {/* Stepper Header */}
              <div className="flex items-center justify-between mb-12 px-4 relative">
                <div className="absolute top-1/2 left-0 right-0 h-px bg-slate-100 -translate-y-1/2 z-0" />
                {[1, 2, 3, 4].map((s) => (
                  <div key={s} className="relative z-10 flex flex-col items-center gap-2">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-xs font-black transition-all ${
                      step === s ? 'bg-[#FF7F50] text-white shadow-lg shadow-[#FF7F50]/30 scale-110' : 
                      step > s ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20' : 'bg-slate-50 text-slate-400 border border-slate-100'
                    }`}>
                      {step > s ? <Check size={20} weight="bold" /> : s}
                    </div>
                  </div>
                ))}
              </div>

              {/* Step Content Rendering */}
              <div className="flex-1">
                {step === 1 && (
                  <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                    <h3 className="text-2xl font-black text-slate-900 mb-8 uppercase tracking-tight">Step 1: Select Notification Type</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <button 
                        onClick={() => { setAudience("both"); setStep(2); }}
                        className={`p-6 rounded-[1.5rem] border-2 transition-all text-left group ${
                          audience === "both" ? 'border-[#FF7F50] bg-[#FF7F50]/5' : 'border-slate-50 bg-white hover:border-slate-200'
                        }`}
                      >
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110 ${
                          audience === "both" ? 'bg-[#FF7F50] text-white' : 'bg-[#FF7F50]/10 text-[#FF7F50]'
                        }`}>
                          <Bell size={20} weight="duotone" />
                        </div>
                        <h4 className="text-lg font-bold text-slate-900 mb-1">General Alert</h4>
                        <p className="text-xs text-slate-500 leading-relaxed">Broadcast to the entire school community.</p>
                      </button>

                      <button 
                        onClick={() => { setAudience("parents"); setStep(2); }}
                        className={`p-6 rounded-[1.5rem] border-2 transition-all text-left group ${
                          audience === "parents" ? 'border-[#FF7F50] bg-[#FF7F50]/5' : 'border-slate-50 bg-white hover:border-slate-200'
                        }`}
                      >
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110 ${
                          audience === "parents" ? 'bg-[#FF7F50] text-white' : 'bg-slate-50 text-slate-400'
                        }`}>
                          <Users size={20} weight="duotone" />
                        </div>
                        <h4 className="text-lg font-bold text-slate-900 mb-1">Class-wise</h4>
                        <p className="text-xs text-slate-500 leading-relaxed">Target specific grades or sections.</p>
                      </button>
                    </div>
                  </motion.div>
                )}

                {step === 2 && (
                  <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                    <h3 className="text-2xl font-black text-slate-900 mb-8 uppercase tracking-tight">Step 2: Compose Message</h3>
                    <div className="space-y-6">
                       <div className="space-y-2">
                         <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Message Headline</label>
                         <input 
                           type="text"
                           value={title}
                           onChange={(e) => setTitle(e.target.value)}
                           placeholder="e.g. Annual Sports Meet 2026"
                           className="w-full px-8 py-5 bg-slate-50 border border-slate-100 rounded-[1.5rem] focus:ring-2 focus:ring-[#FF7F50]/10 focus:border-[#FF7F50] outline-none transition-all font-bold"
                         />
                       </div>
                       <div className="space-y-2">
                         <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Content</label>
                         <textarea 
                           value={message}
                           onChange={(e) => setMessage(e.target.value)}
                           placeholder="What would you like to say to the community?"
                           className="w-full h-48 px-8 py-6 bg-slate-50 border border-slate-100 rounded-[2rem] focus:ring-2 focus:ring-[#FF7F50]/10 focus:border-[#FF7F50] outline-none transition-all resize-none leading-relaxed"
                         />
                       </div>
                    </div>
                  </motion.div>
                )}

                {step === 3 && (
                  <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                    <h3 className="text-2xl font-black text-slate-900 mb-8 uppercase tracking-tight">Step 3: Review & Schedule</h3>
                    <div className="bg-slate-50 rounded-[2.5rem] p-10 border border-slate-100">
                       <div className="flex items-center justify-between mb-8 pb-6 border-b border-slate-200">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center text-[#FF7F50] shadow-sm"><Megaphone size={24} weight="duotone" /></div>
                            <div>
                               <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Broadcast Preview</p>
                               <h4 className="text-xl font-bold text-slate-900">{title || "Untitled Message"}</h4>
                            </div>
                          </div>
                          <div className="px-4 py-2 bg-white rounded-full text-[10px] font-bold text-[#FF7F50] border border-[#FF7F50]/20 uppercase tracking-wider">
                            To: {audience}
                          </div>
                       </div>
                       <p className="text-slate-600 leading-relaxed text-lg italic">&quot;{message || "No content provided..."}&quot;</p>
                       
                       <div className="mt-12 flex items-center gap-3 p-4 bg-emerald-50 rounded-2xl border border-emerald-100">
                          <CheckCircle size={20} className="text-emerald-500" />
                          <p className="text-xs font-bold text-emerald-700 uppercase tracking-tight">Ready for immediate delivery via Push Notification & Web Hub.</p>
                       </div>
                    </div>
                  </motion.div>
                )}

                {step === 4 && (
                  <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center text-center py-10">
                    <div className="w-24 h-24 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-xl shadow-emerald-500/30 mb-8">
                       <PaperPlaneTilt size={48} weight="fill" className="rotate-12" />
                    </div>
                    <h3 className="text-3xl font-black text-slate-900 uppercase tracking-tight mb-4">Broadcast Launched!</h3>
                    <p className="text-slate-500 max-w-sm mb-10 leading-relaxed">Your message has been delivered to all registered devices in the {audience} group.</p>
                    <button 
                      onClick={() => { setStep(1); setTitle(""); setMessage(""); setAudience(""); }}
                      className="px-12 py-5 bg-slate-900 text-white rounded-3xl font-black uppercase tracking-widest hover:bg-slate-800 transition-all shadow-xl"
                    >
                      New Broadcast
                    </button>
                  </motion.div>
                )}
              </div>

              {/* Wizard Footer Navigation */}
              {step < 4 && (
                <div className="mt-12 flex items-center justify-between pt-8 border-t border-slate-50">
                  <button 
                    onClick={() => setStep(s => Math.max(1, s - 1))}
                    disabled={step === 1}
                    className="px-8 py-4 text-slate-400 font-bold hover:text-slate-900 transition-all disabled:opacity-0"
                  >
                    Back
                  </button>
                  <button 
                    onClick={() => step === 3 ? handleSend() : setStep(s => s + 1)}
                    disabled={(step === 1 && !audience) || (step === 2 && (!title || !message)) || isSending}
                    className={`px-10 py-4 bg-[#FF7F50] text-white rounded-2xl font-black uppercase tracking-widest shadow-xl shadow-[#FF7F50]/20 hover:scale-[1.05] active:scale-[0.95] transition-all disabled:opacity-30 disabled:scale-100 flex items-center gap-3 ${
                      step === 1 ? 'hidden' : ''
                    }`}
                  >
                    {step === 3 ? (isSending ? "Launching..." : "Deliver Now") : "Continue"}
                    <Plus size={20} weight="bold" />
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Recent History */}
          <div className="lg:col-span-4">
            <div className="bg-white border border-slate-100 rounded-[3rem] p-8 shadow-sm">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-8 h-8 rounded-lg bg-orange-50 text-[#FF7F50] flex items-center justify-center">
                   <ClockCounterClockwise size={18} weight="bold" />
                </div>
                <h3 className="font-bold text-slate-900">Recent History</h3>
              </div>

              <div className="space-y-4">
                {history.slice(0, 5).map((item) => (
                  <div key={item.id} className="p-5 rounded-2xl bg-slate-50/50 border border-slate-50 hover:bg-white hover:border-slate-100 transition-all group">
                    <div className="flex items-center justify-between mb-2">
                       <span className="text-[10px] font-black text-[#FF7F50] uppercase tracking-widest">
                         TO: {item.audience}
                       </span>
                       <span className="text-[10px] font-bold text-slate-300">
                         {new Date(item.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                       </span>
                    </div>
                    <h4 className="text-sm font-bold text-slate-900 mb-1 truncate">{item.title}</h4>
                    <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed">{item.message}</p>
                  </div>
                ))}

                {history.length === 0 && (
                   <div className="py-12 text-center">
                     <p className="text-xs font-bold text-slate-300 uppercase tracking-widest">No Recent History</p>
                   </div>
                )}
              </div>

              <button className="w-full mt-6 py-4 text-xs font-black text-slate-400 uppercase tracking-[0.2em] hover:text-[#FF7F50] transition-colors">
                See Full Archive
              </button>
            </div>
          </div>
        </div>
      </div>
    </PageSection>
  );
}
