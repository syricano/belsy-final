import { useEffect, useState } from 'react';
import {
  getMyFeedback,
  updateFeedback,
  deleteFeedback
} from '@/data/feedback';
import { errorHandler } from '@/utils';
import { toast } from 'react-hot-toast';

const UserFeedbackList = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({ name: '', message: '', rating: 5 });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const fetchFeedback = async () => {
    try {
      const data = await getMyFeedback();
      setFeedbacks(data);
    } catch (err) {
      errorHandler(err, 'Failed to load your feedback');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeedback();
  }, []);

  const handleEdit = (fb) => {
    setEditingId(fb.id);
    setForm({ name: fb.name, message: fb.message, rating: fb.rating || 5 });
  };

  const handleCancel = () => {
    setEditingId(null);
    setForm({ name: '', message: '', rating: 5 });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdate = async () => {
    setSubmitting(true);
    try {
      await updateFeedback(editingId, form);
      toast.success('Feedback updated');
      setEditingId(null);
      fetchFeedback();
    } catch (err) {
      errorHandler(err, 'Update failed');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm('Delete this feedback?');
    if (!confirmed) return;

    try {
      await deleteFeedback(id);
      toast.success('Feedback deleted');
      fetchFeedback();
    } catch (err) {
      errorHandler(err, 'Delete failed');
    }
  };

  if (loading) return <p className="text-center text-sm">Loading feedback...</p>;
  if (!feedbacks.length) return <p className="text-center text-sm">No feedback submitted yet.</p>;

  return (
    <div className="space-y-6">
      <h3 className="text-2xl font-serif font-semibold">🗒️ Your Feedback</h3>
      {feedbacks.map((fb) => (
        <div
          key={fb.id}
          className="border border-[var(--border-color)] bg-[var(--b1)] text-[var(--bc)] p-4 rounded-xl shadow space-y-4"
        >
          {editingId === fb.id ? (
            <>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                className="input input-bordered w-full bg-[var(--b1)] text-[var(--bc)]"
              />
              <textarea
                name="message"
                rows={3}
                value={form.message}
                onChange={handleChange}
                className="textarea textarea-bordered w-full bg-[var(--b1)] text-[var(--bc)]"
              />
              <select
                name="rating"
                value={form.rating}
                onChange={handleChange}
                className="select select-bordered w-full bg-[var(--b1)] text-[var(--bc)]"
              >
                {[5, 4, 3, 2, 1].map((star) => (
                  <option key={star} value={star}>★ {star}</option>
                ))}
              </select>
              <div className="flex gap-3">
                <button className="btn btn-primary btn-sm" onClick={handleUpdate} disabled={submitting}>
                  Save
                </button>
                <button className="btn btn-ghost btn-sm" onClick={handleCancel}>Cancel</button>
              </div>
            </>
          ) : (
            <>
              <p className="italic mb-1">“{fb.message}”</p>
              <div className="flex justify-between text-sm opacity-70">
                <span>— {fb.name}</span>
                {fb.rating && <span className="text-yellow-400 font-bold">★ {fb.rating}</span>}
              </div>
              <div className="flex gap-2 mt-2">
                <button className="btn btn-outline btn-sm" onClick={() => handleEdit(fb)}>Edit</button>
                <button className="btn btn-error btn-sm" onClick={() => handleDelete(fb.id)}>Delete</button>
              </div>
            </>
          )}
        </div>
      ))}
    </div>
  );
};

export default UserFeedbackList;
