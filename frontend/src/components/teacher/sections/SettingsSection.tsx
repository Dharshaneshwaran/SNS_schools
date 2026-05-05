"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  User, 
  Palette, 
  Globe, 
  Lock, 
  Bell, 
  ShieldCheck,
  ChevronRight,
  LogOut,
  Camera,
  CheckCircle2
} from "lucide-react";
import { useAuth } from "../../../hooks/use-auth";
import { useRouter } from "next/navigation";

export default function SettingsSection({ theme, toggleTheme }: { theme?: 'light' | 'dark', toggleTheme?: () => void }) {
  const [activeSubTab, setActiveSubTab] = useState<"profile" | "preferences" | "security">("profile");
  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const { session, logout } = useAuth();
  const router = useRouter();

  const userName = session?.user?.name || "Teacher";
  const userEmail = session?.user?.email || "teacher@snsacademy.org";
  const userInitial = userName.charAt(0).toUpperCase();

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  return (
    <div className="flex flex-col lg:flex-row gap-10">
      {/* Settings Navigation */}
      <div className="w-full lg:w-72 space-y-2">
        {[
          { id: "profile", label: "Profile Details", icon: User },
          { id: "preferences", label: "Preferences", icon: Palette },
          { id: "security", label: "Login & Security", icon: Lock },
        ].map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveSubTab(item.id as any)}
            className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl transition-all ${
              activeSubTab === item.id 
                ? "bg-[var(--accent)] text-white shadow-lg shadow-[var(--accent-glow)]" 
                : "text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-secondary)]"
            }`}
          >
            <item.icon size={20} />
            <span className="text-sm font-black uppercase tracking-widest">{item.label}</span>
          </button>
        ))}

        <div className="pt-6 mt-6 border-t border-[var(--border)]">
          <button onClick={handleLogout} className="w-full flex items-center gap-4 px-6 py-4 rounded-2xl text-red-500 hover:bg-red-500/10 transition-all font-black uppercase tracking-widest text-xs">
            <LogOut size={20} />
            Sign Out
          </button>
        </div>
      </div>

      {/* Settings Content */}
      <div className="flex-1">
        <AnimatePresence mode="wait">
          {activeSubTab === "profile" && (
            <motion.div
              key="profile"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8"
            >
              <div className="p-12 rounded-[56px] bg-[var(--bg-secondary)] border border-[var(--border)] shadow-[var(--card-shadow)] relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none group-hover:opacity-10 transition-opacity">
                  <User size={200} />
                </div>
                
                <div className="relative z-10 flex flex-col md:flex-row gap-12 items-start">
                  <div className="relative">
                    <div className="w-48 h-48 rounded-[64px] bg-gradient-to-br from-zinc-800 to-black flex items-center justify-center text-[var(--accent)]xl font-black italic text-white shadow-2xl relative overflow-hidden">
                      {userInitial}
                      <div className="absolute inset-0 bg-gradient-to-tr from-[var(--accent)]/20 to-transparent" />
                    </div>
                    <button className="absolute -bottom-4 -right-4 p-5 rounded-[28px] bg-[var(--accent)] text-white shadow-2xl hover:scale-110 active:scale-95 transition-all">
                      <Camera size={24} strokeWidth={3} />
                    </button>
                  </div>
                  
                  <div className="flex-1 w-full space-y-10">
                    <div>
                      <h3 className="text-3xl font-black italic uppercase tracking-tight text-[var(--text-primary)] mb-2">Personal Identity</h3>
                      <p className="text-[var(--text-secondary)] font-medium">Manage your public profile and system identification</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-8">
                      <div className="space-y-3">
                        <label className="text-[10px] font-black text-[var(--text-secondary)] uppercase tracking-[0.3em] ml-1">Legal Full Name</label>
                        <input 
                          type="text" 
                          defaultValue={userName} 
                          className="w-full bg-[var(--bg-primary)] border border-[var(--border)] rounded-[24px] px-6 py-5 text-base font-bold outline-none focus:border-[var(--accent)] focus:ring-4 focus:ring-[var(--accent-glow)] transition-all" 
                        />
                      </div>
                      <div className="space-y-3">
                        <label className="text-[10px] font-black text-[var(--text-secondary)] uppercase tracking-[0.3em] ml-1">Work Email Address</label>
                        <input 
                          type="email" 
                          defaultValue={userEmail} 
                          className="w-full bg-[var(--bg-primary)] border border-[var(--border)] rounded-[24px] px-6 py-5 text-base font-bold outline-none focus:border-[var(--accent)] focus:ring-4 focus:ring-[var(--accent-glow)] transition-all" 
                        />
                      </div>
                      <div className="space-y-3">
                        <label className="text-[10px] font-black text-[var(--text-secondary)] uppercase tracking-[0.3em] ml-1">Emergency Contact</label>
                        <input 
                          type="text" 
                          defaultValue="+91 98765 43210" 
                          className="w-full bg-[var(--bg-primary)] border border-[var(--border)] rounded-[24px] px-6 py-5 text-base font-bold outline-none focus:border-[var(--accent)] focus:ring-4 focus:ring-[var(--accent-glow)] transition-all" 
                        />
                      </div>
                      <div className="space-y-3">
                        <label className="text-[10px] font-black text-[var(--text-secondary)] uppercase tracking-[0.3em] ml-1">System Employee ID</label>
                        <input 
                          type="text" 
                          readOnly 
                          value="SNS-T-2026-001" 
                          className="w-full bg-[var(--bg-primary)]/50 border border-[var(--border)] rounded-[24px] px-6 py-5 text-base font-bold text-[var(--text-secondary)] outline-none cursor-not-allowed italic" 
                        />
                      </div>
                    </div>

                    <div className="pt-4">
                      <button 
                        onClick={() => {
                          setIsSaving(true);
                          setTimeout(() => { setIsSaving(false); setSaved(true); setTimeout(() => setSaved(false), 2000); }, 1000);
                        }}
                        className="px-12 py-5 rounded-[24px] bg-[var(--accent)] text-white font-black uppercase tracking-widest text-sm hover:shadow-2xl hover:shadow-[var(--accent-glow)] hover:-translate-y-1 active:translate-y-0 transition-all flex items-center justify-center gap-3 w-full md:w-auto"
                      >
                        {isSaving ? (
                          <div className="w-5 h-5 border-3 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : saved ? (
                          <><CheckCircle2 size={20} strokeWidth={3} /> Changes Committed</>
                        ) : (
                          "Synchronize Profile"
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

          {activeSubTab === "preferences" && (
            <motion.div
              key="preferences"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                {/* Theme Selection */}
                <div className="p-10 rounded-[56px] bg-[var(--bg-secondary)] border border-[var(--border)] shadow-[var(--card-shadow)] relative overflow-hidden">
                  <div className="flex items-center gap-5 mb-10">
                    <div className="p-4 rounded-3xl bg-purple-500/10 text-purple-500">
                      <Palette size={32} strokeWidth={2.5} />
                    </div>
                    <div>
                      <h3 className="text-2xl font-black italic uppercase tracking-tight text-[var(--text-primary)]">Interface Theme</h3>
                      <p className="text-[var(--text-secondary)] text-xs font-bold uppercase tracking-widest">Aesthetic Control</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-6">
                    <button 
                      onClick={() => toggleTheme && toggleTheme()}
                      className={`p-6 rounded-[36px] border-4 transition-all flex flex-col items-center gap-4 group ${theme === 'light' ? 'border-[var(--accent)] bg-[var(--bg-primary)] shadow-2xl' : 'border-transparent bg-[var(--bg-primary)] opacity-40 hover:opacity-100'}`}
                    >
                      <div className="w-full aspect-video rounded-2xl bg-gradient-to-br from-white to-zinc-100 border border-zinc-200 shadow-[var(--card-shadow)] overflow-hidden p-2">
                        <div className="w-full h-full rounded-lg bg-[var(--bg-secondary)]/50 backdrop-blur-sm border border-zinc-200" />
                      </div>
                      <span className="text-xs font-black uppercase tracking-[0.2em] text-[var(--text-primary)] group-hover:text-[var(--accent)] transition-colors">Daylight</span>
                    </button>
                    <button 
                      onClick={() => toggleTheme && toggleTheme()}
                      className={`p-6 rounded-[36px] border-4 transition-all flex flex-col items-center gap-4 group ${theme === 'dark' ? 'border-[var(--accent)] bg-[var(--bg-primary)] shadow-2xl' : 'border-transparent bg-[var(--bg-primary)] opacity-40 hover:opacity-100'}`}
                    >
                      <div className="w-full aspect-video rounded-2xl bg-gradient-to-br from-zinc-800 to-black border border-zinc-700 shadow-[var(--card-shadow)] overflow-hidden p-2">
                        <div className="w-full h-full rounded-lg bg-[var(--bg-secondary)]/5 backdrop-blur-sm border border-zinc-800" />
                      </div>
                      <span className="text-xs font-black uppercase tracking-[0.2em] text-[var(--text-primary)] group-hover:text-[var(--accent)] transition-colors">Midnight</span>
                    </button>
                  </div>
                </div>

                {/* Language Selection */}
                <div className="p-10 rounded-[56px] bg-[var(--bg-secondary)] border border-[var(--border)] shadow-[var(--card-shadow)]">
                  <div className="flex items-center gap-5 mb-10">
                    <div className="p-4 rounded-3xl bg-blue-500/10 text-blue-500">
                      <Globe size={32} strokeWidth={2.5} />
                    </div>
                    <div>
                      <h3 className="text-2xl font-black italic uppercase tracking-tight text-[var(--text-primary)]">System Locale</h3>
                      <p className="text-[var(--text-secondary)] text-xs font-bold uppercase tracking-widest">Global Language</p>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    {["English (US)", "Tamil (Regional)", "Hindi (National)"].map((lang, i) => (
                      <button key={i} className={`w-full flex items-center justify-between p-6 rounded-3xl border-2 transition-all group ${
                        i === 0 ? "border-[var(--accent)] bg-[var(--accent-glow)]/10 text-[var(--accent)]" : "border-[var(--border)] bg-[var(--bg-primary)] hover:border-[var(--accent)]/50"
                      }`}>
                        <span className="text-base font-black italic uppercase tracking-tight">{lang}</span>
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center transition-all ${i === 0 ? "bg-[var(--accent)] text-white scale-110" : "bg-[var(--border)] text-transparent group-hover:bg-[var(--accent)]/20"}`}>
                          <CheckCircle2 size={16} strokeWidth={3} />
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeSubTab === "security" && (
            <motion.div
              key="security"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-8"
            >
              <div className="p-10 rounded-[48px] bg-[var(--bg-secondary)] border border-[var(--border)] max-w-2xl">
                <div className="flex items-center gap-4 mb-10">
                  <div className="p-3 rounded-2xl bg-red-500/10 text-red-500">
                    <Lock size={24} />
                  </div>
                  <h3 className="text-xl font-black italic uppercase tracking-tight text-[var(--text-primary)]">Reset Security Credentials</h3>
                </div>

                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-[var(--text-secondary)] uppercase tracking-[0.2em] ml-1">Current Password</label>
                    <input type="password" placeholder="••••••••••••" className="w-full bg-[var(--bg-primary)] border border-[var(--border)] rounded-2xl p-4 text-sm font-bold outline-none focus:border-[var(--accent)] transition-all" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-[var(--text-secondary)] uppercase tracking-[0.2em] ml-1">New Password</label>
                    <input type="password" placeholder="••••••••••••" className="w-full bg-[var(--bg-primary)] border border-[var(--border)] rounded-2xl p-4 text-sm font-bold outline-none focus:border-[var(--accent)] transition-all" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-[var(--text-secondary)] uppercase tracking-[0.2em] ml-1">Confirm New Password</label>
                    <input type="password" placeholder="••••••••••••" className="w-full bg-[var(--bg-primary)] border border-[var(--border)] rounded-2xl p-4 text-sm font-bold outline-none focus:border-[var(--accent)] transition-all" />
                  </div>

                  <div className="pt-4">
                    <button className="w-full py-4 rounded-2xl bg-[var(--accent)] text-white font-black uppercase tracking-widest text-xs hover:shadow-2xl hover:shadow-[var(--accent-glow)] transition-all">
                      Update Security Password
                    </button>
                  </div>
                </div>
              </div>

              <div className="p-8 rounded-[40px] bg-green-500/5 border-2 border-dashed border-green-500/20 max-w-2xl flex items-center gap-6">
                <div className="w-12 h-12 rounded-2xl bg-green-500/10 text-green-500 flex items-center justify-center shrink-0">
                  <ShieldCheck size={24} />
                </div>
                <div>
                  <p className="text-sm font-bold text-[var(--text-primary)]">Two-Factor Authentication is Active</p>
                  <p className="text-xs text-[var(--text-secondary)] mt-1 font-medium">Your account is protected by biometric verification and email codes.</p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
