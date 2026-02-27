import { Router, Request, Response } from 'express';
import { config } from '../config/config';
import { scraperService } from '../services/scraperService';
import mangaRoutes from './mangaRoutes';
import chapterRoutes from './chapterRoutes';
import singleChapterRoutes from './singleChapterRoutes';
import searchRoutes from './searchRoutes';
import genreRoutes from './genreRoutes';
import homepageRoutes from './homepageRoutes';

const router = Router();

// Mount route modules
router.use('/homepage', homepageRoutes);
router.use('/manga', mangaRoutes);
router.use('/chapter', singleChapterRoutes);
router.use('/chapters', chapterRoutes);
router.use('/search', searchRoutes);
router.use('/genre', genreRoutes);

/**
 * @route   GET /api/docs
 * @desc    Get API documentation
 * @access  Public
 */
router.get('/docs', (req: Request, res: Response) => {
  const baseUrl = `${req.protocol}://${req.get('host')}`;
  
  res.json({
    title: 'MangaPill API Documentation',
    version: '2.0.0',
    baseUrl,
    description: 'Comprehensive RESTful API for scraping manga data from MangaPill.com',
    
    endpoints: [
      {
        name: 'Homepage',
        method: 'GET',
        path: '/api/homepage',
        description: 'Get homepage data including featured chapters, new chapters, trending manga',
        example: `${baseUrl}/api/homepage`
      },
      {
        name: 'Manga Details',
        method: 'GET',
        path: '/api/manga/:id',
        description: 'Get comprehensive manga details by ID',
        parameters: ['id (manga ID)'],
        example: `${baseUrl}/api/manga/723`
      },
      {
        name: 'New Manga',
        method: 'GET',
        path: '/api/manga/new',
        description: 'Get newly added manga',
        parameters: ['page (optional)'],
        example: `${baseUrl}/api/manga/new?page=1`
      },
      {
        name: 'Random Manga',
        method: 'GET',
        path: '/api/manga/random',
        description: 'Get a random manga',
        example: `${baseUrl}/api/manga/random`
      },
      {
        name: 'Chapter Pages',
        method: 'GET',
        path: '/api/chapter/:chapterId',
        description: 'Get all pages/images for a chapter',
        parameters: ['chapterId (format: mangaId-chapterNumber)'],
        example: `${baseUrl}/api/chapter/723-10230000`
      },
      {
        name: 'Recent Chapters',
        method: 'GET',
        path: '/api/chapters/recent',
        description: 'Get recently released chapters',
        parameters: ['page (optional)'],
        example: `${baseUrl}/api/chapters/recent?page=1`
      },
      {
        name: 'Search',
        method: 'GET',
        path: '/api/search',
        description: 'Search manga by title',
        parameters: ['q (query)', 'page (optional)'],
        example: `${baseUrl}/api/search?q=naruto&page=1`
      },
      {
        name: 'Advanced Search',
        method: 'GET',
        path: '/api/search/advanced',
        description: 'Search with multiple filters',
        parameters: ['q (optional)', 'genres (comma-separated)', 'type', 'status', 'year', 'page'],
        example: `${baseUrl}/api/search/advanced?genres=Action,Adventure&status=publishing`
      },
      {
        name: 'Genre Search',
        method: 'GET',
        path: '/api/genre/:genre',
        description: 'Get manga by genre',
        parameters: ['genre', 'page (optional)'],
        example: `${baseUrl}/api/genre/Action?page=1`
      }
    ],
    
    responseFormat: {
      success: {
        success: true,
        data: 'Response data',
        timestamp: 'ISO 8601 timestamp'
      },
      error: {
        success: false,
        error: 'Error message',
        timestamp: 'ISO 8601 timestamp'
      }
    },
    
    features: [
      'Automatic retry with exponential backoff',
      'In-memory caching (5 minute TTL)',
      'Rate limiting (100 requests per 15 minutes)',
      'Comprehensive error handling',
      'Request logging',
      'TypeScript support',
      'CORS enabled'
    ]
  });
});

/**
 * @route   GET /api/cache/stats
 * @desc    Get cache statistics
 * @access  Public
 */
router.get('/cache/stats', (req: Request, res: Response) => {
  const stats = scraperService.getCacheStats();
  res.json({
    success: true,
    data: stats,
    timestamp: new Date().toISOString()
  });
});

/**
 * @route   POST /api/cache/clear
 * @desc    Clear cache
 * @access  Public
 */
router.post('/cache/clear', (req: Request, res: Response) => {
  scraperService.clearCache();
  res.json({
    success: true,
    message: 'Cache cleared successfully',
    timestamp: new Date().toISOString()
  });
});

export default router;
