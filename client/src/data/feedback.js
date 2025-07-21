// src/data/feedback.js
import axiosInstance from '@/config/axiosConfig';

const baseURL = '/feedback';

const handleRequest = async (callback, errorMsg) => {
  try {
    const res = await callback();
    return res.data;
  } catch (error) {
    const msg =
      error.response?.data?.error ||
      error.response?.data?.message ||
      error.message ||
      errorMsg;
    throw new Error(msg);
  }
};

// Get all feedbacks (admin)
export const getAllFeedback = () =>
  handleRequest(() => axiosInstance.get(baseURL), 'Failed to fetch feedback');

// Create feedback (guest or user)
export const createFeedback = (data) =>
  handleRequest(() => axiosInstance.post(baseURL, data), 'Failed to submit feedback');

// Get my feedback (user only)
export const getMyFeedback = () =>
  handleRequest(() => axiosInstance.get(`${baseURL}/my`), 'Failed to fetch your feedback');

// Update feedback
export const updateFeedback = (id, data) =>
  handleRequest(() => axiosInstance.put(`${baseURL}/${id}`, data), 'Update failed');

// Delete feedback
export const deleteFeedback = (id) =>
  handleRequest(() => axiosInstance.delete(`${baseURL}/${id}`), 'Delete failed');
