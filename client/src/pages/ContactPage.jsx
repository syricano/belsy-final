import { useState } from 'react';
import { toast } from 'react-hot-toast';
import { asyncHandler } from '@/utils';
import axiosInstance from '@/config/axiosConfig';
import { useNavigate } from 'react-router';
import { useLang } from '@/context';

const ContactPage = () => {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();
  const { t } = useLang();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    asyncHandler(() => axiosInstance.post('/contact/message', form), t('contact.send_error'))
      .then(() => {
        toast.success(t('contact.message_sent'));
        setForm({ name: '', email: '', message: '' });
      })
      .catch((err) => {
        toast.error(err.message || t('common.error'));
      })
      .finally(() => setSubmitting(false));
  };

  return (
    <section className="main-section min-h-screen flex items-center justify-center px-6 py-12">
      <div className="relative max-w-xl w-full bg-[var(--n)] text-[var(--nc)] p-8 rounded-2xl shadow-lg border border-[var(--border-color)] animate-fade-in-up">
        {/* Close (X) button */}
        <button
          onClick={() => navigate(-1)}
          className="btn btn-sm btn-outline absolute top-4 right-4"
          aria-label={t('common.close')}
        >
          ✕
        </button>

        <h2 className="text-3xl font-serif font-bold text-center mb-6">{t('contact.title')}</h2>

        <form onSubmit={handleSubmit} className="space-y-6" role="form">
          <fieldset className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium mb-1">{t('contact.name')}</label>
              <input
                type="text"
                name="name"
                id="name"
                required
                placeholder={t('contact.your_name')}
                className="input input-bordered w-full bg-[var(--b1)] text-[var(--bc)]"
                value={form.name}
                onChange={handleChange}
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-1">{t('contact.email')}</label>
              <input
                type="email"
                name="email"
                id="email"
                required
                placeholder={t('contact.your_email')}
                className="input input-bordered w-full bg-[var(--b1)] text-[var(--bc)]"
                value={form.email}
                onChange={handleChange}
              />
            </div>

            <div>
              <label htmlFor="message" className="block text-sm font-medium mb-1">{t('contact.message')}</label>
              <textarea
                name="message"
                id="message"
                required
                rows="4"
                placeholder={t('contact.write_message')}
                className="textarea textarea-bordered w-full bg-[var(--b1)] text-[var(--bc)]"
                value={form.message}
                onChange={handleChange}
              ></textarea>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="btn btn-primary w-full"
            >
              {submitting ? t('contact.sending') : t('contact.send_message')}
            </button>
          </fieldset>
        </form>
      </div>
    </section>
  );
};

export default ContactPage;
