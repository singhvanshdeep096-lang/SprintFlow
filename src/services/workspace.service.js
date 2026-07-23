import api from './api';

export const workspaceService = {
  getWorkspaces: async () => {
    return await api.get('/workspaces');
  },
  getWorkspaceById: async (id) => {
    return await api.get(`/workspaces/${id}`);
  },
  createWorkspace: async (data) => {
    return await api.post('/workspaces', data);
  },
  updateWorkspace: async (id, data) => {
    return await api.put(`/workspaces/${id}`, data);
  },
  deleteWorkspace: async (id) => {
    return await api.delete(`/workspaces/${id}`);
  },
};

export default workspaceService;
