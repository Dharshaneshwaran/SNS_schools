export type UserRole = "superadmin" | "admin" | "leader" | "teacher" | "parent";

export type UserProfile = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  department: string;
  status: "active" | "away";
};

export type AuthSession = {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  user: UserProfile;
};

export type LoginPayload = {
  email: string;
  password: string;
};
