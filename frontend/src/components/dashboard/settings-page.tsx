"use client";

import { useCallback, useState } from "react";
import { useAuthResource } from "../../hooks/use-auth-resource";
import { getSettings } from "../../services/mock-data-service";
import { PageSection } from "./page-section";
import { ResourceError, ResourceLoading } from "./resource-states";
import { Settings, ShieldCheck, Globe, Bell, Palette, CheckCircle2, Save } from "lucide-react";

export function SettingsPage() {
  const loadSettings = useCallback(
    (accessToken: string) => getSettings(accessToken),
    [],
  );
  const { data, error, isLoading } = useAuthResource(loadSettings);
  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    }, 1500);
  };

  return (
    <PageSection
      eyebrow="System Configuration"
      title="Institution Command Center"
      description="Manage global academic parameters, department mapping, and communication protocols for SNS Academy."
    >
      {isLoading ? <ResourceLoading label="settings" /> : null}
      {error ? <ResourceError label="settings" message={error} /> : null}
      {data ? (
        <div className="space-y-10">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Primary Profile */}
            <div className="lg:col-span-2 p-10 rounded-[48px] bg-[var(--bg-secondary)] border border-[var(--border)] shadow-[var(--card-shadow)] relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-12 opacity-[0.03] pointer-events-none group-hover:opacity-[0.07] transition-opacity">
                <Settings size={200} />
              </div>
              
              <div className="relative z-10 space-y-10">
                <div className="flex items-center gap-5">
                  <div className="p-4 rounded-3xl bg-[var(--accent)]/10 text-[var(--accent)]">
                    <ShieldCheck size={32} strokeWidth={2.5} />
                  </div>
                  <div>
                    <h3 className="text-2xl font-black italic uppercase tracking-tight text-[var(--text-primary)]">Institution Profile</h3>
                    <p className="text-[var(--text-secondary)] text-xs font-bold uppercase tracking-widest">Global Identity</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-[var(--text-secondary)] uppercase tracking-[0.3em] ml-1">Academy Name</label>
                    <input 
                      type="text" 
                      defaultValue={data.institution.name} 
                      className="w-full bg-[var(--bg-primary)] border border-[var(--border)] rounded-[24px] px-6 py-5 text-base font-bold outline-none focus:border-[var(--accent)] transition-all" 
                    />
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-[var(--text-secondary)] uppercase tracking-[0.3em] ml-1">Academic Year</label>
                    <input 
                      type="text" 
                      defaultValue={data.institution.academicYear} 
                      className="w-full bg-[var(--bg-primary)] border border-[var(--border)] rounded-[24px] px-6 py-5 text-base font-bold outline-none focus:border-[var(--accent)] transition-all" 
                    />
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-[var(--text-secondary)] uppercase tracking-[0.3em] ml-1">System Timezone</label>
                    <input 
                      type="text" 
                      defaultValue={data.institution.timezone} 
                      className="w-full bg-[var(--bg-primary)] border border-[var(--border)] rounded-[24px] px-6 py-5 text-base font-bold outline-none focus:border-[var(--accent)] transition-all" 
                    />
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-[var(--text-secondary)] uppercase tracking-[0.3em] ml-1">Data Storage Region</label>
                    <input 
                      type="text" 
                      readOnly 
                      value="Asia South (Mumbai)" 
                      className="w-full bg-[var(--bg-primary)]/50 border border-[var(--border)] rounded-[24px] px-6 py-5 text-base font-bold text-[var(--text-secondary)] outline-none cursor-not-allowed italic" 
                    />
                  </div>
                </div>

                <div className="pt-4">
                  <button 
                    onClick={handleSave}
                    className="px-12 py-5 rounded-[24px] bg-[var(--accent)] text-white font-black uppercase tracking-widest text-sm hover:shadow-2xl hover:shadow-[var(--accent-glow)] hover:-translate-y-1 active:translate-y-0 transition-all flex items-center justify-center gap-3 w-full md:w-auto"
                  >
                    {isSaving ? (
                      <div className="w-5 h-5 border-3 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : saved ? (
                      <><CheckCircle2 size={20} strokeWidth={3} /> System Updated</>
                    ) : (
                      <><Save size={20} /> Commit Changes</>
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Sidebar Tools */}
            <div className="space-y-8">
              {/* Notification Status */}
              <div className="p-8 rounded-[40px] bg-[var(--bg-secondary)] border border-[var(--border)] shadow-[var(--card-shadow)]">
                <div className="flex items-center gap-4 mb-8">
                  <div className="p-3 rounded-2xl bg-blue-500/10 text-blue-500">
                    <Bell size={24} strokeWidth={2.5} />
                  </div>
                  <h4 className="text-lg font-black italic uppercase tracking-tight text-[var(--text-primary)]">Channels</h4>
                </div>
                <div className="space-y-4">
                  {data.notifications.map((n, i) => (
                    <div key={i} className="flex items-center justify-between p-4 rounded-2xl bg-[var(--bg-primary)] border border-[var(--border)]">
                      <span className="text-sm font-bold text-[var(--text-primary)]">{n.channel}</span>
                      <span className={`text-[10px] font-black uppercase px-2 py-1 rounded-lg ${n.status === 'Active' ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
                        {n.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Department Distribution */}
              <div className="p-8 rounded-[40px] bg-[var(--bg-secondary)] border border-[var(--border)] shadow-[var(--card-shadow)]">
                <div className="flex items-center gap-4 mb-8">
                  <div className="p-3 rounded-2xl bg-purple-500/10 text-purple-500">
                    <Globe size={24} strokeWidth={2.5} />
                  </div>
                  <h4 className="text-lg font-black italic uppercase tracking-tight text-[var(--text-primary)]">Departments</h4>
                </div>
                <div className="flex flex-wrap gap-2">
                  {data.departments.map((dept, i) => (
                    <span key={i} className="px-4 py-2 rounded-xl bg-[var(--bg-primary)] border border-[var(--border)] text-xs font-bold text-[var(--text-secondary)]">
                      {dept}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </PageSection>
  );
}
