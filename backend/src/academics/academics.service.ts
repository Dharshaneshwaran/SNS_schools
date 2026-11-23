import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

// --- DTOs ----------------------------------------------------------------
// Plain classes, matching the HomeworkModule convention (no class-validator
// in this project, so validation is done by hand in the service).

export class CreateWingDto {
  name: string;
  gradeRange?: string;
  coordinatorName?: string;
  sortOrder?: number;
}

export class UpdateWingDto {
  name?: string;
  gradeRange?: string;
  coordinatorName?: string;
  sortOrder?: number;
  coordinatorId?: string | null;
}

export class CreateClassDto {
  name: string;
  code: string;
  wingId?: string | null;
  sortOrder?: number;
  sections?: string[];
}

export class UpdateClassDto {
  name?: string;
  code?: string;
  wingId?: string | null;
  sortOrder?: number;
}

export class CreateSubjectDto {
  name: string;
  type?: string;
  sortOrder?: number;
}

export class UpdateSubjectDto {
  name?: string;
  type?: string;
  sortOrder?: number;
}

export class AssignSubjectsDto {
  subjectIds: string[];
}

export class CreateGradeBandDto {
  minMark: number;
  maxMark: number;
  grade: string;
  remark?: string;
}

export class CreateGradingScaleDto {
  name: string;
  passMark?: number;
  isDefault?: boolean;
  bands?: CreateGradeBandDto[];
}

export class CreateExamTypeDto {
  name: string;
  appliesTo?: string;
  isTerm?: boolean;
  sortOrder?: number;
}

export class UpdateExamTypeDto {
  name?: string;
  appliesTo?: string;
  isTerm?: boolean;
  sortOrder?: number;
}

export class UpdateMediumDto {
  mediumOfInstruction?: string;
  secondLanguage?: string;
  board?: string;
}

// --- Service -------------------------------------------------------------

@Injectable()
export class AcademicsService {
  constructor(private readonly prisma: PrismaService) {}

  /** Everything the Academic Structure screen needs in one call. */
  async overview() {
    const [wings, classes, subjects, scales, examTypes, settings] =
      await Promise.all([
        this.prisma.wing.findMany({
          orderBy: { sortOrder: 'asc' },
          include: { _count: { select: { classes: true } } },
        }),
        this.prisma.schoolClass.findMany({
          orderBy: { sortOrder: 'asc' },
          include: {
            wing: true,
            sections: { orderBy: { name: 'asc' } },
            subjects: {
              orderBy: { sortOrder: 'asc' },
              include: { subject: true },
            },
          },
        }),
        this.prisma.subject.findMany({ orderBy: [{ type: 'asc' }, { sortOrder: 'asc' }] }),
        this.prisma.gradingScale.findMany({
          orderBy: { isDefault: 'desc' },
          include: { bands: { orderBy: { sortOrder: 'desc' } } },
        }),
        this.prisma.examType.findMany({ orderBy: { sortOrder: 'asc' } }),
        this.prisma.schoolSettings.findFirst(),
      ]);

    return {
      wings,
      classes,
      subjects,
      gradingScales: scales,
      examTypes,
      medium: {
        mediumOfInstruction: settings?.mediumOfInstruction ?? 'English',
        secondLanguage: settings?.secondLanguage ?? '',
        board: settings?.board ?? '',
      },
    };
  }

  // --- Wings -------------------------------------------------------------

  async createWing(data: CreateWingDto) {
    this.require(data.name, 'Wing name is required.');
    const exists = await this.prisma.wing.findUnique({ where: { name: data.name } });
    if (exists) throw new BadRequestException(`Wing "${data.name}" already exists.`);
    return this.prisma.wing.create({
      data: {
        name: data.name,
        gradeRange: data.gradeRange ?? '',
        coordinatorName: data.coordinatorName ?? '',
        sortOrder: data.sortOrder ?? 0,
      },
    });
  }

  async updateWing(id: string, data: UpdateWingDto) {
    await this.mustExist(this.prisma.wing.findUnique({ where: { id } }), 'Wing');
    return this.prisma.wing.update({ where: { id }, data: this.strip(data) });
  }

  async deleteWing(id: string) {
    await this.mustExist(this.prisma.wing.findUnique({ where: { id } }), 'Wing');
    // Classes keep their rows; wingId is nullable and set to null.
    return this.prisma.wing.delete({ where: { id } });
  }

  // --- Classes and sections ---------------------------------------------

  async createClass(data: CreateClassDto) {
    this.require(data.name, 'Class name is required.');
    this.require(data.code, 'Class code is required.');
    const byCode = await this.prisma.schoolClass.findUnique({ where: { code: data.code } });
    if (byCode) throw new BadRequestException(`Class code "${data.code}" already exists.`);
    const byName = await this.prisma.schoolClass.findUnique({ where: { name: data.name } });
    if (byName) throw new BadRequestException(`Class "${data.name}" already exists.`);

    return this.prisma.schoolClass.create({
      data: {
        name: data.name,
        code: data.code,
        wingId: data.wingId ?? null,
        sortOrder: data.sortOrder ?? 0,
        sections: {
          create: (data.sections ?? ['A']).map((name) => ({ name })),
        },
      },
      include: { sections: true },
    });
  }

