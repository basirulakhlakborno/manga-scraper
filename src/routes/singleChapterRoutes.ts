import { Router } from 'express';
import { chapterController } from '../controllers/chapterController';

const router = Router();

/**
 * @route   GET /api/chapter/:chapterId
 * @desc    Get chapter pages and images
 * @access  Public
 */
router.get('/:chapterId', (req, res) => chapterController.getChapterPages(req, res));

export default router;
