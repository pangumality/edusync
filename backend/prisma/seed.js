import 'dotenv/config';
import pkg from '@prisma/client';
const { PrismaClient } = pkg;
import bcrypt from 'bcryptjs';
import pg from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';

const { Pool } = pg;
const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const classesData = [
  { id: 'class-1', name: 'Grade 1', sections: ['A', 'B'] },
  { id: 'class-2', name: 'Grade 2', sections: ['A'] },
  { id: 'class-3', name: 'Grade 3', sections: ['A', 'B', 'C'] },
];

const rosterData = {
  'class-1-A': [
    { id: 's-1', name: 'accde fjhij' },
    { id: 's-2', name: 'First kilo' },
    { id: 's-3', name: 'Second kilos' },
    { id: 's-4', name: 'Third kick' },
  ],
  'class-1-B': [
    { id: 's-5', name: 'Kofi Boateng' },
    { id: 's-6', name: 'Lilian Owusu' },
  ],
  'class-2-A': [
    { id: 's-7', name: 'Rahul Patel' },
    { id: 's-8', name: 'Yara Hassan' },
  ],
  'class-3-A': [
    { id: 's-9', name: 'Chen Li' },
    { id: 's-10', name: 'Maryam Ali' },
  ],
  'class-3-B': [
    { id: 's-11', name: 'Peter Kim' },
    { id: 's-12', name: 'Olivia Adebayo' },
  ],
  'class-3-C': [
    { id: 's-13', name: 'Kwame Darko' },
  ],
};

async function main() {
  console.log('Start seeding ...');

  // Create Classes and Sections
  for (const cls of classesData) {
    console.log(`Creating class: ${cls.name}`);
    
    // Create Class
    const classRecord = await prisma.class.upsert({
      where: { id: cls.id },
      update: { name: cls.name },
      create: {
        id: cls.id,
        name: cls.name,
      },
    });

    // Create Sections
    for (const sectionName of cls.sections) {
      console.log(`  Creating section: ${sectionName}`);
      await prisma.section.upsert({
        where: {
          classId_name: {
            classId: classRecord.id,
            name: sectionName,
          },
        },
        update: {},
        create: {
          name: sectionName,
          classId: classRecord.id,
        },
      });
    }
  }

  // Create Students
  for (const [key, students] of Object.entries(rosterData)) {
    const [_, classIdPart, sectionName] = key.match(/class-(\d+)-(\w+)/) || [];
    // The key format in rosterData is 'class-1-A', but my regex above is slightly off because the ID is 'class-1'.
    // Let's parse it more carefully.
    // keys are like 'class-1-A', 'class-2-A'
    // classId is 'class-1', 'class-2'
    // sectionName is 'A', 'B'
    
    const lastDashIndex = key.lastIndexOf('-');
    const classId = key.substring(0, lastDashIndex); // 'class-1'
    const secName = key.substring(lastDashIndex + 1); // 'A'

    console.log(`Seeding students for ${classId} - ${secName}`);

    // Find the section ID
    const section = await prisma.section.findUnique({
      where: {
        classId_name: {
          classId: classId,
          name: secName,
        },
      },
    });

    if (!section) {
      console.error(`Section not found for ${classId} ${secName}`);
      continue;
    }

    for (const s of students) {
      const email = `${s.name.replace(/\s+/g, '.').toLowerCase()}@school.local`;
      
      // Create User
      const user = await prisma.user.upsert({
        where: { email },
        update: { name: s.name },
        create: {
          id: s.id, // Keep the ID from the frontend for consistency if possible, or let UUID generate
          // Actually, `id` in User model is UUID. The frontend IDs 's-1' are short strings.
          // I will try to use them if they are valid strings, but UUIDs are better.
          // However, to match the frontend hardcoded data, I should probably generate new UUIDs 
          // or force these IDs if the DB allows (text). My schema says String @id @default(uuid()).
          // So 's-1' is valid string.
          email,
          name: s.name,
          role: 'STUDENT',
          password: await bcrypt.hash('password123', 10),
        },
      });

      // Create Student Profile
      await prisma.studentProfile.upsert({
        where: { userId: user.id },
        update: {
          classId: classId,
          sectionId: section.id,
        },
        create: {
          userId: user.id,
          classId: classId,
          sectionId: section.id,
        },
      });
    }
  }

  console.log('Seeding finished.');
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
