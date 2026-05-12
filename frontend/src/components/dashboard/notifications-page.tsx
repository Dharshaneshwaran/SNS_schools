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
  Check,
  Clock
} from "@phosphor-icons/react";
import { PageSection } from "./page-section";
import { apiRequest } from "../../services/api-client";
import { useAuth } from "../../hooks/use-auth";
import { toast } from "sonner";

import { useSearchParams } from "next/navigation";

export function NotificationsPage() {
  const searchParams = useSearchParams();
  const [step, setStep] = useState(1);
  const [history, setHistory] = useState<any[]>([]);
  const [isSending, setIsSending] = useState(false);
  const [audience, setAudience] = useState<"parents" | "staff" | "both" | "notice" | "">("");
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [targetClasses, setTargetClasses] = useState<string[]>([]);
  const [dbClasses, setDbClasses] = useState<string[]>([]);

  const fetchClasses = async () => {
    try {
      const data = await apiRequest<string[]>("/users/classes");
      setDbClasses(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to fetch classes", err);
      setDbClasses([]);
    }
  };

  useEffect(() => {
    const action = searchParams.get("action");
    if (action === "new") {
      setAudience("notice");
      setStep(2);
    }
  }, [searchParams]);

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
    fetchClasses();
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
          targetClasses: audience === "parents" ? targetClasses : undefined,
        }),
      });
      setIsSending(false);
      setStep(4); // Success step
      setTitle("");
      setMessage("");
      setAudience("");
      setTargetClasses([]);
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

  const handleDeleteAll = async () => {
    if (!confirm("Are you sure you want to delete all notifications?")) return;
    try {
      await apiRequest("/notifications/delete-all", {
        method: "POST",
      });
      toast.success("All notifications cleared");
      fetchHistory();
    } catch (err) {
      toast.error("Failed to clear notifications");
    }
  };

  return (
    <PageSection
      eyebrow="SNS COMMUNICATION"
      title="Notification Hub"
      description="Manage and broadcast real-time updates to the school community."
    >
      <div className="flex flex-col gap-8">
        
        {/* Tool Panel */}
        <div className="flex flex-col md:flex-row items-center justify-between bg-white px-8 py-5 rounded-[2rem] border border-slate-100 shadow-sm mb-8">
           <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                 <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                 <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">System Online</p>
              </div>
              <div className="h-4 w-px bg-slate-100" />
               <div className="flex items-center gap-2 text-slate-900">
                  <Bell size={18} weight="duotone" className="text-[#FF7F50]" />
                  <p className="text-xs font-black uppercase tracking-tight">{history.length} Broadcasts</p>
               </div>
            </div>
            <button 
              onClick={handleDeleteAll}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl border border-red-100 text-red-500 hover:bg-red-50 transition-all text-xs font-black uppercase tracking-widest"
            >
              <Trash size={16} weight="bold" />
              Delete All
            </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Broadcast Wizard */}
          <div className="lg:col-span-8">
            <div className="bg-white border border-slate-100 rounded-[2.5rem] p-8 shadow-sm">
              
              {/* Stepper Header */}
              <div className="flex items-center justify-center mb-8 relative">
                <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-slate-50 -translate-y-1/2" />
                <div className="relative flex justify-between w-full max-w-md">
                  {[1, 2, 3, 4].map((s) => (
                    <div 
                      key={s}
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-black z-10 transition-all duration-500 ${
                        step >= s ? "bg-[#FF7F50] text-white shadow-lg shadow-[#FF7F50]/30" : "bg-white border-2 border-slate-50 text-slate-300"
                      }`}
                    >
                      {step > s ? <Check size={16} weight="bold" /> : s}
                    </div>
                  ))}
                </div>
              </div>

              {/* Step Content Rendering */}
              <div className="flex-1">
                {step === 1 && (
                  <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                    <h3 className="text-2xl font-black text-slate-900 mb-8 uppercase tracking-tight">Step 1: Select Notification Type</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <button 
                        onClick={() => { setAudience("both"); setStep(2); }}
                        className={`p-4 rounded-[1.25rem] border-2 transition-all text-left group ${
                          audience === "both" ? 'border-[#FF7F50] bg-[#FF7F50]/5' : 'border-slate-50 bg-white hover:border-slate-200'
                        }`}
                      >
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center mb-3 transition-transform group-hover:scale-110 ${
                          audience === "both" ? 'bg-[#FF7F50] text-white' : 'bg-[#FF7F50]/10 text-[#FF7F50]'
                        }`}>
                          <Bell size={18} weight="duotone" />
                        </div>
                        <h4 className="text-sm font-bold text-slate-900 mb-0.5">General Alert</h4>
                        <p className="text-[10px] text-slate-500 leading-tight">Broadcast to everyone.</p>
                      </button>

                      <button 
                        onClick={() => { setAudience("parents"); setStep(2); }}
                        className={`p-4 rounded-[1.25rem] border-2 transition-all text-left group ${
                          audience === "parents" ? 'border-[#FF7F50] bg-[#FF7F50]/5' : 'border-slate-50 bg-white hover:border-slate-200'
                        }`}
                      >
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center mb-3 transition-transform group-hover:scale-110 ${
                          audience === "parents" ? 'bg-[#FF7F50] text-white' : 'bg-slate-50 text-slate-400'
                        }`}>
                          <Users size={18} weight="duotone" />
                        </div>
                        <h4 className="text-sm font-bold text-slate-900 mb-0.5">Class-wise</h4>
                        <p className="text-[10px] text-slate-500 leading-tight">Target specific grades.</p>
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
                            className="w-full h-32 px-8 py-6 bg-slate-50 border border-slate-100 rounded-[2rem] focus:ring-2 focus:ring-[#FF7F50]/10 focus:border-[#FF7F50] outline-none transition-all resize-none leading-relaxed"
                          />
                       </div>

                       {audience === "parents" && (
                         <div className="space-y-4">
                           <div className="flex items-center justify-between">
                             <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Select Target Class</label>
                             <div className="flex gap-2">
                               <button
                                 type="button"
                                 onClick={() => setTargetClasses(dbClasses)}
                                 className="px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest bg-slate-100 text-slate-500 hover:bg-[#FF7F50] hover:text-white transition-all"
                               >
                                 Select All
                               </button>
                               <button
                                 type="button"
                                 onClick={() => setTargetClasses([])}
                                 className="px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest bg-slate-100 text-slate-500 hover:bg-slate-200 transition-all"
                               >
                                 Clear
                               </button>
                             </div>
                           </div>
                           <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                             {dbClasses.length > 0 ? dbClasses.map((cls) => {
                               const isSelected = targetClasses.includes(cls);
                               return (
                                 <button
                                   key={cls}
                                   type="button"
                                   onClick={() => {
                                     setTargetClasses(prev => 
                                       isSelected ? prev.filter(c => c !== cls) : [...prev, cls]
                                     );
                                   }}
                                   className={`px-3 py-2 rounded-xl text-[10px] font-bold border-2 transition-all ${
                                     isSelected 
                                       ? 'border-[#FF7F50] bg-[#FF7F50] text-white shadow-lg shadow-[#FF7F50]/20' 
                                       : 'border-slate-50 bg-slate-50 text-slate-500 hover:border-slate-200'
                                   }`}
                                 >
                                   {cls}
                                 </button>
                               );
                             }) : (
                               <p className="col-span-full text-center py-4 text-xs font-bold text-slate-300 uppercase tracking-widest">No classes found in database</p>
                             )}
                           </div>
                         </div>
                       )}

                       {audience === "notice" && (
                         <div className="space-y-2">
                           <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Attach Media (Images/Videos)</label>
                           <div className="w-full p-8 border-2 border-dashed border-slate-100 rounded-[2rem] bg-slate-50/50 flex flex-col items-center justify-center gap-3 group hover:border-[#FF7F50]/30 transition-colors cursor-pointer">
                             <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center text-slate-300 group-hover:text-[#FF7F50] transition-colors">
                               <Plus size={24} weight="bold" />
                             </div>
                             <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Click to upload or drag & drop</p>
                           </div>
                         </div>
                       )}
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
                            To: {audience} {targetClasses.length > 0 && `(${targetClasses.length === dbClasses.length ? 'All Classes' : targetClasses.join(", ")})`}
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
                    <p className="text-slate-500 max-w-sm mb-10 leading-relaxed">Your message has been delivered to all registered devices in the {audience} {targetClasses.length > 0 && `(${targetClasses.length === dbClasses.length ? 'All Classes' : targetClasses.length + ' Classes'})`} group.</p>
                    <button 
                      onClick={() => { setStep(1); setTitle(""); setMessage(""); setAudience(""); setTargetClasses([]); }}
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
                    disabled={(step === 1 && !audience) || (step === 2 && (!title || !message || (audience === 'parents' && targetClasses.length === 0))) || isSending}
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
            <div className="bg-white border border-slate-100 rounded-[2rem] p-6 shadow-sm">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 rounded-lg bg-orange-50 text-[#FF7F50] flex items-center justify-center">
                   <Clock size={18} weight="duotone" />
                </div>
                <h3 className="font-bold text-slate-900">Recent History</h3>
              </div>

              <div className="space-y-3">
                {history.length > 0 ? history.map((item) => (
                  <div key={item.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-100 hover:border-[#FF7F50]/20 transition-all group">
                    <div className="flex items-center justify-between mb-2">
                       <span className="text-[9px] font-black text-[#FF7F50] uppercase tracking-widest">
                         TO: {item.audience}
                       </span>
                       <span className="text-[9px] font-bold text-slate-300">
                         {new Date(item.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                       </span>
                    </div>
                    <h4 className="text-sm font-bold text-slate-900 mb-1 truncate group-hover:text-[#FF7F50] transition-colors">{item.title}</h4>
                    <p className="text-[10px] text-slate-500 line-clamp-1 leading-relaxed">{item.message}</p>
                  </div>
                )) : (
                  <div className="py-8 text-center">
                    <p className="text-xs font-bold text-slate-300 uppercase tracking-widest">No Recent History</p>
                  </div>
                )}
              </div>

              <button className="w-full mt-6 py-3 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] border border-dashed border-slate-200 rounded-xl hover:border-[#FF7F50] hover:text-[#FF7F50] transition-all">
                See Full Archive
              </button>
            </div>
          </div>
        </div>
      </div>
    </PageSection>
  );
}
