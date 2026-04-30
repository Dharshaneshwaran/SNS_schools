"use client";

import { useAuth } from "../../hooks/use-auth";
import { AdminDashboard } from "../../components/dashboard/admin-dashboard";
import { TeacherDashboard } from "../../components/dashboard/teacher-dashboard";
import { DashboardOverview } from "../../components/dashboard/dashboard-overview";

export default function DashboardPage() {
  const { session } = useAuth();
  
  if (session?.user.role === "admin" || session?.user.role === "superadmin") {
    return <AdminDashboard />;
  }

  if (session?.user.role === "teacher") {
    return <TeacherDashboard />;
  }
  
  return <DashboardOverview />;
}
