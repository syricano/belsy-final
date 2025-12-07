import axios from 'axios';

const isDev = import.meta.env.MODE === 'development';
const baseURL = isDev ? '/api' : (import.meta.env.VITE_API_BASE_URL || '/api');

const axiosInstance = axios.create({
  baseURL,
  withCredentials: true, // rely on httpOnly auth cookies
});

if (typeof window !== 'undefined') {
  const savedLang = localStorage.getItem('belsy_lang');
  if (savedLang) {
    axiosInstance.defaults.headers.common['Accept-Language'] = savedLang;
  }
}

export default axiosInstance;
