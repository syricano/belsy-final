// data/upload.js
import axiosInstance from '@/config/axiosConfig';

const uploadImage = async (file) => {
  const formData = new FormData();
  formData.append('image', file);

  const res = await axiosInstance.post('/api/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });

  return res.data.fileUrl;
};

export default uploadImage;
