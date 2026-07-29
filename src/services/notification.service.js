import api from './api';
import { NOTIFICATIONS } from '../constants/data';

const STORAGE_KEY = 'sprintflow_notifications';

const getStoredNotifications = () => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (e) {
    // ignore
  }
  // Initialize default mock notifications in localStorage if empty
  localStorage.setItem(STORAGE_KEY, JSON.stringify(NOTIFICATIONS));
  return NOTIFICATIONS;
};

const saveStoredNotifications = (notifications) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(notifications));
  } catch (e) {
    // ignore
  }
};

export const notificationService = {
  getNotifications: async () => {
    try {
      const data = await api.get('/notifications');
      saveStoredNotifications(data);
      return data;
    } catch (err) {
      return getStoredNotifications();
    }
  },

  markAsRead: async (id) => {
    try {
      await api.patch(`/notifications/${id}/read`);
    } catch (e) {
      // ignore
    }
    const current = getStoredNotifications();
    const updated = current.map((n) => (n.id === id ? { ...n, isRead: true } : n));
    saveStoredNotifications(updated);
    return { id, isRead: true };
  },

  markAllAsRead: async () => {
    try {
      await api.patch('/notifications/mark-all-read');
    } catch (e) {
      // ignore
    }
    const current = getStoredNotifications();
    const updated = current.map((n) => ({ ...n, isRead: true }));
    saveStoredNotifications(updated);
    return updated;
  },

  deleteNotification: async (id) => {
    try {
      await api.delete(`/notifications/${id}`);
    } catch (e) {
      // ignore
    }
    const current = getStoredNotifications();
    const updated = current.filter((n) => n.id !== id);
    saveStoredNotifications(updated);
    return id;
  },
};

export default notificationService;
