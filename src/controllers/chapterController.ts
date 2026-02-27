import { Request, Response } from 'express';
import { scraperService } from '../services/scraperService';
import { successResponse, errorResponse, getErrorMessage } from '../utils/response';
import { logger } from '../utils/logger';

export class ChapterController {
  /**
   * Get chapter pages and images
   * GET /api/chapter/:chapterId
   */
  async getChapterPages(req: Request, res: Response): Promise<void> {
    try {
      const { chapterId } = req.params;
      
      if (!chapterId) {
        res.status(400).json(errorResponse('Chapter ID is required'));
        return;
      }

      const data = await scraperService.getChapterPages(chapterId);
      
      if (!data) {
        res.status(404).json(errorResponse('Chapter not found'));
        return;
      }

      res.json(successResponse(data));
    } catch (error) {
      logger.error('Error in getChapterPages:', error);
      res.status(500).json(errorResponse(getErrorMessage(error)));
    }
  }

  /**
   * Get recent chapters
   * GET /api/chapters/recent
   */
  async getRecentChapters(req: Request, res: Response): Promise<void> {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const data = await scraperService.getRecentChapters(page);
      res.json(successResponse(data));
    } catch (error) {
      logger.error('Error in getRecentChapters:', error);
      res.status(500).json(errorResponse(getErrorMessage(error)));
    }
  }
}

export const chapterController = new ChapterController();
