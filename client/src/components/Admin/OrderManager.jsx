import { useEffect, useState } from 'react';
import { errorHandler, asyncHandler } from '@/utils';
import {
  adminGetOrders,
  adminUpdateOrderStatus,
  adminUpdateOrderPayment,
  adminGetOrderById
} from '@/data/orders';
import ActionButton from '../UI/ActionButton';

const statusOptions = ['Pending', 'Confirmed', 'Cancelled'];
const paymentStatusOptions = ['Unpaid', 'Paid', 'Refunded', 'Failed'];
const paymentMethods = ['cash', 'card', 'paypal'];

const OrderManager = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [updating, setUpdating] = useState(false);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const data = await adminGetOrders();
      setOrders(data);
    } catch (err) {
      errorHandler(err, 'Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  const fetchOne = async (id) => {
    try {
      const data = await adminGetOrderById(id);
      setSelected(data);
    } catch (err) {
      errorHandler(err, 'Failed to load order');
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleStatus = async (id, status) => {
    setUpdating(true);
    await asyncHandler(() => adminUpdateOrderStatus(id, status), 'Update failed')
      .then(fetchOrders)
      .then(() => fetchOne(id))
      .catch(errorHandler)
      .finally(() => setUpdating(false));
  };

  const handlePayment = async (id, paymentStatus, paymentMethod) => {
    setUpdating(true);
    await asyncHandler(() => adminUpdateOrderPayment(id, { paymentStatus, paymentMethod }), 'Payment update failed')
      .then(fetchOrders)
      .then(() => fetchOne(id))
      .catch(errorHandler)
      .finally(() => setUpdating(false));
  };

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-serif font-semibold text-[var(--bc)] text-center">Manage Orders</h2>

      {loading ? (
        <div className="w-full flex justify-center py-10">
          <span className="loading loading-spinner text-[var(--bc)] w-10 h-10" />
        </div>
      ) : orders.length === 0 ? (
        <p className="text-center text-[var(--bc)] opacity-70">No orders found.</p>
      ) : (
        <div className="grid lg:grid-cols-3 gap-4">
          <div className="lg:col-span-1 space-y-3 max-h-[70vh] overflow-y-auto">
            {orders.map((order) => (
              <button
                key={order.id}
                className={`w-full text-left p-3 rounded-lg border ${selected?.id === order.id ? 'border-[var(--p)] bg-[var(--b1)]' : 'border-[var(--border-color)]'}`}
                onClick={() => fetchOne(order.id)}
              >
                <div className="flex justify-between">
                  <span className="font-semibold">Order #{order.id}</span>
                  <span className="badge">{order.status}</span>
                </div>
                <p className="text-sm opacity-70">{order.customerName}</p>
                <p className="text-sm opacity-70">${order.total?.toFixed(2)}</p>
              </button>
            ))}
          </div>

          <div className="lg:col-span-2 bg-[var(--b1)] text-[var(--bc)] p-4 rounded-2xl border border-[var(--border-color)] min-h-[300px]">
            {selected ? (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-2xl font-serif font-semibold">Order #{selected.id}</h3>
                  <div className="flex gap-2">
                    <select
                      className="select select-bordered select-sm"
                      value={selected.status}
                      onChange={(e) => handleStatus(selected.id, e.target.value)}
                      disabled={updating}
                    >
                      {statusOptions.map((s) => <option key={s}>{s}</option>)}
                    </select>
                    <select
                      className="select select-bordered select-sm"
                      value={selected.paymentStatus}
                      onChange={(e) => handlePayment(selected.id, e.target.value, selected.paymentMethod)}
                      disabled={updating}
                    >
                      {paymentStatusOptions.map((s) => <option key={s}>{s}</option>)}
                    </select>
                    <select
                      className="select select-bordered select-sm"
                      value={selected.paymentMethod}
                      onChange={(e) => handlePayment(selected.id, selected.paymentStatus, e.target.value)}
                      disabled={updating}
                    >
                      {paymentMethods.map((m) => <option key={m}>{m}</option>)}
                    </select>
                  </div>
                </div>
                <p className="opacity-80">{selected.customerName} • {selected.customerEmail} • {selected.customerPhone}</p>
                {selected.note && <p className="text-sm opacity-80">Note: {selected.note}</p>}
                <div className="border-t border-[var(--border-color)] pt-3 space-y-2">
                  {selected.items?.map((item) => (
                    <div key={item.id} className="flex justify-between">
                      <span>{item.name} x {item.quantity}</span>
                      <span>${item.lineTotal.toFixed(2)}</span>
                    </div>
                  ))}
                </div>
                <div className="flex justify-between font-bold text-lg border-t border-[var(--border-color)] pt-3">
                  <span>Total</span>
                  <span>${selected.total?.toFixed(2)}</span>
                </div>
              </div>
            ) : (
              <p className="opacity-70">Select an order to view details.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderManager;
