const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  let users = await prisma.user.findMany();
  console.log(`Total users before: ${users.length}`);
  
  if (users.length <= 1) {
    if (users.length === 0) {
      console.log('Creating seed admin...');
      await prisma.user.create({
        data: {
          email: 'admin@sns-erp.local',
          password: 'ChangeMe123!',
          name: 'SNS ERP Admin',
          role: 'admin',
          department: 'Administration',
          status: 'active',
        }
      });
    }

    console.log('Creating mock teachers...');
    await prisma.user.createMany({
      data: [
        { name: 'Dr. Sarah Connor', email: 'sarah@sns.edu', password: 'ChangeMe123!', role: 'teacher', department: 'Science', status: 'active' },
        { name: 'James Wilson', email: 'james@sns.edu', password: 'ChangeMe123!', role: 'teacher', department: 'Math', status: 'active' },
      ]
    });

    console.log('Creating mock students...');
    await prisma.user.createMany({
      data: [
        { name: 'Arjun Sharma', email: 'arjun@sns.edu', password: 'ChangeMe123!', role: 'parent', department: 'Academic', status: 'active', phone: '9952134884' },
        { name: 'Priya Patel', email: 'priya@sns.edu', password: 'ChangeMe123!', role: 'parent', department: 'Academic', status: 'active', phone: '9876543210' },
      ]
    });
    users = await prisma.user.findMany();
  }
  
  console.log(`Total users after: ${users.length}`);
  console.log(JSON.stringify(users, null, 2));
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
