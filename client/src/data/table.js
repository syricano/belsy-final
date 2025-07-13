import axiosInstance from '@/config/axiosConfig';
import { asyncHandler } from '@/utils';

export const addTable = (data) =>
  asyncHandler(() => axiosInstance.post('/tables', data), 'Create table failed');

export const updateTable = (id, data) =>
  asyncHandler(() => axiosInstance.put(`/tables/${id}`, data), 'Update table failed');

export const deleteTable = (id) =>
  asyncHandler(() => axiosInstance.delete(`/tables/${id}`), 'Delete table failed');

export const getTables = () =>
  asyncHandler(() => axiosInstance.get('/tables'), 'Fetch tables failed');
