import React from "react";
import { motion } from "framer-motion";
import { Search, Bell, Mail, ChevronDown, Sun, Moon } from "lucide-react";

interface TeacherHeaderProps {
  theme: "dark" | "light";
  toggleTheme: () => void;
}

export default function TeacherHeader({ theme, toggleTheme }: TeacherHeaderProps) {
  return (
    <header style={{
      height: "80px",
      padding: "0 32px",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      backgroundColor: "var(--bg-primary)",
      borderBottom: "1px solid var(--border-color)",
      position: "sticky",
      top: 0,
      zIndex: 90,
    }} className="header-container">
      {/* Search Bar - Hidden on small mobile, compact on tablet */}
      <div className="search-wrapper">
        <Search 
          size={18} 
          style={{ 
            position: "absolute", 
            left: "16px", 
            top: "50%", 
            transform: "translateY(-50%)", 
            color: "var(--text-secondary)" 
          }} 
        />
        <input 
          type="text" 
          placeholder="Search..."
          className="search-input"
        />
      </div>

      {/* Right Side: Theme, Notifications & Profile */}
      <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
        {/* Theme Toggle */}
        <motion.button
          whileHover={{ scale: 1.05, backgroundColor: "var(--card-hover)" }}
          whileTap={{ scale: 0.95 }}
          onClick={toggleTheme}
          className="icon-button"
          style={{ color: "var(--text-secondary)" }}
        >
          {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
        </motion.button>

        {/* Notifications - Only show one icon on mobile */}
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <motion.button
            whileHover={{ scale: 1.05, backgroundColor: "var(--card-hover)" }}
            whileTap={{ scale: 0.95 }}
            className="icon-button"
            style={{ color: "var(--text-secondary)" }}
          >
            <Bell size={20} />
            <div style={{
              position: "absolute",
              top: "10px",
              right: "10px",
              width: "8px",
              height: "8px",
              backgroundColor: "#FF6A00",
              borderRadius: "50%",
              border: "2px solid var(--bg-primary)"
            }} />
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05, backgroundColor: "var(--card-hover)" }}
            whileTap={{ scale: 0.95 }}
            className="icon-button desktop-only"
            style={{ color: "var(--text-secondary)" }}
          >
            <Mail size={20} />
          </motion.button>
        </div>

        {/* Divider */}
        <div className="divider desktop-only" />

        {/* Teacher Profile */}
        <motion.div 
          whileHover={{ x: 2 }}
          style={{ 
            display: "flex", 
            alignItems: "center", 
            gap: "10px", 
            cursor: "pointer" 
          }}
        >
          <div className="profile-text desktop-only">
            <p style={{ color: "var(--text-primary)", fontSize: "14px", fontWeight: 600, margin: 0 }}>Dr. Sarah Wilson</p>
            <p style={{ color: "var(--text-secondary)", fontSize: "12px", margin: 0 }}>Senior Math HOD</p>
          </div>
          <div style={{ position: "relative" }}>
            <div style={{
              width: "40px",
              height: "40px",
              borderRadius: "10px",
              overflow: "hidden",
              border: "2px solid rgba(255, 106, 0, 0.2)",
            }}>
              <img 
                src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=150&auto=format&fit=crop" 
                alt="Profile" 
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            </div>
          </div>
          <ChevronDown size={14} color="var(--text-secondary)" className="desktop-only" />
        </motion.div>
      </div>

      <style jsx>{`
        .search-wrapper {
          position: relative;
          width: 400px;
        }

        .search-input {
          width: 100%;
          height: 40px;
          background-color: var(--input-bg);
          border: 1px solid var(--border-color);
          border-radius: 12px;
          padding: 0 16px 0 44px;
          color: var(--text-primary);
          font-size: 14px;
          outline: none;
          transition: all 0.2s ease;
        }

        .icon-button {
          width: 40px;
          height: 40px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          border: none;
          background-color: transparent;
          cursor: pointer;
          position: relative;
          transition: all 0.2s;
        }

        .divider {
          width: 1px;
          height: 32px;
          background-color: var(--border-color);
        }

        @media (max-width: 1024px) {
          .header-container {
            height: 70px;
            padding: 0 16px;
          }

          .search-wrapper {
            width: 150px;
          }

          .desktop-only {
            display: none;
          }
        }

        @media (max-width: 480px) {
          .search-wrapper {
            width: 36px;
            overflow: hidden;
          }
          .search-input {
            padding: 0;
            width: 0;
            border: none;
          }
        }
      `}</style>
    </header>
  );
}
