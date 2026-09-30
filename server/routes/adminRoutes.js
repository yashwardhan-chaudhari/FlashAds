import express from 'express';
import {
  getPendingBoards,
  getAllAdminBoards,
  approveBoard,
  rejectBoard,
  getAdminStats,
} from '../controllers/adminController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// All admin routes require admin role
router.use(protect);
router.use(authorize('admin'));

router.get('/boards/pending', getPendingBoards);
router.get('/boards', getAllAdminBoards);
router.patch('/boards/:id/approve', approveBoard);
router.patch('/boards/:id/reject', rejectBoard);
router.get('/stats', getAdminStats);

export default router;
