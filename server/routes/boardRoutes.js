import express from 'express';
import {
  createBoard,
  getPublicBoards,
  getBoardById,
  getMyBoards,
  updateBoard,
  toggleAvailability,
  deleteBoard,
} from '../controllers/boardController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.get('/', getPublicBoards);
router.get('/mine', protect, authorize('advertiser', 'admin'), getMyBoards);
router.get('/:id', getBoardById);

// Protected advertiser routes
router.post('/', protect, authorize('advertiser', 'admin'), createBoard);
router.put('/:id', protect, authorize('advertiser', 'admin'), updateBoard);
router.patch('/:id/availability', protect, authorize('advertiser', 'admin'), toggleAvailability);
router.delete('/:id', protect, authorize('advertiser', 'admin'), deleteBoard);

export default router;
