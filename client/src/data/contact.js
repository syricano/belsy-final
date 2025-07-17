// data/contact.js
import axiosInstance from '@/config/axiosConfig';
import { asyncHandler } from '@/utils';

const baseURL = '/api/contact';

export const getAllContacts = () =>
  asyncHandler(() => axiosInstance.get(baseURL), 'Fetch contact messages failed');

export const deleteContact = (id) =>
  asyncHandler(() => axiosInstance.delete(`${baseURL}/${id}`), 'Delete contact message failed');

export const getContactInfo = () =>
  asyncHandler(() => axiosInstance.get(baseURL), 'Fetch contact info failed');

export const updateContactInfo = (data) =>
  asyncHandler(() => axiosInstance.put(baseURL, data), 'Update contact info failed');
