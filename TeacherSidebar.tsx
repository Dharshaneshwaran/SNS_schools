"use client";

import React from "react";
import { motion } from "framer-motion";
import { 
  LayoutDashboard, 
  Users, 
  Calendar, 
  FileText, 
  MessageSquare, 
  BookOpen, 
  Settings, 
  LogOut,
  ChevronRight,
  TrendingUp,
  FileBarChart
} from "lucide-react";

interface SidebarItemProps {
  icon: React.ElementType;
  label: string;
  active?: boolean;
  onClick: () => void;
  badge?: string;
}

const SidebarItem = ({ icon: Icon, label, active, onClick, badge }: SidebarItemProps) => {
  return (
    <motion.button
      whileHover={{ x: 4 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      style={{
        width: "100%",
        display: "flex",
        alignItems: "center",
        gap: "12px",
        padding: "12px 16px",
        borderRadius: "12px",
        backgroundColor: active ? "rgba(255, 106, 0, 0.1)" : "transparent",
        border: "none",
        cursor: "pointer",
        color: active ? "#FF7A1A" : "var(--text-secondary)",
        transition: "all 0.2s ease",
        marginBottom: "4px",
        position: "relative",
      }}
    >
      <Icon size={20} strokeWidth={active ? 2.5 : 2} />
      <span style={{ 
        fontWeight: active ? 600 : 500, 
        fontSize: "14px",
        fontFamily: "'Inter', sans-serif"
      }}>
        {label}
      </span>
      {active && (
        <motion.div
          layoutId="sidebar-active"
          style={{
            position: "absolute",
            left: 0,
            width: "3px",
            height: "20px",
            backgroundColor: "#FF7A1A",
            borderRadius: "0 4px 4px 0",
            boxShadow: "0 0 10px rgba(255, 122, 26, 0.5)",
          }}
        />
      )}
      {badge && (
        <span style={{
          marginLeft: "auto",
          backgroundColor: "#FF7A1A",
          color: "white",
          fontSize: "10px",
          fontWeight: 700,
          padding: "2px 6px",
          borderRadius: "10px",
          boxShadow: "0 2px 8px rgba(255, 106, 0, 0.4)"
        }}>
          {badge}
        </span>
      )}
    </motion.button>
  );
};

interface TeacherSidebarProps {
  activeSection: string;
  setActiveSection: (section: string) => void;
}

export default function TeacherSidebar({ activeSection, setActiveSection }: TeacherSidebarProps) {
  const menuItems = [
    { id: "overview", label: "Dashboard", icon: LayoutDashboard },
    { id: "classes", label: "Classes & Subjects", icon: Users },
    { id: "schedule", label: "Schedule", icon: Calendar },
    { id: "assignments", label: "Assignments & Exams", icon: FileText, badge: "3" },
    { id: "communication", label: "Communication", icon: MessageSquare, badge: "New" },
    { id: "resources", label: "Learning Resources", icon: BookOpen },
  ];

  const toolItems = [
    { id: "reports", label: "Reports", icon: FileBarChart },
    { id: "analytics", label: "Analytics", icon: TrendingUp },
    { id: "settings", label: "Settings", icon: Settings },
  ];

  return (
    <aside style={{
      width: "280px",
      height: "100vh",
      backgroundColor: "var(--bg-primary)",
      borderRight: "1px solid var(--border-color)",
      display: "flex",
      flexDirection: "column",
      padding: "24px 16px",
      position: "sticky",
      top: 0,
      zIndex: 100,
    }}>
      {/* Brand */}
      <div style={{ display: "flex", alignItems: "center", gap: "12px", padding: "0 8px 32px" }}>
        <div style={{
          width: "40px",
          height: "40px",
          borderRadius: "12px",
          background: "linear-gradient(135deg, #FF6A00, #FF7A1A)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: "0 4px 15px rgba(255, 106, 0, 0.3)",
        }}>
          <span style={{ color: "white", fontWeight: 800, fontSize: "18px" }}>S</span>
        </div>
        <div>
          <h1 style={{ color: "var(--text-primary)", fontSize: "16px", fontWeight: 700, margin: 0 }}>SNS Academy</h1>
          <p style={{ color: "#FF7A1A", fontSize: "10px", fontWeight: 600, letterSpacing: "1px", textTransform: "uppercase", margin: 0 }}>Teacher Portal</p>
        </div>
      </div>

      {/* Main Menu */}
      <div style={{ flex: 1 }}>
        <p style={{ color: "var(--text-secondary)", fontSize: "11px", opacity: 0.7, fontWeight: 700, letterSpacing: "1px", textTransform: "uppercase", padding: "0 16px 12px" }}>Menu</p>
        {menuItems.map((item) => (
          <SidebarItem
            key={item.id}
            icon={item.icon}
            label={item.label}
            active={activeSection === item.id}
            onClick={() => setActiveSection(item.id)}
            badge={item.badge}
          />
        ))}

        <div style={{ margin: "24px 0" }}>
          <p style={{ color: "var(--text-secondary)", fontSize: "11px", opacity: 0.7, fontWeight: 700, letterSpacing: "1px", textTransform: "uppercase", padding: "0 16px 12px" }}>Tools</p>
          {toolItems.map((item) => (
            <SidebarItem
              key={item.id}
              icon={item.icon}
              label={item.label}
              active={activeSection === item.id}
              onClick={() => setActiveSection(item.id)}
            />
          ))}
        </div>
      </div>

      {/* Footer / Sign Out */}
      <div style={{ paddingTop: "24px", borderTop: "1px solid var(--border-color)" }}>
        <motion.button
          whileHover={{ x: 4 }}
          style={{
            width: "100%",
            display: "flex",
            alignItems: "center",
            gap: "12px",
            padding: "12px 16px",
            borderRadius: "12px",
            backgroundColor: "transparent",
            border: "none",
            cursor: "pointer",
            color: "#FF4D4D",
            transition: "all 0.2s ease",
          }}
        >
          <LogOut size={20} />
          <span style={{ fontWeight: 500, fontSize: "14px" }}>Sign Out</span>
        </motion.button>
      </div>
    </aside>
  );
}
