"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { useAuth } from "../../hooks/use-auth";

import { 
  Layout, 
  UserList, 
  Calendar, 
  ArrowsLeftRight, 
  ChalkboardTeacher, 
  FileText, 
  Gear,
  SignOut,
  Bell,
  Users,
  GraduationCap,
  Bus,
  CalendarCheck,
  UserPlus,
  Student,
  ChatCircleDots
} from "@phosphor-icons/react";

export function SidebarNav() {
  const pathname = usePathname();
  const { session, logout } = useAuth();
  const isAdmin = session?.user.role === "admin" || session?.user.role === "superadmin";

  const sections = [
    {
      title: "MENU",
      items: [
        { label: "Dashboard", href: "/dashboard", icon: <Layout size={18} weight="duotone" /> },
        { label: "Notifications", href: "/dashboard/notifications", icon: <Bell size={18} weight="duotone" /> },
        { label: "Attendance", href: "/dashboard/attendance", icon: <UserList size={18} weight="duotone" /> },
        { label: "Timetable", href: "/dashboard/timetable", icon: <Calendar size={18} weight="duotone" /> },
        { label: "Calendar", href: "/dashboard/calendar", icon: <CalendarCheck size={18} weight="duotone" /> },
      ]
    },
    // Only show MANAGEMENT to Admins
    ...(isAdmin ? [{
      title: "MANAGEMENT",
      items: [
        { label: "Users", href: "/dashboard/users", icon: <Users size={18} weight="duotone" /> },
        { label: "Staff", href: "/dashboard/staff", icon: <ChalkboardTeacher size={18} weight="duotone" /> },
        { label: "Admission", href: "/dashboard/admission", icon: <UserPlus size={18} weight="duotone" /> },
      ]
    }] : []),
    {
      title: "TOOLS",
      items: [
        // Both can see Students, but it might be in different contexts
        { label: "Students", href: "/dashboard/students", icon: <Student size={18} weight="duotone" /> },
        { label: "Results", href: "/dashboard/results", icon: <GraduationCap size={18} weight="duotone" /> },
        { label: "Transport", href: "/dashboard/transport", icon: <Bus size={18} weight="duotone" /> },
        { label: "Reports", href: "/dashboard/reports", icon: <FileText size={18} weight="duotone" /> },
        { label: "Chat", href: "/dashboard/chat", icon: <ChatCircleDots size={18} weight="duotone" /> },
        { label: "Settings", href: "/dashboard/settings", icon: <Gear size={18} weight="duotone" /> },
      ]
    }
  ];

  return (
    <aside className="hide-scrollbar h-screen w-full flex flex-col bg-white border-r border-[#F1F5F9] z-50 overflow-hidden">
      {/* Logo Section */}
      <div className="p-6 pb-7 border-b border-[#F1F5F9]">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white p-1.5 shadow-[0_8px_20px_rgba(0,0,0,0.06)] border border-black/5">
            <img src="/images/logo.png" alt="Logo" className="w-full h-auto object-contain" />
          </div>
          <div>
            <p className="text-base font-extrabold tracking-tight text-slate-900 leading-none">
              SNS Academy
            </p>
            <p className="text-[10px] font-extrabold uppercase tracking-[0.12em] text-[#FF7F50] mt-1.5">
              {isAdmin ? "Admin Panel" : "Teacher Portal"}
            </p>
          </div>
        </div>
      </div>

      {/* Navigation Sections */}
      <div className="flex-1 px-3 py-6 overflow-y-auto hide-scrollbar">
        {sections.map((section) => (
          <div key={section.title} className="mb-6">
            <p className="px-4 mb-3 text-[10px] font-extrabold uppercase tracking-[0.12em] text-slate-400">
              {section.title}
            </p>
            <nav className="flex flex-col gap-1">
              {section.items.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    href={item.href}
                    key={item.href}
                    className={`group flex w-full items-center gap-3 rounded-xl px-4 py-2.5 text-[13.5px] font-bold transition-all duration-200 ${
                      isActive
                        ? "bg-[#FF7F50]/[0.08] text-[#FF7F50]"
                        : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                    }`}
                  >
                    <span className={`transition-colors ${isActive ? "text-[#FF7F50]" : "text-slate-400 group-hover:text-slate-600"}`}>
                      {item.icon}
                    </span>
                    {item.label}
                    {isActive && (
                      <span className="ml-auto h-1.5 w-1.5 rounded-full bg-[#FF7F50]" />
                    )}
                  </Link>
                );
              })}
            </nav>
          </div>
        ))}
      </div>

      {/* Footer / Sign Out */}
      <div className="p-3.5 border-t border-[#F1F5F9]">
        <button 
          onClick={logout}
          className="flex w-full items-center justify-center gap-2 rounded-xl p-3 text-slate-500 font-bold text-sm transition-all hover:bg-red-50 hover:text-red-500"
        >
          <SignOut size={18} weight="duotone" />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
}
