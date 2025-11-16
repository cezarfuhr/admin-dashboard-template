import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting seed...');

  // Clean existing data
  await prisma.auditLog.deleteMany();
  await prisma.notification.deleteMany();
  await prisma.refreshToken.deleteMany();
  await prisma.user.deleteMany();

  console.log('✨ Creating users...');

  // Create admin user
  const admin = await prisma.user.create({
    data: {
      name: 'Admin User',
      email: 'admin@example.com',
      password: await bcrypt.hash('admin123', 10),
      role: 'ADMIN',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=admin',
    },
  });

  // Create regular users
  const john = await prisma.user.create({
    data: {
      name: 'John Doe',
      email: 'john@example.com',
      password: await bcrypt.hash('user123', 10),
      role: 'USER',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=john',
    },
  });

  const jane = await prisma.user.create({
    data: {
      name: 'Jane Smith',
      email: 'jane@example.com',
      password: await bcrypt.hash('user123', 10),
      role: 'USER',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=jane',
    },
  });

  const bob = await prisma.user.create({
    data: {
      name: 'Bob Johnson',
      email: 'bob@example.com',
      password: await bcrypt.hash('user123', 10),
      role: 'USER',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=bob',
    },
  });

  console.log('✨ Creating notifications...');

  // Create sample notifications
  await prisma.notification.createMany({
    data: [
      {
        userId: admin.id,
        title: 'Bem-vindo!',
        message: 'Bem-vindo ao Admin Dashboard',
        type: 'INFO',
      },
      {
        userId: admin.id,
        title: 'Sistema atualizado',
        message: 'O sistema foi atualizado para a versão 2.0',
        type: 'SUCCESS',
      },
      {
        userId: john.id,
        title: 'Perfil incompleto',
        message: 'Complete seu perfil para ter acesso total',
        type: 'WARNING',
      },
    ],
  });

  console.log('✨ Creating audit logs...');

  // Create sample audit logs
  await prisma.auditLog.createMany({
    data: [
      {
        userId: admin.id,
        action: 'CREATE',
        entity: 'USER',
        entityId: john.id,
        changes: { name: 'John Doe', email: 'john@example.com' },
        ipAddress: '127.0.0.1',
      },
      {
        userId: admin.id,
        action: 'CREATE',
        entity: 'USER',
        entityId: jane.id,
        changes: { name: 'Jane Smith', email: 'jane@example.com' },
        ipAddress: '127.0.0.1',
      },
      {
        userId: john.id,
        action: 'LOGIN',
        entity: 'AUTH',
        ipAddress: '127.0.0.1',
      },
    ],
  });

  console.log('✅ Seed completed successfully!');
  console.log(`
📊 Created:
  - 4 users (1 admin, 3 regular users)
  - 3 notifications
  - 3 audit logs

🔐 Login credentials:
  Admin: admin@example.com / admin123
  User: john@example.com / user123
  `);
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
