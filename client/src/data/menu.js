// data/menu.js
import axiosInstance from '@/config/axiosConfig';
import { asyncHandler } from '@/utils';

const baseURL = '/menu';

// ========== MENU ITEMS ==========
export const addMenuItem = (data) =>
  asyncHandler(() => axiosInstance.post(baseURL, data), 'Create menu item failed');

export const updateMenuItem = (id, data) =>
  asyncHandler(() => axiosInstance.put(`${baseURL}/${id}`, data), 'Update menu item failed');

export const deleteMenuItem = (id) =>
  asyncHandler(() => axiosInstance.delete(`${baseURL}/${id}`), 'Delete menu item failed');

export const getMenu = (lang = 'en') =>
  asyncHandler(() => axiosInstance.get(baseURL, { params: { lang } }), 'Fetch menu failed');

// ========== MENU CATEGORIES ==========
export const getCategories = () =>
  asyncHandler(() => axiosInstance.get(`${baseURL}/categories`), 'Fetch categories failed');

export const addCategory = (data) =>
  asyncHandler(() => axiosInstance.post(`${baseURL}/categories`, data), 'Create category failed');

export const updateCategory = (id, data) =>
  asyncHandler(() => axiosInstance.put(`${baseURL}/categories/${id}`, data), 'Update category failed');

export const deleteCategory = (id) =>
  asyncHandler(() => axiosInstance.delete(`${baseURL}/categories/${id}`), 'Delete category failed');
