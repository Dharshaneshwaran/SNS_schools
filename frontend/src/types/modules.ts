export type DashboardOverview = {
  stats: {
    label: string;
    value: string;
    hint: string;
    trend: string;
  }[];
  panels: {
    title: string;
    body: string;
  }[];
  quickActions: {
    title: string;
    description: string;
  }[];
};

export type TeachersData = {
  summary: {
    total: number;
    active: number;
    overloaded: number;
  };
  departments: {
    name: string;
    teachers: number;
  }[];
  teachers: {
    id: string;
    name: string;
    department: string;
    subjects: string[];
    workload: string;
    status: string;
  }[];
};

export type TimetableData = {
  weekLabel: string;
  conflicts: string[];
  schedule: {
    day: string;
    periods: {
      time: string;
      subject: string;
      teacher: string;
      grade: string;
      room: string;
    }[];
  }[];
  metadata?: {
    classes: string[];
    activeTeachers: number;
  };
};

export type AttendanceRules = {
  /** A pupil arriving after this many minutes past roll call is "Late". */
  lateAfterMinutes: number;
  /** Pupils below this attendance percentage are flagged as low. */
  minAttendancePercent: number;
  /** Consecutive absences that raise an alert for a guardian. */
  consecutiveAbsenceAlerts: number;
  /** Day of month the monthly attendance report is generated. */
  monthlyReportDay: number;
};

export type LeaveRequest = {
  id: string;
  studentName: string;
  class: string;
  section: string;
  startDate: string;
  endDate: string;
  reason: string;
  appliedBy: string;
  status: string;
};

export type LateArrival = {
  rollNo: string;
  name: string;
  status: string;
  date: string;
};

export type AttendanceConcern = {
  rollNo: string;
  name: string;
  percent: number;
  longestAbsenceStreak: number;
};

export type AttendanceData = {
  summary: {
    present: number;
    onLeave: number;
    lateArrivals: number;
  };
  teacherSummary: {
    total: number;
    present: number;
    absent: number;
    notMarked: number;
  };
  rules: AttendanceRules;
  leaveRequests: LeaveRequest[];
  lateArrivals: LateArrival[];
  /** Below `rules.minAttendancePercent`. */
  lowAttendance: AttendanceConcern[];
  /** Reached `rules.consecutiveAbsenceAlerts` days in a row. */
  absenceAlerts: AttendanceConcern[];
  teachers: {
    id: string;
    empId: string;
    name: string;
    department: string;
    designation: string;
    status: string;
  }[];
  classWiseAttendance: {
    class: string;
    total: number;
    present: number;
    absent: number;
    percentage: string;
  }[];
  studentsAttendance: {
    [className: string]: {
      rollNo: string;
      name: string;
      status: string;
      photo: string;
    }[];
  };
};

export type SubstitutionsData = {
  summary: {
    pendingApproval: number;
    emergencyReplacements: number;
    autoAssigned: number;
  };
  requests: {
    className: string;
    absentTeacher: string;
    suggestedTeacher: string;
    mode: string;
    status: string;
  }[];
};

export type ReportsData = {
  availableReports: {
    title: string;
    description: string;
    format: string;
  }[];
  highlights: {
    metric: string;
    value: string;
  }[];
};

export type SettingsData = {
  institution: {
    name: string;
    academicYear: string;
    timezone: string;
  };
  departments: string[];
  notifications: {
    channel: string;
    status: string;
  }[];
};
