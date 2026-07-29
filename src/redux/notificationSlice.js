import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import notificationService from '../services/notification.service';

const saveToStorage = (list) => {
  try {
    localStorage.setItem('sprintflow_notifications', JSON.stringify(list));
  } catch (e) {
    // ignore
  }
};

export const fetchNotifications = createAsyncThunk('notifications/fetchNotifications', async () => {
  return await notificationService.getNotifications();
});

export const markAsReadAsync = createAsyncThunk('notifications/markAsRead', async (id) => {
  return await notificationService.markAsRead(id);
});

export const markAllAsReadAsync = createAsyncThunk('notifications/markAllAsRead', async () => {
  return await notificationService.markAllAsRead();
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
      saveToStorage(state.list);
    },
    markAllAsRead: (state) => {
      state.list.forEach((n) => (n.isRead = true));
      state.unreadCount = 0;
      saveToStorage(state.list);
    },
    addNotification: (state, action) => {
      state.list.unshift(action.payload);
      if (!action.payload.isRead) state.unreadCount += 1;
      saveToStorage(state.list);
    },
    deleteNotification: (state, action) => {
      const notif = state.list.find((n) => n.id === action.payload);
      if (notif && !notif.isRead) state.unreadCount = Math.max(0, state.unreadCount - 1);
      state.list = state.list.filter((n) => n.id !== action.payload);
      saveToStorage(state.list);
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
        saveToStorage(state.list);
      })
      .addCase(markAllAsReadAsync.fulfilled, (state) => {
        state.list.forEach((n) => (n.isRead = true));
        state.unreadCount = 0;
        saveToStorage(state.list);
      })
      .addCase(deleteNotificationAsync.fulfilled, (state, action) => {
        const notif = state.list.find((n) => n.id === action.payload);
        if (notif && !notif.isRead) state.unreadCount = Math.max(0, state.unreadCount - 1);
        state.list = state.list.filter((n) => n.id !== action.payload);
        saveToStorage(state.list);
      });
  },
});

export const { markAsRead, markAllAsRead, addNotification, deleteNotification } = notificationSlice.actions;
export default notificationSlice.reducer;
