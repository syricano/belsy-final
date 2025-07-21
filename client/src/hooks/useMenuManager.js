// src/hooks/useMenuManager.js
import { useEffect, useState } from 'react';
import { useAdmin } from '@/context';
import { toast } from 'react-hot-toast';
import useImageManager from './useImageManager';
import axiosInstance from '@/config/axiosConfig';
import { asyncHandler, errorHandler } from '@/utils';

const defaultForm = {
  name: '',
  description: '',
  price: '',
  image: '',
  categoryId: '',
  categoryName: '',
  editingCategoryId: null,
};

const useMenuManager = () => {
  const {
    createMenuItem,
    updateMenuItem,
    deleteMenuItem,
    getMenu,
    getCategories,
    createCategory,
    updateCategory,
    deleteCategory,
  } = useAdmin();

  const {
    uploadedImages,
    selectedImage,
    setSelectedImage,
    uploadImage,
    uploading,
    fetchImages,
  } = useImageManager();

  const [menu, setMenu] = useState([]);
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState(defaultForm);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true); // ✅

  const fetchAll = () => {
    setLoading(true); // ✅
    Promise.all([getMenu(), getCategories()])
      .then(([menuData, categoryData]) => {
        setMenu(menuData);
        setCategories(categoryData);
      })
      .catch(errorHandler)
      .finally(() => setLoading(false)); // ✅
  };

  useEffect(() => {
    fetchAll();
  }, []);

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === 'image' && files?.[0]) {
      const file = files[0];
      if (!file.type.startsWith('image/')) {
        toast.error('Only image files are allowed');
        return;
      }
      uploadImage(file)
        .then((url) => {
          setForm((prev) => ({ ...prev, image: url }));
          setSelectedImage(url);
        })
        .catch((err) => {
          const msg = err?.response?.data?.error || 'Image upload failed';
          toast.error(msg);
        });
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleDeleteImage = () => {
    if (!form.image) return;
    const filename = form.image.split('/').pop();

    asyncHandler(() => axiosInstance.delete(`/upload/${filename}`), 'Delete failed')
      .then(() => {
        toast.success('Image deleted');
        setForm((prev) => ({ ...prev, image: '' }));
        setSelectedImage(null);
        if (typeof fetchImages === 'function') fetchImages();
      })
      .catch(errorHandler);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = {
      ...form,
      price: parseFloat(form.price),
      categoryId: parseInt(form.categoryId),
      image: form.image?.trim() || undefined,
    };

    const action = editingId
      ? updateMenuItem(editingId, payload)
      : createMenuItem(payload);

    action
      .then(() => {
        toast.success(editingId ? 'Menu item updated' : 'Menu item added');
        setForm(defaultForm);
        setEditingId(null);
        fetchAll();
      })
      .catch((err) => errorHandler(err, 'Failed to save menu item'));
  };

  const handleEdit = (item) => {
    setForm({
      name: item.name,
      description: item.description || '',
      price: item.price,
      image: item.image || '',
      categoryId: item.categoryId,
      categoryName: '',
      editingCategoryId: null,
    });
    setEditingId(item.id);
  };

  const handleDelete = (id) => {
    if (!confirm('Are you sure?')) return;

    deleteMenuItem(id)
      .then(() => {
        toast.success('Menu item deleted');
        fetchAll();
      })
      .catch((err) => errorHandler(err, 'Failed to delete item'));
  };

  const handleCategorySubmit = () => {
    if (!form.categoryName) return;

    const action = form.editingCategoryId
      ? updateCategory(form.editingCategoryId, { name: form.categoryName })
      : createCategory({ name: form.categoryName });

    action
      .then(() => {
        toast.success(form.editingCategoryId ? 'Category updated' : 'Category created');
        setForm((prev) => ({ ...prev, categoryName: '', editingCategoryId: null }));
        fetchAll();
      })
      .catch((err) => {
        if (err.message.includes('exists')) {
          toast.error('Category already exists');
        } else {
          errorHandler(err, 'Failed to save category');
        }
      });
  };

  const handleCategoryEdit = (cat) => {
    setForm((prev) => ({
      ...prev,
      categoryName: cat.name,
      editingCategoryId: cat.id,
    }));
  };

  const handleCategoryDelete = () => {
    if (!confirm('Delete this category?')) return;

    deleteCategory(form.editingCategoryId)
      .then(() => {
        setForm((prev) => ({
          ...prev,
          categoryName: '',
          editingCategoryId: null,
        }));
        fetchAll();
      })
      .catch((err) => errorHandler(err, 'Delete failed'));
  };

  return {
    form,
    setForm,
    menu,
    categories,
    editingId,
    uploadedImages,
    selectedImage,
    setSelectedImage,
    uploading,
    loading, // ✅ expose
    handleChange,
    handleEdit,
    handleDelete,
    handleSubmit,
    handleDeleteImage,
    handleCategorySubmit,
    handleCategoryEdit,
    handleCategoryDelete,
    fetchAll,
  };
};

export default useMenuManager;
