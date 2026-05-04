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
};

export type AttendanceData = {
  summary: {
    present: number;
    onLeave: number;
    lateArrivals: number;
  };
  leaveRequests: {
    teacher: string;
    type: string;
    duration: string;
    status: string;
  }[];
  lateArrivals: {
    teacher: string;
    expected: string;
    actual: string;
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
