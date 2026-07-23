import api from './api';

export const notificationService = {
  getNotifications: async () => {
    return await api.get('/notifications');
  },
  markAsRead: async (id) => {
    return await api.patch(`/notifications/${id}/read`);
  },
  markAllAsRead: async () => {
    return await api.patch('/notifications/mark-all-read');
  },
  deleteNotification: async (id) => {
    return await api.delete(`/notifications/${id}`);
  },
};

export default notificationService;
