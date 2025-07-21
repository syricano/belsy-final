import { useState } from 'react';
import { createFeedback } from '@/data/feedback';
import { toast } from 'react-hot-toast';
import { errorHandler } from '@/utils';

const FeedbackForm = ({ onSuccess }) => {
  const [form, setForm] = useState({
    name: '',
    message: '',
    rating: 5,
  });
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      await createFeedback(form);
      toast.success('Thank you for your feedback!');
      setForm({ name: '', message: '', rating: 5 });
      onSuccess?.(); // refresh list if passed
    } catch (err) {
      errorHandler(err, 'Failed to send feedback');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="w-full bg-[var(--b1)] text-[var(--bc)] py-16 px-6">
      <div className="max-w-xl mx-auto border border-[var(--border-color)] rounded-2xl p-8 shadow-md bg-[var(--n)] text-[var(--nc)]">
        <h2 className="text-3xl font-serif font-bold text-center mb-6">
          Share Your Experience
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium mb-1">
              Name
            </label>
            <input
              type="text"
              name="name"              
              placeholder="Your name"
              className="input input-bordered w-full bg-[var(--b1)] text-[var(--bc)]"
              value={form.name}
              onChange={handleChange}
            />
          </div>

          <div>
            <label htmlFor="message" className="block text-sm font-medium mb-1">
              Feedback
            </label>
            <textarea
              name="message"
              required
              rows="4"
              placeholder="Write your feedback..."
              className="textarea textarea-bordered w-full bg-[var(--b1)] text-[var(--bc)]"
              value={form.message}
              onChange={handleChange}
            ></textarea>
          </div>

          <div>
            <label htmlFor="rating" className="block text-sm font-medium mb-1">
              Rating
            </label>
            <select
              name="rating"
              value={form.rating}
              onChange={handleChange}
              className="select select-bordered w-full bg-[var(--b1)] text-[var(--bc)]"
            >
              {[5, 4, 3, 2, 1].map((star) => (
                <option key={star} value={star}>
                  ★ {star}
                </option>
              ))}
            </select>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="btn btn-primary w-full"
          >
            {submitting ? 'Submitting...' : 'Submit Feedback'}
          </button>
        </form>
      </div>
    </section>
  );
};

export default FeedbackForm;
