import React, { useEffect, useState } from 'react';
import { useAdmin } from '@/context';
import { errorHandler } from '@/utils/errorHandler';

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

  if (loading) return <p className="text-center">Loading working hours...</p>;

  return (
    <section className="w-full">
      <form
        onSubmit={handleSubmit}
        className="flex flex-wrap gap-4 items-end mb-8"
      >
        <select
          name="dayOfWeek"
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

        <input
          type="time"
          name="startTime"
          value={form.startTime}
          onChange={handleChange}
          className="input input-bordered"
          required
        />
        <input
          type="time"
          name="endTime"
          value={form.endTime}
          onChange={handleChange}
          className="input input-bordered"
          required
        />

        <button type="submit" className="btn btn-primary">
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
        <table className="w-full">
          <thead className="bg-white text-[var(--main-text-color)]">
            <tr>
              <th>Day</th>
              <th>Start</th>
              <th>End</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {dutyList.map((entry) => (
              <tr key={entry.id}>
                <td>{entry.dayOfWeek}</td>
                <td>{entry.startTime}</td>
                <td>{entry.endTime}</td>
                <td className="space-x-2">
                  <button
                    className="btn btn-xs btn-info"
                    onClick={() => handleEdit(entry)}
                  >
                    Edit
                  </button>
                  <button
                    className="btn btn-xs btn-error"
                    onClick={() => handleDelete(entry.id)}
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

export default DutyManager;
