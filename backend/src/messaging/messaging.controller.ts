import { Controller, Get, Post, Body, Param, Req, UseGuards } from '@nestjs/common';
import { MessagingService } from './messaging.service';
import { AuthGuard } from '../common/guards/auth.guard';

@Controller('messaging')
@UseGuards(AuthGuard)
export class MessagingController {
  constructor(private readonly messagingService: MessagingService) {}

  @Get('conversations')
  getConversations(@Req() req: any) {
    const userId = req.user.sub;
    return this.messagingService.getConversations(userId);
  }

  @Get('history/:recipientId')
  getHistory(@Req() req: any, @Param('recipientId') recipientId: string) {
    const userId = req.user.sub;
    return this.messagingService.getMessagesBetweenUsers(userId, recipientId);
  }

  @Post('send')
  sendMessage(@Req() req: any, @Body() body: { recipientId: string; text: string }) {
    const userId = req.user.sub;
    return this.messagingService.sendMessage(userId, body.recipientId, body.text);
  }
}
