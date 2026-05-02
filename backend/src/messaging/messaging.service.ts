import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { NotificationsService } from '../notifications/notifications.service';

export interface Message {
  id: string;
  senderId: string;
  recipientId: string;
  text: string;
  timestamp: Date;
  status: 'sent' | 'delivered' | 'read';
}

@Injectable()
export class MessagingService {
  private messages: Message[] = [];
  private messageCounter = 0;

  constructor(
    private usersService: UsersService,
    private notificationsService: NotificationsService,
  ) {}

  getMessagesBetweenUsers(userId1: string, userId2: string): Message[] {
    const chatMessages = this.messages.filter(
      (m) =>
        (m.senderId === userId1 && m.recipientId === userId2) ||
        (m.senderId === userId2 && m.recipientId === userId1),
    ).sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());

    // Mark messages as read when fetched by the recipient
    chatMessages.forEach(m => {
      if (m.recipientId === userId1 && m.status !== 'read') {
        m.status = 'read';
      }
    });

    return chatMessages;
  }

  getConversations(userId: string) {
    const conversationsMap = new Map<string, any>();
    const allUsers = (this.usersService as any).users || [];

    // Initialize map with all users to allow starting new chats
    allUsers.forEach(u => {
      if (u.id !== userId) {
        conversationsMap.set(u.id, {
          id: u.id,
          name: u.name,
          role: u.role,
          status: u.status,
          lastMsg: '',
          time: '',
          timestamp: new Date(0),
          unread: 0,
        });
      }
    });

    // Populate with actual message data
    this.messages.forEach(m => {
      const otherId = m.senderId === userId ? m.recipientId : m.senderId;
      const conv = conversationsMap.get(otherId);
      if (conv) {
        // Update last message if this one is newer
        if (m.timestamp > conv.timestamp) {
          conv.lastMsg = m.text;
          conv.timestamp = m.timestamp;
          conv.time = this.formatTime(m.timestamp);
        }
        // Count unread if I am the recipient
        if (m.recipientId === userId && m.status !== 'read') {
          conv.unread++;
        }
      }
    });

    return Array.from(conversationsMap.values())
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  }

  private formatTime(date: Date): string {
    const now = new Date();
    const isToday = date.toDateString() === now.toDateString();
    if (isToday) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
    return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
  }

  sendMessage(senderId: string, recipientId: string, text: string): Message {
    const newMessage: Message = {
      id: `msg-${++this.messageCounter}`,
      senderId,
      recipientId,
      text,
      timestamp: new Date(),
      status: 'sent',
    };
    this.messages.push(newMessage);

    // Create a notification for the recipient
    const sender = this.usersService.findById(senderId);
    this.notificationsService.createNotification(
      recipientId,
      `New message from ${sender?.name || 'User'}`,
      text.length > 50 ? `${text.substring(0, 47)}...` : text,
      'message',
    );

    return newMessage;
  }

  getAvailableContacts(currentUserId: string) {
    // For now, return all users except current user
    // In a real app, this would be filtered by school/class/etc.
    // We'll use the users from UsersService
    const allUsers = (this.usersService as any).users || []; // Accessing private field for demo purposes if needed, or implement a getter
    
    return allUsers
      .filter((u) => u.id !== currentUserId)
      .map((u) => ({
        id: u.id,
        name: u.name,
        role: u.role,
        department: u.department,
        status: u.status,
      }));
  }
}
