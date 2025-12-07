import React, { useEffect, useState } from 'react';
import { useAdmin, useLang } from '@/context';
import { errorHandler, asyncHandler } from '@/utils';
import ActionButton from '@/components/UI/ActionButton';

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
  const [loading, setLoading] = useState(false);
  const [loadingTables, setLoadingTables] = useState(true);
  const { t } = useLang();

  const fetchTables = () => {
    setLoadingTables(true);
    asyncHandler(getTables, t('common.error'))
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
      [name]: ['seats', 'number'].includes(name) ? (value === '' ? '' : Number(value)) : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    const handler = editingId ? updateTable : createTable;
    const args = editingId ? [editingId, form] : [form];

    asyncHandler(() => handler(...args), t('common.error'))
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
    asyncHandler(() => deleteTable(id), t('common.error'))
      .then(() => fetchTables())
      .catch(errorHandler);
  };

  return (
    <section className="space-y-10">
      <form
        onSubmit={handleSubmit}
        className="bg-[var(--b1)] text-[var(--bc)] p-6 rounded-xl shadow-md border border-[var(--border-color)] grid grid-cols-1 md:grid-cols-3 gap-4"
      >
        <input
          type="number"
          name="number"
          placeholder={t('admin.tables.number')}
          className="input input-bordered"
          value={form.number}
          onChange={handleChange}
          required
        />
        <input
          type="number"
          name="seats"
          placeholder={t('admin.tables.seats')}
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
          <option value="inRestaurant">{t('admin.tables.location_inside')}</option>
          <option value="inHall">{t('admin.tables.location_hall')}</option>
        </select>

        <div className="col-span-1 md:col-span-3 flex gap-2">
          {editingId ? (
            <>
              <ActionButton type="edit" label={t('admin.tables.update')} disabled={loading} />
              <ActionButton type="decline" label={t('common.cancel')} onClick={() => {
                setForm({ number: '', seats: '', location: 'inRestaurant' });
                setEditingId(null);
              }} />
            </>
          ) : (
            <ActionButton type="add" label={t('admin.tables.add')} disabled={loading} />
          )}
        </div>
      </form>

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
                <th>{t('admin.tables.seats')}</th>
                <th>{t('admin.tables.location')}</th>
                <th className='text-right'>{t('common.edit')}</th>
              </tr>
            </thead>
            <tbody>
              {tables.map((table) => (
                <tr key={table.id} className="hover:bg-[var(--card-bg)] transition">
                  <td>{table.number}</td>
                  <td>{table.seats}</td>
                  <td>{table.location}</td>
                  <td className="space-x-2 flex justify-end gap-2 ">
                    <ActionButton type="edit" onClick={() => handleEdit(table)} />
                    <ActionButton type="delete" onClick={() => handleDelete(table.id)} />
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
