import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  AcademicsService,
  AssignSubjectsDto,
  CreateClassDto,
  CreateExamTypeDto,
  CreateGradingScaleDto,
  CreateSubjectDto,
  CreateWingDto,
  UpdateClassDto,
  UpdateExamTypeDto,
  UpdateMediumDto,
  UpdateSubjectDto,
  UpdateWingDto,
} from './academics.service';
import { AuthGuard } from '../common/guards/auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';

/**
 * Academic structure: wings, classes/sections, subjects, grading and
 * exam types (sections 3-7, 10 and 11 of the requirements workbook).
 *
 * Reads are open to any authenticated user; writes are admin/leader only,
 * matching the convention used by HomeworkController.
 */
@Controller('academics')
export class AcademicsController {
  constructor(private readonly academics: AcademicsService) {}

  @Get('overview')
  overview() {
    return this.academics.overview();
  }

  // --- Wings -----------------------------------------------------------

  @Post('wings')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('admin', 'leader')
  createWing(@Body() data: CreateWingDto) {
    return this.academics.createWing(data);
  }

  @Patch('wings/:id')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('admin', 'leader')
  updateWing(@Param('id') id: string, @Body() data: UpdateWingDto) {
    return this.academics.updateWing(id, data);
  }

  @Delete('wings/:id')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('admin', 'leader')
  deleteWing(@Param('id') id: string) {
    return this.academics.deleteWing(id);
  }

  // --- Classes and sections -------------------------------------------

  @Post('classes')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('admin', 'leader')
  createClass(@Body() data: CreateClassDto) {
    return this.academics.createClass(data);
  }

  @Patch('classes/:id')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('admin', 'leader')
  updateClass(@Param('id') id: string, @Body() data: UpdateClassDto) {
    return this.academics.updateClass(id, data);
  }

  @Delete('classes/:id')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('admin', 'leader')
  deleteClass(@Param('id') id: string) {
    return this.academics.deleteClass(id);
  }

  @Post('classes/:id/sections')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('admin', 'leader')
  addSection(@Param('id') id: string, @Body('name') name: string) {
    return this.academics.addSection(id, name);
  }

  @Delete('classes/:id/sections/:sectionId')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('admin', 'leader')
  removeSection(@Param('id') id: string, @Param('sectionId') sectionId: string) {
    return this.academics.removeSection(id, sectionId);
  }

  // --- Subjects ---------------------------------------------------------

  @Post('subjects')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('admin', 'leader')
  createSubject(@Body() data: CreateSubjectDto) {
    return this.academics.createSubject(data);
  }

  @Patch('subjects/:id')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('admin', 'leader')
  updateSubject(@Param('id') id: string, @Body() data: UpdateSubjectDto) {
    return this.academics.updateSubject(id, data);
  }

  @Delete('subjects/:id')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('admin', 'leader')
  deleteSubject(@Param('id') id: string) {
    return this.academics.deleteSubject(id);
  }

  @Post('classes/:id/subjects')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('admin', 'leader')
  assignSubjects(@Param('id') id: string, @Body() data: AssignSubjectsDto) {
    return this.academics.assignSubjects(id, data);
  }

  // --- Grading ----------------------------------------------------------

  @Get('grading')
  grading(@Query('marks') marks?: string) {
    if (marks !== undefined && marks !== '') {
      const value = Number(marks);
      return this.academics.gradeFor(value);
    }
    return this.academics.overview().then((o) => o.gradingScales);
  }

  @Post('grading')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('admin', 'leader')
  createGradingScale(@Body() data: CreateGradingScaleDto) {
    return this.academics.createGradingScale(data);
  }

  @Patch('grading/:id')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('admin', 'leader')
  updateGradingScale(@Param('id') id: string, @Body() data: Partial<CreateGradingScaleDto>) {
    return this.academics.updateGradingScale(id, data);
  }

  @Delete('grading/:id')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('admin', 'leader')
  deleteGradingScale(@Param('id') id: string) {
    return this.academics.deleteGradingScale(id);
  }

  // --- Exam types -------------------------------------------------------

  @Post('exam-types')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('admin', 'leader')
  createExamType(@Body() data: CreateExamTypeDto) {
    return this.academics.createExamType(data);
  }

  @Patch('exam-types/:id')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('admin', 'leader')
  updateExamType(@Param('id') id: string, @Body() data: UpdateExamTypeDto) {
    return this.academics.updateExamType(id, data);
  }

  @Delete('exam-types/:id')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('admin', 'leader')
  deleteExamType(@Param('id') id: string) {
    return this.academics.deleteExamType(id);
  }

  // --- Medium of instruction -------------------------------------------

  @Patch('medium')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('admin', 'leader')
  updateMedium(@Body() data: UpdateMediumDto) {
    return this.academics.updateMedium(data);
  }
}
