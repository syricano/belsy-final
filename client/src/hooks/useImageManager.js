import { useState, useEffect } from 'react';
import axiosInstance from '@/config/axiosConfig';

const useImageManager = () => {
  const [uploadedImages, setUploadedImages] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [uploading, setUploading] = useState(false);

  const fetchImages = async () => {
    const res = await axiosInstance.get('/upload/list');
    setUploadedImages(res.data);
  };

  const uploadImage = async (file) => {
    setUploading(true);
    const formData = new FormData();
    formData.append('image', file);
    const res = await axiosInstance.post('/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    setUploading(false);
    await fetchImages(); // refresh list
    return res.data.fileUrl;
  };

  useEffect(() => {
    fetchImages();
  }, []);

  return {
    uploadedImages,
    selectedImage,
    setSelectedImage,
    uploadImage,
    uploading,
  };
};

export default useImageManager;
