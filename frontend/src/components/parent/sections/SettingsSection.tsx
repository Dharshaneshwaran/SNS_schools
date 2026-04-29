"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Gear, PencilSimple, Moon, Sun, Lock, Globe } from "@phosphor-icons/react";
import { DashboardTheme } from "../../../types/theme";

export default function SettingsSection({ theme, isDarkMode, setIsDarkMode }: { theme: DashboardTheme; isDarkMode: boolean; setIsDarkMode: (v: boolean) => void }) {
  const [language, setLanguage] = useState("English");
  const [saved, setSaved] = useState(false);

  const [profileData, setProfileData] = useState({
    fullName: "Parent Name",
    email: "parent@email.com",
    mobile: "+91 9876543210",
    city: "Coimbatore"
  });

  const [passwordData, setPasswordData] = useState({
    current: "",
    new: "",
    confirm: ""
  });

  const handleSave = () => {
    if (passwordData.new && passwordData.new !== passwordData.confirm) {
      alert("New passwords do not match!");
      return;
    }

    console.log("Saving profile data:", profileData);
    if (passwordData.new) console.log("Password updated");

    setSaved(true);
    setTimeout(() => {
      setSaved(false);
      setPasswordData({ current: "", new: "", confirm: "" });
    }, 2500);
  };

  const cardStyle: React.CSSProperties = {
    background: theme.cardBg,
    borderRadius: 16,
    padding: "24px",
    boxShadow: theme.isDark ? "none" : "0 4px 20px rgba(0,0,0,0.07)",
    marginBottom: 16,
    border: `1px solid ${theme.border}`,
    transition: "all 0.3s",
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
    <div>
      <div style={{ marginBottom: 28 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
          <Gear size={26} weight="duotone" color="#FF7F50" />
          <h1 style={{ fontFamily: "var(--font-poppins,'Poppins',sans-serif)", fontSize: 24, fontWeight: 700, color: theme.text }}>Settings</h1>
        </div>
        <p style={{ color: theme.textMuted, fontSize: 14 }}>Manage your account preferences</p>
      </div>

      {/* Edit Profile */}
      <div style={cardStyle}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 18 }}>
          <PencilSimple size={18} color="#FF7F50" weight="duotone" />
          <p style={{ fontFamily: "var(--font-poppins,'Poppins',sans-serif)", fontWeight: 700, fontSize: 15, color: theme.text }}>Edit Profile</p>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
          {[
            { label: "Full Name", key: "fullName", type: "text" },
            { label: "Email", key: "email", type: "email" },
            { label: "Mobile", key: "mobile", type: "tel" },
            { label: "City", key: "city", type: "text" },
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
        </div>
      </div>

      {/* Preferences */}
      <div style={cardStyle}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
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

      {/* Password Reset */}
      <div style={cardStyle}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 18 }}>
          <Lock size={18} color="#FF7F50" weight="duotone" />
          <p style={{ fontFamily: "var(--font-poppins,'Poppins',sans-serif)", fontWeight: 700, fontSize: 15, color: theme.text }}>Password Reset</p>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 14, maxWidth: 400 }}>
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
      </div>

      {/* Save Button */}
      <div style={{ display: "flex", justifyContent: "flex-end", gap: 12 }}>
        <button onClick={handleSave}
          style={{ padding: "13px 32px", borderRadius: 12, background: saved ? "#10B981" : "linear-gradient(90deg,#FF7F50,#e66a3e)", color: "white", border: "none", cursor: "pointer", fontWeight: 600, fontSize: 15, transition: "background 0.3s", boxShadow: "0 4px 14px rgba(255,127,80,0.3)", fontFamily: "var(--font-poppins,'Poppins',sans-serif)" }}>
          {saved ? "✓ Saved!" : "Save Changes"}
        </button>
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
      justifyContent: on ? "flex-end" : "flex-start",
    }}>
    <motion.div animate={{ x: on ? 0 : 0 }} style={{ width: 20, height: 20, borderRadius: "50%", background: "white", boxShadow: "0 2px 4px rgba(0,0,0,0.2)" }} />
  </button>
);
