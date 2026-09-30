import Booking from '../models/Booking.js';
import Board from '../models/Board.js';
import Notification from '../models/Notification.js';
import { calculateDurationPrice, getDaysBetweenDates } from '../services/pricingEngine.js';

/**
 * Helper to check date interval overlap on a board
 * Overlap condition: (StartA < EndB) AND (EndA > StartB)
 * Active booking statuses that block dates: 'approved' (and optionally 'pending')
 */
export const checkBookingOverlap = async (boardId, startDate, endDate, excludeBookingId = null) => {
  const start = new Date(startDate);
  const end = new Date(endDate);

  const query = {
    boardId,
    // Block against confirmed approved bookings and pending active bookings
    status: { $in: ['approved', 'pending'] },
    $and: [
      { startDate: { $lt: end } },
      { endDate: { $gt: start } },
    ],
  };

  if (excludeBookingId) {
    query._id = { $ne: excludeBookingId };
  }

  const conflictingBookings = await Booking.find(query)
    .populate('clientId', 'name email phone')
    .sort({ startDate: 1 });

  return conflictingBookings;
};

/**
 * @desc    Create a new booking request
 * @route   POST /api/bookings
 * @access  Private (Client / Admin)
 */
export const createBooking = async (req, res) => {
  try {
    const { boardId, startDate, endDate, campaignNotes } = req.body;

    if (!boardId || !startDate || !endDate) {
      return res.status(400).json({
        success: false,
        message: 'Please provide boardId, startDate, and endDate',
      });
    }

    // 1. Fetch Board
    const board = await Board.findById(boardId);
    if (!board) {
      return res.status(404).json({
        success: false,
        message: 'Advertising board not found',
      });
    }

    if (board.status !== 'approved') {
      return res.status(400).json({
        success: false,
        message: 'This board is not yet approved for public booking',
      });
    }

    // 2. Date Validation
    const start = new Date(startDate);
    const end = new Date(endDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      return res.status(400).json({
        success: false,
        message: 'Invalid start or end date format',
      });
    }

    if (start < today) {
      return res.status(400).json({
        success: false,
        message: 'Start date cannot be in the past',
      });
    }

    if (start >= end) {
      return res.status(400).json({
        success: false,
        message: 'End date must be after start date',
      });
    }

    // 3. Prevent Double Booking (Phase 14 Check)
    const conflicts = await checkBookingOverlap(boardId, start, end);
    if (conflicts.length > 0) {
      const conflict = conflicts[0];
      const conflictStart = new Date(conflict.startDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
      const conflictEnd = new Date(conflict.endDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
      
      return res.status(409).json({
        success: false,
        message: `❌ Board unavailable for selected dates. Already reserved from ${conflictStart} to ${conflictEnd}.`,
        conflict: {
          startDate: conflict.startDate,
          endDate: conflict.endDate,
          status: conflict.status,
        },
      });
    }

    // 4. Calculate Duration and Intelligent Tier Pricing (Phase 12)
    const durationDays = getDaysBetweenDates(start, end);
    const pricing = calculateDurationPrice(
      durationDays,
      board.pricePerDay,
      board.pricePerWeek,
      board.pricePerMonth
    );

    // 5. Create Booking Document
    const booking = new Booking({
      boardId: board._id,
      clientId: req.user._id,
      advertiserId: board.ownerId,
      startDate: start,
      endDate: end,
      duration: durationDays,
      totalAmount: pricing.totalAmount,
      priceBreakdown: pricing.breakdown,
      status: 'pending',
      campaignNotes: campaignNotes || '',
    });

    await booking.save();

    // Trigger Notification for Advertiser (Phase 19)
    try {
      await Notification.create({
        recipientId: board.ownerId,
        senderId: req.user._id,
        type: 'booking_request',
        title: 'New Booking Request Received',
        message: `New booking request from ${req.user.name} for ${board.title} (${durationDays} days).`,
        link: '/advertiser/dashboard?tab=requests',
      });
    } catch (notifErr) {
      console.warn('Notification trigger failed:', notifErr.message);
    }

    const populatedBooking = await Booking.findById(booking._id)
      .populate('boardId', 'title images city area address boardType width height trafficLevel')
      .populate('clientId', 'name email phone')
      .populate('advertiserId', 'name email phone');

    return res.status(201).json({
      success: true,
      message: 'Booking request sent successfully to the board owner',
      booking: populatedBooking,
    });
  } catch (error) {
    console.error('Create booking error:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Server error creating booking request',
    });
  }
};

/**
 * @desc    Get client's own bookings (Phase 15)
 * @route   GET /api/bookings/my-bookings
 * @access  Private (Client / Admin)
 */
export const getClientBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ clientId: req.user._id })
      .populate('boardId', 'title images city area address boardType width height trafficLevel pricePerDay pricePerWeek pricePerMonth')
      .populate('advertiserId', 'name email phone')
      .sort({ createdAt: -1 });

    // Compute Client Metrics
    const activeCampaigns = bookings.filter((b) => b.status === 'approved').length;
    const pendingBookings = bookings.filter((b) => b.status === 'pending').length;
    const completedCampaigns = bookings.filter((b) => b.status === 'completed').length;
    const totalSpending = bookings
      .filter((b) => b.status === 'approved' || b.status === 'completed')
      .reduce((sum, b) => sum + (b.totalAmount || 0), 0);

    return res.status(200).json({
      success: true,
      count: bookings.length,
      metrics: {
        activeCampaigns,
        pendingBookings,
        completedCampaigns,
        totalSpending,
      },
      bookings,
    });
  } catch (error) {
    console.error('Get client bookings error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error retrieving client bookings',
    });
  }
};

