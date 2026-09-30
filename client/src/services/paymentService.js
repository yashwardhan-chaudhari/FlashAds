import api from './api';

export const paymentService = {
  createPaymentOrder: async (bookingId) => {
    const response = await api.post('/payments/create-order', { bookingId });
    return response.data;
  },

  verifyPayment: async (paymentData) => {
    const response = await api.post('/payments/verify', paymentData);
    return response.data;
  },
};

export default paymentService;
