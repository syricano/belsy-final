import React, { useEffect, useState } from 'react';
import ActionButton from '@/components/UI/ActionButton';
import { computeVat } from '@/utils';

const MenuManagerFormModal = ({ item, onClose, onSubmit }) => {
  const [form, setForm] = useState({
    name: '',
    description: '',
    price: '',
    categoryId: '',
    image: '',
  });

  useEffect(() => {
    if (item) {
      setForm({
        name: item.name || '',
        description: item.description || '',
        price: item.price || '',
        categoryId: item.categoryId || '',
        image: item.image || '',
      });
    }
  }, [item]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ ...item, ...form });
  };

  const priceInfo = computeVat({ gross: form.price || 0 });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="bg-[var(--b1)] text-[var(--bc)] w-full max-w-md rounded-lg shadow-lg p-6">
        <h3 className="text-xl font-semibold mb-4">Edit Menu Item</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Name</label>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              className="input input-bordered w-full bg-[var(--b1)] text-[var(--bc)]"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Price (incl. 19% VAT)</label>
            <input
              name="price"
              value={form.price}
              onChange={handleChange}
              className="input input-bordered w-full bg-[var(--b1)] text-[var(--bc)]"
              type="number"
              step="0.01"
              required
            />
            <div className="text-xs opacity-80 bg-[var(--b2)] border border-[var(--border-color)] rounded-lg p-2 mt-1">
              <p>Net (excl. VAT): ${priceInfo.net.toFixed(2)}</p>
              <p>VAT (19%): ${priceInfo.vat.toFixed(2)}</p>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Category ID</label>
            <input
              name="categoryId"
              value={form.categoryId}
              onChange={handleChange}
              className="input input-bordered w-full bg-[var(--b1)] text-[var(--bc)]"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Image URL</label>
            <input
              name="image"
              value={form.image}
              onChange={handleChange}
              className="input input-bordered w-full bg-[var(--b1)] text-[var(--bc)]"
            />
          </div>
          <div className="flex gap-3 pt-2">
            <ActionButton type="edit" label="Update" />
            <ActionButton type="decline" label="Cancel" onClick={onClose} />
          </div>
        </form>
      </div>
    </div>
  );
};

export default MenuManagerFormModal;
