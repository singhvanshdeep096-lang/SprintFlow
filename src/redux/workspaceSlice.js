import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import workspaceService from '../services/workspace.service';

export const fetchWorkspaces = createAsyncThunk('workspaces/fetchWorkspaces', async () => {
  return await workspaceService.getWorkspaces();
});

export const addWorkspaceAsync = createAsyncThunk('workspaces/addWorkspace', async (data) => {
  return await workspaceService.createWorkspace(data);
});

export const updateWorkspaceAsync = createAsyncThunk('workspaces/updateWorkspace', async ({ id, data }) => {
  return await workspaceService.updateWorkspace(id, data);
});

export const deleteWorkspaceAsync = createAsyncThunk('workspaces/deleteWorkspace', async (id) => {
  await workspaceService.deleteWorkspace(id);
  return id;
});

const initialState = {
  list: [],
  selected: null,
  loading: false,
  error: null,
};

const workspaceSlice = createSlice({
  name: 'workspaces',
  initialState,
  reducers: {
    setWorkspaces: (state, action) => {
      state.list = action.payload;
    },
    selectWorkspace: (state, action) => {
      state.selected = action.payload;
    },
    addWorkspace: (state, action) => {
      state.list.unshift(action.payload);
    },
    updateWorkspace: (state, action) => {
      const idx = state.list.findIndex((w) => w.id === action.payload.id);
      if (idx !== -1) state.list[idx] = { ...state.list[idx], ...action.payload };
    },
    deleteWorkspace: (state, action) => {
      state.list = state.list.filter((w) => w.id !== action.payload);
      if (state.selected?.id === action.payload) state.selected = null;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchWorkspaces.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchWorkspaces.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
        if (!state.selected && action.payload.length > 0) {
          state.selected = action.payload[0];
        }
      })
      .addCase(fetchWorkspaces.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(addWorkspaceAsync.fulfilled, (state, action) => {
        state.list.unshift(action.payload);
      })
      .addCase(updateWorkspaceAsync.fulfilled, (state, action) => {
        const idx = state.list.findIndex((w) => w.id === action.payload.id);
        if (idx !== -1) state.list[idx] = action.payload;
        if (state.selected?.id === action.payload.id) state.selected = action.payload;
      })
      .addCase(deleteWorkspaceAsync.fulfilled, (state, action) => {
        state.list = state.list.filter((w) => w.id !== action.payload);
        if (state.selected?.id === action.payload) state.selected = null;
      });
  },
});

export const { setWorkspaces, selectWorkspace, addWorkspace, updateWorkspace, deleteWorkspace, setLoading } = workspaceSlice.actions;
export default workspaceSlice.reducer;
