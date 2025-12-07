import { useState } from 'react';
import { createFeedback } from '@/data/feedback';
import { toast } from 'react-hot-toast';
import { errorHandler } from '@/utils';
import { useLang } from '@/context';

const FeedbackForm = ({ onSuccess }) => {
  const [form, setForm] = useState({
    name: '',
    message: '',
    rating: 5,
  });
  const [submitting, setSubmitting] = useState(false);
  const { t } = useLang();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      await createFeedback(form);
      toast.success(t('home.thank_you'));
      setForm({ name: '', message: '', rating: 5 });
      onSuccess?.(); // refresh list if passed
    } catch (err) {
      errorHandler(err, t('feedback.send_error'));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="w-full bg-[var(--b1)] text-[var(--bc)] py-16 px-6">
      <div className="max-w-xl mx-auto border border-[var(--border-color)] rounded-2xl p-8 shadow-md bg-[var(--n)] text-[var(--nc)]">
        <h2 className="text-3xl font-serif font-bold text-center mb-6">
          {t('home.share_experience')}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium mb-1">
              {t('home.name')}
            </label>
            <input
              type="text"
              name="name"              
              placeholder={t('contact.your_name')}
              className="input input-bordered w-full bg-[var(--b1)] text-[var(--bc)]"
              value={form.name}
              onChange={handleChange}
            />
          </div>

          <div>
            <label htmlFor="message" className="block text-sm font-medium mb-1">
              {t('home.feedback')}
            </label>
            <textarea
              name="message"
              required
              rows="4"
              placeholder={t('feedback.write_feedback')}
              className="textarea textarea-bordered w-full bg-[var(--b1)] text-[var(--bc)]"
              value={form.message}
              onChange={handleChange}
            ></textarea>
          </div>

          <div>
            <label htmlFor="rating" className="block text-sm font-medium mb-1">
              {t('home.rating')}
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
            {submitting ? t('home.submitting') : t('home.submit_feedback')}
          </button>
        </form>
      </div>
    </section>
  );
};

export default FeedbackForm;
