import dotenv from 'dotenv';
dotenv.config();
import pkg from '@prisma/client';
const { PrismaClient } = pkg;
import pg from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import bcrypt from 'bcryptjs';

const { Pool } = pg;
const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const API_URL = 'http://localhost:5000/api';
const EMAIL = 'admin@system.com';
const PASSWORD = 'NewPassword@123';

async function main() {
  console.log('--- Debugging API ---');

  // 1. Ensure User Exists and Set Password
  const user = await prisma.user.findUnique({ where: { email: EMAIL } });
  if (!user) {
    console.error(`User ${EMAIL} not found! Listing all users...`);
    const users = await prisma.user.findMany({ take: 5 });
    console.log(users);
    return;
  }
  
  console.log(`Found user: ${user.id} (${user.role})`);
  const hashedPassword = await bcrypt.hash(PASSWORD, 10);
  await prisma.user.update({
    where: { id: user.id },
    data: { password: hashedPassword }
  });
  console.log('Password updated.');

  // 2. Login
  let token;
  try {
    const res = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: EMAIL, password: PASSWORD })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(JSON.stringify(data));
    token = data.token;
    console.log('Login successful. Token obtained.');
  } catch (error) {
    console.error('Login failed:', error.message);
    return;
  }

  // 3. Fetch ClassWork
  const subjectId = 'aabdcdf7-e837-4336-98a3-5ff41f639e60';
  
  try {
    console.log(`Fetching ClassWork for subject: ${subjectId}`);
    const res = await fetch(`${API_URL}/class-work?subjectId=${subjectId}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const data = await res.json();
    console.log('Status:', res.status);
    if (!res.ok) console.error('Error:', data);
    else console.log('Data:', JSON.stringify(data, null, 2));
  } catch (error) {
    console.error('Fetch ClassWork failed:', error.message);
  }

  // 4. Fetch Homework
  try {
    console.log(`Fetching Homework for subject: ${subjectId}`);
    const res = await fetch(`${API_URL}/homework?subjectId=${subjectId}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const data = await res.json();
    console.log('Status:', res.status);
    if (!res.ok) console.error('Error:', data);
    else console.log('Data:', JSON.stringify(data, null, 2));
  } catch (error) {
    console.error('Fetch Homework failed:', error.message);
  }

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
