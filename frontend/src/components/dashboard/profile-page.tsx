"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { 
  UserCircle, 
  PencilSimple, 
  CheckCircle,
  Phone,
  EnvelopeSimple,
  Briefcase,
  IdentificationCard,
  Lock
} from "@phosphor-icons/react";
import { PageSection } from "./page-section";
import { useAuth } from "../../hooks/use-auth";

export function ProfilePage() {
  const { session } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState({
    name: session?.user.name || "Dr. Sarah Connor",
    email: session?.user.email || "sarah.c@sns-academy.edu",
    phone: "+91 98765 43210",
    role: session?.user.role || "Teacher",
    department: "Mathematics",
    empId: "EMP-2024-045",
    bio: "Dedicated mathematics educator with over 10 years of experience in higher secondary education. Passionate about making complex concepts accessible to all students."
  });

  const handleSave = () => {
    setIsEditing(false);
    // Mock save
  };

  return (
    <PageSection
      eyebrow="Account Settings"
      title="My Profile"
      description="Manage your professional profile, contact information, and system preferences."
    >
      <div className="max-w-5xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
           
           {/* Left: Profile Card */}
           <div className="lg:col-span-4">
              <div className="rounded-[3rem] bg-[var(--bg-secondary)] border border-[var(--border)] p-10 shadow-[0_24px_70px_rgba(15,23,42,0.05)] text-center">
                 <div className="relative inline-block mb-6">
                    <div className="h-32 w-32 rounded-[2.5rem] bg-[var(--bg-muted)] flex items-center justify-center text-[var(--text-muted)]">
                       <UserCircle size={80} weight="duotone" />
                    </div>
                    <button className="absolute bottom-0 right-0 h-10 w-10 bg-[var(--accent)] text-white rounded-2xl flex items-center justify-center shadow-lg hover:scale-105 transition-transform border-4 border-white">
                       <PencilSimple size={20} weight="bold" />
                    </button>
                 </div>
                 <h3 className="text-2xl font-bold text-[var(--text-primary)] mb-1">{profile.name}</h3>
                 <p className="text-sm font-bold text-[var(--accent)] uppercase tracking-[0.2em] mb-8">{profile.role}</p>
                 
                 <div className="space-y-4 text-left">
                    <div className="flex items-center gap-3 p-4 rounded-2xl bg-[var(--bg-primary)] border border-[var(--border)]">
                       <IdentificationCard size={20} className="text-[var(--text-muted)]" />
                       <div>
                          <div className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest">Employee ID</div>
                          <div className="text-sm font-bold text-[var(--text-primary)]">{profile.empId}</div>
                       </div>
                    </div>
                    <div className="flex items-center gap-3 p-4 rounded-2xl bg-[var(--bg-primary)] border border-[var(--border)]">
                       <Briefcase size={20} className="text-[var(--text-muted)]" />
                       <div>
                          <div className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest">Department</div>
                          <div className="text-sm font-bold text-[var(--text-primary)]">{profile.department}</div>
                       </div>
                    </div>
                 </div>
              </div>
           </div>

           {/* Right: Detailed Form */}
           <div className="lg:col-span-8">
              <div className="rounded-[3rem] bg-[var(--bg-secondary)] border border-[var(--border)] p-10 shadow-[0_24px_70px_rgba(15,23,42,0.05)]">
                 <div className="flex items-center justify-between mb-10">
                    <h4 className="text-xl font-bold text-[var(--text-primary)]">Personal Information</h4>
                    <button 
                      onClick={() => isEditing ? handleSave() : setIsEditing(true)}
                      className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-bold text-sm transition-all ${
                        isEditing 
                          ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/20" 
                          : "bg-slate-900 text-white shadow-lg shadow-slate-900/20"
                      }`}
                    >
                       {isEditing ? <CheckCircle size={18} weight="bold" /> : <PencilSimple size={18} weight="bold" />}
                       {isEditing ? "Save Changes" : "Edit Profile"}
                    </button>
                 </div>

                 <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
                    <div className="space-y-2">
                       <label className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest">Full Name</label>
                       <input 
                         type="text" 
                         disabled={!isEditing}
                         value={profile.name}
                         onChange={(e) => setProfile({...profile, name: e.target.value})}
                         className="w-full bg-[var(--bg-primary)] border-none rounded-2xl px-6 py-4 text-sm focus:ring-2 focus:ring-[var(--accent)]/20 transition-all outline-none disabled:opacity-60"
                       />
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest">Email Address</label>
                       <div className="relative">
                          <EnvelopeSimple size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
                          <input 
                            type="email" 
                            disabled={!isEditing}
                            value={profile.email}
                            className="w-full bg-[var(--bg-primary)] border-none rounded-2xl pl-12 pr-6 py-4 text-sm focus:ring-2 focus:ring-[var(--accent)]/20 transition-all outline-none disabled:opacity-60"
                          />
                       </div>
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest">Phone Number</label>
                       <div className="relative">
                          <Phone size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
                          <input 
                            type="text" 
                            disabled={!isEditing}
                            value={profile.phone}
                            onChange={(e) => setProfile({...profile, phone: e.target.value})}
                            className="w-full bg-[var(--bg-primary)] border-none rounded-2xl pl-12 pr-6 py-4 text-sm focus:ring-2 focus:ring-[var(--accent)]/20 transition-all outline-none disabled:opacity-60"
                          />
                       </div>
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest">Security Status</label>
                       <div className="flex items-center gap-2 px-6 py-4 bg-emerald-50 rounded-2xl border border-emerald-100 text-emerald-600 font-bold text-xs">
                          <Lock size={16} /> Two-Factor Enabled
                       </div>
                    </div>
                 </div>

                 <div className="space-y-2">
                    <label className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest">Professional Bio</label>
                    <textarea 
                      disabled={!isEditing}
                      value={profile.bio}
                      onChange={(e) => setProfile({...profile, bio: e.target.value})}
                      className="w-full h-32 bg-[var(--bg-primary)] border-none rounded-2xl px-6 py-4 text-sm focus:ring-2 focus:ring-[var(--accent)]/20 transition-all outline-none resize-none disabled:opacity-60"
                    />
                 </div>
              </div>
           </div>

        </div>
      </div>
    </PageSection>
  );
}
