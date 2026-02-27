import { Router } from 'express';
import { homepageController } from '../controllers/homepageController';

const router = Router();

/**
 * @route   GET /api/homepage
 * @desc    Get homepage data
 * @access  Public
 */
router.get('/', (req, res) => homepageController.getHomepage(req, res));

export default router;
