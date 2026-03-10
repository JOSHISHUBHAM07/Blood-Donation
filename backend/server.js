const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const logger = require('./utils/logger.js');

dotenv.config();

const app = express();

// ─── Security Middleware ──────────────────────────────────────────────────────
app.use(helmet());

// CORS — allow frontend origin
const rawClientUrl = process.env.CLIENT_URL || 'http://localhost:5173';
const clientUrl = rawClientUrl.startsWith('http') ? rawClientUrl : `https://${rawClientUrl}`;

const allowedOrigins = [clientUrl, 'http://localhost:5173', 'http://localhost:5174'];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
}));

// Rate limiting: 100 requests per minute per IP
const limiter = rateLimit({
  windowMs: 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Too many requests, please try again later.' },
});
app.use('/api/', limiter);

// ─── Body Parser ─────────────────────────────────────────────────────────────
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// ─── Request Logger ───────────────────────────────────────────────────────────
app.use((req, _res, next) => {
  logger.info(`${req.method} ${req.originalUrl}`);
  next();
});

// ─── Health Check ─────────────────────────────────────────────────────────────
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString(), uptime: process.uptime() });
});

// ─── Routes ───────────────────────────────────────────────────────────────────
app.use('/api/auth', require('./routes/authRoutes.js'));
app.use('/api/admin', require('./routes/adminRoutes.js'));
app.use('/api/patient', require('./routes/patientRoutes.js'));
app.use('/api/donor', require('./routes/donorRoutes.js'));
app.use('/api/export', require('./routes/exportRoutes.js'));

// ─── 404 Handler ──────────────────────────────────────────────────────────────
app.use((_req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// ─── Global Error Handler ─────────────────────────────────────────────────────
app.use((err, _req, res, _next) => {
  logger.error(`Unhandled error: ${err.message}`);
  res.status(err.status || 500).json({ message: err.message || 'Internal Server Error' });
});

// ─── Database + Server Start ──────────────────────────────────────────────────
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    logger.info('MongoDB connected successfully');
  } catch (error) {
    logger.error(`MongoDB connection failed: ${error.message}`);
    process.exit(1);
  }
};

const PORT = process.env.PORT || 5000;

app.listen(PORT, async () => {
  await connectDB();
  logger.info(`🚀 Life Flow server running on port ${PORT}`);
});
