import dotenv from 'dotenv';
dotenv.config();
import { PrismaClient } from '@prisma/client';
import pg from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';

const { Pool } = pg;
const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('--- ClassWork ---');
  const classWorks = await prisma.classWork.findMany();
  console.log(JSON.stringify(classWorks, null, 2));

  console.log('--- Homework ---');
  const homeworks = await prisma.homework.findMany();
  console.log(JSON.stringify(homeworks, null, 2));
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end(); 
  });
