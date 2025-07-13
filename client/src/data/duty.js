import axiosInstance from '@/config/axiosConfig';
import { asyncHandler } from '@/utils';

// ========== GET all duties ==========
export const getAllDutyHours = () =>
  asyncHandler(() => axiosInstance.get('/duty'), 'Failed to fetch working hours');

// ========== POST new duty ==========
export const addDutyHour = (data) =>
  asyncHandler(() => axiosInstance.post('/duty', data), 'Failed to create working hour');

// ========== PUT update duty ==========
export const updateDutyHour = (id, data) =>
  asyncHandler(() => axiosInstance.put(`/duty/${id}`, data), 'Failed to update working hour');

// ========== DELETE duty ==========
export const deleteDutyHour = (id) =>
  asyncHandler(() => axiosInstance.delete(`/duty/${id}`), 'Failed to delete working hour');
