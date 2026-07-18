import { createSlice } from '@reduxjs/toolkit';
import { NOTIFICATIONS } from '../constants/data';

const initialState = {
  list: NOTIFICATIONS,
  unreadCount: NOTIFICATIONS.filter((n) => !n.isRead).length,
};

const notificationSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    markAsRead: (state, action) => {
      const notif = state.list.find((n) => n.id === action.payload);
      if (notif && !notif.isRead) {
        notif.isRead = true;
        state.unreadCount = Math.max(0, state.unreadCount - 1);
      }
    },
    markAllAsRead: (state) => {
      state.list.forEach((n) => (n.isRead = true));
      state.unreadCount = 0;
    },
    addNotification: (state, action) => {
      state.list.unshift(action.payload);
      if (!action.payload.isRead) state.unreadCount += 1;
    },
    deleteNotification: (state, action) => {
      const notif = state.list.find((n) => n.id === action.payload);
      if (notif && !notif.isRead) state.unreadCount = Math.max(0, state.unreadCount - 1);
      state.list = state.list.filter((n) => n.id !== action.payload);
    },
  },
});

export const { markAsRead, markAllAsRead, addNotification, deleteNotification } = notificationSlice.actions;
export default notificationSlice.reducer;
