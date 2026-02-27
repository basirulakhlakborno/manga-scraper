import { Router } from 'express';
import { mangaController } from '../controllers/mangaController';

const router = Router();

/**
 * @route   GET /api/manga/new
 * @desc    Get newly added manga
 * @access  Public
 */
router.get('/new', (req, res) => mangaController.getNewManga(req, res));

/**
 * @route   GET /api/manga/random
 * @desc    Get a random manga
 * @access  Public
 */
router.get('/random', (req, res) => mangaController.getRandomManga(req, res));

/**
 * @route   GET /api/manga/:id
 * @desc    Get manga details by ID
 * @access  Public
 */
router.get('/:id', (req, res) => mangaController.getMangaDetails(req, res));

export default router;
