import api from './api';

export const messageService = {
  sendMessage: async (data) => {
    const response = await api.post('/messages', data);
    return response.data;
  },

  getConversation: async (userId) => {
    const response = await api.get(`/messages/conversation/${userId}`);
    return response.data;
  },

  getConversationsList: async () => {
    const response = await api.get('/messages/conversations');
    return response.data;
  },
};

export default messageService;
