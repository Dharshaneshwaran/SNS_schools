import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import type { Prisma } from '@prisma/client';
import * as ExcelJS from 'exceljs';

/** Header aliases accepted when importing a school's own sheet. */
const STUDENT_COLUMNS: { key: string; header: string; aliases: string[] }[] = [
  { key: 'name', header: 'Name', aliases: ['name', 'student name', 'full name'] },
  { key: 'email', header: 'Email', aliases: ['email', 'e-mail', 'mail'] },
  { key: 'class', header: 'Class', aliases: ['class', 'grade', 'std', 'standard'] },
  { key: 'section', header: 'Section', aliases: ['section', 'sec', 'div', 'division'] },
  { key: 'gender', header: 'Gender', aliases: ['gender', 'sex'] },
  { key: 'dob', header: 'DOB', aliases: ['dob', 'date of birth', 'birthdate'] },
  { key: 'studentId', header: 'Roll No', aliases: ['roll no', 'rollno', 'roll no.', 'student id'] },
  { key: 'admissionNo', header: 'Admission No', aliases: ['admission no', 'admission no.', 'adm no'] },
  { key: 'fatherName', header: 'Father Name', aliases: ['father name', 'father'] },
  { key: 'fatherContact', header: 'Father Contact', aliases: ['father contact', 'father phone', 'father mobile'] },
  { key: 'motherName', header: 'Mother Name', aliases: ['mother name', 'mother'] },
  { key: 'motherContact', header: 'Mother Contact', aliases: ['mother contact', 'mother phone', 'mother mobile'] },
  { key: 'address', header: 'Address', aliases: ['address', 'residential address'] },
];

