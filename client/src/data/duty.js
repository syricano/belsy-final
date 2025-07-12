// /data/duty.js
import axiosInstance from '@/config/axiosConfig';

const baseURL = '/duty';

export const getAllDutyHours = () =>
  axiosInstance.get(baseURL); // already returns ordered by ID
