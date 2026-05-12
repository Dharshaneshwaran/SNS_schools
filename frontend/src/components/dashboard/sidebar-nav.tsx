"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "../../hooks/use-auth";
import { apiRequest } from "../../services/api-client";
import {
  Layout,
  UserList,
  Calendar,
  ArrowsLeftRight,
  ChalkboardTeacher,
  FileText,
  Gear,
  Bell,
  Users,
  GraduationCap,
  Bus,
  CalendarCheck,
  UserPlus,
  Student,
  ChatCircleDots,
  UserCircle,
  Plus,
  IdentificationCard,
  ClipboardText,
  Cake,
  MagnifyingGlass,
  Command,
  Images,
  BookOpen,
} from "@phosphor-icons/react";

interface SidebarCounts {
  notifications: number;
  profileRequests: number;
  substitutions: number;
  leaves: number;
  admission: number;
}

export function SidebarNav() {
  const pathname = usePathname();
  const { session, logout } = useAuth();
  const isAdmin   = session?.user.role === "admin" || session?.user.role === "leader";
  const isTeacher = session?.user.role === "teacher";

  const roleLabel = session?.user.role === "admin"
    ? "Admin"
    : session?.user.role === "leader"
    ? "Leader"
    : session?.user.role === "teacher"
    ? "Teacher"
    : "Portal";

  const [counts, setCounts] = useState<SidebarCounts>({
    notifications: 0,
    profileRequests: 0,
    substitutions: 0,
    leaves: 0,
    admission: 0,
  });

  useEffect(() => {
    if (!session) return;
    apiRequest<SidebarCounts>("/dashboard/counts")
      .then(setCounts)
      .catch(() => {});
  }, [session]);

  const sections = [
    {
      title: "WORKSPACE",
      items: [
        { label: "Dashboard",     href: "/dashboard",               icon: <Layout            size={16} weight="duotone" />, badge: "Live" },
        { label: "Notifications", href: "/dashboard/notifications",  icon: <Bell             size={16} weight="duotone" />, count: counts.notifications || undefined },
        { label: "Attendance",    href: "/dashboard/attendance",     icon: <UserList          size={16} weight="duotone" /> },
        { label: "Timetable",     href: "/dashboard/timetable",      icon: <Calendar          size={16} weight="duotone" /> },
        { label: "Homework",      href: "/dashboard/homework",       icon: <BookOpen          size={16} weight="duotone" /> },
        { label: "Calendar",      href: "/dashboard/calendar",       icon: <CalendarCheck     size={16} weight="duotone" /> },
        { label: "New Post",       href: "/dashboard/notice-post",     icon: <Plus   size={16} weight="bold"    />, highlight: true },
        { label: "Event Gallery",  href: "/dashboard/events-gallery",  icon: <Images size={16} weight="duotone" /> },
      ],
    },
    ...(isAdmin ? [{
      title: "MANAGEMENT",
      items: [
        { label: "Users",              href: "/dashboard/users",            icon: <Users              size={16} weight="duotone" /> },
        { label: "Staff",              href: "/dashboard/staff",            icon: <ChalkboardTeacher  size={16} weight="duotone" /> },
        { label: "Role Assignment",    href: "/dashboard/roles",            icon: <IdentificationCard size={16} weight="duotone" /> },
        { label: "Admission",          href: "/dashboard/admission",        icon: <UserPlus           size={16} weight="duotone" />, count: counts.admission || undefined },
        { label: "Profile Requests",   href: "/dashboard/profile-requests", icon: <UserCircle         size={16} weight="duotone" />, count: counts.profileRequests || undefined },
        { label: "Leave Applications", href: "/dashboard/leaves",           icon: <ClipboardText      size={16} weight="duotone" />, count: counts.leaves || undefined },
        { label: "Birthdays",          href: "/dashboard/birthdays",        icon: <Cake               size={16} weight="duotone" /> },
        { label: "Substitutions",      href: "/dashboard/substitutions",    icon: <ArrowsLeftRight    size={16} weight="duotone" />, count: counts.substitutions || undefined },
      ],
    }] : []),
    {
      title: "TOOLS",
      items: [
        ...(isTeacher ? [
          { label: "Teacher Portal", href: "/teacher-dashboard",      icon: <ChalkboardTeacher size={16} weight="duotone" />, highlight: true },
          { label: "My Profile",     href: "/dashboard/profile",      icon: <UserCircle        size={16} weight="duotone" /> },
          { label: "Substitution",   href: "/dashboard/substitution", icon: <ArrowsLeftRight   size={16} weight="duotone" /> },
        ] : []),
        { label: "Alumni",    href: "/dashboard/alumni",    icon: <Student        size={16} weight="duotone" /> },
        { label: "Results",   href: "/dashboard/results",   icon: <GraduationCap  size={16} weight="duotone" /> },
        { label: "Transport", href: "/dashboard/transport", icon: <Bus            size={16} weight="duotone" /> },
        { label: "Reports",   href: "/dashboard/reports",   icon: <FileText       size={16} weight="duotone" /> },
        { label: "Chat",      href: "/dashboard/chat",      icon: <ChatCircleDots size={16} weight="duotone" /> },
        { label: "Settings",  href: "/dashboard/settings",  icon: <Gear           size={16} weight="duotone" /> },
      ],
    },
  ];

  return (
    <aside className="hide-scrollbar h-screen w-full flex flex-col bg-white border-r border-slate-100 z-50 overflow-hidden">

      {/* Brand */}
      <div className="px-5 pt-5 pb-4 flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-[#FF7F50] text-white flex items-center justify-center font-black text-base shrink-0 shadow-md shadow-[#FF7F50]/30">
          S
        </div>
        <div>
          <p className="text-[13px] font-black text-slate-900 leading-none tracking-tight">SNS Academy</p>
          <p className="text-[10px] font-semibold text-slate-400 mt-0.5">ERP · {roleLabel}</p>
        </div>
      </div>

      {/* Search */}
      <div className="px-4 mb-3">
        <div 
          onClick={() => window.dispatchEvent(new CustomEvent("open-command-palette"))}
          className="flex items-center gap-2 bg-slate-50 border border-slate-100 rounded-xl px-3 py-2 cursor-pointer group hover:border-slate-200 transition-all shadow-sm active:scale-[0.98]"
        >
          <MagnifyingGlass size={14} className="text-slate-400 shrink-0" />
          <span className="flex-1 text-xs text-slate-400 font-medium">Search...</span>
          <div className="flex items-center gap-0.5 shrink-0">
            <span className="flex items-center justify-center w-5 h-5 rounded bg-slate-100 border border-slate-200">
              <Command size={10} className="text-slate-400" />
            </span>
            <span className="text-[10px] font-bold text-slate-300 bg-slate-100 border border-slate-200 rounded px-1">K</span>
          </div>
        </div>
      </div>

      {/* Nav sections */}
      <div className="flex-1 px-3 overflow-y-auto hide-scrollbar pb-4">
        {sections.map((section) => (
          <div key={section.title} className="mb-5">
            <p className="px-3 mb-1.5 text-[9px] font-black uppercase tracking-[0.18em] text-slate-400">
              {section.title}
            </p>
            <nav className="flex flex-col gap-px">
              {section.items.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    href={item.href}
                    key={item.href}
                    className={`group flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-[12.5px] font-semibold transition-all duration-150 ${
                      item.highlight
                        ? "bg-[#FF7F50] text-white shadow-md shadow-[#FF7F50]/20 my-1 hover:bg-[#e66a3e]"
                        : isActive
                        ? "bg-slate-50 text-slate-900 font-bold"
                        : "text-slate-500 hover:bg-slate-50 hover:text-slate-700"
                    }`}
                  >
                    <span className={`shrink-0 ${
                      item.highlight ? "text-white" :
                      isActive ? "text-[#FF7F50]" :
                      "text-slate-400 group-hover:text-slate-500"
                    }`}>
                      {item.icon}
                    </span>

                    <span className="flex-1 truncate">{item.label}</span>

                    {item.badge && (
                      <span className="text-[8px] font-black uppercase tracking-widest px-1.5 py-0.5 rounded-md bg-emerald-50 text-emerald-500 border border-emerald-100">
                        {item.badge}
                      </span>
                    )}

                    {item.count !== undefined && (
                      <span className={`text-[10px] font-black min-w-[18px] h-[18px] flex items-center justify-center rounded-md px-1 ${
                        isActive
                          ? "bg-[#FF7F50]/10 text-[#FF7F50]"
                          : "bg-slate-100 text-slate-500"
                      }`}>
                        {item.count}
                      </span>
                    )}

                    {isActive && !item.highlight && !item.count && !item.badge && (
                      <span className="w-1.5 h-1.5 rounded-full bg-[#FF7F50] shrink-0" />
                    )}
                  </Link>
                );
              })}
            </nav>
          </div>
        ))}
      </div>

      {/* Bottom profile */}
      {session && (
        <div className="px-3 pb-4 border-t border-slate-100 pt-3">
          <div className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer group">
            <div className="w-8 h-8 rounded-full bg-[#FF7F50] text-white flex items-center justify-center text-xs font-black shrink-0">
              {session.user.name.slice(0, 2).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[11px] font-bold text-slate-900 truncate leading-none">{session.user.name}</p>
              <p className="text-[10px] font-medium text-slate-400 truncate mt-0.5">{session.user.email}</p>
            </div>
            <button
              onClick={logout}
              className="p-1.5 rounded-lg text-slate-300 hover:text-rose-500 hover:bg-rose-50 transition-all"
              title="Sign out"
            >
              <Gear size={14} className="group-hover:text-slate-600 transition-colors" />
            </button>
          </div>
        </div>
      )}
    </aside>
  );
}
