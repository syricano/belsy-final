import { useState, useEffect } from 'react';
import axiosInstance from '@/config/axiosConfig';

// ✅ Separate base for API and file URLs
const API_BASE = import.meta.env.VITE_API_BASE_URL;
const FILES_BASE = import.meta.env.VITE_FILES_BASE_URL || '' ;

const useImageManager = () => {
  const [uploadedImages, setUploadedImages] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [uploading, setUploading] = useState(false);

  const fetchImages = async () => {
    const res = await axiosInstance.get('/upload/list');
    const fullUrls = res.data.map((name) => `${FILES_BASE}${name}`); 
    setUploadedImages(fullUrls);
  };

  const uploadImage = async (file) => {
    setUploading(true);
    const formData = new FormData();
    formData.append('image', file);
    const res = await axiosInstance.post('/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    setUploading(false);
    await fetchImages(); // refresh gallery
    return `${FILES_BASE}${res.data.fileUrl}`; 
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
