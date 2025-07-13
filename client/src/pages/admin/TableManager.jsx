import React, { useEffect, useState } from 'react';
import { useAdmin } from '@/context';
import { errorHandler } from '@/utils/errorHandler';

const defaultForm = { number: '', seats: 2, location: 'inRestaurant' };

const TableManager = () => {
  const { createTable, updateTable, deleteTable, getTables } = useAdmin();

  const [tables, setTables] = useState([]);
  const [form, setForm] = useState(defaultForm);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTables();
  }, []);

  const loadTables = () =>
    getTables()
      .then(setTables)
      .catch((err) => errorHandler(err, 'Failed to load tables'))
      .finally(() => setLoading(false));

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: name === 'seats' || name === 'number' ? parseInt(value) : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const action = editingId ? updateTable(editingId, form) : createTable(form);

    action
      .then(() => {
        setForm(defaultForm);
        setEditingId(null);
        loadTables();
      })
      .catch((err) => errorHandler(err, 'Failed to save table'));
  };

  const handleEdit = (table) => {
    setForm({ ...table });
    setEditingId(table.id);
  };

  const handleDelete = (id) => {
    if (!confirm('Are you sure you want to delete this table?')) return;

    deleteTable(id)
      .then(loadTables)
      .catch((err) => errorHandler(err, 'Failed to delete table'));
  };

  if (loading) return <p className="text-center">Loading tables...</p>;

  return (
    <section className="w-full">
      <form onSubmit={handleSubmit} className="flex flex-wrap gap-4 items-end mb-8">
        <input
          type="number"
          name="number"
          value={form.number}
          onChange={handleChange}
          placeholder="Table #"
          className="input input-bordered"
          required
        />
        <input
          type="number"
          name="seats"
          value={form.seats}
          onChange={handleChange}
          className="input input-bordered"
          min={1}
          required
        />
        <select
          name="location"
          value={form.location}
          onChange={handleChange}
          className="select select-bordered"
          required
        >
          <option value="inRestaurant">In Restaurant</option>
          <option value="inHall">In Hall</option>
        </select>
        <button className="btn btn-primary">
          {editingId ? 'Update' : 'Add'}
        </button>
        {editingId && (
          <button
            type="button"
            className="btn"
            onClick={() => {
              setForm(defaultForm);
              setEditingId(null);
            }}
          >
            Cancel
          </button>
        )}
      </form>

      <div className="overflow-x-auto rounded-lg shadow">
        <table className="table table-zebra w-full">
          <thead className="bg-base-200 text-[var(--text-color)]">
            <tr>
              <th>ID</th>
              <th>Number</th>
              <th>Seats</th>
              <th>Location</th>
              <th>Available</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {tables.map((table) => (
              <tr key={table.id}>
                <td>{table.id}</td>
                <td>{table.number}</td>
                <td>{table.seats}</td>
                <td>{table.location}</td>
                <td>{table.isAvailable ? 'Yes' : 'No'}</td>
                <td className="space-x-2">
                  <button onClick={() => handleEdit(table)} className="btn btn-xs btn-info">
                    Edit
                  </button>
                  <button onClick={() => handleDelete(table.id)} className="btn btn-xs btn-error">
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

export default TableManager;
