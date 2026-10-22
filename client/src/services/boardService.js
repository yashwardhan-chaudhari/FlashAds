import api from './api';
import { mockBoards } from '../data/mockBoards';

/**
 * FlashAds Board API Service
 */
export const boardService = {
  /**
   * Get all approved boards for public marketplace explore
   * @param {object} params - query parameters (city, area, boardType, trafficLevel, maxPrice, search, sort, page, limit)
   */
  getPublicBoards: async (params = {}) => {
    try {
      const response = await api.get('/boards', { params });
      if (response.data && response.data.boards && response.data.boards.length > 0) {
        return response.data;
      }
    } catch (error) {
      console.warn('API /boards failed, using mock data fallback:', error.message);
    }
    // Fallback to client mock data
    return {
      success: true,
      count: mockBoards.length,
      total: mockBoards.length,
      page: 1,
      pages: 1,
      boards: mockBoards,
    };
  },

  /**
   * Get single board details by ID
   * @param {string} id - Board ID
   */
  getBoardById: async (id) => {
    try {
      const response = await api.get(`/boards/${id}`);
      if (response.data && response.data.board) {
        return response.data.board;
      }
    } catch (error) {
      console.warn(`API /boards/${id} failed, using mock data fallback:`, error.message);
    }
    // Fallback to finding in mockBoards
    return mockBoards.find((b) => b.id === id || b._id === id) || mockBoards[0];
  },

  /**
   * Get all boards owned by the logged-in advertiser
   */
  getMyBoards: async () => {
    const response = await api.get('/boards/mine');
    return response.data;
  },

  /**
   * Create a new advertising board listing
   * @param {object} boardData - Board payload
   */
  createBoard: async (boardData) => {
    const response = await api.post('/boards', boardData);
    return response.data;
  },

  /**
   * Update an owned board
   * @param {string} id - Board ID
   * @param {object} boardData - Updated fields
   */
  updateBoard: async (id, boardData) => {
    const response = await api.put(`/boards/${id}`, boardData);
    return response.data;
  },

  /**
   * Toggle board availability (Approved <-> Unavailable)
   * @param {string} id - Board ID
   */
  toggleAvailability: async (id) => {
    const response = await api.patch(`/boards/${id}/availability`);
    return response.data;
  },

  /**
   * Delete an owned board
   * @param {string} id - Board ID
   */
  deleteBoard: async (id) => {
    const response = await api.delete(`/boards/${id}`);
    return response.data;
  },

  /**
   * Upload an image file to the server (Cloudinary or local data URI)
   * @param {File} file - Browser File object
   */
  uploadImage: async (file) => {
    const formData = new FormData();
    formData.append('images', file);

    const response = await api.post('/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },
};

export default boardService;
