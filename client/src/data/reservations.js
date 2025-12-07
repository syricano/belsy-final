// data/reservation.js
import axiosInstance from '@/config/axiosConfig';

const baseURL = '/reservations';

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

// Create a reservation
export const createReservation = (payload, isGuest = false) =>
  handleRequest(() =>
    axiosInstance.post(baseURL, payload, isGuest
      ? { headers: { Authorization: undefined } }
      : undefined
    ), 'Reservation failed'
  );

// Get current user's reservations
export const getMyReservations = () =>
  handleRequest(() => axiosInstance.get(`${baseURL}/mine`), 'Failed to fetch reservations');

// Suggest tables
export const suggestTables = (payload) =>
  handleRequest(() => axiosInstance.post(`${baseURL}/suggest-tables`, payload), 'Suggestion failed');

// Admin: get all reservations
export const getAllReservations = () =>
  handleRequest(() => axiosInstance.get(`${baseURL}/admin`), 'Failed to fetch admin reservations');

// Cancel reservation (sets status to "Cancelled")
export const cancelReservation = (id, contactInfo = {}) =>
  handleRequest(() =>
    axiosInstance.patch(`${baseURL}/${id}/cancel`, contactInfo), 'Cancel failed');

// Update reservation (guest/date/time/note)
export const updateReservation = (id, data) =>
  handleRequest(() => axiosInstance.patch(`${baseURL}/${id}`, data), 'Update failed');

// Admin: approve reservation
export const approveReservation = (id, message = 'Approved by admin') =>
  handleRequest(
    () => axiosInstance.patch(`${baseURL}/admin/${id}/approve`, { adminResponse: message }),
    'Approval failed'
  );

// Admin: decline reservation
export const declineReservation = (id, message = 'Declined by admin') =>
  handleRequest(
    () => axiosInstance.patch(`${baseURL}/admin/${id}/decline`, { adminResponse: message }),
    'Decline failed'
  );
