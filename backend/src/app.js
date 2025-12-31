import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';

dotenv.config();
const app = express();

// Middleware
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));
app.use(express.json());

// Multi-tenancy Middleware
app.use(async (req, res, next) => {
  const tenantId = req.headers['x-tenant-id'];
  
  if (!tenantId && req.path !== '/api/health') {
    // Allow health checks or super-admin routes without tenant, 
    // but generally enforce it. 
    // For now, we'll just log it or set a default for dev if needed.
    // return res.status(400).json({ error: 'X-Tenant-ID header missing' });
  }

  // In a real app, validate the tenant exists here
  req.tenantId = tenantId;
  next();
});

// Routes
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date() });
});

// Basic Auth Route Placeholder
app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  // TODO: Implement actual JWT auth
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
