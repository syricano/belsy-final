// data/duty.js
import axiosInstance from '@/config/axiosConfig';
import { asyncHandler } from '@/utils';

const baseURL = '/api/duty';

// ========== GET all duties ==========
export const getAllDutyHours = () =>
  asyncHandler(() => axiosInstance.get(baseURL), 'Failed to fetch working hours');

// ========== POST new duty ==========
export const addDutyHour = (data) =>
  asyncHandler(() => axiosInstance.post(baseURL, data), 'Failed to create working hour');

// ========== PUT update duty ==========
export const updateDutyHour = (id, data) =>
  asyncHandler(() => axiosInstance.put(`${baseURL}/${id}`, data), 'Failed to update working hour');

// ========== DELETE duty ==========
export const deleteDutyHour = (id) =>
  asyncHandler(() => axiosInstance.delete(`${baseURL}/${id}`), 'Failed to delete working hour');
