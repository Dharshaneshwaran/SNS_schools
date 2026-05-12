import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { PrismaService } from '../prisma.service';

@Injectable()
export class DashboardService {
  constructor(
    private readonly usersService: UsersService,
    private readonly prisma: PrismaService,
  ) {}

  async getCounts(userId: string) {
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

    const [notifications, profileRequests, substitutions, leaves, admission] = await Promise.all([
      this.prisma.notification.count({ where: { userId, isRead: false } }),
      this.prisma.profileUpdateRequest.count({ where: { status: 'pending' } }),
      this.prisma.substitution.count({ where: { status: 'pending' } }),
      this.prisma.leaveApplication.count({ where: { status: 'pending' } }),
      this.prisma.user.count({ where: { createdAt: { gte: sevenDaysAgo } } }),
    ]);

    return { notifications, profileRequests, substitutions, leaves, admission };
  }

  async getOverview(userId: string) {
    const now = new Date();
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const currentYear = now.getFullYear();
    const yearStart = new Date(currentYear, 0, 1);

    let stats = { totalStudents: 0, totalTeachers: 0, totalAdmins: 0, totalUsers: 0 };
    let activeStudents = 0;
    let inactiveStudents = 0;
    let activeStaff = 0;
    let unreadNotifications = 0;
    let groups = 0;
    let messages = 0;
    let newUsersThisWeek = 0;
    let recentUsers: { id: string; name: string; role: string; createdAt: Date; status: string }[] = [];
    let enrollmentByMonth: { createdAt: Date; studentProfile: { gender: string | null } | null }[] = [];

    try {
      [stats, activeStudents, inactiveStudents, activeStaff] = await Promise.all([
        this.usersService.getSystemStats(),
        this.prisma.user.count({ where: { role: 'parent', status: 'active' } }),
        this.prisma.user.count({ where: { role: 'parent', status: 'inactive' } }),
        this.prisma.user.count({
          where: {
            role: { in: ['teacher', 'admin', 'leader'] },
            status: 'active',
          },
        }),
      ]);
    } catch (error) {
      console.error('Dashboard batch 1 (stats) failed:', error);
    }

    try {
      [unreadNotifications, groups, messages] = await Promise.all([
        this.prisma.notification.count({ where: { userId, isRead: false } }),
        this.prisma.group.count(),
        this.prisma.message.count(),
      ]);
    } catch (error) {
      console.error('Dashboard batch 2 (notifications/groups/messages) failed:', error);
    }

    try {
      [newUsersThisWeek, recentUsers, enrollmentByMonth] = await Promise.all([
        this.prisma.user.count({
          where: { createdAt: { gte: sevenDaysAgo } },
        }),
        this.prisma.user.findMany({
          where: { role: { in: ['parent', 'teacher'] } },
          orderBy: { createdAt: 'desc' },
          take: 5,
          select: {
            id: true,
            name: true,
            role: true,
            createdAt: true,
            status: true,
          },
        }),
        this.prisma.user.findMany({
          where: {
            role: 'parent',
            createdAt: { gte: yearStart },
          },
          select: {
            createdAt: true,
            studentProfile: { select: { gender: true } },
          },
        }),
      ]);
    } catch (error) {
      console.error('Dashboard batch 3 (users) failed:', error);
    }

    const monthlyEnrollment = Array.from({ length: 12 }, (_, i) => ({
      month: i + 1,
      boys: 0,
      girls: 0,
    }));

    for (const user of enrollmentByMonth) {
      const month = user.createdAt.getMonth();
      const gender = (user.studentProfile?.gender ?? '').toLowerCase();
      if (gender === 'female' || gender === 'girl') {
        monthlyEnrollment[month].girls += 1;
      } else {
        monthlyEnrollment[month].boys += 1;
      }
    }

    const maxCount = Math.max(
      1,
      ...monthlyEnrollment.map((m) => m.boys + m.girls),
    );
    const monthlyChart = monthlyEnrollment.map((m) => ({
      month: m.month,
      boys: Math.round((m.boys / maxCount) * 100),
      girls: Math.round((m.girls / maxCount) * 100),
      boysCount: m.boys,
      girlsCount: m.girls,
    }));

    const recentRegistrations = recentUsers.map((u) => {
      const roleLabel =
        u.role === 'parent'
          ? 'New Student'
          : u.role === 'teacher'
            ? 'New Teacher'
            : u.role.charAt(0).toUpperCase() + u.role.slice(1);
      const diffMs = Date.now() - new Date(u.createdAt).getTime();
      const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
      const diffDays = Math.floor(diffHours / 24);
      const dateLabel =
        diffDays === 0
          ? diffHours === 0
            ? 'Just now'
            : `Today, ${new Date(u.createdAt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}`
          : diffDays === 1
            ? 'Yesterday'
            : `${diffDays} days ago`;
      return { name: u.name, type: roleLabel, date: dateLabel };
    });

    return {
      stats: [
        {
          label: 'Total Students',
          value: activeStudents.toString(),
          hint: 'Live count of enrolled students in the database.',
          trend: 'Live',
        },
        {
          label: 'Total Staff',
          value: activeStaff.toString(),
          hint: 'Active faculty and administrators.',
          trend: 'Live',
        },
        {
          label: 'Inactive Students',
          value: inactiveStudents.toString(),
          hint: 'Student accounts marked inactive in the database.',
          trend: 'Live',
        },
        {
          label: 'Unread Notifications',
          value: unreadNotifications.toString(),
          hint: 'Notifications not yet marked as read.',
          trend: 'Live',
        },
      ],
      panels: [
        {
          title: 'Enrollment Summary',
          body: `${activeStudents} active students and ${inactiveStudents} inactive student records are currently stored.`,
        },
        {
          title: 'Staff Directory',
          body: `${activeStaff} active staff accounts are available across the configured departments.`,
        },
        {
          title: 'Messaging Activity',
          body: `${groups} groups and ${messages} messages are stored in the communication module.`,
        },
        {
          title: 'System Users',
          body: `${stats.totalUsers} total user accounts exist in the database.`,
        },
      ],
      quickActions: [
        {
          title: 'Manage students',
          description: 'Review active and inactive student records from the user directory.',
        },
        {
          title: 'Manage staff',
          description: 'Create teacher accounts and update department assignments.',
        },
        {
          title: 'Send notifications',
          description: 'Broadcast messages to parents, teachers, and leaders.',
        },
      ],
      newUsersThisWeek,
      recentRegistrations,
      monthlyChart,
    };
  }

  async getParentOverview(studentId: string) {
    const now = new Date();
    const currentMonth = now.getMonth() + 1;
    const currentYear = now.getFullYear();
    const monthStr = `${currentYear}-${currentMonth.toString().padStart(2, '0')}`;

    // Get attendance records for current month
    const [attendance, examResults] = await Promise.all([
      this.prisma.attendance.findMany({
        where: { studentId, date: { startsWith: monthStr.slice(0, 7) } },
      }),
      this.prisma.examResult.findMany({
        where: { studentId },
        orderBy: { createdAt: 'desc' },
        take: 1,
      }),
    ]);

    const totalDays = attendance.length;
    const presentDays = attendance.filter((a) => a.status === 'P').length;
    const attendancePercentage =
      totalDays > 0 ? ((presentDays / totalDays) * 100).toFixed(1) : '0';

    const latestExam = examResults[0];
    const examGrade = latestExam ? latestExam.grade : 'N/A';
    const examTerm = latestExam ? latestExam.term : 'No recent results';

    return {
      attendance: {
        value: `${attendancePercentage}%`,
        sub: `Month of ${now.toLocaleString('default', { month: 'long' })}`,
      },
      exam: {
        value: examGrade,
        sub: examTerm,
      },
    };
  }
}
