import React, { useEffect, useState } from 'react';
import { useAdmin } from '@/context';
import { errorHandler, asyncHandler } from '@/utils';

const TableManager = () => {
  const {
    getTables,
    createTable,
    updateTable,
    deleteTable,
  } = useAdmin();

  const [tables, setTables] = useState([]);
  const [form, setForm] = useState({ number: '', seats: '', location: 'inRestaurant' });
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false); // for form
  const [loadingTables, setLoadingTables] = useState(true); // for table list

  const fetchTables = () => {
    setLoadingTables(true);
    asyncHandler(getTables, 'Failed to fetch tables')
      .then(data => setTables(data))
      .catch(errorHandler)
      .finally(() => setLoadingTables(false));
  };

  useEffect(() => {
    fetchTables();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: ['seats', 'number'].includes(name)
        ? value === '' ? '' : Number(value)
        : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    const handler = editingId ? updateTable : createTable;
    const args = editingId ? [editingId, form] : [form];

    asyncHandler(() => handler(...args), editingId ? 'Update failed' : 'Creation failed')
      .then(() => {
        fetchTables();
        setForm({ number: '', seats: '', location: 'inRestaurant' });
        setEditingId(null);
      })
      .catch(errorHandler)
      .finally(() => setLoading(false));
  };

  const handleEdit = (table) => {
    setForm({
      number: table.number,
      seats: table.seats,
      location: table.location,
    });
    setEditingId(table.id);
  };

  const handleDelete = (id) => {
    asyncHandler(() => deleteTable(id), 'Failed to delete table')
      .then(() => fetchTables())
      .catch(errorHandler);
  };

  return (
    <section className="space-y-10">
      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="bg-[var(--b1)] text-[var(--bc)] p-6 rounded-xl shadow-md border border-[var(--border-color)] grid grid-cols-1 md:grid-cols-3 gap-4"
      >
        <input
          type="number"
          name="number"
          placeholder="Table Number"
          className="input input-bordered"
          value={form.number}
          onChange={handleChange}
          required
        />
        <input
          type="number"
          name="seats"
          placeholder="Seats"
          className="input input-bordered"
          value={form.seats}
          onChange={handleChange}
          required
        />
        <select
          name="location"
          className="select select-bordered"
          value={form.location}
          onChange={handleChange}
        >
          <option value="inRestaurant">Inside Restaurant</option>
          <option value="inHall">In Hall</option>
        </select>

        <button
          type="submit"
          className="btn btn-primary col-span-1 md:col-span-3"
          disabled={loading}
        >
          {editingId ? 'Update Table' : 'Add Table'}
        </button>
      </form>

      {/* Table List */}
      {loadingTables ? (
        <div className="w-full flex justify-center py-10">
          <span className="loading loading-spinner text-[var(--bc)] w-10 h-10" />
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-[var(--border-color)] bg-[var(--b1)] text-[var(--bc)]">
          <table className="table w-full">
            <thead>
              <tr className="text-left text-sm border-b border-[var(--border-color)]">
                <th>#</th>
                <th>Seats</th>
                <th>Location</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {tables.map((table) => (
                <tr key={table.id} className="hover:bg-[var(--card-bg)] transition">
                  <td>{table.number}</td>
                  <td>{table.seats}</td>
                  <td>{table.location}</td>
                  <td className="space-x-2">
                    <button
                      onClick={() => handleEdit(table)}
                      className="btn btn-xs btn-warning"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(table.id)}
                      className="btn btn-xs btn-error"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
};

export default TableManager;
