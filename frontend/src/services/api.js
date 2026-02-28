import axios from 'axios';
import { supabase } from '@/lib/supabase';

// const API_BASE = import.meta.env.VITE_API_URL || '/api';
const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE,
  headers: { 'Content-Type': 'application/json' },
});

// Attach Supabase session token to every request (when Supabase is configured)
api.interceptors.request.use(async (config) => {
  if (supabase) {
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.access_token) {
      config.headers.Authorization = `Bearer ${session.access_token}`;
    }
  }
  return config;
});

export const setUserId = (userId) => {
  if (userId) api.defaults.headers.common['x-user-id'] = userId;
  else delete api.defaults.headers.common['x-user-id'];
};

// Events
export const eventsApi = {
  list: (params) => api.get('/events', { params }),
  create: (data) => api.post('/events', data),
  update: (id, data) => api.put(`/events/${id}`, data),
  delete: (id) => api.delete(`/events/${id}`),
};

// Tasks
export const tasksApi = {
  list: (params) => api.get('/tasks', { params }),
  create: (data) => api.post('/tasks', data),
  update: (id, data) => api.put(`/tasks/${id}`, data),
  reorder: (items) => api.post('/tasks/reorder', { items }),
  delete: (id) => api.delete(`/tasks/${id}`),
};

// Journal
// export const journalApi = {
//   list: (params) => api.get('/journal', { params }),
//   getByDate: (date) => api.get(`/journal/date/${date}`),
//   save: (data) => api.post('/journal', data),
//   delete: (id) => api.delete(`/journal/${id}`),
// };
export const journalApi = {
  list: () => api.get('/journal'),
  getByDate: (date) => api.get(`/journal/date/${date}`),
  save: (data) => api.post('/journal', data),
  delete: (id) => api.delete(`/journal/${id}`)
};
// Goals
export const goalsApi = {
  list: (params) => api.get('/goals', { params }),
  create: (data) => api.post('/goals', data),
  update: (id, data) => api.put(`/goals/${id}`, data),
  delete: (id) => api.delete(`/goals/${id}`),
};

// Mood
export const moodApi = {
  list: (params) => api.get('/mood', { params }),
  log: (data) => api.post('/mood', data),
  delete: (id) => api.delete(`/mood/${id}`),
};

// Habits
export const habitsApi = {
  list: () => api.get('/habits'),
  completions: (params) => api.get('/habits/completions', { params }),
  create: (data) => api.post('/habits', data),
  toggle: (data) => api.post('/habits/toggle', data),
  update: (id, data) => api.put(`/habits/${id}`, data),
  delete: (id) => api.delete(`/habits/${id}`),
};

// Reminders
export const remindersApi = {
  list: (params) => api.get('/reminders', { params }),
  create: (data) => api.post('/reminders', data),
  update: (id, data) => api.put(`/reminders/${id}`, data),
  delete: (id) => api.delete(`/reminders/${id}`),
};

// Settings
export const settingsApi = {
  get: () => api.get('/settings'),
  update: (data) => api.put('/settings', data),
};

export default api;
