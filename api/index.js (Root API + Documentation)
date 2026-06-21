const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
const serverless = require('serverless-http');
require('dotenv').config();

const app = express();

// Import middleware
const { validateApiKey } = require('../middleware/auth');

// Import routes
const tiktokHandler = require('./tiktok');
const infoHandler = require('./info');
const mp3Handler = require('./mp3');
const nowmHandler = require('./nowm');
const wmHandler = require('./wm');

// Global middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'"],
      styleSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
}));

app.use(cors({
  origin: process.env.ALLOWED_ORIGINS?.split(',') || '*',
  credentials: true
}));

app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Global rate limiter
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW) || 60000,
  max: parseInt(process.env.RATE_LIMIT_MAX) || 100,
  keyGenerator: (req) => req.headers['x-forwarded-for'] || req.ip,
  handler: (req, res) => {
    res.status(429).json({
      status: false,
      code: 429,
      message: 'Too many requests, please try again later'
    });
  }
});

app.use('/api', limiter);

// API Key validation for all /api routes except documentation
app.use('/api', (req, res, next) => {
  if (req.path === '/') {
    return next();
  }
  validateApiKey(req, res, next);
});

// Routes
app.get('/api', (req, res) => {
  res.json({
    status: true,
    creator: 'Tio',
    message: 'TikTok Downloader API',
    endpoints: {
      '/api/tiktok': 'Download TikTok video (GET)',
      '/api/info': 'Get video info (GET)',
      '/api/mp3': 'Get audio only (GET)',
      '/api/nowm': 'Get video without watermark (GET)',
      '/api/wm': 'Get video with watermark (GET)'
    },
    documentation: 'https://github.com/yourusername/tiktok-downloader-api',
    version: '1.0.0'
  });
});

// Mount route handlers
app.get('/api/tiktok', tiktokHandler);
app.get('/api/info', infoHandler);
app.get('/api/mp3', mp3Handler);
app.get('/api/nowm', nowmHandler);
app.get('/api/wm', wmHandler);

// Error handler
app.use((err, req, res, next) => {
  console.error('Error:', err.message);
  res.status(err.status || 500).json({
    status: false,
    code: err.status || 500,
    message: err.message || 'Internal Server Error'
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    status: false,
    code: 404,
    message: 'Endpoint not found'
  });
});

// Export for Vercel
module.exports = serverless(app);

// For local development
if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    console.log(`📚 Documentation: http://localhost:${PORT}/api`);
  });
}
