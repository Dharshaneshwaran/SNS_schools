require('dotenv').config();
const { PrismaClient } = require('@prisma/client');

// Never hardcode credentials here — read from backend/.env
const url = process.env.DATABASE_URL;
if (!url) {
  console.error('DATABASE_URL is not set in backend/.env');
  process.exit(1);
}

const prisma = new PrismaClient({
  datasources: { db: { url } }
});

async function main() {
  try {
    await prisma.$connect();
    console.log('CONNECTED successfully');
    const usersCount = await prisma.user.count();
    console.log('Users count:', usersCount);
  } catch (e) {
    console.error('FAILED to connect:', e.message);
  }
}

main()
  .finally(async () => await prisma.$disconnect());
