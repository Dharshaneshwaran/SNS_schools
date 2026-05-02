import { Module } from '@nestjs/common';
import { MessagingService } from './messaging.service';
import { MessagingController } from './messaging.controller';
import { UsersModule } from '../users/users.module';
import { AuthModule } from '../auth/auth.module';
import { NotificationsModule } from '../notifications/notifications.module';

@Module({
  imports: [UsersModule, AuthModule, NotificationsModule],
  controllers: [MessagingController],
  providers: [MessagingService],
  exports: [MessagingService],
})
export class MessagingModule {}
