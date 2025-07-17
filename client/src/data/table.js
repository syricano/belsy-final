// data/table.js
import axiosInstance from '@/config/axiosConfig';
import { asyncHandler } from '@/utils';

const baseURL = '/api/tables';

export const addTable = (data) =>
  asyncHandler(() => axiosInstance.post(baseURL, data), 'Create table failed');

export const updateTable = (id, data) =>
  asyncHandler(() => axiosInstance.put(`${baseURL}/${id}`, data), 'Update table failed');

export const deleteTable = (id) =>
  asyncHandler(() => axiosInstance.delete(`${baseURL}/${id}`), 'Delete table failed');

export const getTables = () =>
  asyncHandler(() => axiosInstance.get(baseURL), 'Fetch tables failed');
