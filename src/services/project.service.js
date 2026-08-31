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
  addMember: async (projectId, userId) => {
    return await api.post(`/projects/${projectId}/members`, { userId });
  },
  addMembers: async (projectId, userIds) => {
    return await api.post(`/projects/${projectId}/members`, { userIds });
  },
  removeMember: async (projectId, userId) => {
    return await api.delete(`/projects/${projectId}/members/${userId}`);
  },
};

export default projectService;

