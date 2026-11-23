import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import type { Prisma } from '@prisma/client';

export class CreateEventDto {
  title: string;
  date: string;
  endDate?: string;
  time?: string;
  type?: string;
  location?: string;
  description?: string;
}

export type UpdateEventDto = Partial<CreateEventDto>;

/** The four kinds the calendar page colours by. */
const EVENT_TYPES = ['academic', 'holiday', 'event', 'exam'];
const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

@Injectable()
export class CalendarService {
  constructor(private readonly prisma: PrismaService) {}

  private assertDate(value: string | undefined, field: string) {
    if (value === undefined || value === '') return;
    if (!DATE_RE.test(value) || Number.isNaN(Date.parse(value))) {
      throw new BadRequestException(`${field} must be a date in YYYY-MM-DD form.`);
    }
  }

  private assertType(type: string | undefined) {
    if (type === undefined || type === '') return;
    if (!EVENT_TYPES.includes(type)) {
      throw new BadRequestException(
        `type must be one of ${EVENT_TYPES.join(', ')}.`,
      );
    }
  }

  private assertTitle(title: string | undefined) {
    if (!title || !title.trim()) {
      throw new BadRequestException('Event title is required.');
    }
    if (title.trim().length > 160) {
      throw new BadRequestException('Title must be 160 characters or fewer.');
    }
  }

  /**
   * Events for a month (`month=YYYY-MM`) or, with no filter, the whole
   * year. Multi-day events are included if they overlap the window.
   */
  async list(month?: string, type?: string) {
    const where: Prisma.AcademicEventWhereInput = {};

    if (month) {
      if (!/^\d{4}-\d{2}$/.test(month)) {
        throw new BadRequestException('month must be in YYYY-MM form.');
      }
      const [year, mon] = month.split('-').map(Number);
      const start = `${month}-01`;
      // Last day of the month, computed rather than hardcoded.
      const lastDay = new Date(year, mon, 0).getDate();
      const end = `${month}-${String(lastDay).padStart(2, '0')}`;
      where.AND = [
        { date: { lte: end } },
        { OR: [{ endDate: null }, { endDate: { gte: start } }] },
      ];
    }

    if (type) {
      if (!EVENT_TYPES.includes(type)) {
        throw new BadRequestException(
          `type must be one of ${EVENT_TYPES.join(', ')}.`,
        );
      }
      where.type = type;
    }

    return this.prisma.academicEvent.findMany({
      where,
      orderBy: [{ date: 'asc' }, { title: 'asc' }],
    });
  }

  /** Next N events from today - used by dashboard "upcoming" cards. */
  async upcoming(limit = 5) {
    const today = new Date().toISOString().split('T')[0];
    return this.prisma.academicEvent.findMany({
      where: { OR: [{ date: { gte: today } }, { endDate: { gte: today } }] },
      orderBy: { date: 'asc' },
      take: Math.min(Math.max(Number(limit) || 5, 1), 50),
    });
  }

  async create(data: CreateEventDto) {
    this.assertTitle(data.title);
    this.assertDate(data.date, 'date');
    this.assertDate(data.endDate, 'endDate');
    this.assertType(data.type);

    if (!data.date) throw new BadRequestException('date is required.');
    if (data.endDate && data.endDate < data.date) {
      throw new BadRequestException('endDate cannot be before date.');
    }

    return this.prisma.academicEvent.create({
      data: {
        title: data.title.trim(),
        date: data.date,
        endDate: data.endDate || null,
        time: data.time ?? '',
        type: data.type ?? 'academic',
        location: data.location ?? '',
        description: data.description ?? '',
      },
    });
  }

  async update(id: string, data: UpdateEventDto) {
    const existing = await this.prisma.academicEvent.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException('Event not found.');

    this.assertTitle(data.title ?? existing.title);
    this.assertDate(data.date, 'date');
    this.assertDate(data.endDate, 'endDate');
    this.assertType(data.type);

    const date = data.date ?? existing.date;
    const endDate = data.endDate !== undefined ? data.endDate : existing.endDate;
    if (endDate && endDate < date) {
      throw new BadRequestException('endDate cannot be before date.');
    }

    return this.prisma.academicEvent.update({
      where: { id },
      data: {
        title: (data.title ?? existing.title).trim(),
        date,
        endDate: endDate || null,
        time: data.time ?? existing.time,
        type: data.type ?? existing.type,
        location: data.location ?? existing.location,
        description: data.description ?? existing.description,
      },
    });
  }

  async remove(id: string) {
    const existing = await this.prisma.academicEvent.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException('Event not found.');
    return this.prisma.academicEvent.delete({ where: { id } });
  }
}
