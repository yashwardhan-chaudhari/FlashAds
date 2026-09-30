import express from 'express';
import {
  toggleFavorite,
  getUserFavorites,
  checkIsFavorited,
} from '../controllers/favoriteController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);

router.get('/', getUserFavorites);
router.post('/:boardId', toggleFavorite);
router.get('/check/:boardId', checkIsFavorited);

export default router;
