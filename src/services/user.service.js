import api from './api';

export const userService = {
  getUsers: async () => {
    return await api.get('/users');
  },
};

export default userService;
