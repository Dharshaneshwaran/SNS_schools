import { Controller, Get } from '@nestjs/common';
import { AttendanceService } from './attendance.service';

@Controller('attendance')
export class AttendanceController {
  constructor(private readonly attendanceService: AttendanceService) {}

  @Get()
  getAttendance() {
    return this.attendanceService.getAttendance();
  }
}
