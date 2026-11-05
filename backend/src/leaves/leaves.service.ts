import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { NotificationsService } from '../notifications/notifications.service';

@Injectable()
export class LeavesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly notifications: NotificationsService,
  ) {}

  async submitLeave(
    userId: string,
    data: {
      studentName: string;
      class: string;
      section: string;
      startDate: string;
      endDate: string;
      reason: string;
      documentUrl?: string;
    },
  ) {
    const leave = await this.prisma.leaveApplication.create({
      data: { userId, ...data },
    });

    // Notify all admins
    const admins = await this.prisma.user.findMany({
      where: { role: { in: ['admin', 'leader'] } },
      select: { id: true },
    });

    await Promise.all(
      admins.map((a) =>
        this.notifications.createNotification(
          a.id,
          'Leave Application Received',
          `${data.studentName} (Class ${data.class}-${data.section}) has applied for leave from ${data.startDate} to ${data.endDate}.`,
          'alert',
        ),
      ),
    );

    return { message: 'Leave application submitted successfully.', id: leave.id };
  }

  async getMyLeaves(userId: string) {
    return this.prisma.leaveApplication.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getAllLeaves() {
    return this.prisma.leaveApplication.findMany({
      orderBy: { createdAt: 'desc' },
      include: { user: { select: { id: true, name: true, email: true } } },
    });
  }

  async resolveLeave(id: string, status: 'approved' | 'rejected', adminNote?: string) {
    const leave = await this.prisma.leaveApplication.update({
      where: { id },
      data: { status, adminNote: adminNote ?? null },
    });

    // Tell the applicant straight away — this is how a parent finds out
    // without waiting for the next dashboard refresh.
    const noteSuffix = adminNote ? ` Admin note: ${adminNote}` : '';
    await this.notifications.createNotification(
      leave.userId,
      status === 'approved' ? 'Leave Approved' : 'Leave Rejected',
      `Your leave application for ${leave.studentName} (Class ${leave.class}-${leave.section}) from ${leave.startDate} to ${leave.endDate} has been ${status}.${noteSuffix}`,
      'alert',
    );

    if (status === 'approved') {
      await this.markLeaveDays(leave);
    }

    return leave;
  }

  /**
   * Record the approved leave days in the student's attendance register as
   * "L" (excused leave). A day a teacher already marked Present/Holiday is
   * never overwritten; a plain Absent is upgraded to the excused Leave.
   */
  private async markLeaveDays(leave: {
    userId: string;
    class: string;
    section: string;
    startDate: string;
    endDate: string;
  }) {
    const profile = await this.prisma.studentProfile.findUnique({
      where: { userId: leave.userId },
    });
    const studentId = profile?.studentId;
    if (!studentId) return;

    const className = profile?.class || leave.class;
    const section = profile?.section || leave.section;

    for (const date of dateRange(leave.startDate, leave.endDate)) {
      const existing = await this.prisma.attendance.findUnique({
        where: { studentId_date: { studentId, date } },
      });

      if (!existing) {
        await this.prisma.attendance.create({
          data: {
            studentId,
            date,
            status: 'L',
            reason: 'Approved leave',
            class: className,
            section,
          },
        });
      } else if (existing.status === 'A' || existing.status === 'Absent') {
        await this.prisma.attendance.update({
          where: { id: existing.id },
          data: { status: 'L', reason: 'Approved leave' },
        });
      }
      // Present / Holiday marks are left untouched.
    }
  }
}

/** Inclusive list of YYYY-MM-DD dates between two ISO dates (capped at 120). */
function dateRange(start: string, end: string): string[] {
  const from = new Date(`${start}T00:00:00Z`);
  const to = new Date(`${end}T00:00:00Z`);
  if (Number.isNaN(from.getTime()) || Number.isNaN(to.getTime()) || from > to) {
    return [];
  }

  const dates: string[] = [];
  const cursor = new Date(from);
  while (cursor <= to && dates.length < 120) {
    dates.push(cursor.toISOString().slice(0, 10));
    cursor.setUTCDate(cursor.getUTCDate() + 1);
  }
  return dates;
}
