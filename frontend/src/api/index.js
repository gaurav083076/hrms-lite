import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5009';

const api = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

export const getEmployees = () => api.get('/api/employees');
export const createEmployee = (data) => api.post('/api/employees', data);
export const deleteEmployee = (employeeId) => api.delete(`/api/employees/${employeeId}`);
export const getAttendance = (params = {}) => api.get('/api/attendance', { params });
export const markAttendance = (data) => api.post('/api/attendance', data);
export const getAttendanceSummary = () => api.get('/api/attendance/summary');

export default api;