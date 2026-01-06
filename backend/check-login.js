import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const email = 'admin@system.com';
  const password = 'Admin@123';

  console.log(`Checking user: ${email}`);
  const user = await prisma.user.findUnique({
    where: { email }
  });

  if (!user) {
    console.log('User NOT found!');
    return;
  }

  console.log('User found:', user.id);
  console.log('Stored password:', user.password);
  console.log('Is Active:', user.isActive);

  let valid = false;
  try {
    console.log('Trying bcrypt compare...');
    valid = await bcrypt.compare(password, user.password);
    console.log('Bcrypt result:', valid);
  } catch (e) {
    console.log('Bcrypt error:', e.message);
    valid = false;
  }

  if (!valid) {
    console.log('Bcrypt failed. Checking plain text...');
    if (user.password === password) {
      console.log('Plain text match SUCCESS');
      valid = true;
    } else {
      console.log('Plain text match FAILED');
      console.log(`Expected: '${password}'`);
      console.log(`Actual:   '${user.password}'`);
    }
  }

  if (valid) {
    console.log('LOGIN WOULD SUCCEED');
  } else {
    console.log('LOGIN WOULD FAIL');
  }
}

main()
  .catch(e => console.error(e))
  .finally(async () => await prisma.$disconnect());
