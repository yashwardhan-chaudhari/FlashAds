import express from 'express';
import {
  getPendingBoards,
  getAllAdminBoards,
  approveBoard,
  rejectBoard,
  getAdminStats,
  getAllUsers,
  toggleUserStatus,
  getAllAdminBookings,
} from '../controllers/adminController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// All admin routes strictly require admin authentication and authorization (Phase 25)
router.use(protect);
router.use(authorize('admin'));

// Board Moderation & Overview
router.get('/boards/pending', getPendingBoards);
router.get('/boards', getAllAdminBoards);
router.patch('/boards/:id/approve', approveBoard);
router.patch('/boards/:id/reject', rejectBoard);

// Analytics & Metrics (Phase 24)
router.get('/stats', getAdminStats);

// User Management
router.get('/users', getAllUsers);
router.patch('/users/:id/toggle-status', toggleUserStatus);

// Booking Oversight
router.get('/bookings', getAllAdminBookings);

export default router;
