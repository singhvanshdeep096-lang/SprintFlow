import api from './api';

export const projectService = {
  getProjects: async () => {
    return await api.get('/projects');
  },
  getProjectById: async (id) => {
    return await api.get(`/projects/${id}`);
  },
  createProject: async (data) => {
    return await api.post('/projects', data);
  },
  updateProject: async (id, data) => {
    return await api.put(`/projects/${id}`, data);
  },
  deleteProject: async (id) => {
    return await api.delete(`/projects/${id}`);
  },
};

export default projectService;
