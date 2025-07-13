import React, { useEffect, useState } from 'react';
import { useAdmin } from '@/context';
import { errorHandler } from '@/utils';

const defaultForm = {
  name: '',
  description: '',
  price: '',
  image: '',
  categoryId: '',
};

const MenuManager = () => {
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

  const [menu, setMenu] = useState([]);
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState(defaultForm);
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchAll();
  }, []);

  const fetchAll = () => {
    Promise.all([
      getMenu(),
      getCategories(),
    ])
      .then(([menuData, categoryData]) => {
        setMenu(menuData);
        setCategories(categoryData);
      })
      .catch(errorHandler);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
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
        setForm(defaultForm);
        setEditingId(null);
        fetchAll();
      })
      .catch(err => errorHandler(err, 'Failed to save menu item'));
  };

  const handleEdit = (item) => {
    setForm({
      name: item.name,
      description: item.description || '',
      price: item.price,
      image: item.image || '',
      categoryId: item.categoryId,
    });
    setEditingId(item.id);
  };

  const handleDelete = (id) => {
    if (!confirm('Are you sure?')) return;

    deleteMenuItem(id)
      .then(fetchAll)
      .catch(err => errorHandler(err, 'Failed to delete item'));
  };

  return (
    <section className="w-full bg-white dark:bg-base-100 p-6 rounded-xl shadow">
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
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
        <input
          type="text"
          name="image"
          className="input input-bordered"
          placeholder="Image URL"
          value={form.image || ''}
          onChange={handleChange}
        />
        <select
          name="categoryId"
          className="select select-bordered"
          value={form.categoryId}
          onChange={handleChange}
          required
        >
          <option value="">Select Category</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>{cat.name}</option>
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
            <button className="btn" type="button" onClick={() => {
              setForm(defaultForm);
              setEditingId(null);
            }}>
              Cancel
            </button>
          )}
        </div>
      </form>

      <div className="overflow-x-auto rounded-lg shadow">
        <table className="table table-zebra w-full text-sm">
          <thead>
            <tr>
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
                <td>{item.price}</td>
                <td>{item.Category?.name || item.categoryId}</td>
                <td>
                  {item.image && (
                    <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded" onError={(e) => (e.target.src = './src/assets/fallback.jpg')} />
                  )}
                </td>
                <td className="space-x-2">
                  <button className="btn btn-xs btn-info" onClick={() => handleEdit(item)}>
                    Edit
                  </button>
                  <button className="btn btn-xs btn-error" onClick={() => handleDelete(item.id)}>
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
