export type MenuKey = "dashboard" | "events" | "profile" | "diary" | "notifications" | "academic" | "transport" | "settings";
export type AcademicTab = "calendar" | "attendance" | "exam" | "schedule" | "leave";

export interface Student {
  id: number;
  name: string;
  class: string;
  section: string;
  avatar: string;
  fatherNumber?: string;
  fatherEmail?: string;
  motherNumber?: string;
  motherEmail?: string;
  guardianNumber?: string;
  address?: string;
  parentMobile?: string;
  classTeacher?: string;
  teacherEmail?: string;
}
