"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Gear, PencilSimple, Moon, Sun, Lock, Globe, CheckCircle, XCircle, SpinnerGap, GraduationCap } from "@phosphor-icons/react";
import { DashboardTheme } from "../../../types/theme";
import { apiRequest } from "../../../services/api-client";

function getAccessToken(): string | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem("sns-erp-session");
    if (!raw) return null;
    const session = JSON.parse(raw);
    return session.accessToken ?? null;
  } catch {
    return null;
  }
}

type ToastType = { message: string; type: "success" | "error" } | null;

export default function SettingsSection({ theme, isDarkMode, setIsDarkMode }: { theme: DashboardTheme; isDarkMode: boolean; setIsDarkMode: (v: boolean) => void }) {
  const [language, setLanguage] = useState("English");
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<ToastType>(null);

  const [profileData, setProfileData] = useState({
    fullName: "Parent Name",
    email: "parent@email.com",
    mobile: "+91 9876543210",
    city: "Coimbatore",
    fatherMobile: "",
    motherMobile: "",
    guardianMobile: "",
    address: ""
  });

  const [passwordData, setPasswordData] = useState({
    current: "",
    new: "",
    confirm: ""
  });

  const [saved, setSaved] = useState(false);

  const showToast = (message: string, type: "success" | "error") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  const handleSendApproval = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 3500);
  };

  const handleSaveProfile = async () => {
    const token = getAccessToken();
    if (!token) {
      showToast("You are not logged in. Please log in again.", "error");
      return;
    }

    setSaving(true);
    try {
      await apiRequest<{ message: string }>("/auth/profile", {
        method: "PATCH",
        headers: { Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          name: profileData.fullName,
          email: profileData.email,
        }),
      });
      showToast("Profile updated successfully!", "success");
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to update profile.";
      showToast(message, "error");
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async () => {
    if (!passwordData.current) {
      showToast("Please enter your current password.", "error");
      return;
    }
    if (!passwordData.new) {
      showToast("Please enter a new password.", "error");
      return;
    }
    if (passwordData.new.length < 6) {
      showToast("New password must be at least 6 characters.", "error");
      return;
    }
    if (passwordData.new !== passwordData.confirm) {
      showToast("New passwords do not match!", "error");
      return;
    }

    const token = getAccessToken();
    if (!token) {
      showToast("You are not logged in. Please log in again.", "error");
      return;
    }

    setSaving(true);
    try {
      await apiRequest<{ message: string }>("/auth/change-password", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          currentPassword: passwordData.current,
          newPassword: passwordData.new,
        }),
      });
      showToast("Password changed successfully!", "success");
      setPasswordData({ current: "", new: "", confirm: "" });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to change password.";
      showToast(message, "error");
    } finally {
      setSaving(false);
    }
  };

  const rowStyle: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "14px 0",
    borderBottom: `1px solid ${theme.border}`,
  };

  const labelStyle2: React.CSSProperties = {
    fontSize: 12,
    fontWeight: 600,
    color: theme.textMuted,
    marginBottom: 6,
    textTransform: "uppercase" as const,
    letterSpacing: "0.04em",
  };

  const inputStyle2: React.CSSProperties = {
    width: "100%",
    padding: "12px 14px",
    borderRadius: 10,
    border: `1px solid ${theme.border}`,
    fontSize: 14,
    outline: "none",
    fontFamily: "var(--font-inter,'Inter',sans-serif)",
    color: theme.text,
    background: theme.isDark ? "rgba(255,255,255,0.03)" : "#fafafa",
    transition: "all 0.3s",
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
      {/* Toast Notification */}
      {toast && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          style={{
            position: "fixed",
            top: 20,
            right: 20,
            zIndex: 9999,
            display: "flex",
            alignItems: "center",
            gap: 10,
            padding: "14px 20px",
            borderRadius: 12,
            background: toast.type === "success" ? "#10B981" : "#EF4444",
            color: "white",
            fontSize: 14,
            fontWeight: 600,
            boxShadow: "0 8px 30px rgba(0,0,0,0.15)",
            fontFamily: "var(--font-inter,'Inter',sans-serif)",
          }}
        >
          {toast.type === "success" ? <CheckCircle size={20} weight="fill" /> : <XCircle size={20} weight="fill" />}
          {toast.message}
        </motion.div>
      )}

      <div style={{ marginBottom: 4 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
          <Gear size={26} weight="duotone" color="#FF7F50" />
          <h1 style={{ fontFamily: "var(--font-poppins,'Poppins',sans-serif)", fontSize: 24, fontWeight: 700, color: theme.text }}>Settings</h1>
        </div>
        <p style={{ color: theme.textMuted, fontSize: 14 }}>Manage your account preferences</p>
      </div>

      {/* Edit Profile */}
      <div className="premium-card" style={{ padding: "32px" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 18 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <PencilSimple size={18} color="#FF7F50" weight="duotone" />
            <p style={{ fontFamily: "var(--font-poppins,'Poppins',sans-serif)", fontWeight: 700, fontSize: 15, color: theme.text }}>Edit Profile</p>
          </div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 20 }}>
          {[
            { label: "Full Name", key: "fullName", type: "text" },
            { label: "Email", key: "email", type: "email" },
            { label: "Mobile", key: "mobile", type: "tel" },
            { label: "City", key: "city", type: "text" },
            { label: "Father's Mobile", key: "fatherMobile", type: "tel" },
            { label: "Mother's Mobile", key: "motherMobile", type: "tel" },
            { label: "Guardian Mobile (Optional)", key: "guardianMobile", type: "tel" },
          ].map((f, i) => (
            <div key={i}>
              <label style={labelStyle2}>{f.label}</label>
              <input 
                type={f.type} 
                value={profileData[f.key as keyof typeof profileData]}
                onChange={(e) => setProfileData({ ...profileData, [f.key]: e.target.value })}
                style={inputStyle2} 
              />
            </div>
          ))}
          <div style={{ gridColumn: "span 2" }}>
            <label style={labelStyle2}>Current Address</label>
            <textarea 
              value={profileData.address}
              onChange={(e) => setProfileData({ ...profileData, address: e.target.value })}
              placeholder="Enter your full address..." 
              rows={3}
              style={{ ...inputStyle2, resize: "none" } as React.CSSProperties} 
            />
          </div>
        </div>

        <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 32 }}>
          <button onClick={handleSendApproval}
            style={{ padding: "14px 40px", borderRadius: 14, background: saved ? "#10B981" : "linear-gradient(90deg,#FF7F50,#e66a3e)", color: "white", border: "none", cursor: "pointer", fontWeight: 700, fontSize: 15, transition: "background 0.3s", boxShadow: "0 6px 20px rgba(255,127,80,0.3)", fontFamily: "var(--font-poppins,'Poppins',sans-serif)" }}>
            {saved ? "✓ Approval Sent to Admin" : "Send Approval to Admin"}
          </button>
        </div>
      </div>

      {/* Preferences */}
      <div className="premium-card" style={{ padding: "32px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
          <Sun size={18} color="#FF7F50" weight="duotone" />
          <p style={{ fontFamily: "var(--font-poppins,'Poppins',sans-serif)", fontWeight: 700, fontSize: 15, color: theme.text }}>Preferences</p>
        </div>

        <div style={rowStyle}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            {isDarkMode ? <Moon size={18} color="#6C63FF" /> : <Sun size={18} color="#F59E0B" />}
            <div>
              <p style={{ fontSize: 14, fontWeight: 600, color: theme.text }}>Dark Mode</p>
              <p style={{ fontSize: 12, color: theme.textMuted }}>Switch between light and dark theme</p>
            </div>
          </div>
          <Toggle on={isDarkMode} onToggle={() => setIsDarkMode(!isDarkMode)} />
        </div>

        <div style={{ ...rowStyle, borderBottom: "none" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <Globe size={18} color="#10B981" />
            <div>
              <p style={{ fontSize: 14, fontWeight: 600, color: theme.text }}>Language</p>
              <p style={{ fontSize: 12, color: theme.textMuted }}>Choose your preferred language</p>
            </div>
          </div>
          <select value={language} onChange={(e) => setLanguage(e.target.value)}
            style={{ padding: "8px 14px", borderRadius: 8, border: `1px solid ${theme.border}`, fontSize: 13, color: theme.text, background: theme.cardBg, outline: "none", cursor: "pointer", fontFamily: "var(--font-inter,'Inter',sans-serif)" }}>
            {["English", "Tamil", "Hindi"].map(l => <option key={l} value={l}>{l}</option>)}
          </select>
        </div>
      </div>

      {/* Change Password */}
      <div className="premium-card" style={{ padding: "32px" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 18 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <Lock size={18} color="#FF7F50" weight="duotone" />
            <p style={{ fontFamily: "var(--font-poppins,'Poppins',sans-serif)", fontWeight: 700, fontSize: 15, color: theme.text }}>Change Password</p>
          </div>
          <button
            onClick={handleChangePassword}
            disabled={saving || !passwordData.current || !passwordData.new}
            style={{
              padding: "8px 20px", borderRadius: 10,
              background: (!passwordData.current || !passwordData.new) ? (theme.isDark ? "#333" : "#ddd") : "linear-gradient(90deg,#FF7F50,#e66a3e)",
              color: (!passwordData.current || !passwordData.new) ? theme.textMuted : "white",
              border: "none", cursor: (!passwordData.current || !passwordData.new || saving) ? "not-allowed" : "pointer",
              fontWeight: 600, fontSize: 13, opacity: saving ? 0.7 : 1,
              transition: "all 0.3s", fontFamily: "var(--font-poppins,'Poppins',sans-serif)",
              boxShadow: (!passwordData.current || !passwordData.new) ? "none" : "0 2px 10px rgba(255,127,80,0.25)",
              display: "flex", alignItems: "center", gap: 6,
            }}
          >
            {saving && <SpinnerGap size={14} className="animate-spin" />}
            {saving ? "Changing..." : "Change Password"}
          </button>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 20 }}>
          {[
            { label: "Current Password", key: "current" },
            { label: "New Password", key: "new" },
            { label: "Confirm New Password", key: "confirm" }
          ].map((f, i) => (
            <div key={i}>
              <label style={labelStyle2}>{f.label}</label>
              <input 
                type="password" 
                value={passwordData[f.key as keyof typeof passwordData]}
                onChange={(e) => setPasswordData({ ...passwordData, [f.key]: e.target.value })}
                placeholder="••••••••" 
                style={inputStyle2} 
              />
            </div>
          ))}
        </div>
        <button style={{ background: "none", border: "none", color: "#FF7F50", fontSize: 13, fontWeight: 600, cursor: "pointer", textAlign: "left", padding: 0, marginTop: 16 }}>
          Forgot Password?
        </button>
      </div>

      {/* Add Student */}
      <div className="premium-card" style={{ padding: "32px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 18 }}>
          <GraduationCap size={18} color="#FF7F50" weight="duotone" />
          <p style={{ fontFamily: "var(--font-poppins,'Poppins',sans-serif)", fontWeight: 700, fontSize: 15, color: theme.text }}>Add Another Student</p>
        </div>
        <p style={{ color: theme.textMuted, fontSize: 13, marginBottom: 20 }}>Link another student profile to switch between them easily.</p>
        
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 20, alignItems: "end" }}>
          <div>
            <label style={labelStyle2}>Student ID</label>
            <input type="text" placeholder="SNS-2026-XXXX" style={inputStyle2} />
          </div>
          <div>
            <label style={labelStyle2}>Password</label>
            <input type="password" placeholder="••••••••" style={inputStyle2} />
          </div>
          <button
            style={{
              padding: "12px 24px", borderRadius: 10,
              background: "linear-gradient(90deg,#FF7F50,#e66a3e)", color: "white",
              border: "none", cursor: "pointer",
              fontWeight: 700, fontSize: 14,
              fontFamily: "var(--font-poppins,'Poppins',sans-serif)",
              boxShadow: "0 4px 15px rgba(255,127,80,0.2)"
            }}
          >
            Link Student
          </button>
        </div>
      </div>
    </div>
  );
}

const Toggle = ({ on, onToggle }: { on: boolean; onToggle: () => void }) => (
  <button onClick={onToggle}
    style={{
      width: 46, height: 26, borderRadius: 13, padding: 3, border: "none",
      background: on ? "#FF7F50" : "#ddd", cursor: "pointer",
      transition: "background 0.3s", display: "flex", alignItems: "center",
    }}>
    <motion.div animate={{ x: on ? 20 : 0 }} transition={{ type: "spring", stiffness: 500, damping: 30 }} style={{ width: 20, height: 20, borderRadius: "50%", background: "white", boxShadow: "0 2px 4px rgba(0,0,0,0.2)" }} />
  </button>
);
