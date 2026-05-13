import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  withCredentials: true, // Crucial for JWT cookies
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a response interceptor to handle unauthorized errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Clear local storage or state if needed
      // window.location.href = '/admin/login';
    }
    return Promise.reject(error);
  }
);

export default api;
