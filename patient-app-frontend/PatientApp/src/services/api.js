import axios from 'axios';

const API_URL = 'http://10.0.2.2:8080/api'; // Android emulator ke liye
// const API_URL = 'http://localhost:8080/api'; // iOS ke liye

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const authAPI = {
  signup: (data) => api.post('/auth/signup', data),
  login: (data) => api.post('/auth/login', data),
};

export const userAPI = {
  getProfile: () => api.get('/users/profile'),
   updateProfile: (data) => api.put('/users/profile', data),
};

export default api;