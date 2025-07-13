import axios from 'axios';


const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_APP_BELSY_API_URL || 'http://localhost:3000/api',
  withCredentials: true,    
});

axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');

  // Clear any stale or empty auth headers first
  delete config.headers.Authorization;

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default axiosInstance;
