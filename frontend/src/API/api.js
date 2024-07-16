// src/api.js
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000', 
  headers: {
    'Content-Type': 'application/json',
  },
});

export const updateUserProfile = (user) => {
  return api.put('/components/UserProfile', user); 
};

export default api;
