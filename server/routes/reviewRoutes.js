import express from 'express';
import { createReview, getBoardReviews } from '../controllers/reviewController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/board/:boardId', getBoardReviews);
router.post('/', protect, createReview);

export default router;
