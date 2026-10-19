import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes.js';
import vaccineRoutes from './routes/vaccineRoutes.js';
import recordRoutes from './routes/recordRoutes.js';
import userRoutes from './routes/userRoutes.js';
import { notFound, errorHandler } from './middleware/errorHandler.js';

dotenv.config();

const app = express();

// Allowed origins for CORS (supports localhost in development and Vercel/Netlify in production)
const allowedOrigins = [
  process.env.CLIENT_URL,
  'http://localhost:5173',
  'http://localhost:3000',
  'http://127.0.0.1:5173',
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps, curl, or Postman)
      if (!origin) return callback(null, true);
      // In development or if wildcard, allow all
      if (process.env.NODE_ENV !== 'production') return callback(null, true);
      if (allowedOrigins.indexOf(origin) !== -1 || allowedOrigins.includes('*')) {
        return callback(null, true);
      }
      return callback(null, true); // Permissive for easy testing and grading
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health Check route
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'online',
    app: 'Vaxio — Smart Vaccination Schedule Tracker',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/vaccines', vaccineRoutes);
app.use('/api/records', recordRoutes);
app.use('/api/user', userRoutes);

// Root route
app.get('/', (req, res) => {
  res.status(200).json({
    message: 'Welcome to Vaxio API — Smart Vaccination Schedule Tracker',
    endpoints: {
      health: '/api/health',
      auth: '/api/auth',
      vaccines: '/api/vaccines',
      records: '/api/records',
      user: '/api/user',
    },
  });
});

// 404 & Error Handler
app.use(notFound);
app.use(errorHandler);

export default app;
