"use client";

import { useState } from "react";
import ParentSidebar from "../../components/parent/ParentSidebar";
import EventsGallery from "../../components/parent/sections/EventsGallery";
import ProfileSection from "../../components/parent/sections/ProfileSection";
import DiarySection from "../../components/parent/sections/DiarySection";
import AcademicSection from "../../components/parent/sections/AcademicSection";
import TransportSection from "../../components/parent/sections/TransportSection";
import SettingsSection from "../../components/parent/sections/SettingsSection";
import { List } from "@phosphor-icons/react";

export type MenuKey = "events" | "profile" | "diary" | "academic" | "transport" | "settings";

const students = [
  { id: 1, name: "Arjun Sharma", class: "8", section: "A", avatar: "AS" },
  { id: 2, name: "Priya Sharma", class: "5", section: "B", avatar: "PS" },
];

export default function ParentDashboard() {
  const [activeMenu, setActiveMenu] = useState<MenuKey>("events");
  const [activeStudent, setActiveStudent] = useState(students[0]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

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
    <div className="flex min-h-screen bg-[#f4f6fb] font-sans relative">
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar Wrapper */}
      <div 
        className={`fixed inset-y-0 left-0 z-50 transform ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"} md:relative md:translate-x-0 transition-transform duration-300 ease-in-out bg-white`}
      >
        <ParentSidebar
          students={students}
          activeStudent={activeStudent}
          setActiveStudent={(s) => { setActiveStudent(s); setIsSidebarOpen(false); }}
          activeMenu={activeMenu}
          setActiveMenu={(m) => { setActiveMenu(m); setIsSidebarOpen(false); }}
        />
      </div>

      <main className="flex-1 h-screen overflow-y-auto w-full min-w-0">
        {/* Mobile Header Component */}
        <div className="md:hidden flex items-center justify-between p-4 bg-white border-b border-gray-100 sticky top-0 z-30 shadow-sm">
          <button 
            onClick={() => setIsSidebarOpen(true)}
            className="p-1 text-[#FF7F50] rounded-md hover:bg-orange-50 transition-colors"
          >
            <List size={28} weight="bold" />
          </button>
          <div className="flex flex-col items-center">
            <span className="font-bold text-[#121212] text-sm font-poppins">SNS Academy</span>
            <span className="text-[10px] text-[#FF7F50] font-bold tracking-wider">PARENT</span>
          </div>
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#FF7F50] to-[#e66a3e] text-white flex items-center justify-center font-bold text-sm shadow-md">
            {activeStudent.avatar}
          </div>
        </div>

        {/* Dynamic Page Content */}
        <div className="p-4 md:p-8">
          {renderContent()}
        </div>
      </main>
    </div>
  );
}
