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

const items = [
  { label: "Dashboard", href: "/dashboard", icon: <Layout size={20} weight="duotone" /> },
  { label: "Notifications", href: "/dashboard/notifications", icon: <Bell size={20} weight="duotone" /> },
  { label: "Attendance", href: "/dashboard/attendance", icon: <UserList size={20} weight="duotone" /> },
  { label: "Users", href: "/dashboard/users", icon: <Users size={20} weight="duotone" /> },
  { label: "Results", href: "/dashboard/results", icon: <GraduationCap size={20} weight="duotone" /> },
  { label: "Transport", href: "/dashboard/transport", icon: <Bus size={20} weight="duotone" /> },
  { label: "Timetable", href: "/dashboard/timetable", icon: <Calendar size={20} weight="duotone" /> },
  { label: "Calendar", href: "/dashboard/calendar", icon: <CalendarCheck size={20} weight="duotone" /> },
  { label: "Admission", href: "/dashboard/admission", icon: <UserPlus size={20} weight="duotone" /> },
  { label: "Staff", href: "/dashboard/staff", icon: <ChalkboardTeacher size={20} weight="duotone" /> },
  { label: "Alumni", href: "/dashboard/alumni", icon: <Student size={20} weight="duotone" /> },
  { label: "Reports", href: "/dashboard/reports", icon: <FileText size={20} weight="duotone" /> },
  { label: "Chat", href: "/dashboard/chat", icon: <ChatCircleDots size={20} weight="duotone" /> },
];

export function SidebarNav() {
  const pathname = usePathname();
  const { session, logout } = useAuth();
  const isAdmin = session?.user.role === "admin" || session?.user.role === "superadmin";

  return (
    <aside className="h-full flex flex-col rounded-[2rem] border border-[var(--border)] bg-white shadow-[0_20px_60px_rgba(0,0,0,0.05)] lg:sticky lg:top-6 lg:h-[calc(100vh-3rem)] lg:self-start">
      <div className="shrink-0 border-b border-[var(--border)] px-6 py-5">
        <div className="flex items-center gap-4">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#FF7F50] text-sm font-bold text-white shadow-[0_16px_30px_rgba(255,127,80,0.28)]">
            SE
          </div>
          <div>
            <p className="text-lg font-bold tracking-tight text-slate-900">
              sns erp
            </p>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#FF7F50]">
              Admin Panel
            </p>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-5 custom-scrollbar">
        <div className="rounded-[1.6rem] border border-[var(--border)] bg-[#f8faff] px-4 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#FF7F50] text-base font-bold text-white">
              {session?.user.name[0]}
            </div>
            <div className="min-w-0">
              <p className="truncate text-base font-semibold text-slate-900">{session?.user.name}</p>
              <p className="text-sm text-[#FF7F50]">{isAdmin ? 'System Owner' : 'Faculty Member'}</p>
            </div>
          </div>
        </div>

        <div className="mt-7">
          <p className="px-3 text-xs font-semibold uppercase tracking-[0.28em] text-slate-500">
            Management
          </p>
        </div>

      <nav className="mt-4 flex flex-col gap-1 pb-10">
        {items.map((item) => {
          const isActive = pathname === item.href;

          return (
            <Link
              href={item.href}
              key={item.href}
              className={`flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-sm font-bold transition-all ${
                isActive
                  ? "bg-[#FF7F50] text-white shadow-[0_8px_20px_rgba(255,127,80,0.3)]"
                  : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
              }`}
            >
              <span className={isActive ? "text-white" : "text-slate-400 group-hover:text-[#FF7F50] transition-colors"}>
                {item.icon}
              </span>
              {item.label}
            </Link>
          );
        })}
      </nav>
      </div>

      <div className="shrink-0 border-t border-[var(--border)] px-4 py-5">
        <button
          className="flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left text-sm font-bold text-slate-500 transition hover:bg-rose-50 hover:text-rose-600"
          onClick={logout}
          type="button"
        >
          <SignOut size={20} weight="duotone" />
          Sign Out
        </button>
      </div>
    </aside>
  );
}
