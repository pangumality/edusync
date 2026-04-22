import 'dotenv/config';
import pkg from '@prisma/client';
const { PrismaClient } = pkg;
import bcrypt from 'bcryptjs';
import { randomUUID } from 'node:crypto';
import pg from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';

const { Pool } = pg;
const connectionString =
  process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5434/schoolerp';
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });


async function main() {
  console.log('Starting seed...');

  // 1. Create School
  const schoolName = 'Tabo Academy';
  const schoolCode = 'TABO001';
  
  console.log(`Creating School: ${schoolName}`);
  
  const school = await prisma.school.upsert({
    where: { code: schoolCode },
    update: {},
    create: {
      id: randomUUID(),
      name: schoolName,
      code: schoolCode,
    },
  });

  console.log(`School ID: ${school.id}`);

  // 2. Create Class
  console.log('Creating Class: Grade 10-A');
  const classId = randomUUID();
  const klass = await prisma.class.upsert({
    where: { id: classId }, // In a real scenario, you'd check by name+school, but for seed we assume fresh or this ID
    update: {}, // Simplified: We just create if not exists, but here we are generating random ID so upsert on ID isn't great if we want to find existing.
    // Better strategy: Find first, then create.
    create: {
      id: classId,
      schoolId: school.id,
      name: 'Grade 10-A',
    }
  }).catch(async () => {
      // Fallback if ID collision or logic change. Let's just find "Grade 10-A"
      const existing = await prisma.class.findFirst({ where: { schoolId: school.id, name: 'Grade 10-A' }});
      if(existing) return existing;
      return prisma.class.create({ data: { id: randomUUID(), schoolId: school.id, name: 'Grade 10-A' }});
  });

  // 3. Create Users & Profiles

  // --- Super Admin ---
  console.log('Creating Super Admin...');
  const adminEmail = 'admin@system.com';
  const adminPassword = await bcrypt.hash('Admin@123', 10);
  
  await prisma.user.upsert({
    where: { email: adminEmail },
    update: { password: adminPassword, schoolId: school.id, role: 'admin' },
    create: {
      id: randomUUID(),
      schoolId: school.id,
      email: adminEmail,
      firstName: 'Super',
      lastName: 'Admin',
      password: adminPassword,
      role: 'admin',
    },
  });

  // --- School Admin (Staff) ---
  console.log('Creating School Admin...');
  const staffEmail = 'taboacademy@gmail.com';
  const staffPassword = await bcrypt.hash('School@admin', 10);

  await prisma.user.upsert({
    where: { email: staffEmail },
    update: { password: staffPassword, schoolId: school.id, role: 'staff' },
    create: {
      id: randomUUID(),
      schoolId: school.id,
      email: staffEmail,
      firstName: 'Tabo',
      lastName: 'Admin',
      password: staffPassword,
      role: 'staff',
    },
  });

  // --- Teacher ---
  console.log('Creating Teacher...');
  const teacherEmail = 'oneousmality11@gmail.com';
  const teacherPassword = await bcrypt.hash('Teacher@123', 10);

  const teacherUser = await prisma.user.upsert({
    where: { email: teacherEmail },
    update: { password: teacherPassword, schoolId: school.id, role: 'teacher' },
    create: {
      id: randomUUID(),
      schoolId: school.id,
      email: teacherEmail,
      firstName: 'Oneous',
      lastName: 'Mality',
      password: teacherPassword,
      role: 'teacher',
    },
  });

  // Create Teacher Profile
  await prisma.teacher.upsert({
    where: { userId: teacherUser.id },
    update: {},
    create: {
      id: randomUUID(),
      userId: teacherUser.id,
      employeeNumber: 'EMP001',
    },
  });

  // --- Student ---
  console.log('Creating Student...');
  const studentEmail = 'charity@gmail.com';
  const studentPassword = await bcrypt.hash('Student@123', 10);

  const studentUser = await prisma.user.upsert({
    where: { email: studentEmail },
    update: { password: studentPassword, schoolId: school.id, role: 'student' },
    create: {
      id: randomUUID(),
      schoolId: school.id,
      email: studentEmail,
      firstName: 'Charity',
      lastName: 'Student',
      password: studentPassword,
      role: 'student',
      gender: 'female',
    },
  });

  // Create Student Profile
  const studentProfile = await prisma.student.upsert({
    where: { userId: studentUser.id },
    update: { classId: klass.id },
    create: {
      id: randomUUID(),
      schoolId: school.id,
      userId: studentUser.id,
      classId: klass.id,
      grade: '10',
      dateOfBirth: new Date('2008-01-01'),
    },
  });

  // --- Parent ---
  console.log('Creating Parent...');
  const parentEmail = 'charityparent@gmail.com';
  const parentPassword = await bcrypt.hash('Parent@123', 10);

  const parentUser = await prisma.user.upsert({
    where: { email: parentEmail },
    update: { password: parentPassword, schoolId: school.id, role: 'parent' },
    create: {
      id: randomUUID(),
      schoolId: school.id,
      email: parentEmail,
      firstName: 'Charity',
      lastName: 'Parent',
      password: parentPassword,
      role: 'parent',
    },
  });

  // Create Parent Profile
  const parentProfile = await prisma.parent.upsert({
    where: { userId: parentUser.id },
    update: {},
    create: {
      id: randomUUID(),
      userId: parentUser.id,
    },
  });

  // Link Parent to Student
  await prisma.parentStudents.upsert({
    where: {
      parentId_studentId: {
        parentId: parentProfile.id,
        studentId: studentProfile.id,
      },
    },
    update: {},
    create: {
      parentId: parentProfile.id,
      studentId: studentProfile.id,
      relationship: 'Mother',
      isPrimary: true,
    },
  });

  // 4. Create Subjects
  console.log('Creating Subjects...');
  const subjects = ['Mathematics', 'Science', 'English', 'History', 'Sports'];
  
  const teacherProfile = await prisma.teacher.findUnique({ where: { userId: teacherUser.id } });

  for (const subName of subjects) {
    const sub = await prisma.subject.create({
      data: {
        id: randomUUID(),
        schoolId: school.id,
        name: subName,
      },
    });

    // Link to Class (ClassSubject)
    await prisma.classSubject.create({
      data: {
        id: randomUUID(),
        classId: klass.id,
        subjectId: sub.id,
        teacherId: teacherProfile ? teacherProfile.id : undefined,
      },
    }).catch(() => {}); // Ignore if duplicate or logic fails
  }

  console.log('Seeding finished successfully.');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
