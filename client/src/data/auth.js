// data/auth.js
import axiosInstance from '@/config/axiosConfig';

const baseURL = '/api/auth';
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

export const signup = async (formData) => {
  return handleRequest(() => axiosInstance.post(`${baseURL}/signup`, formData), 'Signup failed');
};

export const signout = async () => {
  return handleRequest(() => axiosInstance.post(`${baseURL}/signout`), 'Signout failed');
};

export const signin = async (formData) => {
  return handleRequest(() => axiosInstance.post(`${baseURL}/signin`, formData), 'Signin failed');
};
   

export const profile = async () => {
  return handleRequest(() => axiosInstance.get(`${baseURL}/me`), 'Failed to fetch user data');
};


export const forgotPassword = async (email) => {
  return handleRequest(() => axiosInstance.post(`${baseURL}/forgot-password`, { email }), 'Forgot password failed');
};

export const resetPassword = async (token, newPassword) => {
  return handleRequest(() => axiosInstance.post(`${baseURL}/reset-password`, { token, newPassword }), 'Reset password failed');
};

export const updateProfile = async (formData) => {
  return handleRequest(() => axiosInstance.put(`${baseURL}/update-profile`, formData), 'Update profile failed');
};

export const changePassword = async (oldPassword, newPassword) => {
  return handleRequest(() => axiosInstance.put(`${baseURL}/change-password`, { oldPassword, newPassword }), 'Change password failed');
}

export const deleteAccount = async (formData) => {
  return handleRequest(() =>
    axiosInstance.post(`${baseURL}/delete-account`, formData),
    'Delete account failed'
  );
};