import { Router } from 'express';
import { searchController } from '../controllers/searchController';

const router = Router();

/**
 * @route   GET /api/search/advanced
 * @desc    Advanced search with filters
 * @access  Public
 */
router.get('/advanced', (req, res) => searchController.advancedSearch(req, res));

/**
 * @route   GET /api/search
 * @desc    Basic search
 * @access  Public
 */
router.get('/', (req, res) => searchController.search(req, res));

export default router;
