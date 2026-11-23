import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import type { Prisma } from '@prisma/client';

export class CreateExamResultDto {
  studentId: string;
  term: string;
  subject: string;
  internal: number;
  exam: number;
  total: number;
  grade: string;
  remarks?: string;
  academicYear: string;
}

/** One row of the class report-card grid. */
export interface SubjectMark {
  subject: string;
  internal: number;
  exam: number;
  total: number;
  maxMark: number;
  grade: string | null;
  remark: string;
  passed: boolean;
}

type ScaleWithBands = Prisma.GradingScaleGetPayload<{
  include: { bands: true };
}>;

@Injectable()
export class ExamsService {
  constructor(private readonly prisma: PrismaService) {}

  // ─── Grading ──────────────────────────────────────────────────────────

  /**
   * The configured default scale (falls back to the only scale if no
   * default is flagged). Replaces the hardcoded A+/A/A- ladder that used
   * to live in calcGrade() and disagreed with the CBSE 9-point scale.
   */
  private async loadScale(): Promise<ScaleWithBands | null> {
    const scale =
      (await this.prisma.gradingScale.findFirst({
        where: { isDefault: true },
        include: { bands: { orderBy: { sortOrder: 'desc' } } },
      })) ??
      (await this.prisma.gradingScale.findFirst({
        include: { bands: { orderBy: { sortOrder: 'desc' } } },
      }));
    return scale;
  }

  /** Map a percentage onto a band of the default scale. */
  private bandFor(scale: ScaleWithBands, percentage: number) {
    return (
      scale.bands.find(
        (band) => percentage >= band.minMark && percentage <= band.maxMark,
      ) ?? null
    );
  }

  /** Grade a raw score out of `max` using the configured scale. */
  private gradeOf(
    scale: ScaleWithBands | null,
    total: number,
    max: number,
  ): { grade: string; passed: boolean; remark: string } {
    if (!scale) {
      // No scale configured: never invent a grade, just report the facts.
      return { grade: '', passed: total >= Math.round(max * 0.33), remark: '' };
    }
    const percentage = max > 0 ? (total / max) * 100 : 0;
    const band = this.bandFor(scale, percentage);
    return {
      grade: band?.grade ?? '',
      passed: percentage >= scale.passMark,
      remark: band?.remark ?? '',
    };
  }

  // ─── Results ──────────────────────────────────────────────────────────

  async createResult(data: CreateExamResultDto) {
    const scale = await this.loadScale();
    const graded = this.gradeOf(scale, data.total, 100);
    return this.prisma.examResult.create({
      data: {
        ...data,
        // The caller may supply a grade, but the configured scale wins so
        // stored rows can never disagree with the report card.
        grade: graded.grade || data.grade || '',
        remarks: data.remarks ?? graded.remark,
      },
    });
  }

