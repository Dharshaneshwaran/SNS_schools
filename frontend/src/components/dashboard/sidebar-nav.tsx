"use client";

import Link from "next/link";
import Image from "next/image";
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
  ChatCircleDots,
  UserCircle
} from "@phosphor-icons/react";

export function SidebarNav() {
  const pathname = usePathname();
  const { session, logout } = useAuth();
  const isAdmin = session?.user.role === "admin" || session?.user.role === "superadmin";
  const isTeacher = session?.user.role === "teacher";

  const sections = [
    {
      title: "MENU",
      items: [
        { label: "Dashboard", href: "/admin-dashboard", icon: <Layout size={18} weight="duotone" /> },
        { label: "Notifications", href: "/admin-dashboard/notifications", icon: <Bell size={18} weight="duotone" /> },
        { label: "Attendance", href: "/admin-dashboard/attendance", icon: <UserList size={18} weight="duotone" /> },
        { label: "Timetable", href: "/admin-dashboard/timetable", icon: <Calendar size={18} weight="duotone" /> },
        { label: "Calendar", href: "/admin-dashboard/calendar", icon: <CalendarCheck size={18} weight="duotone" /> },
      ]
    },
    // Only show MANAGEMENT to Admins
    ...(isAdmin ? [{
      title: "MANAGEMENT",
      items: [
        { label: "Users", href: "/admin-dashboard/users", icon: <Users size={18} weight="duotone" /> },
        { label: "Staff", href: "/admin-dashboard/staff", icon: <ChalkboardTeacher size={18} weight="duotone" /> },
        { label: "Admission", href: "/admin-dashboard/admission", icon: <UserPlus size={18} weight="duotone" /> },
      ]
    }] : []),
    {
      title: "TOOLS",
      items: [
        ...(isTeacher ? [{ label: "My Profile", href: "/admin-dashboard/profile", icon: <UserCircle size={18} weight="duotone" /> }] : []),
        ...(isTeacher ? [{ label: "Substitution", href: "/admin-dashboard/substitution", icon: <ArrowsLeftRight size={18} weight="duotone" /> }] : []),
        { label: "Alumni", href: "/admin-dashboard/alumni", icon: <Student size={18} weight="duotone" /> },
        { label: "Results", href: "/admin-dashboard/results", icon: <GraduationCap size={18} weight="duotone" /> },
        { label: "Transport", href: "/admin-dashboard/transport", icon: <Bus size={18} weight="duotone" /> },
        { label: "Reports", href: "/admin-dashboard/reports", icon: <FileText size={18} weight="duotone" /> },
        { label: "Chat", href: "/admin-dashboard/chat", icon: <ChatCircleDots size={18} weight="duotone" /> },
        { label: "Settings", href: "/admin-dashboard/settings", icon: <Gear size={18} weight="duotone" /> },
      ]
    }
  ];

  return (
    <aside className="hide-scrollbar h-screen w-full flex flex-col bg-[var(--bg-secondary)] border-r border-[var(--border)] z-50 overflow-hidden transition-colors duration-300">
      {/* Logo Section */}
      <div className="p-6 pb-7 border-b border-[var(--border)]">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[var(--bg-secondary)] p-1.5 shadow-[0_8px_20px_rgba(0,0,0,0.06)] border border-[var(--border)]">
            <Image src="/images/logo.png" alt="Logo" width={40} height={40} className="w-full h-auto object-contain" />
          </div>
          <div>
            <p className="text-base font-extrabold tracking-tight text-[var(--text-primary)] leading-none">
              SNS Academy
            </p>
            <p className="text-[10px] font-extrabold uppercase tracking-[0.12em] text-[var(--accent)] mt-1.5">
              {isAdmin ? "Admin Panel" : (isTeacher ? "Teacher Portal" : "User Portal")}
            </p>
          </div>
        </div>
      </div>

      {/* Navigation Sections */}
      <div className="flex-1 px-3 py-6 overflow-y-auto hide-scrollbar">
        {sections.map((section) => (
          <div key={section.title} className="mb-6">
            <p className="px-4 mb-3 text-[10px] font-extrabold uppercase tracking-[0.12em] text-[var(--text-secondary)]">
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
                        ? "bg-[var(--accent)]/[0.08] text-[var(--accent)]"
                        : "text-[var(--text-secondary)] hover:bg-[var(--bg-primary)] hover:text-[var(--text-primary)]"
                    }`}
                  >
                    <span className={`transition-colors ${isActive ? "text-[var(--accent)]" : "text-[var(--text-secondary)] group-hover:text-[var(--text-primary)]"}`}>
                      {item.icon}
                    </span>
                    {item.label}
                    {isActive && (
                      <span className="ml-auto h-1.5 w-1.5 rounded-full bg-[var(--accent)]" />
                    )}
                  </Link>
                );
              })}
            </nav>
          </div>
        ))}
      </div>

      {/* Footer / Sign Out */}
      <div className="p-3.5 border-t border-[var(--border)]">
        <button 
          onClick={logout}
          className="flex w-full items-center justify-center gap-2 rounded-xl p-3 text-[var(--text-secondary)] font-bold text-sm transition-all hover:bg-red-50 hover:text-red-500"
        >
          <SignOut size={18} weight="duotone" />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
}
