export type MenuKey = "dashboard" | "events" | "profile" | "diary" | "notifications" | "academic" | "transport" | "settings" | "messages";
export type AcademicTab = "calendar" | "attendance" | "exam" | "schedule" | "leave";

export interface Student {
  id: string;
  studentId: string;
  name: string;
  class: string;
  section: string;
  avatar: string;
  schoolName?: string;
  fatherName?: string;
  fatherNumber?: string;
  fatherEmail?: string;
  motherName?: string;
  motherNumber?: string;
  motherEmail?: string;
  guardianName?: string;
  guardianNumber?: string;
  relation?: string;
  address?: string;
  parentMobile?: string;
  classTeacher?: string;
  teacherEmail?: string;
}
