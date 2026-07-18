import { createSlice } from '@reduxjs/toolkit';
import { TASKS } from '../constants/data';

const initialState = {
  list: TASKS,
  selected: null,
  isDrawerOpen: false,
  loading: false,
  filter: { status: 'all', priority: 'all', assignee: 'all', search: '' },
};

const taskSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    setTasks: (state, action) => {
      state.list = action.payload;
    },
    selectTask: (state, action) => {
      state.selected = action.payload;
    },
    openTaskDrawer: (state, action) => {
      state.selected = action.payload;
      state.isDrawerOpen = true;
    },
    closeTaskDrawer: (state) => {
      state.isDrawerOpen = false;
      state.selected = null;
    },
    addTask: (state, action) => {
      state.list.unshift(action.payload);
    },
    updateTask: (state, action) => {
      const idx = state.list.findIndex((t) => t.id === action.payload.id);
      if (idx !== -1) state.list[idx] = { ...state.list[idx], ...action.payload };
    },
    updateTaskStatus: (state, action) => {
      const { taskId, status } = action.payload;
      const idx = state.list.findIndex((t) => t.id === taskId);
      if (idx !== -1) {
        state.list[idx].status = status;
        state.list[idx].updatedAt = new Date().toISOString();
      }
    },
    deleteTask: (state, action) => {
      state.list = state.list.filter((t) => t.id !== action.payload);
      if (state.selected?.id === action.payload) {
        state.selected = null;
        state.isDrawerOpen = false;
      }
    },
    setFilter: (state, action) => {
      state.filter = { ...state.filter, ...action.payload };
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
  },
});

export const {
  setTasks, selectTask, openTaskDrawer, closeTaskDrawer,
  addTask, updateTask, updateTaskStatus, deleteTask, setFilter, setLoading,
} = taskSlice.actions;

export default taskSlice.reducer;
