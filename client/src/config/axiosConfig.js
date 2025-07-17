import axios from 'axios';


const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ,
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
