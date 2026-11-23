import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class AttendanceService {
  constructor(private readonly prisma: PrismaService) {}

  /** Statuses that count as a late arrival. */
  private static readonly LATE_STATUSES = ['L', 'Late', 'late'];

  // ─── Rules (school-wide thresholds) ──────────────────────────────────

  async getRules() {
    const s = await this.prisma.schoolSettings.findFirst();
    return {
      lateAfterMinutes: s?.lateAfterMinutes ?? 15,
      minAttendancePercent: s?.minAttendancePercent ?? 75,
      consecutiveAbsenceAlerts: s?.consecutiveAbsenceAlerts ?? 3,
      monthlyReportDay: s?.monthlyReportDay ?? 1,
    };
  }

  async updateRules(data: {
    lateAfterMinutes?: number;
    minAttendancePercent?: number;
    consecutiveAbsenceAlerts?: number;
    monthlyReportDay?: number;
  }) {
    const bounds: [keyof typeof data, number, number][] = [
      ['lateAfterMinutes', 0, 180],
      ['minAttendancePercent', 1, 100],
      ['consecutiveAbsenceAlerts', 1, 30],
      ['monthlyReportDay', 1, 28],
    ];

    const clean: Record<string, number> = {};
    for (const [key, min, max] of bounds) {
      const value = data[key];
      if (value === undefined) continue;
      const numeric = Number(value);
      if (!Number.isFinite(numeric)) {
        throw new BadRequestException(`${key} must be a number.`);
      }
      if (numeric < min || numeric > max) {
        throw new BadRequestException(`${key} must be between ${min} and ${max}.`);
      }
      clean[key] = Math.round(numeric);
    }

    if (Object.keys(clean).length === 0) {
      throw new BadRequestException('No rule values supplied.');
    }

    await this.prisma.schoolSettings.upsert({
      where: { id: 'singleton' },
      create: { id: 'singleton', ...clean },
      update: clean,
    });
    return this.getRules();
  }

  async getStudentAttendance(studentId: string, month?: string) {
    const where: any = { studentId };
    if (month) where.date = { startsWith: month };
    return this.prisma.attendance.findMany({ where, orderBy: { date: 'asc' } });
  }

  async markAttendance(records: { studentId: string; date: string; status: string; reason?: string; class: string; section: string }[]) {
    const results = await Promise.all(
      records.map((r) =>
        this.prisma.attendance.upsert({
          where: { studentId_date: { studentId: r.studentId, date: r.date } },
          create: { studentId: r.studentId, date: r.date, status: r.status, reason: r.reason ?? null, class: r.class, section: r.section },
          update: { status: r.status, reason: r.reason ?? null },
        }),
      ),
    );
    return { marked: results.length };
  }

  async getAttendance() {
    const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD

    // ─── Student attendance ───────────────────────────────────────
    const students = await this.prisma.user.findMany({
      where: { role: 'parent' },
      include: { studentProfile: true },
      orderBy: { name: 'asc' },
    });

    const activeStudents = students.filter((student) => student.status === 'active');

    // Fetch today's attendance records in one query
    const todayRecords = await this.prisma.attendance.findMany({
      where: { date: today },
    });

    // Index attendance by studentId for fast lookup
    const attendanceMap = new Map<string, string>();
    todayRecords.forEach((rec) => {
      attendanceMap.set(rec.studentId, rec.status);
    });

    // Group students by class
    const classGroups = activeStudents.reduce<Record<string, typeof activeStudents>>((acc, student) => {
      const profile = student.studentProfile;
      const className = profile?.class
        ? `${profile.class}${profile.section ? `-${profile.section}` : ''}`
        : 'Unassigned';
      acc[className] = [...(acc[className] ?? []), student];
      return acc;
    }, {});

    // Build class-wise attendance with real counts
    let totalPresent = 0;
    let totalAbsent = 0;

    const classWiseAttendance = Object.entries(classGroups).map(([className, classStudents]) => {
      let present = 0;
      let absent = 0;

      classStudents.forEach((student) => {
        const sid = student.studentProfile?.studentId ?? student.id.slice(0, 8);
        const status = attendanceMap.get(sid);
        if (status === 'Present' || status === 'P') present++;
        else if (status === 'Absent' || status === 'A') absent++;
      });

      totalPresent += present;
      totalAbsent += absent;

      const marked = present + absent;
      const percentage = marked > 0
        ? `${Math.round((present / marked) * 100)}%`
        : classStudents.length === 0
          ? 'N/A'
          : 'Not marked';

      return {
        class: className,
        total: classStudents.length,
        present,
        absent,
        percentage,
      };
    });

    // Build per-class student lists with today's status
    const studentsAttendance = Object.fromEntries(
      Object.entries(classGroups).map(([className, classStudents]) => [
        className,
        classStudents.map((student) => {
          const sid = student.studentProfile?.studentId ?? student.id.slice(0, 8);
          const dbStatus = attendanceMap.get(sid);
          return {
            rollNo: sid,
            name: student.name,
            status: dbStatus || 'Not Marked',
            photo: '',
          };
        }),
      ]),
    );

    // ─── Teacher attendance ───────────────────────────────────────
    const teachers = await this.prisma.user.findMany({
      where: { role: { in: ['teacher', 'admin'] }, status: 'active' },
      include: { teacherProfile: true },
      orderBy: { name: 'asc' },
    });

    // Look up today's teacher attendance (stored with class = 'FACULTY')
    let teacherPresent = 0;
    let teacherAbsent = 0;

    const teacherList = teachers.map((t) => {
      const teacherId = t.teacherProfile?.employeeId ?? t.id;
      const dbStatus = attendanceMap.get(teacherId);
      if (dbStatus === 'Present' || dbStatus === 'P') teacherPresent++;
      else if (dbStatus === 'Absent' || dbStatus === 'A') teacherAbsent++;
      return {
        id: t.id,
        empId: teacherId,
        name: t.name,
        department: t.department,
        designation: t.teacherProfile?.designation || t.role,
        status: dbStatus || 'Not Marked',
      };
    });

    // ─── Rules, late arrivals, leave requests, low attendance ──────────
    const rules = await this.getRules();

    // Students marked "L"/"Late" today. The schema has no clock-in time,
    // so lateness is whatever the marker chose to record rather than a
    // value we can derive from lateAfterMinutes.
    const lateIds = new Set(
      todayRecords
        .filter((rec) => AttendanceService.LATE_STATUSES.includes(rec.status))
        .map((rec) => rec.studentId),
    );

    const nameById = new Map<string, string>();
    activeStudents.forEach((s) => {
      const sid = s.studentProfile?.studentId ?? s.id.slice(0, 8);
      nameById.set(sid, s.name);
    });

    const lateArrivals = [...lateIds].map((rollNo) => ({
      rollNo,
      name: nameById.get(rollNo) ?? rollNo,
      status: 'Late',
      date: today,
    }));

    // Pending leave applications, instead of the hardcoded empty array.
    const pendingLeaves = await this.prisma.leaveApplication.findMany({
      where: { status: 'pending' },
      orderBy: { startDate: 'asc' },
    });
    const leaveRequests = pendingLeaves.map((leave) => ({
      id: leave.id,
      studentName: leave.studentName,
      class: leave.class,
      section: leave.section,
      startDate: leave.startDate,
      endDate: leave.endDate,
      reason: leave.reason,
      appliedBy: leave.userId,
      status: leave.status,
    }));

    // Per-student attendance against the configured floor.
    const allRecords = await this.prisma.attendance.findMany({
      where: { class: { not: 'FACULTY' } },
      orderBy: { date: 'asc' },
    });
    const perStudent = new Map<
      string,
      { total: number; present: number; streak: number; longestStreak: number }
    >();
    for (const record of allRecords) {
      const tally =
        perStudent.get(record.studentId) ??
        { total: 0, present: 0, streak: 0, longestStreak: 0 };
      tally.total += 1;
      const isPresent =
        record.status === 'Present' ||
        record.status === 'P' ||
        record.status === 'L' ||
        record.status === 'Late';
      if (isPresent) {
        tally.streak = 0;
      } else if (record.status === 'Absent' || record.status === 'A') {
        tally.streak += 1;
        tally.longestStreak = Math.max(tally.longestStreak, tally.streak);
      }
      perStudent.set(record.studentId, tally);
    }

    const lowAttendance: {
      rollNo: string;
      name: string;
      percent: number;
      longestAbsenceStreak: number;
    }[] = [];
    const absenceAlerts: typeof lowAttendance = [];

    for (const [rollNo, tally] of perStudent) {
      if (tally.total === 0) continue;
      const percent = Math.round((tally.present / tally.total) * 100);
      const name = nameById.get(rollNo) ?? rollNo;
      if (percent < rules.minAttendancePercent) {
        lowAttendance.push({
          rollNo,
          name,
          percent,
          longestAbsenceStreak: tally.longestStreak,
        });
      }
      if (tally.longestStreak >= rules.consecutiveAbsenceAlerts) {
        absenceAlerts.push({
          rollNo,
          name,
          percent,
          longestAbsenceStreak: tally.longestStreak,
        });
      }
    }

    lowAttendance.sort((a, b) => a.percent - b.percent);
    absenceAlerts.sort((a, b) => b.longestAbsenceStreak - a.longestAbsenceStreak);

    return {
      summary: {
        present: totalPresent,
        onLeave: totalAbsent,
        lateArrivals: lateArrivals.length,
      },
      teacherSummary: {
        total: teacherList.length,
        present: teacherPresent,
        absent: teacherAbsent,
        notMarked: teacherList.length - teacherPresent - teacherAbsent,
      },
      leaveRequests,
      lateArrivals,
      rules,
      lowAttendance,
      absenceAlerts,
      teachers: teacherList,
      classWiseAttendance,
      studentsAttendance,
    };
  }
}
