import api from './api';

export const authService = {
  login: async (credentials) => {
    const data = await api.post('/auth/login', credentials);
    if (data.access_token) {
      localStorage.setItem('sprintflow_token', data.access_token);
    }
    return data;
  },
  register: async (userData) => {
    const data = await api.post('/auth/register', userData);
    if (data.access_token) {
      localStorage.setItem('sprintflow_token', data.access_token);
    }
    return data;
  },
  getCurrentUser: async () => {
    return await api.get('/auth/me');
  },
  logout: () => {
    localStorage.removeItem('sprintflow_token');
  },
};

export default authService;
