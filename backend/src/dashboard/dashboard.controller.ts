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
  getOverview(@Req() req: any) {
    return this.dashboardService.getOverview(req.user.sub);
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
}
