export const APP_ROLES = [
  'superadmin',
  'admin',
  'leader',
  'principal',
  'coordinator',
  'teacher',
  'parent',
] as const;

export type AppRole = (typeof APP_ROLES)[number];

/**
 * Roles a user's role is allowed to satisfy on top of its own label.
 *
 * This exists so the two leadership roles added in Phase B can pass the
 * existing `@Roles('admin')` / `@Roles('admin', 'leader')` guards without
 * touching every controller. Entries map to themselves plus the roles they
 * inherit - every role listed here is additive, so users with the original
 * four roles behave exactly as before.
 */
export const ROLE_INHERITANCE: Record<string, AppRole[]> = {
  principal: ['principal', 'admin', 'leader'],
  coordinator: ['coordinator', 'leader'],
};

/** The set of roles a token's role is permitted to satisfy. */
export function effectiveRoles(role: string): AppRole[] {
  return ROLE_INHERITANCE[role] ?? [role as AppRole];
}
