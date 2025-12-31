import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function ensureTenant(slug, name) {
  return prisma.tenant.upsert({
    where: { slug },
    update: { name },
    create: { slug, name },
  });
}

async function upsertUser(email, password, role, tenantId) {
  const hashed = await bcrypt.hash(password, 10);
  return prisma.user.upsert({
    where: { email },
    update: {},
    create: {
      email,
      password: hashed,
      role,
      tenantId,
    },
  });
}

async function createStudents(tenantId) {
  const students = [
    { firstName: 'Amina', lastName: 'Kora', email: 'amina@school.local' },
    { firstName: 'Daniel', lastName: 'Mensah', email: 'daniel@school.local' },
    { firstName: 'Grace', lastName: 'Okoro', email: 'grace@school.local' },
    { firstName: 'Sam', lastName: 'Ndlovu', email: 'sam@school.local' },
  ];

  for (const s of students) {
    await prisma.student.create({
      data: { ...s, tenantId },
    });
  }
}

async function main() {
  // Tenants
  const superTenant = await ensureTenant('lavsms', 'LAVSMS');
  const demoTenant = await ensureTenant('doonites', 'doonITes School');

  // Users
  await upsertUser('superadmin@lavsms.com', 'superadmin123', 'SUPER_ADMIN', superTenant.id);
  await upsertUser('admin@doonites.com', 'admin123', 'ADMIN', demoTenant.id);
  await upsertUser('teacher1@doonites.com', 'teacher123', 'TEACHER', demoTenant.id);

  // Students
  await createStudents(demoTenant.id);
}

main()
  .then(async () => {
    console.log('Seed completed');
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
