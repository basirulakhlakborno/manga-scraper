import { Router } from 'express';
import { searchController } from '../controllers/searchController';

const router = Router();

/**
 * @route   GET /api/genre/:genre
 * @desc    Search manga by genre
 * @access  Public
 */
router.get('/:genre', (req, res) => searchController.searchByGenre(req, res));

export default router;
