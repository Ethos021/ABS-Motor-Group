import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import config from './config/config.js';
import { errorHandler, notFound } from './middlewares/errorHandler.js';
import { sanitizeObject } from './utils/sanitize.js';

// Import routes
import healthRoutes from './routes/health.js';
import authRoutes from './routes/auth.js';
import vehicleRoutes from './routes/vehicles.js';
import enquiryRoutes from './routes/enquiries.js';
import bookingRoutes from './routes/bookings.js';
import staffRoutes from './routes/staff.js';
import calendarBlockRoutes from './routes/calendarBlocks.js';

const app = express();

// Security middleware
// CSP is disabled for API-only backend - we don't serve HTML
// XSS protection is handled by:
// 1. JSON-only Content-Type validation
// 2. Input sanitization middleware
// 3. Parameterized queries via Prisma ORM
app.use(helmet({
  contentSecurityPolicy: false, // Not needed for JSON API
  crossOriginEmbedderPolicy: false,
}));

// CORS configuration
app.use(cors({
  origin: config.cors.origin,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: config.rateLimit.windowMs,
  max: config.rateLimit.max,
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});

app.use('/api/', limiter);

// Logging
if (config.nodeEnv === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined'));
}

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Input sanitization middleware
app.use((req, res, next) => {
  if (req.body) {
    req.body = sanitizeObject(req.body);
  }
  if (req.query) {
    for (const [key, value] of Object.entries(sanitizeObject({ ...req.query }))) {
      req.query[key] = value;
    }
  }
  next();
});

// API Routes
app.use('/api/health', healthRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/vehicles', vehicleRoutes);
app.use('/api/enquiries', enquiryRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/staff', staffRoutes);
app.use('/api/calendar-blocks', calendarBlockRoutes);

// Root route
app.get('/', (req, res) => {
  res.json({
    message: 'ABS Motor Group API',
    version: '1.0.0',
    endpoints: {
      health: '/api/health',
      auth: '/api/auth',
      vehicles: '/api/vehicles',
      enquiries: '/api/enquiries',
      bookings: '/api/bookings',
      staff: '/api/staff',
      calendarBlocks: '/api/calendar-blocks',
    },
  });
});

// 404 handler
app.use(notFound);

// Error handler (must be last)
app.use(errorHandler);

export default app;
