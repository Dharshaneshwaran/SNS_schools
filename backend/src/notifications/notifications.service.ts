import { Injectable } from '@nestjs/common';

@Injectable()
export class NotificationsService {
  getPhaseFourPlaceholder() {
    return {
      module: 'notifications',
      status: 'placeholder',
      note: 'Email, WhatsApp, and push notification workflows are planned for Phase 4.',
    };
  }
}
