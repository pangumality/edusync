import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import pkg from '@prisma/client';
import bcrypt from 'bcryptjs';
import { randomUUID } from 'node:crypto';
import pg from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env from the backend root
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const { PrismaClient } = pkg;
const { Pool } = pg;

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  console.error('Error: DATABASE_URL is not defined in .env file.');
  process.exit(1);
}

const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('--- Starting Database Seed ---');

  // 1. Create/Get School
  const schoolName = 'Tabo Academy';
  const schoolCode = 'TABO001';
  
  console.log(`Checking School: ${schoolName} (${schoolCode})`);
  
  const school = await prisma.school.upsert({
    where: { code: schoolCode },
    update: { name: schoolName },
    create: {
      id: randomUUID(),
      name: schoolName,
      code: schoolCode,
    },
  });

  console.log(`School ID: ${school.id}`);

  // 2. Create/Get Class
  const className = 'Grade 10-A';
  console.log(`Checking Class: ${className}`);
  
  let klass = await prisma.class.findFirst({
    where: { schoolId: school.id, name: className }
  });

  if (!klass) {
    klass = await prisma.class.create({
      data: {
        id: randomUUID(),
        schoolId: school.id,
        name: className,
      }
    });
    console.log(`Created Class: ${klass.id}`);
  } else {
    console.log(`Class already exists: ${klass.id}`);
  }

  // 3. Create Users & Profiles

  // --- Super Admin ---
  console.log('Checking Super Admin...');
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
  console.log('Checking School Admin...');
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
  console.log('Checking Teacher...');
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

  // Create/Get Teacher Profile
  const teacherProfile = await prisma.teacher.upsert({
    where: { userId: teacherUser.id },
    update: { employeeNumber: 'EMP001' },
    create: {
      id: randomUUID(),
      userId: teacherUser.id,
      employeeNumber: 'EMP001',
    },
  });

  // --- Student ---
  console.log('Checking Student...');
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

  // Create/Get Student Profile
  const studentProfile = await prisma.student.upsert({
    where: { userId: studentUser.id },
    update: { classId: klass.id, grade: '10' },
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
  console.log('Checking Parent...');
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

  // Create/Get Parent Profile
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
    update: { relationship: 'Mother', isPrimary: true },
    create: {
      parentId: parentProfile.id,
      studentId: studentProfile.id,
      relationship: 'Mother',
      isPrimary: true,
    },
  });

  // 4. Create Subjects
  console.log('Checking Subjects...');
  const subjectNames = ['Mathematics', 'Science', 'English', 'History', 'Sports'];
  
  for (const subName of subjectNames) {
    let subject = await prisma.subject.findFirst({
      where: { schoolId: school.id, name: subName }
    });

    if (!subject) {
      subject = await prisma.subject.create({
        data: {
          id: randomUUID(),
          schoolId: school.id,
          name: subName,
        },
      });
      console.log(`Created Subject: ${subName}`);
    } else {
      console.log(`Subject already exists: ${subName}`);
    }

    // Link to Class (ClassSubject)
    const existingLink = await prisma.classSubject.findFirst({
      where: { classId: klass.id, subjectId: subject.id }
    });

    if (!existingLink) {
      await prisma.classSubject.create({
        data: {
          id: randomUUID(),
          classId: klass.id,
          subjectId: subject.id,
          teacherId: teacherProfile.id,
        },
      });
      console.log(`Linked ${subName} to ${className}`);
    }
  }

  console.log('--- Seeding Finished Successfully ---');
}

main()
  .then(async () => {
    await prisma.$disconnect();
    await pool.end();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    await pool.end();
    process.exit(1);
  });
