"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
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

export default function SettingsSection() {
  const [activeSubTab, setActiveSubTab] = useState<"profile" | "preferences" | "security">("profile");

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
          <button className="w-full flex items-center gap-4 px-6 py-4 rounded-2xl text-red-500 hover:bg-red-500/10 transition-all font-black uppercase tracking-widest text-xs">
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
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-8"
            >
              <div className="p-10 rounded-[48px] bg-[var(--bg-secondary)] border border-[var(--border)] relative overflow-hidden">
                <div className="relative z-10 flex flex-col md:flex-row gap-10">
                  <div className="relative group">
                    <div className="w-40 h-40 rounded-[48px] bg-zinc-800 flex items-center justify-center text-6xl font-black italic text-white shadow-2xl">
                      Y
                    </div>
                    <button className="absolute -bottom-2 -right-2 p-4 rounded-3xl bg-[var(--accent)] text-white shadow-xl hover:scale-110 transition-transform">
                      <Camera size={20} strokeWidth={3} />
                    </button>
                  </div>
                  
                  <div className="flex-1 space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-[var(--text-secondary)] uppercase tracking-[0.2em] ml-1">Full Display Name</label>
                        <input type="text" defaultValue="Yukesh" className="w-full bg-[var(--bg-primary)] border border-[var(--border)] rounded-2xl p-4 text-sm font-bold outline-none focus:border-[var(--accent)] transition-all" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-[var(--text-secondary)] uppercase tracking-[0.2em] ml-1">Email Address</label>
                        <input type="email" defaultValue="yukesh.v@snsacademy.org" className="w-full bg-[var(--bg-primary)] border border-[var(--border)] rounded-2xl p-4 text-sm font-bold outline-none focus:border-[var(--accent)] transition-all" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-[var(--text-secondary)] uppercase tracking-[0.2em] ml-1">Phone Number</label>
                        <input type="text" defaultValue="+91 98765 43210" className="w-full bg-[var(--bg-primary)] border border-[var(--border)] rounded-2xl p-4 text-sm font-bold outline-none focus:border-[var(--accent)] transition-all" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-[var(--text-secondary)] uppercase tracking-[0.2em] ml-1">Employee ID</label>
                        <input type="text" readOnly value="SNS-T-2026-001" className="w-full bg-[var(--bg-primary)]/50 border border-[var(--border)] rounded-2xl p-4 text-sm font-bold text-[var(--text-secondary)] outline-none cursor-not-allowed" />
                      </div>
                    </div>

                    <button className="px-10 py-4 rounded-2xl bg-[var(--accent)] text-white font-black uppercase tracking-widest text-xs hover:shadow-2xl hover:shadow-[var(--accent-glow)] transition-all">
                      Save Changes
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeSubTab === "preferences" && (
            <motion.div
              key="preferences"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-8"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Theme Selection */}
                <div className="p-8 rounded-[40px] bg-[var(--bg-secondary)] border border-[var(--border)]">
                  <div className="flex items-center gap-4 mb-8">
                    <div className="p-3 rounded-2xl bg-purple-500/10 text-purple-500">
                      <Palette size={24} />
                    </div>
                    <h3 className="text-xl font-black italic uppercase tracking-tight text-[var(--text-primary)]">Interface Theme</h3>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <button className="p-4 rounded-3xl border-2 border-[var(--accent)] bg-[var(--bg-primary)] flex flex-col items-center gap-3">
                      <div className="w-full aspect-video rounded-xl bg-zinc-100 border border-zinc-200" />
                      <span className="text-xs font-black uppercase tracking-widest">Light Mode</span>
                    </button>
                    <button className="p-4 rounded-3xl border-2 border-transparent bg-[var(--bg-primary)] flex flex-col items-center gap-3 hover:border-[var(--border)] transition-all">
                      <div className="w-full aspect-video rounded-xl bg-zinc-900 border border-zinc-800" />
                      <span className="text-xs font-black uppercase tracking-widest">Dark Mode</span>
                    </button>
                  </div>
                </div>

                {/* Language Selection */}
                <div className="p-8 rounded-[40px] bg-[var(--bg-secondary)] border border-[var(--border)]">
                  <div className="flex items-center gap-4 mb-8">
                    <div className="p-3 rounded-2xl bg-blue-500/10 text-blue-500">
                      <Globe size={24} />
                    </div>
                    <h3 className="text-xl font-black italic uppercase tracking-tight text-[var(--text-primary)]">System Language</h3>
                  </div>
                  
                  <div className="space-y-3">
                    {["English (International)", "Tamil (India)", "Hindi (India)"].map((lang, i) => (
                      <button key={i} className={`w-full flex items-center justify-between p-4 rounded-2xl border-2 transition-all ${
                        i === 0 ? "border-[var(--accent)] bg-[var(--accent-glow)]" : "border-[var(--border)] bg-[var(--bg-primary)] hover:border-[var(--accent)]"
                      }`}>
                        <span className="text-sm font-bold text-[var(--text-primary)]">{lang}</span>
                        {i === 0 && <CheckCircle2 size={18} className="text-[var(--accent)]" />}
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
