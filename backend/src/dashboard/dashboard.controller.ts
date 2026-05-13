import { Controller, Get, Req, UseGuards, Param } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { AuthGuard } from '../common/guards/auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';

@Controller('dashboard')
@UseGuards(AuthGuard, RolesGuard)
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get('overview')
  @Roles('admin')
  getOverview() {
    return this.dashboardService.getOverview();
  }

  @Get('counts')
  @Roles('admin', 'leader', 'teacher')
  getCounts(@Req() req: any) {
    return this.dashboardService.getCounts(req.user.sub);
  }

  @Get('parent/:studentId')
  @Roles('parent', 'admin')
  getParentOverview(@Param('studentId') studentId: string) {
    return this.dashboardService.getParentOverview(studentId);
  }

  @Get('teacher')
  @Roles('teacher', 'admin', 'leader')
  getTeacherOverview(@Req() req: any) {
    return this.dashboardService.getTeacherOverview(req.user.sub);
  }
}
