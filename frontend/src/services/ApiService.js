// Connect Frontend to Backend
import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'http://localhost:5000',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor for the inclusion of the token in the headers
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default {
  getAppointments(config = {}) {
    return apiClient.get('/appointments', config);
  },
  createAppointment(appointment, config = {}) {
    return apiClient.post('/appointments', appointment, config);
  },
  updateAppointment(appointmentId, updatedData, config = {}) {
    return apiClient.put(`/appointments/${appointmentId}`, updatedData, config);
  },
  deleteAppointment(appointmentId, config = {}) {
    return apiClient.delete(`/appointments/${appointmentId}`, config);
  },  
  registerUser(user) {
    return apiClient.post('/users/register', user);
  },
  loginUser(credentials) {
    return apiClient.post('/users/login', credentials);
  },
  updateAppointmentStatus(appointmentId, status, config = {}) {
    return apiClient.put(`/appointments/${appointmentId}/status`, { status }, config);
  },
};
