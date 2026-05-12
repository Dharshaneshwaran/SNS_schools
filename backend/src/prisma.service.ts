import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  constructor() {
    super({
      datasources: {
        db: {
          url: process.env.DATABASE_URL,
        },
      },
      log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
    });
    console.log('Prisma initialized with host:', process.env.DATABASE_URL?.split('@')[1]?.split('/')[0]);
  }

  async onModuleInit() {
    let retries = 5;
    while (retries > 0) {
      try {
        await this.$connect();
        break;
      } catch (err) {
        retries -= 1;
        console.warn(`Prisma connection failed. Retrying... (${5 - retries}/5)`);
        if (retries === 0) throw err;
        await new Promise((resolve) => setTimeout(resolve, 3000));
      }
    }
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }

  // Graceful disconnect with timeout
  async disconnectGracefully() {
    try {
      await this.$disconnect();
    } catch (error) {
      console.error('Error disconnecting Prisma:', error);
    }
  }
}
