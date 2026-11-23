import { Body, Controller, Delete, Get, Param, Post, Query, UseGuards } from '@nestjs/common';
import { ExamsService, CreateExamResultDto } from './exams.service';
import { AuthGuard } from '../common/guards/auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';

@Controller('exams')
export class ExamsController {
  constructor(private readonly examsService: ExamsService) {}

  @Post('results')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('admin', 'teacher')
  async createResult(@Body() data: CreateExamResultDto) {
    return this.examsService.createResult(data);
  }

  @Post('results/bulk')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('admin', 'teacher')
  async bulkSaveResults(@Body() data: any) {
    return this.examsService.bulkSaveResults(data);
  }

  @Get('results/:studentId')
  async getStudentResults(
    @Param('studentId') studentId: string,
    @Query('term') term?: string,
  ) {
    if (term) return this.examsService.getStudentTermResults(studentId, term);
    return this.examsService.getStudentResults(studentId);
  }

  // ─── Report cards ─────────────────────────────────────────────────────

  /** Terms that actually have marks - drives the term dropdowns. */
  @Get('terms')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('admin', 'leader', 'teacher')
  listTerms() {
    return this.examsService.listTerms();
  }

  /**
   * Whole-class report cards. Returns every pupil's marks already graded
   * against the configured CBSE scale, ready to render or export.
   */
  @Get('report-cards')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('admin', 'leader', 'teacher')
  getReportCards(
    @Query('class') cls?: string,
    @Query('section') section?: string,
    @Query('term') term?: string,
    @Query('academicYear') academicYear?: string,
  ) {
    return this.examsService.getReportCards({ class: cls, section, term, academicYear });
  }

  /** One student's report card for a term. */
  @Get('report-card/:studentId')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('admin', 'leader', 'teacher')
  getReportCard(@Param('studentId') studentId: string, @Query('term') term?: string) {
    return this.examsService.getReportCard(studentId, term ?? '');
  }

  @Get('schedule')
  async getSchedule(
    @Query('class') cls: string,
    @Query('section') section: string,
    @Query('term') term?: string,
  ) {
    return this.examsService.getScheduleByClass(cls, section, term);
  }

  @Post('schedule')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('admin', 'teacher')
  async createSchedule(@Body() data: any) {
    return this.examsService.createSchedule(data);
  }

  @Delete('schedule/:id')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('admin', 'teacher')
  async deleteSchedule(@Param('id') id: string) {
    return this.examsService.deleteSchedule(id);
  }
}
