import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import taskService from '../services/task.service';

export const fetchTasks = createAsyncThunk('tasks/fetchTasks', async () => {
  return await taskService.getTasks();
});

export const addTaskAsync = createAsyncThunk('tasks/addTask', async (data) => {
  return await taskService.createTask(data);
});

export const updateTaskAsync = createAsyncThunk('tasks/updateTask', async ({ id, data }) => {
  return await taskService.updateTask(id, data);
});

export const updateTaskStatusAsync = createAsyncThunk('tasks/updateTaskStatus', async ({ taskId, status }) => {
  return await taskService.updateTaskStatus(taskId, status);
});

export const deleteTaskAsync = createAsyncThunk('tasks/deleteTask', async (id) => {
  await taskService.deleteTask(id);
  return id;
});

const initialState = {
  list: [],
  selected: null,
  isDrawerOpen: false,
  loading: false,
  error: null,
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
  extraReducers: (builder) => {
    builder
      .addCase(fetchTasks.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchTasks.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(fetchTasks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(addTaskAsync.fulfilled, (state, action) => {
        state.list.unshift(action.payload);
      })
      .addCase(updateTaskAsync.fulfilled, (state, action) => {
        const idx = state.list.findIndex((t) => t.id === action.payload.id);
        if (idx !== -1) state.list[idx] = action.payload;
        if (state.selected?.id === action.payload.id) state.selected = action.payload;
      })
      .addCase(updateTaskStatusAsync.fulfilled, (state, action) => {
        const idx = state.list.findIndex((t) => t.id === action.payload.id);
        if (idx !== -1) state.list[idx] = action.payload;
        if (state.selected?.id === action.payload.id) state.selected = action.payload;
      })
      .addCase(deleteTaskAsync.fulfilled, (state, action) => {
        state.list = state.list.filter((t) => t.id !== action.payload);
        if (state.selected?.id === action.payload) {
          state.selected = null;
          state.isDrawerOpen = false;
        }
      });
  },
});

export const {
  setTasks, selectTask, openTaskDrawer, closeTaskDrawer,
  addTask, updateTask, updateTaskStatus, deleteTask, setFilter, setLoading,
} = taskSlice.actions;

export default taskSlice.reducer;
