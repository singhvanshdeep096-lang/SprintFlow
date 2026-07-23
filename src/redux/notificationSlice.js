import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import notificationService from '../services/notification.service';

export const fetchNotifications = createAsyncThunk('notifications/fetchNotifications', async () => {
  return await notificationService.getNotifications();
});

export const markAsReadAsync = createAsyncThunk('notifications/markAsRead', async (id) => {
  return await notificationService.markAsRead(id);
});

export const markAllAsReadAsync = createAsyncThunk('notifications/markAllAsRead', async () => {
  await notificationService.markAllAsRead();
});

export const deleteNotificationAsync = createAsyncThunk('notifications/deleteNotification', async (id) => {
  await notificationService.deleteNotification(id);
  return id;
});

const initialState = {
  list: [],
  unreadCount: 0,
  loading: false,
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
  extraReducers: (builder) => {
    builder
      .addCase(fetchNotifications.fulfilled, (state, action) => {
        state.list = action.payload;
        state.unreadCount = action.payload.filter((n) => !n.isRead).length;
      })
      .addCase(markAsReadAsync.fulfilled, (state, action) => {
        const idx = state.list.findIndex((n) => n.id === action.payload.id);
        if (idx !== -1 && !state.list[idx].isRead) {
          state.list[idx].isRead = true;
          state.unreadCount = Math.max(0, state.unreadCount - 1);
        }
      })
      .addCase(markAllAsReadAsync.fulfilled, (state) => {
        state.list.forEach((n) => (n.isRead = true));
        state.unreadCount = 0;
      })
      .addCase(deleteNotificationAsync.fulfilled, (state, action) => {
        const notif = state.list.find((n) => n.id === action.payload);
        if (notif && !notif.isRead) state.unreadCount = Math.max(0, state.unreadCount - 1);
        state.list = state.list.filter((n) => n.id !== action.payload);
      });
  },
});

export const { markAsRead, markAllAsRead, addNotification, deleteNotification } = notificationSlice.actions;
export default notificationSlice.reducer;
