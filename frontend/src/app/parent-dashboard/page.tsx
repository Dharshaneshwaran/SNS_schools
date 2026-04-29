"use client";

import { useState } from "react";
import ParentSidebar from "../../components/parent/ParentSidebar";
import EventsGallery from "../../components/parent/sections/EventsGallery";
import ProfileSection from "../../components/parent/sections/ProfileSection";
import DiarySection from "../../components/parent/sections/DiarySection";
import AcademicSection from "../../components/parent/sections/AcademicSection";
import TransportSection from "../../components/parent/sections/TransportSection";
import SettingsSection from "../../components/parent/sections/SettingsSection";

export type MenuKey = "events" | "profile" | "diary" | "academic" | "transport" | "settings";

const students = [
  { id: 1, name: "Arjun Sharma", class: "8", section: "A", avatar: "AS" },
  { id: 2, name: "Priya Sharma", class: "5", section: "B", avatar: "PS" },
];

export default function ParentDashboard() {
  const [activeMenu, setActiveMenu] = useState<MenuKey>("events");
  const [activeStudent, setActiveStudent] = useState(students[0]);

  const renderContent = () => {
    switch (activeMenu) {
      case "events":    return <EventsGallery />;
      case "profile":   return <ProfileSection student={activeStudent} />;
      case "diary":     return <DiarySection student={activeStudent} />;
      case "academic":  return <AcademicSection student={activeStudent} />;
      case "transport": return <TransportSection />;
      case "settings":  return <SettingsSection />;
      default:          return <EventsGallery />;
    }
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#f4f6fb", fontFamily: "var(--font-inter,'Inter',sans-serif)" }}>
      <ParentSidebar
        students={students}
        activeStudent={activeStudent}
        setActiveStudent={setActiveStudent}
        activeMenu={activeMenu}
        setActiveMenu={setActiveMenu}
      />
      <main style={{ flex: 1, overflowY: "auto", padding: "32px 36px", minWidth: 0 }}>
        {renderContent()}
      </main>
    </div>
  );
}
