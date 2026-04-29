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

  const sections = [
    {
      title: "MENU",
      items: [
        { label: "Dashboard", href: "/dashboard" },
        { label: "Attendance", href: "/dashboard/attendance" },
        { label: "Timetable", href: "/dashboard/timetable" },
        { label: "Substitutions", href: "/dashboard/substitutions" },
      ]
    },
    {
      title: "TOOLS",
      items: [
        { label: "Teachers", href: "/dashboard/teachers" },
        { label: "Reports", href: "/dashboard/reports" },
        { label: "Settings", href: "/dashboard/settings" },
      ]
    }
  ];

  return (
    <aside className="hide-scrollbar sticky top-0 h-screen w-full flex flex-col bg-white border-r border-[#F1F5F9] z-50 overflow-hidden">
      {/* Logo Section */}
      <div className="p-6 pb-7">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white p-1.5 shadow-[0_8px_20px_rgba(0,0,0,0.06)] border border-black/5">
            <img src="/images/logo.png" alt="Logo" className="w-full h-auto object-contain" />
          </div>
          <div>
            <p className="text-base font-extrabold tracking-tight text-slate-900 leading-none">
              SNS Academy
            </p>
            <p className="text-[9px] font-extrabold uppercase tracking-[0.08em] text-[#FF7F50] mt-1">
              Teacher Portal
            </p>
          </div>
        </div>
      </div>

      {/* Navigation Sections */}
      <div className="flex-1 px-3">
        {sections.map((section) => (
          <div key={section.title} className="mb-6">
            <p className="px-4 mb-3 text-[10px] font-extrabold uppercase tracking-[0.12em] text-slate-400">
              {section.title}
            </p>
            <nav className="flex flex-col gap-0.5">
              {section.items.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    href={item.href}
                    key={item.href}
                    className={`group flex w-full items-center gap-3 rounded-xl px-4 py-2.5 text-[13.5px] font-semibold transition-all duration-200 ${
                      isActive
                        ? "bg-[#FF7F50]/[0.08] text-[#FF7F50]"
                        : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                    }`}
                  >
                    <span className={`h-1.5 w-1.5 rounded-full transition-all duration-200 ${
                      isActive ? "bg-[#FF7F50] scale-100" : "bg-transparent scale-0 group-hover:scale-100 group-hover:bg-slate-300"
                    }`} />
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          </div>
        ))}
      </div>

      {/* Footer / Sign Out */}
      <div className="p-3.5 border-t border-[#F1F5F9]">
        <button className="flex w-full items-center justify-center gap-2 rounded-xl p-3 text-slate-500 font-bold text-sm transition-all hover:bg-red-50 hover:text-red-500">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 256 256"><path d="M112,216a8,8,0,0,1-8,8H48a16,16,0,0,1-16-16V48A16,16,0,0,1,48,32h56a8,8,0,0,1,0,16H48V208h56A8,8,0,0,1,112,216Zm109.66-93.66-40-40a8,8,0,0,0-11.32,11.32L196.69,120H104a8,8,0,0,0,0,16h92.69l-26.35,26.34a8,8,0,0,0,11.32,11.32l40-40A8,8,0,0,0,221.66,122.34Z"></path></svg>
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
}
