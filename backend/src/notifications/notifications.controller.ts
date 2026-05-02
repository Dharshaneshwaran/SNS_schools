import { Controller, Get, Patch, Param, Req, UseGuards, Post } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { AuthGuard } from '../common/guards/auth.guard';

@Controller('notifications')
@UseGuards(AuthGuard)
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Get()
  getNotifications(@Req() req: any) {
    return this.notificationsService.getUserNotifications(req.user.sub);
  }

  @Patch(':id/read')
  markAsRead(@Req() req: any, @Param('id') id: string) {
    return this.notificationsService.markAsRead(req.user.sub, id);
  }

  @Post('read-all')
  markAllAsRead(@Req() req: any) {
    this.notificationsService.markAllAsRead(req.user.sub);
    return { success: true };
  }
}
