/**
 * Seeds the Phase A academic foundation from "New ERP school.xlsx".
 *
 * Source sections:
 *   3  school wings            7  subjects per grade
 *   4  wing coordinators      10  examination types
 *   5  classes and sections   11  grading system
 *   6  medium of instruction
 *
 * Idempotent: every write is an upsert keyed on a natural unique column,
 * so this can be re-run safely.
 *
 * Plain JS on purpose - the repo's tsconfig sets module: NodeNext without
 * moduleResolution, which makes ts-node refuse to compile (TS5109).
 * Run with:  npm run seed:academics
 */

const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

// --- Section 3 + 4: wings and coordinators -------------------------------
// sortOrder follows the spreadsheet's top-to-bottom order.
const WINGS = [
  { name: 'Senior Secondary', gradeRange: 'Grade 11 and Grade 12', coordinatorName: 'Mrs. B. Sindhu', sortOrder: 1 },
  { name: 'Secondary',        gradeRange: 'Grade 9 and Grade 10',  coordinatorName: 'Mrs. B. Sindhu', sortOrder: 2 },
  { name: 'Midwing',          gradeRange: 'Grade 6 - 8',           coordinatorName: 'Mrs. Gangadevi', sortOrder: 3 },
  { name: 'Upper Primary',    gradeRange: 'Grade 3 - 5',           coordinatorName: 'Mrs. Meenakshi', sortOrder: 4 },
  { name: 'Lower Primary',    gradeRange: 'Grade 1 - 2',           coordinatorName: 'Mrs. Surekha',   sortOrder: 5 },
  { name: 'Kindergarten',     gradeRange: 'PRE KG, LKG, UKG',      coordinatorName: 'Mrs. Vahida',    sortOrder: 6 },
];

// --- Section 5: classes, sections, and the wing each belongs to ----------
// `code` is the short form already present in existing rows ("9", "10"),
// so current StudentProfile/Homework/Timetable records keep matching.
const CLASSES = [
  { name: 'PRE KG',   code: 'PRE KG', wing: 'Kindergarten',     sortOrder: 1,  sections: ['A', 'B'] },
  { name: 'LKG',      code: 'LKG',    wing: 'Kindergarten',     sortOrder: 2,  sections: ['A', 'B', 'C'] },
  { name: 'UKG',      code: 'UKG',    wing: 'Kindergarten',     sortOrder: 3,  sections: ['A', 'B', 'C'] },
  { name: 'Grade I',  code: '1',      wing: 'Lower Primary',    sortOrder: 4,  sections: ['A', 'B', 'C', 'D'] },
  { name: 'Grade II', code: '2',      wing: 'Lower Primary',    sortOrder: 5,  sections: ['A', 'B', 'C', 'D'] },
  { name: 'Grade III',   code: '3',   wing: 'Upper Primary',    sortOrder: 6,  sections: ['A', 'B', 'C'] },
  { name: 'Grade IV',    code: '4',   wing: 'Upper Primary',    sortOrder: 7,  sections: ['A', 'B'] },
  { name: 'Grade V',     code: '5',   wing: 'Upper Primary',    sortOrder: 8,  sections: ['A', 'B'] },
  { name: 'Grade VI',    code: '6',   wing: 'Midwing',          sortOrder: 9,  sections: ['A', 'B'] },
  { name: 'Grade VII',   code: '7',   wing: 'Midwing',          sortOrder: 10, sections: ['A', 'B'] },
  { name: 'Grade VIII',  code: '8',   wing: 'Midwing',          sortOrder: 11, sections: ['A', 'B'] },
  { name: 'Grade IX',    code: '9',   wing: 'Secondary',        sortOrder: 12, sections: ['A', 'B'] },
  { name: 'Grade X',     code: '10',  wing: 'Secondary',        sortOrder: 13, sections: ['A', 'B'] },
  { name: 'Grade XI',    code: '11',  wing: 'Senior Secondary', sortOrder: 14, sections: ['A', 'B'] },
  { name: 'Grade XII',   code: '12',  wing: 'Senior Secondary', sortOrder: 15, sections: ['A', 'B'] },
];

// --- Section 7: subjects -------------------------------------------------
// `optional` marks choice sets where a student picks one option.
const CORE = ['English', 'Mathematics'];
const SCI = ['Science', 'Social Science'];
const LANG_III = ['Language II Tamil', 'Language III Hindi'];
const LANG_II_CHOICES = ['Language II Tamil', 'Language II Hindi', 'Language II French'];

// Grades IX and X offer three Language II alternatives - a student sits one.
// Grades I-VIII list "Language II Tamil" alongside "Language III Hindi",
// which are two different required languages, NOT a choice set.
const LANG_II_OPTIONAL = new Set(LANG_II_CHOICES);
const CHOICE_SET_GRADES = new Set(['Grade IX', 'Grade X']);

