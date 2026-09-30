import api from './api';

export const adminService = {
  getAdminStats: async () => {
    const response = await api.get('/admin/stats');
    return response.data;
  },

  getPendingBoards: async () => {
    const response = await api.get('/admin/boards/pending');
    return response.data;
  },

  getAllBoards: async (params = {}) => {
    const response = await api.get('/admin/boards', { params });
    return response.data;
  },

  approveBoard: async (boardId) => {
    const response = await api.patch(`/admin/boards/${boardId}/approve`);
    return response.data;
  },

  rejectBoard: async (boardId, reason) => {
    const response = await api.patch(`/admin/boards/${boardId}/reject`, { reason });
    return response.data;
  },

  getAllUsers: async () => {
    const response = await api.get('/admin/users');
    return response.data;
  },

  toggleUserStatus: async (userId) => {
    const response = await api.patch(`/admin/users/${userId}/toggle-status`);
    return response.data;
  },

  getAllBookings: async () => {
    const response = await api.get('/admin/bookings');
    return response.data;
  },
};

export default adminService;
