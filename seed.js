const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  const hash = await bcrypt.hash('admin123', 10);
  const admin = await prisma.admin.upsert({
    where: { email: 'admin@findbroker.com' },
    update: { passwordHash: hash },
    create: {
      name: 'System Admin',
      email: 'admin@findbroker.com',
      passwordHash: hash
    }
  });
  console.log('Admin user seeded:', admin.email);

  const brokerHash = await bcrypt.hash('password123', 10);
  const broker = await prisma.broker.upsert({
    where: { email: 'ahmed@findbroker.com' },
    update: { status: 'approved' },
    create: {
      name: 'Ahmed Hassan',
      email: 'ahmed@findbroker.com',
      phone: '+251911123456',
      passwordHash: brokerHash,
      licenseNumber: 'ET-RE-001',
      city: 'Addis Ababa',
      bio: 'Expert real estate broker with 8+ years experience.',
      status: 'approved',
      rating: 4.8,
      totalSales: 45
    }
  });
  console.log('Broker user seeded:', broker.email);

  await prisma.$disconnect();
}

main().catch(err => {
  console.error(err);
  prisma.$disconnect();
  process.exit(1);
});
