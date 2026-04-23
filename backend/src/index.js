import app, { prisma } from './app.js';
import dotenv from 'dotenv';
import { randomUUID } from 'node:crypto';

dotenv.config();

const PORT = process.env.PORT || 5000;

async function repairDb() {
  try {
    try {
      await prisma.$executeRawUnsafe(
        `DO $$ BEGIN
          BEGIN
            ALTER TYPE "UserRole" ADD VALUE 'staff';
          EXCEPTION WHEN duplicate_object THEN
            NULL;
          END;
        END $$;`
      );
    } catch {}

    try {
      await prisma.$executeRawUnsafe(
        `UPDATE "User" SET role = 'staff' WHERE role::text = 'school_admin'`
      );
    } catch {}

    try {
      await prisma.$executeRawUnsafe(
        `UPDATE "User" SET role = 'admin' WHERE role::text = 'super_admin'`
      );
    } catch {}

    try {
      await prisma.$executeRawUnsafe(
        `DO $$ BEGIN
          IF EXISTS (
            SELECT 1
            FROM information_schema.columns
            WHERE table_schema = 'public'
              AND table_name = 'Class'
              AND column_name = 'sections'
          ) THEN
            IF (
              SELECT udt_name
              FROM information_schema.columns
              WHERE table_schema = 'public'
                AND table_name = 'Class'
                AND column_name = 'sections'
            ) <> '_text' THEN
              ALTER TABLE "Class" DROP COLUMN "sections";
              ALTER TABLE "Class" ADD COLUMN "sections" text[] NOT NULL DEFAULT ARRAY[]::text[];
            END IF;
          ELSE
            ALTER TABLE "Class" ADD COLUMN "sections" text[] NOT NULL DEFAULT ARRAY[]::text[];
          END IF;
        END $$;`
      );
    } catch {}
  } catch (error) {
    console.warn('⚠️ DB repair skipped:', error?.message || error);
  }
}

// Attempt to connect to DB on start
async function startServer() {
  try {
    await prisma.$connect();
    await repairDb();
    await prisma.$queryRaw`SELECT 1`;
    console.log('✅ Database connected successfully');
    
    const email = 'admin@system.com';
    let school = await prisma.school.findFirst();
    if (!school) {
      school = await prisma.school.create({
        data: { id: randomUUID(), name: 'System', code: 'SYSTEM' }
      });
    }
    const existing = await prisma.user.findUnique({ where: { email } });
    if (!existing) {
      await prisma.user.create({
        data: {
          id: randomUUID(),
          schoolId: school.id,
          firstName: 'Admin',
          lastName: 'User',
          email,
          password: 'Admin@123',
          role: 'admin',
          isActive: true
        }
      });
      console.log('✅ Super admin inserted:', email);
    } else {
      await prisma.user.update({
        where: { email },
        data: {
          schoolId: existing.schoolId || school.id,
          firstName: 'Admin',
          lastName: 'User',
          password: 'Admin@123',
          role: 'admin',
          isActive: true
        }
      });
      console.log('✅ Super admin updated:', email);
    }
    
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('❌ Database connection failed:', error);
    process.exit(1);
  }
}

startServer();
