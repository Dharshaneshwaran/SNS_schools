export const APP_ROLES = [
  'superadmin',
  'admin',
  'leader',
  'teacher',
  'parent',
] as const;

export type AppRole = (typeof APP_ROLES)[number];
