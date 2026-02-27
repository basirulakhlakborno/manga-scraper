import { Request, Response } from 'express';
import { scraperService } from '../services/scraperService';
import { successResponse, errorResponse, getErrorMessage } from '../utils/response';
import { logger } from '../utils/logger';

export class MangaController {
  /**
   * Get manga details by ID
   * GET /api/manga/:id
   */
  async getMangaDetails(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      
      if (!id) {
        res.status(400).json(errorResponse('Manga ID is required'));
        return;
      }

      const data = await scraperService.getMangaDetails(id);
      
      if (!data) {
        res.status(404).json(errorResponse('Manga not found'));
        return;
      }

      res.json(successResponse(data));
    } catch (error) {
      logger.error('Error in getMangaDetails:', error);
      res.status(500).json(errorResponse(getErrorMessage(error)));
    }
  }

  /**
   * Get new manga
   * GET /api/manga/new
   */
  async getNewManga(req: Request, res: Response): Promise<void> {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const data = await scraperService.getNewManga(page);
      res.json(successResponse(data));
    } catch (error) {
      logger.error('Error in getNewManga:', error);
      res.status(500).json(errorResponse(getErrorMessage(error)));
    }
  }

  /**
   * Get random manga
   * GET /api/manga/random
   */
  async getRandomManga(req: Request, res: Response): Promise<void> {
    try {
      const data = await scraperService.getRandomManga();
      
      if (!data) {
        res.status(404).json(errorResponse('Failed to get random manga'));
        return;
      }

      res.json(successResponse(data));
    } catch (error) {
      logger.error('Error in getRandomManga:', error);
      res.status(500).json(errorResponse(getErrorMessage(error)));
    }
  }
}

export const mangaController = new MangaController();