  async updateClass(id: string, data: UpdateClassDto) {
    await this.mustExist(this.prisma.schoolClass.findUnique({ where: { id } }), 'Class');
    return this.prisma.schoolClass.update({ where: { id }, data: this.strip(data) });
  }

  async deleteClass(id: string) {
    await this.mustExist(this.prisma.schoolClass.findUnique({ where: { id } }), 'Class');
    return this.prisma.schoolClass.delete({ where: { id } });
  }

  async addSection(classId: string, name: string) {
    this.require(name, 'Section name is required.');
    await this.mustExist(this.prisma.schoolClass.findUnique({ where: { id: classId } }), 'Class');
    const exists = await this.prisma.classSection.findUnique({
      where: { classId_name: { classId, name } },
    });
    if (exists) throw new BadRequestException(`Section "${name}" already exists.`);
    return this.prisma.classSection.create({ data: { classId, name } });
  }

  async removeSection(classId: string, sectionId: string) {
    const section = await this.prisma.classSection.findFirst({
      where: { id: sectionId, classId },
    });
    if (!section) throw new NotFoundException('Section not found.');
    return this.prisma.classSection.delete({ where: { id: sectionId } });
  }

  // --- Subjects ----------------------------------------------------------

  async createSubject(data: CreateSubjectDto) {
    this.require(data.name, 'Subject name is required.');
    const exists = await this.prisma.subject.findUnique({ where: { name: data.name } });
    if (exists) throw new BadRequestException(`Subject "${data.name}" already exists.`);
    return this.prisma.subject.create({
      data: {
        name: data.name,
        type: data.type ?? 'scholastic',
        sortOrder: data.sortOrder ?? 0,
      },
    });
  }

  async updateSubject(id: string, data: UpdateSubjectDto) {
    await this.mustExist(this.prisma.subject.findUnique({ where: { id } }), 'Subject');
    return this.prisma.subject.update({ where: { id }, data: this.strip(data) });
  }

  async deleteSubject(id: string) {
    await this.mustExist(this.prisma.subject.findUnique({ where: { id } }), 'Subject');
    return this.prisma.subject.delete({ where: { id } });
  }

  /** Replace a class's subject list with the given ids. */
  async assignSubjects(classId: string, data: AssignSubjectsDto) {
    await this.mustExist(this.prisma.schoolClass.findUnique({ where: { id: classId } }), 'Class');
    if (!Array.isArray(data.subjectIds)) {
      throw new BadRequestException('subjectIds must be an array.');
    }

    const current = await this.prisma.classSubject.findMany({ where: { classId } });
    const wanted = new Set(data.subjectIds);

    const toRemove = current
      .filter((c) => !wanted.has(c.subjectId))
      .map((c) => c.id);

    const existingIds = new Set(current.map((c) => c.subjectId));
    const toAdd = data.subjectIds
      .filter((id) => !existingIds.has(id))
      .map((id, i) => ({ classId, subjectId: id, sortOrder: current.length + i }));

    await this.prisma.$transaction([
      ...(toRemove.length
        ? [this.prisma.classSubject.deleteMany({ where: { id: { in: toRemove } } })]
        : []),
      ...(toAdd.length
        ? [this.prisma.classSubject.createMany({ data: toAdd })]
        : []),
    ]);

    return this.prisma.classSubject.findMany({
      where: { classId },
      orderBy: { sortOrder: 'asc' },
      include: { subject: true },
    });
  }

  // --- Grading scale -----------------------------------------------------

  async createGradingScale(data: CreateGradingScaleDto) {
    this.require(data.name, 'Scale name is required.');
    const exists = await this.prisma.gradingScale.findUnique({ where: { name: data.name } });
    if (exists) throw new BadRequestException(`Scale "${data.name}" already exists.`);

    const bands = data.bands ?? [];
    this.validateBands(bands);

    return this.prisma.gradingScale.create({
      data: {
        name: data.name,
        passMark: data.passMark ?? 33,
        isDefault: data.isDefault ?? false,
        bands: {
          create: bands.map((b, i) => ({ ...b, sortOrder: i })),
        },
      },
      include: { bands: { orderBy: { sortOrder: 'desc' } } },
    });
  }

