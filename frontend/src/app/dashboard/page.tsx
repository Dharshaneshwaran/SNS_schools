"use client";

import { useAuth } from "../../hooks/use-auth";
import { AdminDashboard } from "../../components/dashboard/admin-dashboard";
import { ModernDashboard } from "../../components/dashboard/modern-dashboard";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function DashboardPage() {
  const { session } = useAuth();
  const router = useRouter();
  const [theme, setTheme] = useState("classic");

  useEffect(() => {
    const t = localStorage.getItem("sns_theme");
    if (t) setTheme(t);
  }, []);

  useEffect(() => {
    if (session?.user.role === "teacher") {
      router.replace("/teacher-dashboard");
    } else if (session?.user.role === "parent") {
      router.replace("/parent-dashboard");
    }
  }, [session, router]);

  const isManagementRole =
    session?.user.role === "admin" ||
    session?.user.role === "leader" ||
    session?.user.role === "principal" ||
    session?.user.role === "coordinator";

  if (isManagementRole) {
    if (theme === "modern") return <ModernDashboard />;
    return <AdminDashboard />;
  }

  return <div className="flex items-center justify-center min-h-screen">Redirecting...</div>;
}
