"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const items = [
  { label: "Dashboard", href: "/dashboard" },
  { label: "Attendance", href: "/dashboard/attendance" },
  { label: "Timetable", href: "/dashboard/timetable" },
  { label: "Substitutions", href: "/dashboard/substitutions" },
  { label: "Teachers", href: "/dashboard/teachers" },
  { label: "Reports", href: "/dashboard/reports" },
  { label: "Settings", href: "/dashboard/settings" },
];

export function SidebarNav() {
  const pathname = usePathname();

  return (
    <aside className="overflow-hidden rounded-[2rem] border border-[var(--border)] bg-[var(--sidebar)] shadow-[0_20px_60px_rgba(15,23,42,0.06)] lg:sticky lg:top-6 lg:h-[calc(100vh-3rem)] lg:self-start">
      <div className="border-b border-[var(--border)] px-6 py-5">
        <div className="flex items-center gap-4">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[var(--accent)] text-sm font-bold text-white shadow-[0_16px_30px_rgba(79,70,229,0.28)]">
            SE
          </div>
          <div>
            <p className="text-lg font-bold tracking-tight text-slate-900">
              sns erp
            </p>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--accent)]">
              Admin Panel
            </p>
          </div>
        </div>
      </div>

      <div className="px-4 py-5">
        <div className="rounded-[1.6rem] border border-[var(--border)] bg-[#f8faff] px-4 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--accent)] text-base font-bold text-white">
              AU
            </div>
            <div>
              <p className="text-base font-semibold text-slate-900">Admin User</p>
              <p className="text-sm text-[var(--accent)]">System Owner</p>
            </div>
          </div>
        </div>

        <div className="mt-7">
          <p className="px-3 text-xs font-semibold uppercase tracking-[0.28em] text-slate-500">
            Management
          </p>
        </div>

      <nav className="mt-4 flex flex-col gap-2">
        {items.map((item) => {
          const isActive = pathname === item.href;

          return (
            <Link
              href={item.href}
              key={item.href}
              className={`flex w-full items-center rounded-2xl px-4 py-3 text-base font-medium ${
                isActive
                  ? "bg-[var(--sidebar-active)] text-slate-900 shadow-[inset_3px_0_0_var(--accent)]"
                  : "text-[var(--sidebar-text)] transition hover:bg-slate-50 hover:text-slate-900"
              }`}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>
      </div>

      <div className="hidden border-t border-[var(--border)] px-4 py-5 lg:block">
        <button
          className="flex w-full items-center rounded-2xl px-4 py-3 text-left text-base font-medium text-[var(--sidebar-text)] transition hover:bg-slate-50 hover:text-slate-900"
          type="button"
        >
          Sign Out
        </button>
      </div>
    </aside>
  );
}
