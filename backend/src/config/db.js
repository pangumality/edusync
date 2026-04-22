import dotenv from 'dotenv';
dotenv.config({ override: true }); // Ensure env vars are loaded and override system defaults
import pkg from '@prisma/client';
import pg from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';

const { PrismaClient } = pkg;
const { Pool } = pg;

const getPoolConfig = () => {
  const { DATABASE_URL, PGHOST, PGPORT, PGUSER, PGPASSWORD, PGDATABASE } = process.env;

  if (DATABASE_URL) {
    let parsed;
    try {
      parsed = new URL(DATABASE_URL);
    } catch {
      throw new Error('Invalid DATABASE_URL. Expected a valid Postgres connection string.');
    }

    if (parsed.username && !parsed.password) {
      throw new Error('DATABASE_URL is missing a password. Include :password@ in the URL, or set PGPASSWORD and use PG* variables.');
    }

    return { connectionString: DATABASE_URL };
  }

  const missing = [];
  if (!PGHOST) missing.push('PGHOST');
  if (!PGUSER) missing.push('PGUSER');
  if (!PGPASSWORD) missing.push('PGPASSWORD');
  if (!PGDATABASE) missing.push('PGDATABASE');

  if (missing.length) {
    const allowDevFallback = process.env.NODE_ENV !== 'production';
    if (!allowDevFallback) {
      throw new Error(`Missing database configuration. Set DATABASE_URL or set: ${missing.join(', ')}`);
    }

    return {
      host: 'localhost',
      port: 5434,
      user: 'postgres',
      password: 'postgres',
      database: 'schoolerp',
    };
  }

  const port = PGPORT ? Number(PGPORT) : 5432;
  if (!Number.isFinite(port)) {
    throw new Error('Invalid PGPORT. Expected a number.');
  }

  return {
    host: PGHOST,
    port,
    user: PGUSER,
    password: PGPASSWORD,
    database: PGDATABASE,
  };
};

const pool = new Pool(getPoolConfig());
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

export default prisma;
