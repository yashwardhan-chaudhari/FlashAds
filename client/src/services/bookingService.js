import api from './api';

/**
 * FlashAds Booking API Service
 */
export const bookingService = {
  // Create a new booking request (Phase 13, 14)
  createBooking: async (bookingData) => {
    const response = await api.post('/bookings', bookingData);
    return response.data;
  },

  // Get current client's bookings (Phase 15)
  getMyBookings: async () => {
    const response = await api.get('/bookings/my-bookings');
    return response.data;
  },

  // Get advertiser's incoming requests (Phase 16)
  getAdvertiserRequests: async () => {
    const response = await api.get('/bookings/advertiser-requests');
    return response.data;
  },

  // Advertiser approves or rejects a request (Phase 16)
  updateBookingStatus: async (bookingId, status, rejectionReason = '') => {
    const response = await api.patch(`/bookings/${bookingId}/status`, {
      status,
      rejectionReason,
    });
    return response.data;
  },

  // Client cancels own booking
  cancelBooking: async (bookingId) => {
    const response = await api.patch(`/bookings/${bookingId}/cancel`);
    return response.data;
  },

  // Public check for board booked date intervals (Phase 14)
  getBoardAvailability: async (boardId) => {
    const response = await api.get(`/bookings/board/${boardId}/availability`);
    return response.data;
  },

  // Get single booking
  getBookingById: async (bookingId) => {
    const response = await api.get(`/bookings/${bookingId}`);
    return response.data;
  },
};

export default bookingService;
