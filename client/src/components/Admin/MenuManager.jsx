// src/components/Admin/MenuManager.jsx
import React from 'react';
import useMenuManager from '@/hooks/useMenuManager';

const MenuManager = () => {
  const {
    form,
    setForm,
    menu,
    categories,
    editingId,
    uploadedImages,
    selectedImage,
    setSelectedImage,
    uploading,
    handleChange,
    handleEdit,
    handleDelete,
    handleSubmit,
    handleDeleteImage,
    handleCategorySubmit,
    handleCategoryEdit,
    handleCategoryDelete,
  } = useMenuManager();

  return (
    <section className="w-full space-y-8">
      <h2 className="text-3xl font-serif font-semibold text-[var(--bc)] text-center">
        Menu Management
      </h2>

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-[var(--b1)] text-[var(--bc)] p-6 rounded-xl shadow border border-[var(--border-color)]"
      >
        <input
          type="text"
          name="name"
          className="input input-bordered"
          placeholder="Dish name"
          value={form.name || ''}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="price"
          className="input input-bordered"
          placeholder="Price"
          value={form.price}
          onChange={handleChange}
          required
        />

        <div className="md:col-span-2 space-y-2">
          <label className="label">Upload New Image</label>
          <input
            type="file"
            name="image"
            className="file-input file-input-bordered w-full max-w-xs"
            onChange={handleChange}
          />
          {uploading && <p className="text-sm text-info">Uploading...</p>}

          {form.image && (
            <div className="mt-4 space-y-3">
              <label className="label">Selected Image</label>
              <img src={form.image} alt="preview" className="h-32 rounded border" />
              <button
                type="button"
                className="btn btn-sm btn-error"
                onClick={handleDeleteImage}
              >
                Delete
              </button>
            </div>
          )}

          <label className="label">Or select an uploaded image</label>
          <div className="grid grid-cols-4 gap-2">
            {uploadedImages.map((url) => (
              <img
                key={url}
                src={url}
                alt="uploaded"
                onClick={() => {
                  setForm((prev) => ({ ...prev, image: url }));
                  setSelectedImage(url);
                }}
                onError={(e) => (e.target.src = '/images/fallback.jpg')}
                className={`h-16 object-cover cursor-pointer rounded border-2 ${
                  form.image === url ? 'border-primary ring-2' : 'border-gray-300'
                }`}
              />
            ))}
          </div>
        </div>

        <select
          name="categoryId"
          className="select select-bordered"
          value={form.categoryId}
          onChange={handleChange}
          required
        >
          <option value="">Select Category</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>

        <textarea
          name="description"
          className="textarea textarea-bordered md:col-span-2"
          placeholder="Description"
          value={form.description || ''}
          onChange={handleChange}
        />

        <div className="md:col-span-2 flex flex-wrap gap-4">
          <button className="btn btn-primary" type="submit">
            {editingId ? 'Update' : 'Add'}
          </button>
          {editingId && (
            <button
              className="btn"
              type="button"
              onClick={() => {
                setForm({
                  name: '',
                  description: '',
                  price: '',
                  image: '',
                  categoryId: '',
                  categoryName: '',
                  editingCategoryId: null,
                });
              }}
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      {/* Category Manager */}
      <div className="bg-[var(--b1)] text-[var(--bc)] border border-[var(--border-color)] p-6 rounded-xl shadow space-y-4">
        <h3 className="text-xl font-semibold font-serif text-center">Manage Categories</h3>

        <div className="flex flex-wrap gap-4 items-center">
          <input
            type="text"
            placeholder="Category name"
            className="input input-bordered"
            value={form.categoryName || ''}
            onChange={(e) => setForm((prev) => ({ ...prev, categoryName: e.target.value }))}
          />

          <button className="btn btn-success" onClick={handleCategorySubmit}>
            {form.editingCategoryId ? 'Update' : 'Create'}
          </button>

          {form.editingCategoryId && (
            <button className="btn btn-error" onClick={handleCategoryDelete}>
              Delete
            </button>
          )}
        </div>

        <table className="table table-sm table-zebra w-full mt-4 text-sm">
          <thead>
            <tr>
              <th>Category</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((cat) => (
              <tr key={cat.id}>
                <td>{cat.name}</td>
                <td>
                  <button className="btn btn-xs btn-info" onClick={() => handleCategoryEdit(cat)}>
                    Edit
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="overflow-x-auto rounded-xl shadow border border-[var(--border-color)] bg-[var(--b1)] text-[var(--bc)]">
        <table className="table table-zebra w-full text-sm">
          <thead>
            <tr className="text-left">
              <th>Name</th>
              <th>Price</th>
              <th>Category</th>
              <th>Image</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {menu.map((item) => (
              <tr key={item.id}>
                <td>{item.name}</td>
                <td>${parseFloat(item.price).toFixed(2)}</td>
                <td>{item.Category?.name || item.categoryId}</td>
                <td>
                  {item.image && (
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-16 h-16 object-cover rounded"
                      onError={(e) => (e.target.src = '/images/fallback.jpg')}
                    />
                  )}
                </td>
                <td className="space-x-2">
                  <button
                    className="btn btn-xs btn-info"
                    onClick={() => handleEdit(item)}
                  >
                    Edit
                  </button>
                  <button
                    className="btn btn-xs btn-error"
                    onClick={() => handleDelete(item.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default MenuManager;
