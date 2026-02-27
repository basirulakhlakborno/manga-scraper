import { Router } from 'express';
import { chapterController } from '../controllers/chapterController';

const router = Router();

/**
 * @route   GET /api/chapters/recent
 * @desc    Get recently released chapters
 * @access  Public
 */
router.get('/recent', (req, res) => chapterController.getRecentChapters(req, res));

export default router;
