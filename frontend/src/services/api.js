import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Patient API
export const patientAPI = {
  getAll: (params) => api.get('/patients', { params }),
  getById: (id) => api.get(`/patients/${id}`),
  create: (data) => api.post('/patients', data),
  update: (id, data) => api.put(`/patients/${id}`, data),
  delete: (id) => api.delete(`/patients/${id}`),
  completeFollowUp: (id) => api.patch(`/patients/${id}/complete`),
  getDueToday: () => api.get('/patients/due-today'),
  getStats: () => api.get('/patients/stats'),
};

// Message Draft API
export const messageDraftAPI = {
  generate: (id) => api.post(`/message-drafts/${id}/generate`),
  getByPatientId: (id) => api.get(`/message-drafts/${id}`),
  update: (id, data) => api.put(`/message-drafts/${id}`, data),
  approve: (id) => api.post(`/message-drafts/${id}/approve`),
  reject: (id) => api.post(`/message-drafts/${id}/reject`),
};

export default api;
