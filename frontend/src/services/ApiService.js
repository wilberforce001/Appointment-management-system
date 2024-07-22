// Connect Frontend to Backend
import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'http://localhost:5000',
  headers: {
    'Content-Type': 'application/json',
  },
});

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
};
