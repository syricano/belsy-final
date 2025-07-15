import React, { useEffect, useState } from 'react';
import { useAdmin } from '@/context';
import { errorHandler } from '@/utils/errorHandler';
import  Toast  from 'react-hot-toast';

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

  if (loading) return <p className="text-center">Loading contact info...</p>;

  return (
    <section className="w-full bg-white dark:bg-base-100 p-6 rounded-xl shadow space-y-6">
      <h2 className="text-2xl font-bold text-center text-amber-900">Public Contact Information</h2>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
        <input
          type="text"
          name="phone"
          className="input input-bordered"
          placeholder="Phone Number"
          value={form.phone}
          onChange={handleChange}
          required
        />

        <input
          type="email"
          name="email"
          className="input input-bordered"
          placeholder="Email Address"
          value={form.email}
          onChange={handleChange}
          required
        />

        <textarea
          name="address"
          className="textarea textarea-bordered md:col-span-2"
          placeholder="Restaurant Address"
          rows={3}
          value={form.address}
          onChange={handleChange}
          required
        />

        <button
          type="submit"
          className="btn btn-primary md:col-span-2"
          disabled={submitting}
        >
          {submitting ? 'Saving...' : 'Save Changes'}
        </button>
      </form>
    </section>
  );
};

export default ContactManager;
