import Booking from '../models/Booking.js';
import User from '../models/User.js';
import Board from '../models/Board.js';

export const seedBookings = async () => {
  try {
    const existingCount = await Booking.countDocuments();
    if (existingCount > 0) {
      return;
    }

    const clientUser = await User.findOne({ role: 'client' });
    const advertiserUser = await User.findOne({ role: 'advertiser' });
    const boards = await Board.find({ status: 'approved' });

    if (!clientUser || !advertiserUser || boards.length === 0) {
      console.log('[Seed] Required users or boards missing for seeding bookings');
      return;
    }

    const board1 = boards[0]; // e.g. Hinjewadi LED / Pune LED Screen
    const board2 = boards[1] || boards[0];

    const demoBookings = [
      {
        bookingId: 'FA-BKG-2026-101',
        boardId: board1._id,
        clientId: clientUser._id,
        advertiserId: board1.ownerId || advertiserUser._id,
        startDate: new Date('2026-10-10'),
        endDate: new Date('2026-10-25'),
        duration: 15,
        totalAmount: 18000,
        priceBreakdown: '2 weeks + 1 day tier (₹18,000)',
        status: 'pending',
        campaignNotes: 'Diwali admissions campaign video in 4K 15-second spot format.',
      },
      {
        bookingId: 'FA-BKG-2026-102',
        boardId: board2._id,
        clientId: clientUser._id,
        advertiserId: board2.ownerId || advertiserUser._id,
        startDate: new Date('2026-11-01'),
        endDate: new Date('2026-11-16'),
        duration: 15,
        totalAmount: 48000,
        priceBreakdown: '2 weeks (₹44,000) + 1 day (₹4,000)',
        status: 'approved',
        campaignNotes: 'Tech summit branding banner.',
        approvedAt: new Date(),
      },
    ];

    await Booking.insertMany(demoBookings);
    console.log('[Seed] Demo bookings seeded successfully');
  } catch (error) {
    console.error('[Seed] Error seeding bookings:', error);
  }
};

export default seedBookings;
