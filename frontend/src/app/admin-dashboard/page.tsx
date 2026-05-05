"use client";

import { useAuth } from "../../hooks/use-auth";
import { AdminDashboard } from "../../components/dashboard/admin-dashboard";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function AdminDashboardPage() {
  const { session } = useAuth();
  const router = useRouter();
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | null;
    if (savedTheme) {
      setTheme(savedTheme);
      document.documentElement.setAttribute('data-theme', savedTheme);
    }
  }, []);

  useEffect(() => {
    if (session && session.user.role !== "admin" && session.user.role !== "superadmin") {
      if (session.user.role === "teacher") router.replace("/teacher-dashboard");
      else if (session.user.role === "parent") router.replace("/parent-dashboard");
    }
  }, [session, router]);

  if (session?.user.role === "admin" || session?.user.role === "superadmin") {
    return <AdminDashboard theme={theme} />;
  }

  return <div className="flex items-center justify-center min-h-screen text-[var(--text-primary)] bg-[var(--bg-primary)]">Redirecting...</div>;
}
