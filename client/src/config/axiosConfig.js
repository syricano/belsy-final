import axios from 'axios';

const isDev = import.meta.env.MODE === 'development';
const baseURL = isDev ? '/api' : (import.meta.env.VITE_API_BASE_URL || '/api');

const axiosInstance = axios.create({
  baseURL,
  withCredentials: true, // rely on httpOnly auth cookies
});

export default axiosInstance;
