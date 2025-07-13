import axiosInstance from '@/config/axiosConfig';
import { asyncHandler } from '@/utils';

// ========== MENU ITEMS ==========
export const addMenuItem = (data) =>
  asyncHandler(() => axiosInstance.post('/menu', data), 'Create menu item failed');

export const updateMenuItem = (id, data) =>
  asyncHandler(() => axiosInstance.put(`/menu/${id}`, data), 'Update menu item failed');

export const deleteMenuItem = (id) =>
  asyncHandler(() => axiosInstance.delete(`/menu/${id}`), 'Delete menu item failed');

export const getMenu = () =>
  asyncHandler(() => axiosInstance.get('/menu'), 'Fetch menu failed');

// ========== MENU CATEGORIES ==========
export const getCategories = () =>
  asyncHandler(() => axiosInstance.get('/menu/categories'), 'Fetch categories failed');

export const addCategory = (data) =>
  asyncHandler(() => axiosInstance.post('/menu/categories', data), 'Create category failed');

export const updateCategory = (id, data) =>
  asyncHandler(() => axiosInstance.put(`/menu/categories/${id}`, data), 'Update category failed');

export const deleteCategory = (id) =>
  asyncHandler(() => axiosInstance.delete(`/menu/categories/${id}`), 'Delete category failed');
