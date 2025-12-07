import axiosInstance from '@/config/axiosConfig';

const baseURL = '/orders';

const handle = async (callback, errorMsg = 'Order request failed') => {
  try {
    const res = await callback();
    return res.data;
  } catch (error) {
    const msg = error?.response?.data?.error || error?.message || errorMsg;
    throw new Error(msg);
  }
};

export const checkoutOrder = (payload) =>
  handle(() => axiosInstance.post(`${baseURL}/checkout`, payload), 'Checkout failed');

export const getMyOrders = () =>
  handle(() => axiosInstance.get(baseURL), 'Failed to fetch orders');

export const getOrderById = (id) =>
  handle(() => axiosInstance.get(`${baseURL}/${id}`), 'Failed to fetch order details');

// Admin
export const adminGetOrders = () =>
  handle(() => axiosInstance.get('/admin/orders'), 'Failed to fetch admin orders');

export const adminGetOrderById = (id) =>
  handle(() => axiosInstance.get(`/admin/orders/${id}`), 'Failed to fetch admin order');

export const adminUpdateOrderStatus = (id, status) =>
  handle(() => axiosInstance.patch(`/admin/orders/${id}/status`, { status }), 'Failed to update order status');

export const adminUpdateOrderPayment = (id, payload) =>
  handle(() => axiosInstance.patch(`/admin/orders/${id}/payment`, payload), 'Failed to update payment');

// User payment update
export const updateOrderPayment = (id, payload) =>
  handle(() => axiosInstance.patch(`${baseURL}/${id}/payment`, payload), 'Failed to update payment');

// Stripe (simulated)
export const createStripePaymentIntent = (orderId) =>
  handle(() => axiosInstance.post('/payments/stripe/intent', { orderId }), 'Failed to start card payment');

export const confirmStripePayment = (orderId, paymentIntentId) =>
  handle(() => axiosInstance.post('/payments/stripe/confirm', { orderId, paymentIntentId }), 'Failed to confirm card payment');

// PayPal (simulated)
export const createPaypalPayment = (orderId) =>
  handle(() => axiosInstance.post('/payments/paypal/create', { orderId }), 'Failed to start PayPal payment');

export const capturePaypalPayment = (orderId, paypalOrderId) =>
  handle(() => axiosInstance.post('/payments/paypal/capture', { orderId, paypalOrderId }), 'Failed to capture PayPal payment');
