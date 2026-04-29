import type { UserRole } from "../types/auth";

export const webAllowedRoles: UserRole[] = ["superadmin", "admin", "leader", "teacher"];

export function canAccessWebDashboard(role: UserRole) {
  return webAllowedRoles.includes(role);
}
