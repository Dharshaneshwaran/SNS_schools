import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { NotificationsService } from '../notifications/notifications.service';
import { PrismaService } from '../prisma.service';

@Injectable()
export class MessagingService {
  constructor(
    private prisma: PrismaService,
    private usersService: UsersService,
    private notificationsService: NotificationsService,
  ) {}

  async getGroups(userId: string) {
    return this.prisma.group.findMany({
      where: {
        members: {
          some: { userId },
        },
      },
      include: {
        members: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                role: true,
                department: true,
              },
            },
          },
        },
        _count: {
          select: { messages: true },
        },
      },
    });
  }

  async getMessages(groupId: string) {
    return this.prisma.message.findMany({
      where: { groupId },
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            role: true,
          },
        },
      },
      orderBy: { createdAt: 'asc' },
    });
  }

  async createGroup(name: string, description: string, creatorId: string) {
    return this.prisma.group.create({
      data: {
        name,
        description,
        members: {
          create: {
            userId: creatorId,
            role: 'admin',
          },
        },
      },
    });
  }

  async addMember(groupId: string, userId: string) {
    return this.prisma.groupMember.create({
      data: {
        groupId,
        userId,
        role: 'member',
      },
    });
  }

  async sendMessage(senderId: string, groupId: string, text: string) {
    const message = await this.prisma.message.create({
      data: {
        text,
        senderId,
        groupId,
      },
      include: {
        sender: {
          select: { name: true },
        },
      },
    });

    // Notify other members
    const members = await this.prisma.groupMember.findMany({
      where: { groupId, userId: { not: senderId } },
    });

    for (const member of members) {
      await this.notificationsService.createNotification(
        member.userId,
        `New message in group`,
        `${message.sender.name}: ${text.length > 50 ? text.substring(0, 47) + '...' : text}`,
        'message',
      );
    }

    return message;
  }

  async getAvailableContacts(currentUserId: string) {
    return this.usersService.findAll();
  }
}
