import { createSlice } from '@reduxjs/toolkit';
import { WORKSPACES } from '../constants/data';

const initialState = {
  list: WORKSPACES,
  selected: null,
  loading: false,
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
});

export const { setWorkspaces, selectWorkspace, addWorkspace, updateWorkspace, deleteWorkspace, setLoading } = workspaceSlice.actions;
export default workspaceSlice.reducer;