  /** Update scale metadata and/or replace its bands wholesale. */
  async updateGradingScale(id: string, data: Partial<CreateGradingScaleDto>) {
    await this.mustExist(this.prisma.gradingScale.findUnique({ where: { id } }), 'Grading scale');

    if (data.bands) this.validateBands(data.bands);

    return this.prisma.$transaction(async (tx) => {
      if (data.bands) {
        await tx.gradeBand.deleteMany({ where: { scaleId: id } });
        await tx.gradeBand.createMany({
          data: data.bands.map((b, i) => ({ ...b, scaleId: id, sortOrder: i })),
        });
      }
      const { bands: _ignored, ...meta } = data;
      return tx.gradingScale.update({
        where: { id },
        data: this.strip(meta),
        include: { bands: { orderBy: { sortOrder: 'desc' } } },
      });
    });
  }

  async deleteGradingScale(id: string) {
    await this.mustExist(this.prisma.gradingScale.findUnique({ where: { id } }), 'Grading scale');
    const remaining = await this.prisma.gradingScale.count();
    if (remaining <= 1) {
      throw new BadRequestException('Cannot delete the last grading scale.');
    }
    return this.prisma.gradingScale.delete({ where: { id } });
  }

  /** Resolve a percentage to a band using the default scale. */
  async gradeFor(percentage: number) {
    const scale =
      (await this.prisma.gradingScale.findFirst({
        where: { isDefault: true },
        include: { bands: { orderBy: { sortOrder: 'desc' } } },
      })) ??
      (await this.prisma.gradingScale.findFirst({
        include: { bands: { orderBy: { sortOrder: 'desc' } } },
      }));
    if (!scale) throw new NotFoundException('No grading scale configured.');

    const { bands } = scale;
    const band = bands.find((b) => percentage >= b.minMark && percentage <= b.maxMark);
    return {
      scale: scale.name,
      passMark: scale.passMark,
      passed: percentage >= scale.passMark,
      grade: band?.grade ?? null,
      remark: band?.remark ?? '',
    };
  }

  // --- Exam types --------------------------------------------------------

  async createExamType(data: CreateExamTypeDto) {
    this.require(data.name, 'Exam name is required.');
    const exists = await this.prisma.examType.findFirst({
      where: { name: data.name, appliesTo: data.appliesTo ?? 'All grades (I - XII)' },
    });
    if (exists) throw new BadRequestException(`Exam type "${data.name}" already exists for ${data.appliesTo ?? 'all grades'}.`);
    return this.prisma.examType.create({
      data: {
        name: data.name,
        appliesTo: data.appliesTo ?? 'All grades (I - XII)',
        isTerm: data.isTerm ?? false,
        sortOrder: data.sortOrder ?? 0,
      },
    });
  }

  async updateExamType(id: string, data: UpdateExamTypeDto) {
    await this.mustExist(this.prisma.examType.findUnique({ where: { id } }), 'Exam type');
    return this.prisma.examType.update({ where: { id }, data: this.strip(data) });
  }

  async deleteExamType(id: string) {
    await this.mustExist(this.prisma.examType.findUnique({ where: { id } }), 'Exam type');
    return this.prisma.examType.delete({ where: { id } });
  }

  // --- Medium of instruction (section 6) ---------------------------------

  async updateMedium(data: UpdateMediumDto) {
    return this.prisma.schoolSettings.update({
      where: { id: 'singleton' },
      data: this.strip(data),
    });
  }

  // --- helpers -----------------------------------------------------------

  private require(value: unknown, message: string) {
    if (value === undefined || value === null || String(value).trim() === '') {
      throw new BadRequestException(message);
    }
  }

  private async mustExist(promise: Promise<unknown>, label: string) {
    const row = await promise;
    if (!row) throw new NotFoundException(`${label} not found.`);
    return row;
  }

  /** Drop undefined values so Prisma updates only what was sent. */
  private strip<T extends object>(data: T): Partial<T> {
    const out: Partial<T> = {};
    for (const [k, v] of Object.entries(data)) {
      if (v !== undefined) (out as any)[k] = v;
    }
    return out;
  }

  private validateBands(bands: CreateGradeBandDto[]) {
    if (!Array.isArray(bands) || bands.length === 0) {
      throw new BadRequestException('At least one grade band is required.');
    }
    for (const b of bands) {
      if (typeof b.minMark !== 'number' || typeof b.maxMark !== 'number') {
        throw new BadRequestException('Band marks must be numbers.');
      }
      if (b.minMark < 0 || b.maxMark > 100) {
        throw new BadRequestException('Band marks must be between 0 and 100.');
      }
      if (b.minMark > b.maxMark) {
        throw new BadRequestException(`Band ${b.minMark}-${b.maxMark}: minMark cannot exceed maxMark.`);
      }
      if (!b.grade || String(b.grade).trim() === '') {
        throw new BadRequestException('Every band needs a grade label.');
      }
    }

    // Bands must not overlap.
    const sorted = [...bands].sort((a, b) => a.minMark - b.minMark);
    for (let i = 1; i < sorted.length; i++) {
      if (sorted[i].minMark <= sorted[i - 1].maxMark) {
        throw new BadRequestException(
          `Bands "${sorted[i - 1].grade}" and "${sorted[i].grade}" overlap.`,
        );
      }
    }
  }
}
