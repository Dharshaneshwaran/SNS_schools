import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import type { Prisma } from '@prisma/client';

export class CreateEntryDto {
  day: string;
  period: number;
  startTime: string;
  endTime: string;
  class: string;
  section: string;
  subject: string;
  teacherId: string;
  room?: string;
}

export type UpdateEntryDto = Partial<CreateEntryDto>;

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

@Injectable()
export class TimetableService {
  constructor(private readonly prisma: PrismaService) {}

  /** "10-A" -> { class: "10", section: "A" }; null when no class picked. */
  private parseClassLabel(label?: string | null) {
    if (!label) return null;
    const idx = label.lastIndexOf('-');
    if (idx <= 0) return { class: label.trim(), section: '' };
    return {
      class: label.slice(0, idx).trim(),
      section: label.slice(idx + 1).trim(),
    };
  }

  /**
   * The weekly grid. Pass `classLabel` ("10-A") to scope it to one class -
   * without it every class's slots are returned so the master view works.
   */
  async getTimetable(classLabel?: string) {
    const parsed = this.parseClassLabel(classLabel);

    const where: Prisma.TimetableEntryWhereInput = {};
    if (parsed) {
      where.class = parsed.class;
      if (parsed.section) where.section = parsed.section;
    }

    const [entries, classProfiles, teacherCount, teachers, subjects] =
      await Promise.all([
        this.prisma.timetableEntry.findMany({
          where,
          include: { teacher: { select: { id: true, name: true } } },
          orderBy: [{ day: 'asc' }, { period: 'asc' }],
        }),
        this.prisma.studentProfile.findMany({
          select: { class: true, section: true },
          distinct: ['class', 'section'],
          orderBy: [{ class: 'asc' }, { section: 'asc' }],
        }),
        this.prisma.user.count({ where: { role: 'teacher', status: 'active' } }),
        this.prisma.user.findMany({
          where: { role: { in: ['teacher', 'leader'] }, status: 'active' },
          select: { id: true, name: true },
          orderBy: { name: 'asc' },
        }),
        this.prisma.subject.findMany({
          select: { name: true, type: true, sortOrder: true },
          orderBy: { sortOrder: 'asc' },
        }),
      ]);

    // Older rows store "9:00 AM" and new ones store "08:00"; render both
    // the same way so the grid never mixes 12-hour and 24-hour clocks.
    const TYPE_PRIORITY: Record<string, number> = {
      scholastic: 0,
      'co-scholastic': 1,
      assessment: 2,
    };
    const orderedSubjects = [...subjects].sort(
      (a, b) =>
        (TYPE_PRIORITY[a.type] ?? 9) - (TYPE_PRIORITY[b.type] ?? 9) ||
        a.sortOrder - b.sortOrder,
    );

    const classLabels = classProfiles.map((profile) =>
      `${profile.class}${profile.section ? `-${profile.section}` : ''}`,
    );

    const schedule = DAYS.map((day) => ({
      day,
      periods: entries
        .filter((e) => e.day === day)
        .sort((a, b) => a.period - b.period)
        .map((e) => ({
          id: e.id,
          period: e.period,
          day: e.day,
          startTime: e.startTime,
          endTime: e.endTime,
          time:
            e.startTime && e.endTime
              ? `${this.formatClock(e.startTime)} - ${this.formatClock(e.endTime)}`
              : '',
          subject: e.subject,
          grade: `${e.class}${e.section ? `-${e.section}` : ''}`,
          class: e.class,
          section: e.section,
          room: e.room,
          teacherId: e.teacherId,
          teacher: e.teacher?.name ?? '',
        })),
    }));

    return {
      weekLabel: `${new Date().getFullYear()} Academic Schedule`,
      // Conflicts are rejected on write, so this only ever reports legacy
      // rows written before the checks existed.
      conflicts: this.findConflicts(entries),
      schedule,
      metadata: {
        classes: classLabels,
        activeTeachers: teacherCount,
        teachers,
        subjects: orderedSubjects.map((s) => s.name),
        selectedClass: classLabel ?? '',
      },
    };
  }

  /**
   * Render a stored clock value as 12-hour time. Accepts both the legacy
   * "9:00 AM" rows and the "08:00" form new entries are validated against.
   */
  private formatClock(value: string): string {
    const match = /^(\d{1,2}):(\d{2})(?::\d{2})?\s*(am|pm)?$/i.exec(
      String(value).trim(),
    );
    if (!match) return value;

    const minutes = match[2];
    const suffix = match[3]?.toLowerCase();
    let hour = Number(match[1]);

    if (suffix) return `${hour}:${minutes} ${suffix}`;

    if (hour === 0) hour = 12;
    const period = hour >= 12 ? 'PM' : 'AM';
    const twelveHour = hour > 12 ? hour - 12 : hour;
    return `${twelveHour}:${minutes} ${period}`;
  }

