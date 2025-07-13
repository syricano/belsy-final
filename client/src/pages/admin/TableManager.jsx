import React, { useEffect, useState } from 'react';
import { useAdmin } from '@/context';
import { errorHandler, asyncHandler } from '@/utils';

const TableManager = () => {
  const {
    getTables,
    createTable,
    updateTable,
    deleteTable
  } = useAdmin();

  const [tables, setTables] = useState([]);
  const [form, setForm] = useState({ number: '', seats: '', location: 'inRestaurant' });
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchTables = () => {
    asyncHandler(getTables, 'Failed to fetch tables')
      .then(data => setTables(data))
      .catch(errorHandler);
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
    <div className="space-y-10">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-xl shadow-md grid grid-cols-1 md:grid-cols-3 gap-4"
      >
        <input
          type="number"
          name="number"
          placeholder="Table Number"
          className="input input-bordered w-full"
          value={form.number}
          onChange={handleChange}
          required
        />
        <input
          type="number"
          name="seats"
          placeholder="Seats"
          className="input input-bordered w-full"
          value={form.seats}
          onChange={handleChange}
          required
        />
        <select
          name="location"
          className="select select-bordered w-full"
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

      <div className="overflow-x-auto">
        <table className="table">
          <thead>
            <tr>
              <th>#</th>
              <th>Seats</th>
              <th>Location</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {tables.map((table) => (
              <tr key={table.id}>
                <td>{table.number}</td>
                <td>{table.seats}</td>
                <td>{table.location}</td>
                <td className="space-x-2">
                  <button
                    onClick={() => handleEdit(table)}
                    className="btn btn-sm btn-warning"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(table.id)}
                    className="btn btn-sm btn-error"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TableManager;
