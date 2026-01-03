import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';
import pg from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';

dotenv.config();
const app = express();

const { Pool } = pg;
const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

// Export prisma client for usage in other files if needed
export { prisma };

// Middleware
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));
app.use(express.json());

// Routes
app.get('/', (req, res) => {
  res.send('School ERP Backend is running');
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date() });
});

app.get('/api/db/health', async (req, res) => {
  const checks = { prisma: null };
  try {
    await prisma.$queryRaw`SELECT 1`;
    checks.prisma = 'ok';
  } catch (e) {
    const detail = e?.message ? e.message : JSON.stringify(e);
    checks.prisma = detail;
  }
  const ok = checks.prisma === 'ok';
  res.status(ok ? 200 : 500).json({ status: ok ? 'ok' : 'error', checks });
});

app.get('/api/classes', async (req, res) => {
  try {
    const classes = await prisma.class.findMany();
    const formatted = classes.map(c => ({
      id: c.id,
      name: c.name,
    }));
    res.json(formatted);
  } catch (error) {
    console.error('Error fetching classes:', error);
    res.status(500).json({ error: 'Failed to fetch classes', details: error.message });
  }
});

app.get('/api/students', async (req, res) => {
  const { classId } = req.query;
  if (!classId) {
    return res.status(400).json({ error: 'Missing classId' });
  }
  try {
    const students = await prisma.student.findMany({
      where: { classId: String(classId) },
      include: { user: true },
    });
    const formatted = students.map(s => ({
      id: s.id,
      name: `${s.user.firstName} ${s.user.lastName}`.trim(),
    }));
    res.json(formatted);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch students' });
  }
});

app.get('/api/classes/:classId/school', async (req, res) => {
  const { classId } = req.params;
  try {
    const klass = await prisma.class.findUnique({ where: { id: String(classId) } });
    if (!klass || !klass.schoolId) {
      return res.status(404).json({ error: 'Class or school not found' });
    }
    const school = await prisma.school.findUnique({ where: { id: String(klass.schoolId) } });
    if (!school) {
      return res.status(404).json({ error: 'School not found' });
    }
    res.json({
      id: school.id,
      name: school.name,
      lat: school.latitude,
      lng: school.longitude,
      radiusMeters: school.attendanceRadiusMeters,
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch school' });
  }
});


// Basic Auth Route Placeholder
app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  
  if (email === 'admin@admin.com' && password === 'admin') {
     return res.json({ 
       token: 'fake-jwt-token', 
       user: { 
         id: '1', 
         name: 'Admin KORA', 
         role: 'ADMIN',
         email: 'admin@admin.com'
       } 
     });
  }
  res.status(401).json({ error: 'Invalid credentials' });
});

export default app;
