"use client";

import React from "react";
import { motion } from "framer-motion";
import { 
  LayoutDashboard, 
  Users, 
  Calendar, 
  MessageSquare, 
  Menu
} from "lucide-react";

interface BottomNavProps {
  activeSection: string;
  setActiveSection: (section: string) => void;
}

export default function TeacherBottomNav({ activeSection, setActiveSection }: BottomNavProps) {
  const navItems = [
    { id: "overview", label: "Home", icon: LayoutDashboard },
    { id: "classes", label: "Classes", icon: Users },
    { id: "schedule", label: "Schedule", icon: Calendar },
    { id: "communication", label: "Chat", icon: MessageSquare },
    { id: "menu", label: "More", icon: Menu },
  ];

  return (
    <div style={{
      position: "fixed",
      bottom: 0,
      left: 0,
      right: 0,
      height: "70px",
      backgroundColor: "var(--header-bg)",
      backdropFilter: "blur(10px)",
      borderTop: "1px solid var(--border-color)",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-around",
      padding: "0 12px",
      zIndex: 1000,
      boxShadow: "var(--shadow)",
    }}>
      {navItems.map((item) => {
        const isActive = activeSection === item.id;
        return (
          <motion.button
            key={item.id}
            whileTap={{ scale: 0.9 }}
            onClick={() => setActiveSection(item.id)}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "4px",
              background: "none",
              border: "none",
              color: isActive ? "#FF7A1A" : "var(--text-secondary)",
              cursor: "pointer",
              transition: "color 0.2s",
              position: "relative",
              flex: 1,
            }}
          >
            <div style={{
              width: "24px",
              height: "24px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}>
              <item.icon size={22} strokeWidth={isActive ? 2.5 : 2} />
            </div>
            <span style={{ 
              fontSize: "10px", 
              fontWeight: isActive ? 700 : 500,
              fontFamily: "'Inter', sans-serif"
            }}>
              {item.label}
            </span>
            
            {isActive && (
              <motion.div
                layoutId="bottom-nav-indicator"
                style={{
                  position: "absolute",
                  top: "-15px",
                  width: "20px",
                  height: "3px",
                  backgroundColor: "#FF7A1A",
                  borderRadius: "0 0 4px 4px",
                  boxShadow: "0 0 10px rgba(255, 122, 26, 0.5)",
                }}
              />
            )}
          </motion.button>
        );
      })}
    </div>
  );
}