// Grade XI/XII: the spreadsheet lists subjects across the science, commerce
// and humanities streams without grouping them. Only English is common to
// every stream, so everything else is offered-but-optional until stream
// grouping is supplied. See the note in the summary printed at the end.
const XI_XII = [
  'English', 'Mathematics', 'Physics', 'Chemistry', 'Biology', 'Accountancy',
  'Economics', 'Business Studies', 'Computer Science', 'Applied mathematics',
  'Physical Education', 'Psychology', 'Entrepreneurship', 'History',
  'Political science',
];
const XI_XII_REQUIRED = new Set(['English']);

const SUBJECTS_BY_CLASS = {
  'Grade XII': XI_XII,
  'Grade XI': XI_XII,
  'Grade X': [...CORE, ...SCI, ...LANG_II_CHOICES],
  'Grade IX': [...CORE, ...SCI, ...LANG_II_CHOICES],
  'Grade VIII': [...CORE, ...SCI, ...LANG_III],
  'Grade VII': [...CORE, ...SCI, ...LANG_III],
  'Grade VI': [...CORE, ...SCI, ...LANG_III],
  'Grade V': [...CORE, ...SCI, ...LANG_III],
  'Grade IV': [...CORE, ...SCI, ...LANG_III],
  'Grade III': [...CORE, ...SCI, ...LANG_III],
  'Grade II': ['English', 'Mathematics', 'EVS', ...LANG_III],
  'Grade I': ['English', 'Mathematics', 'EVS', ...LANG_III],
  'UKG': ['English', 'Tamil', 'Mathematics', 'Environmental Studies', 'Hindi'],
  'LKG': ['English', 'Tamil', 'Mathematics', 'Environmental Studies', 'Hindi'],
  'PRE KG': ['English', 'Mathematics', 'Environmental Studies'],
};

// Section 7 header rows: school-wide co-scholastic activities and the
// assessment tool, offered in every class.
const CO_SCHOLASTIC = ['Silambam/Karate', 'Dance/Music', 'Art', 'Sports', 'Swimming'];
const ASSESSMENT = ['AI'];

// --- Section 11: grading scale ------------------------------------------
// 91-100 A1 ... 00-20 E2, pass mark 33.
const GRADE_BANDS = [
  { minMark: 91, maxMark: 100, grade: 'A1' },
  { minMark: 81, maxMark: 90,  grade: 'A2' },
  { minMark: 71, maxMark: 80,  grade: 'B1' },
  { minMark: 61, maxMark: 70,  grade: 'B2' },
  { minMark: 51, maxMark: 60,  grade: 'C1' },
  { minMark: 41, maxMark: 50,  grade: 'C2' },
  { minMark: 33, maxMark: 40,  grade: 'D'  },
  { minMark: 21, maxMark: 32,  grade: 'E1' },
  { minMark: 0,  maxMark: 20,  grade: 'E2' },
];

// --- Section 10: exam types ---------------------------------------------
// Column B is the main list; column D is a separate Midwing list that the
// spreadsheet labels "Midwing - Grade 6 - 8".
const EXAM_TYPES = [
  { name: 'Periodic Test 1', appliesTo: 'All grades (I - XII)', sortOrder: 1 },
  { name: 'Periodic Test 2', appliesTo: 'All grades (I - XII)', sortOrder: 2 },
  { name: 'Periodic Test 3', appliesTo: 'All grades (I - XII)', sortOrder: 3 },
  { name: 'Term 1',          appliesTo: 'All grades (I - XII)', sortOrder: 4, isTerm: true },
  { name: 'Term 2',          appliesTo: 'All grades (I - XII)', sortOrder: 5, isTerm: true },
  { name: 'Preboard Exam',   appliesTo: 'Grade 9 and 11',       sortOrder: 6 },
  { name: 'Annual Exam',     appliesTo: 'Grade 9 and 11',       sortOrder: 7, isTerm: true },
  { name: 'Cycle test 1',    appliesTo: 'Midwing - Grade 6 - 8', sortOrder: 8 },
  { name: 'Cycle test 2',    appliesTo: 'Midwing - Grade 6 - 8', sortOrder: 9 },
];

// --- Section 6: medium of instruction ------------------------------------
const MEDIUM = {
  mediumOfInstruction: 'English',
  secondLanguage: 'Tamil / Hindi / French',
  board: 'CBSE',
};

