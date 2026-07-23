import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import projectService from '../services/project.service';

export const fetchProjects = createAsyncThunk('projects/fetchProjects', async () => {
  return await projectService.getProjects();
});

export const addProjectAsync = createAsyncThunk('projects/addProject', async (data) => {
  return await projectService.createProject(data);
});

export const updateProjectAsync = createAsyncThunk('projects/updateProject', async ({ id, data }) => {
  return await projectService.updateProject(id, data);
});

export const deleteProjectAsync = createAsyncThunk('projects/deleteProject', async (id) => {
  await projectService.deleteProject(id);
  return id;
});

const initialState = {
  list: [],
  selected: null,
  loading: false,
  error: null,
  filter: { status: 'all', priority: 'all', search: '' },
};

const projectSlice = createSlice({
  name: 'projects',
  initialState,
  reducers: {
    setProjects: (state, action) => {
      state.list = action.payload;
    },
    selectProject: (state, action) => {
      state.selected = action.payload;
    },
    addProject: (state, action) => {
      state.list.unshift(action.payload);
    },
    updateProject: (state, action) => {
      const idx = state.list.findIndex((p) => p.id === action.payload.id);
      if (idx !== -1) state.list[idx] = { ...state.list[idx], ...action.payload };
    },
    deleteProject: (state, action) => {
      state.list = state.list.filter((p) => p.id !== action.payload);
      if (state.selected?.id === action.payload) state.selected = null;
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
      .addCase(fetchProjects.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchProjects.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
        if (!state.selected && action.payload.length > 0) {
          state.selected = action.payload[0];
        }
      })
      .addCase(fetchProjects.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(addProjectAsync.fulfilled, (state, action) => {
        state.list.unshift(action.payload);
      })
      .addCase(updateProjectAsync.fulfilled, (state, action) => {
        const idx = state.list.findIndex((p) => p.id === action.payload.id);
        if (idx !== -1) state.list[idx] = action.payload;
        if (state.selected?.id === action.payload.id) state.selected = action.payload;
      })
      .addCase(deleteProjectAsync.fulfilled, (state, action) => {
        state.list = state.list.filter((p) => p.id !== action.payload);
        if (state.selected?.id === action.payload) state.selected = null;
      });
  },
});

export const { setProjects, selectProject, addProject, updateProject, deleteProject, setFilter, setLoading } = projectSlice.actions;
export default projectSlice.reducer;
