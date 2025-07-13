import axiosInstance from '@/config/axiosConfig';
import { asyncHandler } from '@/utils';

export const getAllContacts = () =>
  asyncHandler(() => axiosInstance.get('/contact'), 'Fetch contact messages failed');

export const deleteContact = (id) =>
  asyncHandler(() => axiosInstance.delete(`/contact/${id}`), 'Delete contact message failed');

// 🔧 Add this for updating public contact info:
export const getContactInfo = () =>
  asyncHandler(() => axiosInstance.get('/contact'), 'Fetch contact info failed');

export const updateContactInfo = (data) =>
  asyncHandler(() => axiosInstance.put('/contact', data), 'Update contact info failed');
