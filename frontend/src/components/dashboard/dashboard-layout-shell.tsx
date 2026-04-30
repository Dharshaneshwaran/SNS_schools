"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { SidebarNav } from "./sidebar-nav";
import { useAuth } from "../../hooks/use-auth";
import { canAccessWebDashboard } from "../../lib/role-access";
import { List, X } from "@phosphor-icons/react";

export function DashboardLayoutShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { isBootstrapping, logout, session } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    // Close sidebar when route changes on mobile
    setIsSidebarOpen(false);
  }, [router]);

  useEffect(() => {
    if (isBootstrapping) {
      return;
    }

    if (!session) {
      router.replace("/");
      return;
    }

    if (!canAccessWebDashboard(session.user.role)) {
      logout();
      router.replace("/");
    }
  }, [isBootstrapping, logout, router, session]);

  if (isBootstrapping || !session) {
    return (
      <div className="flex min-h-screen items-center justify-center px-6">
        <div className="rounded-3xl border border-[var(--border)] bg-white/80 px-6 py-5 text-sm text-slate-600 shadow-[0_20px_40px_rgba(15,23,42,0.08)]">
          Restoring your workspace...
        </div>
      </div>
    );
  }

  const isAdmin = session?.user.role === "admin" || session?.user.role === "superadmin";

  return (
    <main className="min-h-screen bg-[#f4f7fb] p-3 sm:p-4 lg:p-6">
      <div className="flex flex-col lg:grid lg:grid-cols-[280px_minmax(0,1fr)] gap-4 lg:gap-6">
        
        {/* Sidebar Overlay for Mobile */}
        <div className={`fixed inset-0 z-50 transition-all duration-500 lg:relative lg:inset-auto lg:z-0 lg:block ${
          isSidebarOpen ? "visible opacity-100" : "invisible opacity-0 lg:visible lg:opacity-100"
        }`}>
           {/* Backdrop */}
           <div 
             className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm lg:hidden"
             onClick={() => setIsSidebarOpen(false)}
           />
           {/* Sidebar Content */}
           <div className={`relative h-full w-[280px] bg-white transition-transform duration-500 lg:translate-x-0 ${
             isSidebarOpen ? "translate-x-0" : "-translate-x-full"
           }`}>
              <SidebarNav />
           </div>
        </div>

        <section className="min-w-0 space-y-5">
          <header className="rounded-[2rem] border border-[var(--border)] bg-white/95 px-5 py-4 shadow-[0_20px_60px_rgba(0,0,0,0.05)] backdrop-blur-md">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div className="flex items-center gap-3">
                {/* Hamburger Toggle */}
                <button 
                  onClick={() => setIsSidebarOpen(true)}
                  className="lg:hidden p-2 rounded-xl bg-slate-50 border border-slate-100 text-slate-600 hover:bg-slate-100 transition-colors"
                >
                  <List size={24} />
                </button>
                <p className="text-xl sm:text-2xl font-bold tracking-tight text-slate-950">
                  Dashboard
                </p>
              </div>
              
              <div className="flex items-center gap-3 self-start md:self-auto">
                <div className="hidden sm:flex h-11 w-11 items-center justify-center rounded-full bg-[#FF7F50] text-sm font-bold text-white shadow-[0_10px_20px_rgba(255,127,80,0.2)]">
                  {session.user.name
                    .split(" ")
                    .map((part) => part[0])
                    .join("")
                    .slice(0, 2)}
                </div>
                <div className="min-w-0">
                  <p className="truncate text-sm sm:text-base font-semibold text-slate-900">
                    {session.user.name}
                  </p>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#FF7F50]">
                    {session.user.role}
                  </p>
                </div>
                <button
                  className="rounded-2xl border border-[var(--border)] px-4 py-2 text-xs sm:text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                  onClick={logout}
                  type="button"
                >
                  Logout
                </button>
              </div>
            </div>
          </header>
          {children}
        </section>
      </div>
    </main>
  );
}
