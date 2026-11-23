import type { UserRole } from "../types/auth";

export const webAllowedRoles: UserRole[] = [
  "admin",
  "leader",
  "teacher",
  "parent",
  "principal",
  "coordinator",
];

export function canAccessWebDashboard(role: UserRole) {
  return webAllowedRoles.includes(role);
}

export function getDashboardRoute(role: UserRole): string {
  if (role === "parent") return "/parent-dashboard";
  if (role === "teacher") return "/teacher-dashboard";
  // Principal and coordinator run the school from the main console.
  return "/dashboard";
}

/** Management screens (users, staff, academic structure, approvals). */
export function canManage(role: UserRole) {
  return (
    role === "admin" ||
    role === "leader" ||
    role === "principal" ||
    role === "coordinator"
  );
}
