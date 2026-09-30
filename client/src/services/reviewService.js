import api from './api';

export const reviewService = {
  createReview: async (reviewData) => {
    const response = await api.post('/reviews', reviewData);
    return response.data;
  },

  getBoardReviews: async (boardId) => {
    const response = await api.get(`/reviews/board/${boardId}`);
    return response.data;
  },
};

export default reviewService;
