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
  }
};

// Create a reservation
export const createReservation = (payload) =>
  handleRequest(() => axiosInstance.post(`${baseURL}`, payload), 'Reservation failed');

// Get current user's reservations
export const getMyReservations = () =>
  handleRequest(() => axiosInstance.get(`${baseURL}/mine`), 'Failed to fetch reservations');

// Suggest tables (optional feature)
export const suggestTables = async (payload) =>
  handleRequest(() => axiosInstance.post('/reservations/suggest-tables', payload));


// Admin: get all reservations
export const getAllReservations = () =>
  handleRequest(() => axiosInstance.get(`${baseURL}/admin`), 'Failed to fetch admin reservations');

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