import React, { useEffect, useState } from 'react';
import { useAdmin } from '@/context';
import { errorHandler } from '@/utils/errorHandler';
import ActionButton from '@/components/UI/ActionButton';

const defaultForm = {
  dayOfWeek: 'Monday',
  startTime: '09:00',
  endTime: '18:00',
};

const days = [
  'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'
];

const DutyManager = () => {
  const {
    getAllDutyHours,
    createDuty,
    updateDuty,
    deleteDuty
  } = useAdmin();

  const [dutyList, setDutyList] = useState([]);
  const [form, setForm] = useState(defaultForm);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDuties();
  }, []);

  const loadDuties = () => {
    getAllDutyHours()
      .then(setDutyList)
      .catch((err) => errorHandler(err, 'Failed to load duty hours'))
      .finally(() => setLoading(false));
  };

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const action = editingId
      ? updateDuty(editingId, form)
      : createDuty(form);

    action
      .then(() => {
        setForm(defaultForm);
        setEditingId(null);
        loadDuties();
      })
      .catch((err) => errorHandler(err, 'Failed to save duty hour'));
  };

  const handleEdit = (entry) => {
    setForm(entry);
    setEditingId(entry.id);
  };

  const handleDelete = (id) => {
    if (!confirm("Are you sure you want to delete this day's hours?")) return;

    deleteDuty(id)
      .then(loadDuties)
      .catch((err) => errorHandler(err, 'Failed to delete duty hour'));
  };

  if (loading) {
    return (
      <div className="w-full flex justify-center py-10">
        <span className="loading loading-spinner text-[var(--bc)] w-10 h-10" />
      </div>
    );
  }

  return (
    <section className="w-full space-y-8">
      <h2 className="text-3xl font-serif font-semibold text-center text-[var(--bc)]">Working Hours</h2>

      <form
        onSubmit={handleSubmit}
        className="bg-[var(--b1)] text-[var(--bc)] border border-[var(--border-color)] p-6 rounded-xl shadow flex flex-wrap gap-4 items-end justify-start"
      >
        <div className="flex flex-col">
          <label htmlFor="dayOfWeek" className="text-sm font-medium mb-1">Day</label>
          <select
            name="dayOfWeek"
            id="dayOfWeek"
            value={form.dayOfWeek}
            onChange={handleChange}
            className="select select-bordered"
            disabled={editingId !== null}
          >
            {days.map((day) => (
              <option key={day} value={day}>
                {day}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col">
          <label htmlFor="startTime" className="text-sm font-medium mb-1">Start</label>
          <input
            type="time"
            name="startTime"
            id="startTime"
            value={form.startTime}
            onChange={handleChange}
            className="input input-bordered"
            required
          />
        </div>

        <div className="flex flex-col">
          <label htmlFor="endTime" className="text-sm font-medium mb-1">End</label>
          <input
            type="time"
            name="endTime"
            id="endTime"
            value={form.endTime}
            onChange={handleChange}
            className="input input-bordered"
            required
          />
        </div>

        <div className="flex gap-2 mt-4">
          <ActionButton type={editingId ? 'edit' : 'add'} label={editingId ? 'Update' : 'Add'} />
          {editingId && (
            <ActionButton type="decline" label="Cancel" onClick={() => {
              setForm(defaultForm);
              setEditingId(null);
            }} />
          )}
        </div>
      </form>

      <div className="overflow-x-auto rounded-lg shadow border border-[var(--border-color)] bg-[var(--b1)] text-[var(--bc)]">
        <table className="table w-full">
          <thead>
            <tr className="text-left border-b border-[var(--border-color)] text-sm font-semibold">
              <th className="py-3 px-4">Day</th>
              <th className="py-3 px-4">Start</th>
              <th className="py-3 px-4">End</th>
              <th className="py-3 px-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {dutyList.map((entry) => (
              <tr key={entry.id} className="hover:bg-[var(--card-bg)] transition">
                <td className="py-2 px-4">{entry.dayOfWeek}</td>
                <td className="py-2 px-4">{entry.startTime}</td>
                <td className="py-2 px-4">{entry.endTime}</td>
                <td className="py-2 px-4 space-x-2">
                  <ActionButton type="edit" onClick={() => handleEdit(entry)} />
                  <ActionButton type="delete" onClick={() => handleDelete(entry.id)} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default DutyManager;
