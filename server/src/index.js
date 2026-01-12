import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import dotenv from 'dotenv';
import { createServer } from 'http';
import logger from './utils/logger.js';
import { initializeSentry } from './utils/sentry.js';
import routes from './routes/index.js';
import { errorHandler } from './middleware/errorHandler.js';
import { startJobs } from './jobs/index.js';
import { redisClient } from './config/redis.js';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Initialize Sentry (should be first)
initializeSentry(app);

// Middleware
app.use(helmet());
app.use(compression());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging
app.use((req, res, next) => {
  logger.info(`${req.method} ${req.path}`, {
    query: req.query,
    ip: req.ip
  });
  next();
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    redis: redisClient.isReady ? 'connected' : 'disconnected',
    uptime: process.uptime()
  });
});

// API Routes
app.use('/api', routes);

// Error handler (must be last)
app.use(errorHandler);

// Create HTTP server
const server = createServer(app);

// Graceful shutdown
const gracefulShutdown = async () => {
  logger.info('Received shutdown signal, closing server gracefully...');

  server.close(async () => {
    logger.info('HTTP server closed');

    try {
      await redisClient.quit();
      logger.info('Redis connection closed');
      process.exit(0);
    } catch (error) {
      logger.error('Error during shutdown:', error);
      process.exit(1);
    }
  });

  // Force shutdown after 10 seconds
  setTimeout(() => {
    logger.error('Forced shutdown due to timeout');
    process.exit(1);
  }, 10000);
};

process.on('SIGTERM', gracefulShutdown);
process.on('SIGINT', gracefulShutdown);

// Start server
server.listen(PORT, async () => {
  logger.info(`🚀 Server running on port ${PORT}`);
  logger.info(`Environment: ${process.env.NODE_ENV || 'development'}`);

  try {
    // Connect to Redis
    await redisClient.connect();
    logger.info('✅ Redis connected');

    // Start background jobs
    await startJobs();
    logger.info('✅ Background jobs started');
  } catch (error) {
    logger.error('Failed to initialize services:', error);
    process.exit(1);
  }
});

export default app;
