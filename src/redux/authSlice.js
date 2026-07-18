import { createSlice } from '@reduxjs/toolkit';
import { CURRENT_USER } from '../constants/data';

const initialState = {
  isAuthenticated: false,
  user: null,
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    loginSuccess: (state, action) => {
      state.isAuthenticated = true;
      state.user = action.payload;
      state.loading = false;
      state.error = null;
    },
    loginFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.user = null;
      state.loading = false;
      state.error = null;
    },
    updateUser: (state, action) => {
      state.user = { ...state.user, ...action.payload };
    },
    clearError: (state) => {
      state.error = null;
    },
  },
});

export const { loginStart, loginSuccess, loginFailure, logout, updateUser, clearError } = authSlice.actions;

// Thunk for simulated login
export const loginAsync = (credentials) => (dispatch) => {
  dispatch(loginStart());
  // Simulate API call
  setTimeout(() => {
    dispatch(loginSuccess(CURRENT_USER));
  }, 800);
};

export const logoutAsync = () => (dispatch) => {
  dispatch(logout());
};

export default authSlice.reducer;
