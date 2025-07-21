import React, { useEffect, useState } from 'react';
import { useAdmin } from '@/context';
import { errorHandler } from '@/utils/errorHandler';
import toast from 'react-hot-toast';

const defaultInfo = {
  phone: '',
  email: '',
  address: '',
};

const ContactManager = () => {
  const { getContactInfo, updateContactInfo } = useAdmin();
  const [form, setForm] = useState(defaultInfo);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    getContactInfo()
      .then((res) => {
        if (res && typeof res === 'object') setForm(res);
        else throw new Error('Invalid contact info format');
      })
      .catch((err) => errorHandler(err, 'Failed to load contact info'))
      .finally(() => setLoading(false));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitting(true);

    updateContactInfo(form)
      .then(() => toast.success('Contact information updated successfully!'))
      .catch((err) => errorHandler(err, 'Update failed'))
      .finally(() => setSubmitting(false));
  };

  if (loading) {
    return (
      <div className="w-full flex justify-center py-10">
        <span className="loading loading-spinner text-[var(--bc)] w-10 h-10" />
      </div>
    );
  }

  return (
    <section className="w-full bg-[var(--b1)] text-[var(--bc)] p-8 rounded-2xl shadow-lg border border-[var(--border-color)] max-w-4xl mx-auto">
      <h2 className="text-3xl font-serif font-semibold text-center mb-8">
        Public Contact Information
      </h2>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label htmlFor="phone" className="text-sm font-medium">Phone Number</label>
          <input
            id="phone"
            type="text"
            name="phone"
            className="input input-bordered w-full bg-[var(--b1)] text-[var(--bc)]"
            placeholder="Phone Number"
            value={form.phone}
            onChange={handleChange}
            required
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="email" className="text-sm font-medium">Email Address</label>
          <input
            id="email"
            type="email"
            name="email"
            className="input input-bordered w-full bg-[var(--b1)] text-[var(--bc)]"
            placeholder="Email Address"
            value={form.email}
            onChange={handleChange}
            required
          />
        </div>

        <div className="space-y-2 md:col-span-2">
          <label htmlFor="address" className="text-sm font-medium">Restaurant Address</label>
          <textarea
            id="address"
            name="address"
            className="textarea textarea-bordered w-full bg-[var(--b1)] text-[var(--bc)]"
            placeholder="Restaurant Address"
            rows={4}
            value={form.address}
            onChange={handleChange}
            required
          />
        </div>

        <div className="md:col-span-2">
          <button
            type="submit"
            className="btn btn-primary w-full"
            disabled={submitting}
          >
            {submitting ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </section>
  );
};

export default ContactManager;
