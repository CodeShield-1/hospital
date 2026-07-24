import axios from 'axios';

const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:5000';
const APPOINTMENT_API = process.env.REACT_APP_APPOINTMENT_URL || 'http://localhost:5001';

// Main API client
const api = axios.create({
  baseURL: API_BASE,
  headers: { 'Content-Type': 'application/json' }
});

// Appointment microservice client
const appointmentApi = axios.create({
  baseURL: APPOINTMENT_API,
  headers: { 'Content-Type': 'application/json' }
});

// Attach token to all requests
const attachToken = (config) => {
  const token = localStorage.getItem('hms_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
};

api.interceptors.request.use(attachToken);
appointmentApi.interceptors.request.use(attachToken);

// Response error handler
const handleError = (error) => {
  if (error.response?.status === 401 || error.response?.status === 403) {
    localStorage.removeItem('hms_token');
    localStorage.removeItem('hms_role');
    window.location.href = '/login';
  }
  return Promise.reject(error);
};

api.interceptors.response.use(response => response, handleError);
appointmentApi.interceptors.response.use(response => response, handleError);

export { appointmentApi };
export default api;