  /** Duplicate day/period bookings, reported rather than silently hidden. */
  private findConflicts(entries: { day: string; period: number; class: string; section: string; teacherId: string }[]) {
    const seen = new Map<string, string>();
    const conflicts: string[] = [];
    for (const e of entries) {
      const slot = `${e.day} period ${e.period} for ${e.class}-${e.section}`;
      const teacherSlot = `${e.day} period ${e.period} (teacher ${e.teacherId})`;
      if (seen.has(slot)) conflicts.push(slot);
      else seen.set(slot, 'class');
      if (seen.has(teacherSlot)) conflicts.push(teacherSlot);
      else seen.set(teacherSlot, 'teacher');
    }
    return conflicts;
  }

  async getStudentTimetable(cls: string, section: string) {
    return this.prisma.timetableEntry.findMany({
      where: { class: cls, section },
      orderBy: [{ day: 'asc' }, { period: 'asc' }],
      include: { teacher: { select: { name: true } } },
    });
  }

  private assertDay(day: string) {
    if (!DAYS.includes(day)) {
      throw new BadRequestException(
        `day must be one of ${DAYS.join(', ')}.`,
      );
    }
  }

  private assertTimes(startTime: string, endTime: string) {
    if (!startTime || !endTime) {
      throw new BadRequestException('startTime and endTime are required.');
    }
    // "HH:MM" - reject nonsense rather than storing it.
    const pattern = /^([01]\d|2[0-3]):[0-5]\d$/;
    if (!pattern.test(startTime) || !pattern.test(endTime)) {
      throw new BadRequestException('Times must be in HH:MM format.');
    }
    if (endTime <= startTime) {
      throw new BadRequestException('endTime must be after startTime.');
    }
  }

  /** Refuse to double-book a class-section or a teacher. */
  private async assertFree(data: {
    day: string;
    period: number;
    class: string;
    section: string;
    teacherId: string;
  }, ignoreId?: string) {
    const base = { day: data.day, period: data.period };
    const clash = (id?: string) => (id ? { not: id } : undefined);

    const classClash = await this.prisma.timetableEntry.findFirst({
      where: {
        ...base,
        class: data.class,
        section: data.section,
        id: clash(ignoreId),
      },
    });
    if (classClash) {
      throw new ConflictException(
        `${data.class}-${data.section} already has a lesson on ${data.day} period ${data.period}.`,
      );
    }

    const teacherClash = await this.prisma.timetableEntry.findFirst({
      where: { ...base, teacherId: data.teacherId, id: clash(ignoreId) },
    });
    if (teacherClash) {
      throw new ConflictException(
        `That teacher is already teaching on ${data.day} period ${data.period}.`,
      );
    }
  }

  async createEntry(data: CreateEntryDto) {
    this.assertDay(data.day);
    this.assertTimes(data.startTime, data.endTime);

    const period = Number(data.period);
    if (!Number.isInteger(period) || period < 1 || period > 12) {
      throw new BadRequestException('period must be an integer between 1 and 12.');
    }
    if (!data.class || !data.subject || !data.teacherId) {
      throw new BadRequestException('class, subject and teacherId are required.');
    }

    const teacher = await this.prisma.user.findUnique({
      where: { id: data.teacherId },
    });
    if (!teacher) throw new NotFoundException('Teacher not found.');

    await this.assertFree({ ...data, period, class: data.class, section: data.section ?? '' });

    return this.prisma.timetableEntry.create({
      data: {
        day: data.day,
        period,
        startTime: data.startTime,
        endTime: data.endTime,
        class: data.class,
        section: data.section ?? '',
        subject: data.subject,
        room: data.room ?? '',
        teacherId: data.teacherId,
      },
      include: { teacher: { select: { name: true } } },
    });
  }

  async updateEntry(id: string, data: UpdateEntryDto) {
    const existing = await this.prisma.timetableEntry.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException('Timetable entry not found.');

    const merged = { ...existing, ...data };
    this.assertDay(merged.day);
    this.assertTimes(merged.startTime, merged.endTime);

    const period = Number(merged.period);
    if (!Number.isInteger(period) || period < 1 || period > 12) {
      throw new BadRequestException('period must be an integer between 1 and 12.');
    }

    await this.assertFree(
      {
        day: merged.day,
        period,
        class: merged.class,
        section: merged.section,
        teacherId: merged.teacherId,
      },
      id,
    );

    return this.prisma.timetableEntry.update({
      where: { id },
      data: {
        day: merged.day,
        period,
        startTime: merged.startTime,
        endTime: merged.endTime,
        class: merged.class,
        section: merged.section,
        subject: merged.subject,
        room: merged.room ?? '',
        teacherId: merged.teacherId,
      },
      include: { teacher: { select: { name: true } } },
    });
  }

  async deleteEntry(id: string) {
    const existing = await this.prisma.timetableEntry.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException('Timetable entry not found.');
    return this.prisma.timetableEntry.delete({ where: { id } });
  }
}
