import axios from 'axios';


const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_APP_BELSY_API_URL || 'http://localhost:3000/api',
  withCredentials: true,    
});

export default axiosInstance;
