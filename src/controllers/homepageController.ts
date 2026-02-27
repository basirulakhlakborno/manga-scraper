import { Request, Response } from 'express';
import { scraperService } from '../services/scraperService';
import { successResponse, errorResponse, getErrorMessage } from '../utils/response';
import { logger } from '../utils/logger';

export class HomepageController {
  /**
   * Get homepage data
   * GET /api/homepage
   */
  async getHomepage(req: Request, res: Response): Promise<void> {
    try {
      const data = await scraperService.getHomepage();
      res.json(successResponse(data));
    } catch (error) {
      logger.error('Error in getHomepage:', error);
      res.status(500).json(errorResponse(getErrorMessage(error)));
    }
  }
}

export const homepageController = new HomepageController();
