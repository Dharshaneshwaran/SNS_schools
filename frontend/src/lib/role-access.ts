import type { UserRole } from "../types/auth";

export const webAllowedRoles: UserRole[] = ["superadmin", "admin", "leader", "teacher", "parent"];

export function canAccessWebDashboard(role: UserRole) {
  return webAllowedRoles.includes(role);
}

export function getDashboardRoute(role: UserRole): string {
  if (role === "parent") return "/parent-dashboard";
  if (role === "teacher") return "/teacher-dashboard";
  return "/dashboard";
}
