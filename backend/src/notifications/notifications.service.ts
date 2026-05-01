import { Injectable } from '@nestjs/common';

export interface AppNotification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'message' | 'alert' | 'info';
  isRead: boolean;
  createdAt: Date;
}

@Injectable()
export class NotificationsService {
  private notifications: AppNotification[] = [];
  private counter = 0;

  createNotification(userId: string, title: string, message: string, type: 'message' | 'alert' | 'info' = 'info') {
    const notification: AppNotification = {
      id: `ntf-${++this.counter}`,
      userId,
      title,
      message,
      type,
      isRead: false,
      createdAt: new Date(),
    };
    this.notifications.push(notification);
    return notification;
  }

  getUserNotifications(userId: string) {
    return this.notifications
      .filter((n) => n.userId === userId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  markAsRead(userId: string, notificationId: string) {
    const notification = this.notifications.find(
      (n) => n.id === notificationId && n.userId === userId,
    );
    if (notification) {
      notification.isRead = true;
    }
    return notification;
  }

  markAllAsRead(userId: string) {
    this.notifications
      .filter((n) => n.userId === userId)
      .forEach((n) => (n.isRead = true));
  }
}
