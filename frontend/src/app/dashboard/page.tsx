"use client";

import { useAuth } from "../../hooks/use-auth";
import { AdminDashboard } from "../../components/dashboard/admin-dashboard";
import { DashboardOverview } from "../../components/dashboard/dashboard-overview";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function DashboardPage() {
  const { session } = useAuth();
  const router = useRouter();
  
  useEffect(() => {
    if (session?.user.role === "teacher") {
      router.replace("/teacher-dashboard");
    } else if (session?.user.role === "parent") {
      router.replace("/parent-dashboard");
    }
  }, [session, router]);
  
  if (session?.user.role === "admin" || session?.user.role === "superadmin") {
    return <AdminDashboard />;
  }
  
  return <div className="flex items-center justify-center min-h-screen">Redirecting...</div>;
}
