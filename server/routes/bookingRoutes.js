import express from 'express';
import {
  createBooking,
  getClientBookings,
  getAdvertiserRequests,
  updateBookingStatus,
  cancelBooking,
  getBoardAvailability,
  getBookingById,
} from '../controllers/bookingController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public route to inspect board calendar availability
router.get('/board/:boardId/availability', getBoardAvailability);

// Protected routes (Logged-in users)
router.use(protect);

// Create new booking request (Phase 13, 14)
router.post('/', authorize('client', 'admin'), createBooking);

// Client bookings (Phase 15)
router.get('/my-bookings', getClientBookings);

// Advertiser requests (Phase 16)
router.get('/advertiser-requests', authorize('advertiser', 'admin'), getAdvertiserRequests);

// Get single booking details
router.get('/:id', getBookingById);

// Update status (Approve / Reject) (Phase 16)
router.patch('/:id/status', authorize('advertiser', 'admin'), updateBookingStatus);

// Cancel booking (Client)
router.patch('/:id/cancel', cancelBooking);

export default router;
