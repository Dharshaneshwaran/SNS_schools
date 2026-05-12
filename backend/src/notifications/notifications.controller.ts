import { Body, Controller, Delete, Get, Param, Patch, Post, Request, UseGuards } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { Roles } from '../common/decorators/roles.decorator';
import { AuthGuard } from '../common/guards/auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';

@Controller('notifications')
@UseGuards(AuthGuard, RolesGuard)
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

  // Legacy body-based route kept for compat
  @Post('read')
  markAsReadLegacy(@Request() req, @Body('id') id: string) {
    return this.notificationsService.markAsRead(req.user.sub, id);
  }

  // RESTful route used by frontend service
  @Patch(':id/read')
  markAsRead(@Request() req, @Param('id') id: string) {
    return this.notificationsService.markAsRead(req.user.sub, id);
  }

  @Delete(':id')
  deleteOne(@Request() req, @Param('id') id: string) {
    return this.notificationsService.deleteNotification(req.user.sub, id);
  }

  @Post('token')
  registerToken(@Request() req, @Body('token') token: string, @Body('device') device?: string) {
    return this.notificationsService.registerToken(req.user.sub, token, device);
  }

  @Post('delete')
  deleteNotification(@Request() req, @Body('id') id: string) {
    return this.notificationsService.deleteNotification(req.user.sub, id);
  }

  @Post('delete-all')
  deleteAll(@Request() req) {
    return this.notificationsService.deleteAllNotifications(req.user.sub);
  }

  @Post('update')
  updateNotification(@Request() req, @Body('id') id: string, @Body() data: { title?: string, message?: string }) {
    return this.notificationsService.updateNotification(req.user.sub, id, data);
  }

  @Roles('admin', 'leader')
  @Post('broadcast')
  broadcast(@Body() data: { audience: 'parents' | 'staff' | 'both', title: string, message: string, targetClasses?: string[] }) {
    return this.notificationsService.broadcastNotification(data.audience, data.title, data.message, data.targetClasses);
  }
}
