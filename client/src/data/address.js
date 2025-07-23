// data/address.js
import axiosInstance from '@/config/axiosConfig';
import { asyncHandler } from '@/utils';

const baseURL = '/address';

export const getAllAddress = () =>
  asyncHandler(() => axiosInstance.get(baseURL), 'Fetch address messages failed');

export const deleteAddress = (id) =>
  asyncHandler(() => axiosInstance.delete(`${baseURL}/${id}`), 'Delete address message failed');

export const getAddress = () =>
  asyncHandler(() => axiosInstance.get(baseURL), 'Fetch address info failed');

export const updateAddress = (data) =>
  asyncHandler(() => axiosInstance.put(baseURL, data), 'Update address info failed');
