export type UserRole =
  | "admin"
  | "leader"
  | "teacher"
  | "parent"
  | "principal"
  | "coordinator";

export type StudentProfile = {
  id?: string;
  studentId?: string;
  class?: string;
  section?: string;
  presentSchool?: string;
  fatherName?: string;
  fatherContact?: string;
  fatherEmail?: string;
  motherName?: string;
  motherContact?: string;
  motherEmail?: string;
  fatherOfficeAddress?: string;
};

export type UserProfile = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  department: string;
  status: "active" | "away";
  studentProfile?: StudentProfile;
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
