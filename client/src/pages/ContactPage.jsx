// src/pages/ContactPage.jsx
import { useState } from 'react';
import { toast } from 'react-hot-toast';
import { asyncHandler } from '@/utils';
import axiosInstance from '@/config/axiosConfig';

const ContactPage = () => {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    asyncHandler(() => axiosInstance.post('/contact/message', form), 'Message send failed')
      .then(() => {
        toast.success('Message sent successfully!');
        setForm({ name: '', email: '', message: '' });
      })
      .catch((err) => {
        toast.error(err.message || 'Something went wrong');
      })
      .finally(() => setSubmitting(false));
  };

  return (
    <section className="main-section min-h-screen flex items-center justify-center px-6 py-12">
      <div className="max-w-xl w-full bg-[var(--n)] text-[var(--nc)] p-8 rounded-2xl shadow-lg border border-[var(--border-color)]">
        <h2 className="text-3xl font-serif font-bold text-center mb-6">Contact Us</h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium mb-1">Name</label>
            <input
              type="text"
              name="name"
              id="name"
              required
              placeholder="Your name"
              className="input input-bordered w-full bg-[var(--b1)] text-[var(--bc)]"
              value={form.name}
              onChange={handleChange}
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              name="email"
              id="email"
              required
              placeholder="you@example.com"
              className="input input-bordered w-full bg-[var(--b1)] text-[var(--bc)]"
              value={form.email}
              onChange={handleChange}
            />
          </div>

          <div>
            <label htmlFor="message" className="block text-sm font-medium mb-1">Message</label>
            <textarea
              name="message"
              id="message"
              required
              rows="4"
              placeholder="Write your message..."
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
            {submitting ? 'Sending...' : 'Send Message'}
          </button>
        </form>
      </div>
    </section>
  );
};

export default ContactPage;
