import axiosInstance from '@/config/axiosConfig';

const baseURL = '/cart';

const handle = async (callback, errorMsg = 'Cart request failed') => {
  try {
    const res = await callback();
    return res.data;
  } catch (error) {
    const msg = error?.response?.data?.error || error?.message || errorMsg;
    throw new Error(msg);
  }
};

export const getCart = () => handle(() => axiosInstance.get(baseURL), 'Failed to load cart');
export const addCartItem = (menuId, quantity = 1) =>
  handle(() => axiosInstance.post(`${baseURL}/items`, { menuId, quantity }), 'Failed to add item');
export const updateCartItem = (itemId, quantity) =>
  handle(() => axiosInstance.patch(`${baseURL}/items/${itemId}`, { quantity }), 'Failed to update item');
export const removeCartItem = (itemId) =>
  handle(() => axiosInstance.delete(`${baseURL}/items/${itemId}`), 'Failed to remove item');
export const clearCart = () => handle(() => axiosInstance.delete(baseURL), 'Failed to clear cart');