/**
 * @desc    Get advertiser's incoming booking requests (Phase 16)
 * @route   GET /api/bookings/advertiser-requests
 * @access  Private (Advertiser / Admin)
 */
export const getAdvertiserRequests = async (req, res) => {
  try {
    const requests = await Booking.find({ advertiserId: req.user._id })
      .populate('clientId', 'name email phone')
      .populate('boardId', 'title images city area address boardType width height trafficLevel pricePerDay pricePerWeek pricePerMonth')
      .sort({ createdAt: -1 });

    // Compute Advertiser Metrics
    const totalRequests = requests.length;
    const pendingRequests = requests.filter((r) => r.status === 'pending').length;
    const approvedRequests = requests.filter((r) => r.status === 'approved').length;
    const totalEarnings = requests
      .filter((r) => r.status === 'approved' || r.status === 'completed')
      .reduce((sum, r) => sum + (r.totalAmount || 0), 0);

    return res.status(200).json({
      success: true,
      count: requests.length,
      metrics: {
        totalRequests,
        pendingRequests,
        approvedRequests,
        totalEarnings,
      },
      requests,
    });
  } catch (error) {
    console.error('Get advertiser requests error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error retrieving advertiser requests',
    });
  }
};

/**
 * @desc    Advertiser Approve or Reject Booking Request
 * @route   PATCH /api/bookings/:id/status
 * @access  Private (Advertiser / Admin)
 */
