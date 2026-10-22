import api from './api';

/**
 * FlashAds Admin Management API Service
 */
export const adminService = {
  /**
   * Get all pending boards awaiting moderation
   */
  getPendingBoards: async () => {
    const response = await api.get('/admin/boards/pending');
    return response.data;
  },

  /**
   * Get all boards across all statuses
   * @param {object} params - { status: 'approved' | 'pending' | 'rejected' | 'unavailable' }
   */
  getAllBoards: async (params = {}) => {
    const response = await api.get('/admin/boards', { params });
    return response.data;
  },

  /**
   * Approve a pending board
   * @param {string} id - Board ID
   */
  approveBoard: async (id) => {
    const response = await api.patch(`/admin/boards/${id}/approve`);
    return response.data;
  },

  /**
   * Reject a pending board with moderator feedback reason
   * @param {string} id - Board ID
   * @param {string} reason - Rejection explanation
   */
  rejectBoard: async (id, reason) => {
    const response = await api.patch(`/admin/boards/${id}/reject`, { reason });
    return response.data;
  },

  /**
   * Get platform statistics for Admin dashboard
   */
  getAdminStats: async () => {
    const response = await api.get('/admin/stats');
    return response.data;
  },
};

export default adminService;
