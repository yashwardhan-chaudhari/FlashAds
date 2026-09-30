import api from './api';

export const favoriteService = {
  toggleFavorite: async (boardId) => {
    const response = await api.post(`/favorites/${boardId}`);
    return response.data;
  },

  getUserFavorites: async () => {
    const response = await api.get('/favorites');
    return response.data;
  },

  checkIsFavorited: async (boardId) => {
    const response = await api.get(`/favorites/check/${boardId}`);
    return response.data;
  },
};

export default favoriteService;
