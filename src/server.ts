import express, { Request, Response } from 'express';
import cors from 'cors';
import { config } from './config/config';
import { logger } from './utils/logger';
import { requestLogger } from './middleware/requestLogger';
import { errorHandler, notFoundHandler } from './middleware/errorHandler';
import { rateLimitMiddleware } from './middleware/rateLimiter';
import apiRoutes from './routes/index';

const app = express();

// ============================================================================
// MIDDLEWARE
// ============================================================================

// CORS
app.use(cors(config.cors));

// Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging
app.use(requestLogger);

// Rate limiting
app.use('/api', rateLimitMiddleware);

// ============================================================================
// ROUTES
// ============================================================================

/**
 * @route   GET /
 * @desc    API information and quick reference
 * @access  Public
 */
app.get('/', (req: Request, res: Response) => {
  const baseUrl = `${req.protocol}://${req.get('host')}`;
  
  res.json({
    name: 'MangaPill API Scraper',
    version: '2.0.0',
    description: 'Comprehensive RESTful API for scraping manga data from MangaPill.com',
    documentation: `${baseUrl}/api/docs`,
    health: `${baseUrl}/health`,
    repository: 'https://github.com/yourusername/mangapill-scraper',
    
    quickStart: {
      homepage: `${baseUrl}/api/homepage`,
      search: `${baseUrl}/api/search?q=naruto`,
      mangaDetails: `${baseUrl}/api/manga/723`,
      chapterPages: `${baseUrl}/api/chapter/723-10230000`,
      recentChapters: `${baseUrl}/api/chapters/recent`
    },
    
    features: [
      'Full MangaPill coverage',
      'Smart caching system',
      'Auto retry with backoff',
      'Rate limiting',
      'TypeScript support',
      'Modular architecture',
      'Comprehensive logging',
      'CORS enabled'
    ]
  });
});

/**
 * @route   GET /health
 * @desc    Health check endpoint
 * @access  Public
 */
app.get('/health', (req: Request, res: Response) => {
  res.json({
    status: 'healthy',
    uptime: process.uptime(),
    environment: config.nodeEnv,
    timestamp: new Date().toISOString(),
    memory: {
      used: Math.round(process.memoryUsage().heapUsed / 1024 / 1024),
      total: Math.round(process.memoryUsage().heapTotal / 1024 / 1024),
      unit: 'MB'
    }
  });
});

// Mount API routes
app.use('/api', apiRoutes);

// ============================================================================
// ERROR HANDLING
// ============================================================================

// 404 handler
app.use(notFoundHandler);

// Global error handler
app.use(errorHandler);

// ============================================================================
// SERVER START
// ============================================================================

const PORT = config.port;

app.listen(PORT, () => {
  logger.info('╔════════════════════════════════════════════════════════════╗');
  logger.info('║       MangaPill API Scraper v2.0                          ║');
  logger.info('╠════════════════════════════════════════════════════════════╣');
  logger.info(`║  Server:        http://localhost:${PORT}                       ║`);
  logger.info(`║  Documentation: http://localhost:${PORT}/api/docs              ║`);
  logger.info(`║  Health:        http://localhost:${PORT}/health                ║`);
  logger.info(`║  Environment:   ${config.nodeEnv.padEnd(38)}║`);
  logger.info('╚════════════════════════════════════════════════════════════╝');
  logger.info('');
  logger.info('✓ Server is ready to accept connections');
  logger.info('✓ Cache system enabled');
  logger.info('✓ Rate limiting active');
  logger.info('');
});

// Graceful shutdown
process.on('SIGTERM', () => {
  logger.info('SIGTERM received. Shutting down gracefully...');
  process.exit(0);
});

process.on('SIGINT', () => {
  logger.info('SIGINT received. Shutting down gracefully...');
  process.exit(0);
});

export default app;
