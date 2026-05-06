import { Body, Controller, Get, Post, Request } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { Roles } from '../common/decorators/roles.decorator';

@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Get()
  getNotifications(@Request() req) {
    return this.notificationsService.getUserNotifications(req.user.sub);
  }

  @Post('read-all')
  markAllAsRead(@Request() req) {
    return this.notificationsService.markAllAsRead(req.user.sub);
  }

  @Post('read')
  markAsRead(@Request() req, @Body('id') id: string) {
    return this.notificationsService.markAsRead(req.user.sub, id);
  }

  @Post('token')
  registerToken(@Request() req, @Body('token') token: string, @Body('device') device?: string) {
    return this.notificationsService.registerToken(req.user.sub, token, device);
  }

  @Post('delete')
  deleteNotification(@Request() req, @Body('id') id: string) {
    return this.notificationsService.deleteNotification(req.user.sub, id);
  }

  @Post('update')
  updateNotification(@Request() req, @Body('id') id: string, @Body() data: { title?: string, message?: string }) {
    return this.notificationsService.updateNotification(req.user.sub, id, data);
  }

  @Roles('admin', 'superadmin', 'leader')
  @Post('broadcast')
  broadcast(@Body() data: { audience: 'parents' | 'staff' | 'both', title: string, message: string }) {
    return this.notificationsService.broadcastNotification(data.audience, data.title, data.message);
  }
}