async function main() {
  const summary = { wings: 0, classes: 0, sections: 0, subjects: 0, links: 0, bands: 0, examTypes: 0 };

  // Wings (coordinatorId stays null - coordinators are display names only
  // until staff accounts exist for them).
  const wingIds = {};
  for (const w of WINGS) {
    const row = await prisma.wing.upsert({
      where: { name: w.name },
      update: { gradeRange: w.gradeRange, coordinatorName: w.coordinatorName, sortOrder: w.sortOrder },
      create: w,
    });
    wingIds[w.name] = row.id;
    summary.wings++;
  }

  // Classes + sections.
  const classIds = {};
  for (const c of CLASSES) {
    const row = await prisma.schoolClass.upsert({
      where: { code: c.code },
      update: { name: c.name, sortOrder: c.sortOrder, wingId: wingIds[c.wing] },
      create: {
        name: c.name,
        code: c.code,
        sortOrder: c.sortOrder,
        wingId: wingIds[c.wing],
        sections: { create: c.sections.map((name) => ({ name })) },
      },
      include: { sections: true },
    });
    // Upsert skips the nested create when the class already exists, so make
    // sure sections exist either way.
    for (const name of c.sections) {
      await prisma.classSection.upsert({
        where: { classId_name: { classId: row.id, name } },
        update: {},
        create: { classId: row.id, name },
      });
      summary.sections++;
    }
    classIds[c.name] = row.id;
    summary.classes++;
  }

  // Subject catalogue: scholastic (per grade) + co-scholastic + assessment.
  const allSubjectNames = new Set(CO_SCHOLASTIC.concat(ASSESSMENT));
  for (const names of Object.values(SUBJECTS_BY_CLASS)) {
    names.forEach((n) => allSubjectNames.add(n));
  }

  const subjectIds = {};
  let order = 0;
  for (const name of allSubjectNames) {
    const type = CO_SCHOLASTIC.includes(name)
      ? 'co-scholastic'
      : ASSESSMENT.includes(name)
      ? 'assessment'
      : 'scholastic';
    const row = await prisma.subject.upsert({
      where: { name },
      update: { type },
      create: { name, type, sortOrder: order },
    });
    subjectIds[name] = row.id;
    summary.subjects++;
    order++;
  }

  // Class <-> subject links.
  for (const cls of CLASSES) {
    const names = (SUBJECTS_BY_CLASS[cls.name] || [])
      .concat(CO_SCHOLASTIC, ASSESSMENT);
    let sortOrder = 0;
    for (const name of names) {
      const isLanguageChoice =
        CHOICE_SET_GRADES.has(cls.name) && LANG_II_OPTIONAL.has(name);
      // Only genuine stream subjects are electives - co-scholastic
      // activities and the assessment tool are offered to everyone.
      const isStreamSubject =
        (cls.name === 'Grade XI' || cls.name === 'Grade XII') &&
        XI_XII.includes(name);
      const isXIIXIIelective = isStreamSubject && !XI_XII_REQUIRED.has(name);
      const optional = isLanguageChoice || isXIIXIIelective;
      await prisma.classSubject.upsert({
        where: { classId_subjectId: { classId: classIds[cls.name], subjectId: subjectIds[name] } },
        update: { sortOrder, optional },
        create: { classId: classIds[cls.name], subjectId: subjectIds[name], sortOrder, optional },
      });
      summary.links++;
      sortOrder++;
    }
  }

  // Grading scale (section 11).
  const scale = await prisma.gradingScale.upsert({
    where: { name: 'CBSE 9-point' },
    update: { isDefault: true, passMark: 33 },
    create: { name: 'CBSE 9-point', isDefault: true, passMark: 33 },
  });
  for (const [i, band] of GRADE_BANDS.entries()) {
    await prisma.gradeBand.upsert({
      where: { scaleId_minMark: { scaleId: scale.id, minMark: band.minMark } },
      update: { maxMark: band.maxMark, grade: band.grade, sortOrder: i },
      create: { scaleId: scale.id, ...band, sortOrder: i },
    });
    summary.bands++;
  }

  // Exam types (section 10).
  for (const e of EXAM_TYPES) {
    const existing = await prisma.examType.findFirst({ where: { name: e.name, appliesTo: e.appliesTo } });
    if (existing) {
      await prisma.examType.update({
        where: { id: existing.id },
        data: { isTerm: !!e.isTerm, sortOrder: e.sortOrder },
      });
    } else {
      await prisma.examType.create({ data: { ...e, isTerm: !!e.isTerm } });
    }
    summary.examTypes++;
  }

  // Medium of instruction (section 6).
  await prisma.schoolSettings.update({ where: { id: 'singleton' }, data: MEDIUM });

  console.log('Academic foundation seeded:');
  console.log(`  wings          ${summary.wings}`);
  console.log(`  classes        ${summary.classes}`);
  console.log(`  sections       ${summary.sections}`);
  console.log(`  subjects       ${summary.subjects}`);
  console.log(`  class-subject  ${summary.links}`);
  console.log(`  grade bands    ${summary.bands}`);
  console.log(`  exam types     ${summary.examTypes}`);
  console.log(`  medium         ${MEDIUM.mediumOfInstruction} / ${MEDIUM.secondLanguage} / ${MEDIUM.board}`);
  console.log('');
  console.log('Note: Grade XI/XII subjects are seeded as optional except English,');
  console.log('because the spreadsheet lists science/commerce/humanities subjects');
  console.log('without stream grouping. Supply streams to tighten this up.');
}

main()
  .catch((e) => {
    console.error('Seed failed:', e);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
