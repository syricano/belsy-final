import React, { useEffect, useState } from 'react';
import useMenuManager from '@/hooks/useMenuManager';
import MenuManagerPC from './MenuManagerPC';
import MenuManagerMobile from './MenuManagerMobile';

const PreviewImage = ({ url, selected, onSelect }) => {
  const [loaded, setLoaded] = useState(false);
  return (
    <div className="relative h-16 w-full">
      {!loaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-base-200">
          <span className="loading loading-spinner w-6 h-6" />
        </div>
      )}
      <img
        src={url}
        alt="uploaded"
        onClick={onSelect}
        onLoad={() => setLoaded(true)}
        onError={(e) => {
          e.target.src = '/images/fallback.jpg';
          setLoaded(true);
        }}
        className={`h-16 w-full object-cover cursor-pointer rounded border-2 ${
          selected === url ? 'border-primary ring-2' : 'border-base-300'
        } ${loaded ? 'opacity-100' : 'opacity-0'}`}
      />
    </div>
  );
};

const MenuManager = () => {
  const {
    form,
    setForm,
    menu,
    categories,
    editingId,
    setEditingId,
    uploadedImages,
    selectedImage,
    setSelectedImage,
    uploading,
    loading,
    handleChange,
    handleEdit,
    handleDelete,
    handleSubmit,
    handleDeleteImage,
    handleCategorySubmit,
    handleCategoryEdit,
    handleCategoryDelete,
  } = useMenuManager();

  const [galleryOpen, setGalleryOpen] = useState(false);
  const [imageURL, setImageURL] = useState('');
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleCategoryCheck = (categoryName) => {
    const existing = categories.find(cat => cat.name.toLowerCase() === categoryName.toLowerCase());
    if (!existing) {
      setForm((prev) => ({ ...prev, categoryName, categoryId: '' }));
    } else {
      setForm((prev) => ({ ...prev, categoryId: existing.id, categoryName: '' }));
    }
  };

  const getFullImageUrl = (image) => {
    if (!image) return '';
    const base = import.meta.env.PROD
      ? 'https://belsy-final.onrender.com'
      : 'http://localhost:3000';
    return image.startsWith('/uploads/') ? `${base}${image}` : image;
  };

  const resetForm = () => {
    setForm({
      name: '',
      description: '',
      price: '',
      image: '',
      categoryId: '',
      categoryName: '',
      editingCategoryId: null
    });
    setSelectedImage(null);
    setEditingId(null);
  };

  const handleSafeSubmit = (e) => {
    e.preventDefault();
    if (!form.categoryId && form.categoryName) {
      const matched = categories.find(cat => cat.name.toLowerCase() === form.categoryName.toLowerCase());
      if (matched) {
        setForm((prev) => ({ ...prev, categoryId: matched.id, categoryName: '' }));
      } else {
        handleCategorySubmit().then(() => {
          const updated = categories.find(cat => cat.name.toLowerCase() === form.categoryName.toLowerCase());
          if (updated) {
            setForm((prev) => ({ ...prev, categoryId: updated.id, categoryName: '' }));
            handleSubmit(e);
          }
        });
        return;
      }
    }
    handleSubmit(e);
  };

  return (
    <section className="space-y-4">
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-1">
        <div className="col-span-1 border rounded-xl bg-base-100 p-2 shadow">
          <h3 className="text-lg font-semibold mb-4">Menu Item</h3>
          <form onSubmit={handleSafeSubmit} className="space-y-4">
            <input type="text" name="name" className="input input-bordered w-full" placeholder="Dish name" value={form.name} onChange={handleChange} />
            <input type="text" name="price" className="input input-bordered w-full" placeholder="Price" value={form.price} onChange={handleChange} />
            <select name="categoryId" className="select select-bordered w-full" value={form.categoryId} onChange={handleChange}>
              <option value="">Select Category</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
            <input type="text" placeholder="Or create new category" className="input input-bordered w-full" value={form.categoryName || ''} onChange={(e) => handleCategoryCheck(e.target.value)} />
            <div className="flex justify-center">
              <button type="button" className="btn btn-outline btn-secondary w-full" onClick={() => setGalleryOpen(true)}>Choose a Picture</button>
            </div>
            {form.image && (
              <div className="mt-2">
                <PreviewImage
                  url={getFullImageUrl(form.image)}
                  selected={form.image}
                  onSelect={() => setSelectedImage(form.image)}
                />
              </div>
            )}
            <div className="grid grid-cols-2 gap-2">
              {editingId ? (
                <>
                  <button className="btn btn-outline w-full" type="button" onClick={resetForm}>Unselect</button>
                  <button className="btn btn-primary w-full" type="submit">Update</button>
                </>
              ) : (
                <div className="col-span-2">
                  <button className="btn btn-primary w-full" type="submit">Add</button>
                </div>
              )}
            </div>
          </form>
        </div>

        <div className="col-span-1 lg:col-span-4">
          {isMobile ? (
            <MenuManagerMobile
              menu={menu}
              handleEdit={handleEdit}
              handleDelete={handleDelete}
            />
          ) : (
            <MenuManagerPC
              menu={menu}
              handleEdit={handleEdit}
              handleDelete={handleDelete}
            />
          )}
        </div>
      </div>

      {galleryOpen && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-base-100 rounded-xl max-w-4xl w-full p-4 space-y-2 relative">
            <button className="absolute top-2 right-2 btn btn-sm btn-circle" onClick={() => setGalleryOpen(false)}>✕</button>
            <h3 className="text-lg font-semibold text-center">Select or Upload an Image</h3>
            <div>
              <input
                type="file"
                name="image"
                className="file-input file-input-bordered w-full max-w-xs"
                onChange={handleChange}
              />
              {uploading && <p className="text-sm text-info mt-1">Uploading...</p>}
            </div>
            <div>
              <label className="text-sm">Or use image URL</label>
              <div className="flex gap-2 mt-1">
                <input
                  type="text"
                  value={imageURL}
                  onChange={(e) => setImageURL(e.target.value)}
                  className="input input-bordered w-full"
                  placeholder="https://example.com/image.jpg"
                />
                <button
                  className="btn btn-secondary"
                  onClick={() => {
                    if (imageURL) {
                      setForm((prev) => ({ ...prev, image: imageURL }));
                      setGalleryOpen(false);
                      setImageURL('');
                    }
                  }}
                >Use</button>
              </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 max-h-96 overflow-y-auto">
              {uploadedImages.map((url) => (
                <div
                  key={url}
                  className={`cursor-pointer border rounded overflow-hidden ${form.image === url ? 'border-primary ring-2' : 'border-base-300'}`}
                  onClick={() => {
                    setForm((prev) => ({ ...prev, image: url }));
                    setSelectedImage(url);
                    setGalleryOpen(false);
                  }}
                >
                  <img src={url} alt="preview" className="object-cover w-full h-24" />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default MenuManager;
