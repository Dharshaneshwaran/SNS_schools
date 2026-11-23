import { Body, Controller, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { AttendanceService } from './attendance.service';
import { Roles } from '../common/decorators/roles.decorator';
import { AuthGuard } from '../common/guards/auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';

@Controller('attendance')
@UseGuards(AuthGuard, RolesGuard)
export class AttendanceController {
  constructor(private readonly attendanceService: AttendanceService) {}

  @Get()
  getAttendance() {
    return this.attendanceService.getAttendance();
  }

  @Get('student/:studentId')
  getStudentAttendance(
    @Param('studentId') studentId: string,
    @Query('month') month?: string,
  ) {
    return this.attendanceService.getStudentAttendance(studentId, month);
  }

  /** Attendance thresholds (late grace, minimum %, absence streak). */
  @Get('rules')
  getRules() {
    return this.attendanceService.getRules();
  }

  @Patch('rules')
  @Roles('admin')
  updateRules(
    @Body()
    body: {
      lateAfterMinutes?: number;
      minAttendancePercent?: number;
      consecutiveAbsenceAlerts?: number;
      monthlyReportDay?: number;
    },
  ) {
    return this.attendanceService.updateRules(body);
  }

  @Post('mark')
  @Roles('admin', 'teacher')
  markAttendance(
    @Body() body: {
      date: string;
      class: string;
      section: string;
      records: { studentId: string; status: string; reason?: string }[];
    },
  ) {
    const fullRecords = body.records.map((r) => ({
      ...r,
      date: body.date,
      class: body.class,
      section: body.section,
    }));
    return this.attendanceService.markAttendance(fullRecords);
  }

  @Post('mark-teacher')
  @Roles('admin')
  markTeacherAttendance(
    @Body() body: {
      date: string;
      records: { teacherId: string; status: string; department?: string }[];
    },
  ) {
    const fullRecords = body.records.map((r) => ({
      studentId: r.teacherId,
      date: body.date,
      status: r.status,
      reason: undefined,
      class: 'FACULTY',
      section: r.department ?? '',
    }));
    return this.attendanceService.markAttendance(fullRecords);
  }
}