export const updateBookingStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, rejectionReason } = req.body;

    if (!['approved', 'rejected', 'cancelled', 'completed'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status. Must be approved, rejected, cancelled, or completed.',
      });
    }

    const booking = await Booking.findById(id);
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found',
      });
    }

    // Permission check: Advertiser owning the board or Admin
    if (booking.advertiserId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to manage this booking request',
      });
    }

    // If approving, re-check for double-booking conflicts (guard against race conditions)
    if (status === 'approved') {
      const conflicts = await Booking.find({
        boardId: booking.boardId,
        status: 'approved',
        _id: { $ne: booking._id },
        $and: [
          { startDate: { $lt: booking.endDate } },
          { endDate: { $gt: booking.startDate } },
        ],
      });

      if (conflicts.length > 0) {
        return res.status(409).json({
          success: false,
          message: '❌ Cannot approve: Another booking was already approved for these overlapping dates.',
        });
      }

      booking.approvedAt = new Date();
    } else if (status === 'rejected') {
      booking.rejectedAt = new Date();
      if (rejectionReason) {
        booking.rejectionReason = rejectionReason;
      }
    }

    booking.status = status;
    await booking.save();

    const updated = await Booking.findById(booking._id)
      .populate('boardId', 'title images area address boardType')
      .populate('clientId', 'name email phone')
      .populate('advertiserId', 'name email phone');

    // Trigger Notification for Client (Phase 19)
    try {
      if (status === 'approved') {
        await Notification.create({
          recipientId: booking.clientId,
          senderId: req.user._id,
          type: 'booking_approved',
          title: 'Booking Request Approved! 🎉',
          message: `Your booking for "${updated.boardId?.title || 'Advertising Board'}" has been approved.`,
          link: '/client/dashboard?tab=bookings',
        });
      } else if (status === 'rejected') {
        await Notification.create({
          recipientId: booking.clientId,
          senderId: req.user._id,
          type: 'booking_rejected',
          title: 'Booking Request Rejected',
          message: `Your booking for "${updated.boardId?.title || 'Advertising Board'}" was rejected.${rejectionReason ? ` Reason: ${rejectionReason}` : ''}`,
          link: '/client/dashboard?tab=bookings',
        });
      }
    } catch (notifErr) {
      console.warn('Status notification trigger failed:', notifErr.message);
    }

    return res.status(200).json({
      success: true,
      message: `Booking has been ${status}`,
      booking: updated,
    });
  } catch (error) {
    console.error('Update booking status error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error updating booking status',
    });
  }
};

/**
 * @desc    Client cancel own pending booking
 * @route   PATCH /api/bookings/:id/cancel
 * @access  Private (Client / Admin)
 */
export const cancelBooking = async (req, res) => {
  try {
    const { id } = req.params;
    const booking = await Booking.findById(id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found',
      });
    }

    if (booking.clientId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to cancel this booking',
      });
    }

    if (booking.status !== 'pending') {
      return res.status(400).json({
        success: false,
        message: `Cannot cancel booking with status '${booking.status}'`,
      });
    }

    booking.status = 'cancelled';
    await booking.save();

    return res.status(200).json({
      success: true,
      message: 'Booking request cancelled successfully',
      booking,
    });
  } catch (error) {
    console.error('Cancel booking error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error cancelling booking',
    });
  }
};

/**
 * @desc    Get booked date intervals for a board (for frontend availability calendar)
 * @route   GET /api/bookings/board/:boardId/availability
 * @access  Public
 */
export const getBoardAvailability = async (req, res) => {
  try {
    const { boardId } = req.params;

    const activeBookings = await Booking.find({
      boardId,
      status: { $in: ['approved', 'pending'] },
      endDate: { $gte: new Date() }, // Future or ongoing
    })
      .select('startDate endDate status duration')
      .sort({ startDate: 1 });

    const bookedIntervals = activeBookings.map((b) => ({
      startDate: b.startDate,
      endDate: b.endDate,
      status: b.status,
      duration: b.duration,
    }));

    return res.status(200).json({
      success: true,
      boardId,
      count: bookedIntervals.length,
      bookedIntervals,
    });
  } catch (error) {
    console.error('Board availability error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error fetching board availability',
    });
  }
};

/**
 * @desc    Get single booking details
 * @route   GET /api/bookings/:id
 * @access  Private
 */
export const getBookingById = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('boardId')
      .populate('clientId', 'name email phone')
      .populate('advertiserId', 'name email phone');

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found',
      });
    }

    // Check authorization: Client, Advertiser, or Admin
    const userId = req.user._id.toString();
    const isClient = booking.clientId._id.toString() === userId;
    const isAdvertiser = booking.advertiserId._id.toString() === userId;
    const isAdmin = req.user.role === 'admin';

    if (!isClient && !isAdvertiser && !isAdmin) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this booking',
      });
    }

    return res.status(200).json({
      success: true,
      booking,
    });
  } catch (error) {
    console.error('Get booking by ID error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error retrieving booking',
    });
  }
};