  async getStudentResults(studentId: string) {
    return this.prisma.examResult.findMany({
      where: { studentId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getStudentTermResults(studentId: string, term: string) {
    return this.prisma.examResult.findMany({
      where: { studentId, term },
    });
  }

  async bulkSaveResults(data: {
    class: string;
    section: string;
    term: string;
    academicYear: string;
    students: {
      studentId: string;
      name: string;
      subjects: { subject: string; internal: number; exam: number; total: number }[];
    }[];
  }) {
    if (!Array.isArray(data.students)) {
      throw new BadRequestException('students must be an array.');
    }

    const scale = await this.loadScale();

    const records = data.students.flatMap((student) =>
      student.subjects.map((s) => {
        const graded = this.gradeOf(scale, s.total, 100);
        return this.prisma.examResult.upsert({
          where: {
            studentId_term_subject: {
              studentId: student.studentId,
              term: data.term,
              subject: s.subject,
            },
          },
          create: {
            studentId: student.studentId,
            term: data.term,
            subject: s.subject,
            internal: s.internal,
            exam: s.exam,
            total: s.total,
            grade: graded.grade,
            academicYear: data.academicYear,
          },
          update: {
            internal: s.internal,
            exam: s.exam,
            total: s.total,
            grade: graded.grade,
          },
        });
      }),
    );

    const results = await Promise.all(records);
    return { saved: results.length };
  }

  // ─── Report cards ─────────────────────────────────────────────────────

  /**
   * ExamResult.studentId has historically held a StudentProfile.id (the
   * results wizard passes profile.id), a roll number or a User.id. Accept
   * all three so report cards resolve regardless of which wrote the row.
   */
  private async resolveStudent(rawId: string) {
    const byProfileId = await this.prisma.studentProfile.findUnique({
      where: { id: rawId },
      include: { user: true },
    });
    if (byProfileId) return byProfileId;

    const byRollNo = await this.prisma.studentProfile.findUnique({
      where: { studentId: rawId },
      include: { user: true },
    });
    if (byRollNo) return byRollNo;

    const byUserId = await this.prisma.studentProfile.findUnique({
      where: { userId: rawId },
      include: { user: true },
    });
    if (byUserId) return byUserId;

    const user = await this.prisma.user.findUnique({
      where: { id: rawId },
      include: { studentProfile: true },
    });
    if (!user?.studentProfile) return null;

    // Re-fetch with `user` so every caller sees the same shape as the
    // three earlier branches.
    return this.prisma.studentProfile.findUnique({
      where: { id: user.studentProfile.id },
      include: { user: true },
    });
  }

  /** School header printed on every report card. */
  private async schoolHeader() {
    const settings = await this.prisma.schoolSettings.findFirst();
    return {
      name: settings?.name ?? 'SNS Academy',
      academicYear: settings?.academicYear ?? '',
      mediumOfInstruction: settings?.mediumOfInstruction ?? '',
      board: settings?.board ?? '',
      contactPhone: settings?.contactPhone ?? '',
      address: settings?.address ?? '',
    };
  }

  /** Build one student's report card for a term. */
  private async buildReportCard(
    profile: NonNullable<Awaited<ReturnType<ExamsService['resolveStudent']>>>,
    term: string,
    scale: ScaleWithBands | null,
  ) {
    const results = await this.prisma.examResult.findMany({
      where: { studentId: { in: [profile.id, profile.studentId, profile.userId] }, term },
      orderBy: { subject: 'asc' },
    });

    const marks: SubjectMark[] = results.map((r) => {
      const graded = this.gradeOf(scale, r.total, 100);
      return {
        subject: r.subject,
        internal: r.internal,
        exam: r.exam,
        total: r.total,
        maxMark: 100,
        grade: r.grade || graded.grade || null,
        remark: r.remarks ?? '',
        passed: graded.passed,
      };
    });

    const totalObtained = marks.reduce((sum, m) => sum + m.total, 0);
    const totalMax = marks.reduce((sum, m) => sum + m.maxMark, 0);
    const percentage = totalMax > 0 ? (totalObtained / totalMax) * 100 : 0;
    const overall = this.gradeOf(scale, totalObtained, totalMax);
    const failed = marks.filter((m) => !m.passed);

    return {
      student: {
        profileId: profile.id,
        userId: profile.userId,
        rollNo: profile.studentId,
        name: profile.user.name,
        class: profile.class,
        section: profile.section,
        admissionNo: profile.admissionNo ?? '',
        gender: profile.gender ?? '',
        dob: profile.dob ?? '',
      },
      term,
      subjects: marks,
      summary: {
        totalObtained,
        totalMax,
        percentage: Math.round(percentage * 100) / 100,
        overallGrade: overall.grade,
        overallRemark: overall.remark,
        passed: failed.length === 0 && marks.length > 0,
        subjectsAttempted: marks.length,
        subjectsFailed: failed.map((m) => m.subject),
      },
      gradingScale: scale
        ? {
            name: scale.name,
            passMark: scale.passMark,
            bands: [...scale.bands]
              .sort((a, b) => b.minMark - a.minMark)
              .map((b) => ({
                minMark: b.minMark,
                maxMark: b.maxMark,
                grade: b.grade,
                remark: b.remark,
              })),
          }
        : null,
      school: await this.schoolHeader(),
    };
  }

  /** Every student in a class/section, report cards for one term. */
  async getReportCards(query: {
    class?: string;
    section?: string;
    term?: string;
    academicYear?: string;
  }) {
    const term = query.term?.trim();
    if (!term) throw new BadRequestException('term is required.');

    const where: Prisma.StudentProfileWhereInput = {};
    if (query.class) where.class = query.class;
    if (query.section) where.section = query.section;

    const profiles = await this.prisma.studentProfile.findMany({
      where,
      include: { user: true },
      orderBy: [{ class: 'asc' }, { section: 'asc' }, { studentId: 'asc' }],
    });

    if (profiles.length === 0) {
      throw new NotFoundException('No students found for that class/section.');
    }

    const scale = await this.loadScale();
    const cards = await Promise.all(
      profiles.map((p) => this.buildReportCard(p, term!, scale)),
    );

    const attempted = cards.filter((c) => c.subjects.length > 0);

    return {
      term,
      academicYear: query.academicYear ?? (await this.schoolHeader()).academicYear,
      gradingScale: cards[0]?.gradingScale ?? null,
      school: cards[0]?.school ?? (await this.schoolHeader()),
      class: query.class ?? '',
      section: query.section ?? '',
      generatedAt: new Date().toISOString(),
      students: cards,
      summary: {
        total: cards.length,
        withResults: attempted.length,
        passed: attempted.filter((c) => c.summary.passed).length,
        failed: attempted.filter((c) => !c.summary.passed).length,
      },
    };
  }

  /** Single report card - used by the printable view and parent portal. */
  async getReportCard(studentId: string, term: string) {
    if (!term) throw new BadRequestException('term is required.');
    const profile = await this.resolveStudent(studentId);
    if (!profile) throw new NotFoundException('Student not found.');

    const scale = await this.loadScale();
    const card = await this.buildReportCard(profile, term, scale);
    if (card.subjects.length === 0) {
      throw new NotFoundException(
        `No results recorded for ${profile.user.name} in ${term}.`,
      );
    }
    return card;
  }

  /** Distinct terms that actually have results - drives the term dropdown. */
  async listTerms() {
    const rows = await this.prisma.examResult.groupBy({
      by: ['term', 'academicYear'],
      orderBy: { term: 'asc' },
    });
    return rows.map((r) => ({ term: r.term, academicYear: r.academicYear }));
  }

  // ─── Exam schedule ────────────────────────────────────────────────────

  async createSchedule(data: {
    class: string;
    section: string;
    subject: string;
    examDate: string;
    startTime: string;
    duration?: string;
    hall?: string;
    term: string;
    academicYear: string;
  }) {
    return this.prisma.examSchedule.create({ data });
  }

  async getScheduleByClass(cls: string, section: string, term?: string) {
    const where: Prisma.ExamScheduleWhereInput = { class: cls, section };
    if (term) where.term = term;
    return this.prisma.examSchedule.findMany({
      where,
      orderBy: { examDate: 'asc' },
    });
  }

  async deleteSchedule(id: string) {
    return this.prisma.examSchedule.delete({ where: { id } });
  }
}