const normalise = (value: unknown) =>
  String(value ?? '')
    .toLowerCase()
    .replace(/[._-]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

@Injectable()
export class ExcelService {
  constructor(private readonly prisma: PrismaService) {}

  // ─── Exports ──────────────────────────────────────────────────────────

  /** Every pupil, optionally narrowed to one class/section. */
  async exportStudents(classCode?: string, section?: string) {
    const where: Prisma.StudentProfileWhereInput = {};
    if (classCode) where.class = classCode;
    if (section) where.section = section;

    const profiles = await this.prisma.studentProfile.findMany({
      where,
      include: { user: true },
      orderBy: [{ class: 'asc' }, { section: 'asc' }, { studentId: 'asc' }],
    });

    const rows = profiles.map((p) => ({
      'Roll No': p.studentId,
      'Admission No': p.admissionNo ?? '',
      Name: p.user.name,
      Email: p.user.email,
      Class: p.class,
      Section: p.section,
      Gender: p.gender ?? '',
      DOB: p.dob ?? '',
      'Father Name': p.fatherName ?? '',
      'Father Contact': p.fatherContact ?? '',
      'Mother Name': p.motherName ?? '',
      'Mother Contact': p.motherContact ?? '',
      Address: p.fatherOfficeAddress ?? '',
      Status: p.user.status,
    }));

    return this.toWorkbook(
      'Students',
      rows,
      'Export of the student register. Import accepts the same headers.',
    );
  }

  /** Mark sheet for one class/section/term, already graded. */
  async exportMarks(classCode: string, section: string, term: string) {
    if (!classCode || !section || !term) {
      throw new BadRequestException('class, section and term are required.');
    }

    const profiles = await this.prisma.studentProfile.findMany({
      where: { class: classCode, section },
      include: { user: true },
      orderBy: { studentId: 'asc' },
    });
    if (profiles.length === 0) {
      throw new NotFoundException('No students found for that class/section.');
    }

    const results = await this.prisma.examResult.findMany({
      where: {
        term,
        studentId: { in: profiles.flatMap((p) => [p.id, p.studentId, p.userId]) },
      },
    });

    // Index results per pupil across all three id forms we tolerate.
    const byStudent = new Map<string, typeof results>();
    for (const r of results) {
      const owner = profiles.find(
        (p) => p.id === r.studentId || p.studentId === r.studentId || p.userId === r.studentId,
      );
      if (!owner) continue;
      const list = byStudent.get(owner.id) ?? [];
      list.push(r);
      byStudent.set(owner.id, list);
    }

    const subjects = [...new Set(results.map((r) => r.subject))].sort();

    // Overall grade must come from the scale applied to the total, not be
    // lifted from whichever subject sorted first.
    const scale =
      (await this.prisma.gradingScale.findFirst({
        where: { isDefault: true },
        include: { bands: { orderBy: { sortOrder: 'desc' } } },
      })) ??
      (await this.prisma.gradingScale.findFirst({
        include: { bands: { orderBy: { sortOrder: 'desc' } } },
      }));
    const overallGrade = (percentage: number) =>
      scale?.bands.find((b) => percentage >= b.minMark && percentage <= b.maxMark)
        ?.grade ?? '';

    const rows = profiles.map((p) => {
      const mine = byStudent.get(p.id) ?? [];
      const row: Record<string, unknown> = { 'Roll No': p.studentId, Name: p.user.name };
      let total = 0;
      for (const subject of subjects) {
        const found = mine.find((r) => r.subject === subject);
        row[subject] = found ? found.total : '';
        total += found?.total ?? 0;
      }
      const max = subjects.length * 100;
      const pct = max > 0 ? (total / max) * 100 : 0;
      // A pupil with no marks yet gets blanks, never "0" - a zero in a
      // mark sheet reads as "scored nothing" rather than "not entered".
      if (mine.length === 0) {
        row.Total = '';
        row.Percentage = '';
        row.Grade = '';
      } else {
        row.Total = total;
        row.Percentage = `${Math.round(pct * 100) / 100}%`;
        row.Grade = overallGrade(pct);
      }
      return row;
    });

    return this.toWorkbook(
      `Marks ${term}`,
      rows,
      `Mark sheet for Class ${classCode}-${section}, ${term}.`,
    );
  }

  /** The weekly timetable, one row per slot. */
  async exportTimetable(classLabel?: string) {
    const where: Prisma.TimetableEntryWhereInput = {};
    if (classLabel) {
      const idx = classLabel.lastIndexOf('-');
      where.class = idx > 0 ? classLabel.slice(0, idx).trim() : classLabel;
      if (idx > 0) where.section = classLabel.slice(idx + 1).trim();
    }

    const entries = await this.prisma.timetableEntry.findMany({
      where,
      include: { teacher: { select: { name: true } } },
      orderBy: [{ class: 'asc' }, { section: 'asc' }, { day: 'asc' }, { period: 'asc' }],
    });

    const rows = entries.map((e) => ({
      Day: e.day,
      Period: e.period,
      'Start': e.startTime,
      'End': e.endTime,
      Class: e.class,
      Section: e.section,
      Subject: e.subject,
      Teacher: e.teacher?.name ?? '',
      Room: e.room,
    }));

    return this.toWorkbook(
      'Timetable',
      rows,
      'Weekly timetable export.',
    );
  }

  /** Blank sheet matching the import column order. */
  async studentTemplate() {
    const rows = [
      Object.fromEntries(STUDENT_COLUMNS.map((c) => [c.header, ''])),
      {
        Name: 'Example Pupil',
        Email: 'pupil@example.com',
        Class: '10',
        Section: 'A',
        Gender: 'Female',
        'DOB': '2015-04-12',
        'Roll No': 'STD-1042',
        'Admission No': 'ADM-2026-042',
        'Father Name': 'Example Father',
        'Father Contact': '9876543210',
        'Mother Name': 'Example Mother',
        'Mother Contact': '9876543211',
        Address: '12 Temple Street, Chennai',
      },
    ];
    return this.toWorkbook(
      'Students',
      rows,
      'Fill one pupil per row. Headers may be renamed to match your own sheet - ' +
        'the importer matches them case-insensitively. Delete this example row before importing.',
    );
  }

  // ─── Import ───────────────────────────────────────────────────────────

  /**
   * Parse a workbook and create pupils. `dryRun` validates and reports
   * without writing anything, so the office can review the mapping first.
   */
  async importStudents(
    buffer: Buffer,
    options: { dryRun?: boolean } = {},
  ) {
    const workbook = new ExcelJS.Workbook();
    try {
      await workbook.xlsx.load(buffer as unknown as ArrayBuffer);
    } catch {
      throw new BadRequestException(
        'That file could not be read as an .xlsx workbook.',
      );
    }

    const sheet = workbook.worksheets[0];
    if (!sheet) throw new BadRequestException('The workbook has no sheets.');

    const headerRow = sheet.getRow(1);
    const headers: string[] = [];
    headerRow.eachCell({ includeEmpty: true }, (cell, colNumber) => {
      headers[colNumber - 1] = normalise(cell.value);
    });

    if (!headers.length || headers.every((h) => !h)) {
      throw new BadRequestException(
        'The first row must contain column headers.',
      );
    }

    // Map each known field to whichever column carries its header.
    const columnIndex = new Map<string, number>();
    for (const field of STUDENT_COLUMNS) {
      const found = headers.findIndex((h) =>
        field.aliases.some((alias) => h === normalise(alias)),
      );
      if (found >= 0) columnIndex.set(field.key, found + 1);
    }

    if (!columnIndex.has('name')) {
      throw new BadRequestException(
        `No "Name" column found. Expected headers such as: ${STUDENT_COLUMNS.map((c) => c.header).join(', ')}.`,
      );
    }

    const cellAt = (row: ExcelJS.Row, key: string): string => {
      const col = columnIndex.get(key);
      if (!col) return '';
      const value = row.getCell(col).value;
      if (value instanceof Date) return value.toISOString().slice(0, 10);
      if (value && typeof value === 'object' && 'text' in (value as object)) {
        return String((value as { text: string }).text ?? '');
      }
      return String(value ?? '').trim();
    };

    const errors: { row: number; message: string }[] = [];
    const ready: Record<string, string>[] = [];
    const skipped: { row: number; reason: string }[] = [];

    const seenEmails = new Set<string>();
    const existingUsers = await this.prisma.user.findMany({
      select: { email: true },
    });
    const existingEmails = new Set(existingUsers.map((u) => u.email));

    for (let r = 2; r <= sheet.rowCount; r++) {
      const row = sheet.getRow(r);
      const name = cellAt(row, 'name');
      const email = cellAt(row, 'email').toLowerCase();

      // Blank rows are ordinary padding in a spreadsheet - not an error.
      if (!name && !email) continue;

      if (!name) {
        errors.push({ row: r, message: 'Name is required.' });
        continue;
      }
      if (!email) {
        errors.push({ row: r, message: `${name}: email is required.` });
        continue;
      }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        errors.push({ row: r, message: `${name}: "${email}" is not a valid email.` });
        continue;
      }
      if (existingEmails.has(email) || seenEmails.has(email)) {
        skipped.push({ row: r, reason: `${name}: ${email} already exists.` });
        continue;
      }

      seenEmails.add(email);
      const record: Record<string, string> = {};
      for (const field of STUDENT_COLUMNS) record[field.key] = cellAt(row, field.key);

      if (record.class && !record.section) {
        // Tolerate "10-A" pasted into the Class column.
        const split = record.class.lastIndexOf('-');
        if (split > 0) {
          record.section = record.class.slice(split + 1).trim();
          record.class = record.class.slice(0, split).trim();
        }
      }

      ready.push(record);
    }

    // Only fail outright when nothing at all could be understood. If rows
    // were simply skipped as duplicates, report that normally so the
    // caller sees "0 created, N skipped" instead of an error.
    if (errors.length && ready.length === 0 && skipped.length === 0) {
      throw new BadRequestException({
        message: 'No valid rows found in the workbook.',
        errors: errors.slice(0, 20),
      });
    }

    if (options.dryRun) {
      return {
        dryRun: true,
        sheet: sheet.name,
        totalRows: sheet.rowCount - 1,
        matchedColumns: Object.fromEntries(columnIndex),
        unmatchedFields: STUDENT_COLUMNS.filter((c) => !columnIndex.has(c.key)).map(
          (c) => c.header,
        ),
        ready,
        skipped,
        errors,
        created: 0,
      };
    }

    const created: { name: string; email: string; password: string; class: string; section: string }[] = [];
    for (const record of ready) {
      const password = this.generatePassword();
      const user = await this.prisma.$transaction(async (tx) => {
        const row = await tx.user.create({
          data: {
            name: record.name,
            email: record.email,
            password,
            role: 'parent',
            department: '',
            status: 'active',
            studentProfile: {
              create: {
                studentId: record.studentId || `STD-${Date.now()}-${created.length}`,
                class: record.class || '',
                section: record.section || '',
                admissionNo: record.admissionNo || `ADM-${Date.now()}`,
                gender: record.gender || null,
                dob: record.dob || null,
                fatherName: record.fatherName || null,
                fatherContact: record.fatherContact || null,
                motherName: record.motherName || null,
                motherContact: record.motherContact || null,
                fatherOfficeAddress: record.address || null,
              },
            },
          },
          include: { studentProfile: true },
        });
        return row;
      });

      created.push({
        name: user.name,
        email: user.email,
        password,
        class: record.class || '',
        section: record.section || '',
      });
    }

    return {
      dryRun: false,
      matchedColumns: Object.fromEntries(columnIndex),
      created,
      skipped,
      errors,
    };
  }

  // ─── Helpers ──────────────────────────────────────────────────────────

  private generatePassword() {
    const alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let out = '';
    for (let i = 0; i < 8; i++) {
      out += alphabet[Math.floor(Math.random() * alphabet.length)];
    }
    return out;
  }

  private async toWorkbook(
    sheetName: string,
    rows: Record<string, unknown>[],
    description: string,
  ) {
    const workbook = new ExcelJS.Workbook();
    workbook.creator = 'SNS Academy ERP';
    workbook.created = new Date();

    const sheet = workbook.addWorksheet(sheetName);

    // Rows are written positionally on purpose: assigning worksheet.columns
    // after data exists makes exceljs re-map cells, which can shift them.
    sheet.addRow([description]).font = { italic: true, size: 10 };
    sheet.addRow([]);

    const headers = rows.length > 0 ? Object.keys(rows[0]) : [];

    if (headers.length === 0) {
      sheet.addRow(['No records found.']);
    } else {
      const headerRow = sheet.addRow(headers);
      headerRow.font = { bold: true, color: { argb: 'FFFFFFFF' } };
      headerRow.eachCell((cell) => {
        cell.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'FFFF7F50' },
        };
        cell.alignment = { vertical: 'middle' };
      });

      for (const row of rows) {
        sheet.addRow(headers.map((h) => row[h] ?? ''));
      }

      headers.forEach((h, index) => {
        sheet.getColumn(index + 1).width = Math.max(
          12,
          Math.min(34, h.length + 6),
        );
      });

      sheet.views = [{ state: 'frozen', ySplit: 3 }];
      sheet.autoFilter = {
        from: { row: 3, column: 1 },
        to: { row: 3, column: headers.length },
      };
    }

    const buffer = await workbook.xlsx.writeBuffer();
    return {
      buffer: Buffer.from(buffer as ArrayBuffer),
      fileName: `${sheetName.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${new Date()
        .toISOString()
        .slice(0, 10)}.xlsx`,
      contentType:
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    };
  }
}
