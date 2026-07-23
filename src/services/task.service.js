import api from './api';

export const taskService = {
  getTasks: async () => {
    return await api.get('/tasks');
  },
  getTaskById: async (id) => {
    return await api.get(`/tasks/${id}`);
  },
  createTask: async (data) => {
    return await api.post('/tasks', data);
  },
  updateTask: async (id, data) => {
    return await api.put(`/tasks/${id}`, data);
  },
  updateTaskStatus: async (id, status) => {
    return await api.patch(`/tasks/${id}/status`, { status });
  },
  deleteTask: async (id) => {
    return await api.delete(`/tasks/${id}`);
  },
  getComments: async (taskId) => {
    return await api.get(`/comments/task/${taskId}`);
  },
  addComment: async (commentData) => {
    return await api.post('/comments', commentData);
  },
  deleteComment: async (commentId) => {
    return await api.delete(`/comments/${commentId}`);
  },
};

export default taskService;
