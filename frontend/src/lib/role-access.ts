import type { UserRole } from "../types/auth";

export const webAllowedRoles: UserRole[] = ["superadmin", "admin", "leader"];

export function canAccessWebDashboard(role: UserRole) {
  return webAllowedRoles.includes(role);
}
