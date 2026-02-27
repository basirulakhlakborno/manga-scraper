import { Request, Response } from 'express';
import { scraperService } from '../services/scraperService';
import { successResponse, errorResponse, getErrorMessage } from '../utils/response';
import { logger } from '../utils/logger';

export class SearchController {
  /**
   * Basic search
   * GET /api/search
   */
  async search(req: Request, res: Response): Promise<void> {
    try {
      const { q, page = '1' } = req.query;
      
      if (!q || typeof q !== 'string') {
        res.status(400).json(errorResponse('Query parameter "q" is required'));
        return;
      }

      const pageNum = parseInt(page as string) || 1;
      const data = await scraperService.search(q, pageNum);
      res.json(successResponse(data));
    } catch (error) {
      logger.error('Error in search:', error);
      res.status(500).json(errorResponse(getErrorMessage(error)));
    }
  }

  /**
   * Advanced search with filters
   * GET /api/search/advanced
   */
  async advancedSearch(req: Request, res: Response): Promise<void> {
    try {
      const { q, genres, type, status, year, page = '1' } = req.query;
      
      const searchParams: any = {
        page: parseInt(page as string) || 1
      };
      
      if (q && typeof q === 'string') searchParams.query = q;
      if (genres && typeof genres === 'string') {
        searchParams.genres = genres.split(',').map(g => g.trim());
      }
      if (type && typeof type === 'string') searchParams.type = type;
      if (status && typeof status === 'string') searchParams.status = status;
      if (year && typeof year === 'string') searchParams.year = year;
      
      const data = await scraperService.advancedSearch(searchParams);
      res.json(successResponse(data));
    } catch (error) {
      logger.error('Error in advancedSearch:', error);
      res.status(500).json(errorResponse(getErrorMessage(error)));
    }
  }

  /**
   * Search by genre
   * GET /api/genre/:genre
   */
  async searchByGenre(req: Request, res: Response): Promise<void> {
    try {
      const { genre } = req.params;
      const page = parseInt(req.query.page as string) || 1;
      
      if (!genre) {
        res.status(400).json(errorResponse('Genre is required'));
        return;
      }

      const data = await scraperService.searchByGenre(genre, page);
      res.json(successResponse(data));
    } catch (error) {
      logger.error('Error in searchByGenre:', error);
      res.status(500).json(errorResponse(getErrorMessage(error)));
    }
  }
}

export const searchController = new SearchController();
