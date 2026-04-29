"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { SidebarNav } from "./sidebar-nav";
import { useAuth } from "../../hooks/use-auth";
import { canAccessWebDashboard } from "../../lib/role-access";

export function DashboardLayoutShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { isBootstrapping, logout, session } = useAuth();

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

  return (
    <main className="min-h-screen p-3 sm:p-4 lg:p-6">
      <div className="grid gap-4 lg:grid-cols-[280px_minmax(0,1fr)]">
        <SidebarNav />
        <section className="min-w-0 space-y-5">
          <header className="rounded-[2rem] border border-[var(--border)] bg-white/92 px-5 py-4 shadow-[0_20px_60px_rgba(15,23,42,0.05)]">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-2xl font-bold tracking-tight text-slate-950">
                  Dashboard
                </p>
              </div>
              <div className="flex items-center gap-3 self-start md:self-auto">
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[var(--accent)] text-sm font-bold text-white">
                  {session.user.name
                    .split(" ")
                    .map((part) => part[0])
                    .join("")
                    .slice(0, 2)}
                </div>
                <div className="min-w-0">
                  <p className="truncate text-base font-semibold text-slate-900">
                    {session.user.name}
                  </p>
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                    {session.user.role}
                  </p>
                </div>
                <button
                  className="rounded-2xl border border-[var(--border)] px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
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
