import { createSlice } from '@reduxjs/toolkit';
import { PROJECTS } from '../constants/data';

const initialState = {
  list: PROJECTS,
  selected: null,
  loading: false,
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
});

export const { setProjects, selectProject, addProject, updateProject, deleteProject, setFilter, setLoading } = projectSlice.actions;
export default projectSlice.reducer;
