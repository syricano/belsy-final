import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useCart, useAuth } from '@/context';
import { checkoutOrder } from '@/data/orders';
import { computeVat, errorHandler } from '@/utils';
import { toast } from 'react-hot-toast';

const CheckoutPage = () => {
  const { cart, loading, clear, reload } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    note: '',
  });
  const subtotalGross = cart.subtotalGross ?? cart.total ?? 0;
  const vatBreakdown = computeVat({ gross: subtotalGross });
  const subtotalNet = cart.subtotalNet ?? vatBreakdown.net;
  const subtotalVat = cart.subtotalVat ?? vatBreakdown.vat;

  useEffect(() => {
    if (user) {
      setForm((prev) => ({
        ...prev,
        name: prev.name || `${user.firstName || ''} ${user.lastName || ''}`.trim(),
        email: prev.email || user.email || '',
        phone: prev.phone || user.phone || '',
      }));
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await checkoutOrder(form);
      await clear();
      toast.success('Order placed successfully');
      reload();
      if (user) navigate('/orders');
      else navigate('/');
    } catch (err) {
      errorHandler(err, 'Checkout failed');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="w-full flex justify-center py-10">
        <span className="loading loading-spinner text-[var(--bc)] w-10 h-10" />
      </div>
    );
  }

  if (!cart.items?.length) {
    return (
      <section className="main-section min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <p>Your cart is empty.</p>
          <button className="btn btn-primary" onClick={() => navigate('/menu')}>Browse Menu</button>
        </div>
      </section>
    );
  }

  return (
    <section className="main-section min-h-screen py-10 px-4">
      <div className="max-w-5xl mx-auto grid gap-8 lg:grid-cols-2">
        <div className="bg-[var(--n)] text-[var(--nc)] p-6 rounded-2xl shadow-lg border border-[var(--border-color)]">
          <h2 className="text-2xl font-serif font-semibold mb-4">Order Summary</h2>
          <div className="space-y-3">
            {cart.items.map((item) => (
              <div key={item.id} className="flex justify-between">
                <div>
                  <p className="font-semibold">{item.name}</p>
                  <p className="text-sm opacity-70">Qty: {item.quantity} • ${(item.priceGross ?? item.price ?? 0).toFixed(2)} each (incl. VAT)</p>
                </div>
                <p className="font-semibold">${(item.lineTotalGross ?? item.lineTotal ?? 0).toFixed(2)}</p>
              </div>
            ))}
          </div>
          <div className="mt-4 text-sm space-y-1 border-t border-[var(--border-color)] pt-3">
            <div className="flex justify-between font-semibold text-lg">
              <span>Subtotal (incl. 19% VAT)</span>
              <span>${subtotalGross.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Incl. VAT (19%)</span>
              <span>${subtotalVat.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Net (excl. VAT)</span>
              <span>${subtotalNet.toFixed(2)}</span>
            </div>
          </div>
        </div>

        <div className="bg-[var(--n)] text-[var(--nc)] p-6 rounded-2xl shadow-lg border border-[var(--border-color)]">
          <h2 className="text-2xl font-serif font-semibold mb-4">Checkout</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            {[
              { label: 'Name', name: 'name', type: 'text', required: true },
              { label: 'Email', name: 'email', type: 'email', required: true },
              { label: 'Phone', name: 'phone', type: 'text', required: true },
            ].map((field) => (
              <div key={field.name} className="space-y-1">
                <label className="block text-sm font-medium">{field.label}</label>
                <input
                  type={field.type}
                  name={field.name}
                  value={form[field.name]}
                  onChange={handleChange}
                  required={field.required}
                  className="input input-bordered w-full bg-[var(--b1)] text-[var(--bc)]"
                />
              </div>
            ))}

            <div className="space-y-1">
              <label className="block text-sm font-medium">Note (optional)</label>
              <textarea
                name="note"
                rows="3"
                value={form.note}
                onChange={handleChange}
                className="textarea textarea-bordered w-full bg-[var(--b1)] text-[var(--bc)]"
                placeholder="Delivery / pickup instructions"
              />
            </div>

            <button type="submit" className="btn btn-primary w-full" disabled={submitting}>
              {submitting ? 'Placing order...' : 'Place Order'}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default CheckoutPage;
