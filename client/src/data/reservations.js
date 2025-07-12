import axiosInstance from '@/config/axiosConfig';

const baseURL = '/reservations';
const handleRequest = async (callback, errorMsg) => {
  try {
    const res = await callback();
    return res.data;
  } catch (error) {
    const msg = error.response?.data?.error || errorMsg || error.message;
    console.error(msg);
    throw new Error(msg);
  }
};

// Create a reservation
export const createReservation = (payload) =>
  handleRequest(() => axiosInstance.post(`${baseURL}`, payload), 'Reservation failed');

// Get current user's reservations
export const getMyReservations = () =>
  handleRequest(() => axiosInstance.get(`${baseURL}/mine`), 'Failed to fetch reservations');

// Suggest tables (optional feature)
export const suggestTables = (payload) =>
  handleRequest(() => axiosInstance.post(`${baseURL}/suggest-tables`, payload), 'Suggestion failed');

// Admin: get all reservations
export const getAllReservations = () =>
  handleRequest(() => axiosInstance.get(`${baseURL}/admin`), 'Failed to fetch admin reservations');

// Admin: approve reservation
export const approveReservation = (id) =>
  handleRequest(() => axiosInstance.patch(`${baseURL}/admin/${id}/approve`), 'Approval failed');

// Admin: decline reservation
export const declineReservation = (id) =>
  handleRequest(() => axiosInstance.patch(`${baseURL}/admin/${id}/decline`), 'Decline failed');
