
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const users = await prisma.user.findMany({
    select: {
      id: true,
      email: true,
      password: true,
      role: true,
      name: true,
      studentProfile: {
        select: { studentId: true }
      },
      teacherProfile: {
        select: { employeeId: true }
      }
    },
    orderBy: { createdAt: 'desc' },
    take: 5
  });
  
  const mapped = users.map(u => ({
    id: u.id,
    name: u.name,
    email: u.email,
    password: u.password,
    role: u.role,
    identifier: u.studentProfile?.studentId || u.teacherProfile?.employeeId || 'N/A'
  }));

  console.log('Last 5 users:');
  console.table(mapped);
}

main()
  .catch(e => console.error(e))
  .finally(async () => await prisma.$disconnect());
