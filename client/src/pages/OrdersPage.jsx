import { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import {
  getMyOrders,
  getOrderById,
  updateOrderPayment,
  createStripePaymentIntent,
  confirmStripePayment,
  createPaypalPayment,
  capturePaypalPayment
} from '@/data/orders';
import { computeVat, errorHandler } from '@/utils';
import { toast } from 'react-hot-toast';

const OrdersPage = ({ embed = false }) => {
  const params = useParams();
  const id = embed ? null : params.id;
  const [orders, setOrders] = useState([]);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);
  const [paying, setPaying] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [cardDetails, setCardDetails] = useState({ number: '', expiry: '', cvc: '' });
  const [paypalSession, setPaypalSession] = useState(null);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const data = await getMyOrders();
      setOrders(data);
      if (!id) {
        setSelected(data[0] || null);
      }
    } catch (err) {
      errorHandler(err, 'Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  const fetchOne = async (orderId) => {
    setLoading(true);
    try {
      const data = await getOrderById(orderId);
      setSelected(data);
    } catch (err) {
      errorHandler(err, 'Failed to load order');
    } finally {
      setLoading(false);
    }
  };

  const syncOrder = (updated) => {
    setSelected(updated);
    setOrders((prev) => {
      if (!Array.isArray(prev) || prev.length === 0) return prev;
      return prev.map((order) => (order.id === updated.id ? { ...order, ...updated } : order));
    });
    setPaypalSession(null);
  };

  const handleCashPayment = async (orderId) => {
    setPaying(true);
    try {
      const updated = await updateOrderPayment(orderId, { paymentMethod: 'cash' });
      toast.success('Cash selected. Pay on delivery.');
      syncOrder(updated);
    } catch (err) {
      errorHandler(err, 'Payment update failed');
    } finally {
      setPaying(false);
    }
  };

  const handleCardPay = async (orderId) => {
    if (!cardDetails.number || !cardDetails.expiry || !cardDetails.cvc) {
      toast.error('Enter card details to continue');
      return;
    }
    setPaying(true);
    try {
      const intent = await createStripePaymentIntent(orderId);
      const updated = await confirmStripePayment(orderId, intent.paymentIntentId);
      toast.success('Card payment confirmed');
      syncOrder(updated);
    } catch (err) {
      errorHandler(err, 'Card payment failed');
    } finally {
      setPaying(false);
    }
  };

  const handlePaypalCreate = async (orderId) => {
    setPaying(true);
    try {
      const session = await createPaypalPayment(orderId);
      setPaypalSession(session);
      toast.success('PayPal order created');
    } catch (err) {
      errorHandler(err, 'PayPal start failed');
    } finally {
      setPaying(false);
    }
  };

  const handlePaypalCapture = async (orderId) => {
    if (!paypalSession?.paypalOrderId) {
      toast.error('Create a PayPal order first');
      return;
    }
    setPaying(true);
    try {
      const updated = await capturePaypalPayment(orderId, paypalSession.paypalOrderId);
      toast.success('PayPal payment captured');
      syncOrder(updated);
    } catch (err) {
      errorHandler(err, 'PayPal capture failed');
    } finally {
      setPaying(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchOne(id);
    } else {
      fetchOrders();
    }
  }, [id]);

  useEffect(() => {
    if (selected?.paymentMethod) {
      setPaymentMethod(selected.paymentMethod);
    } else {
      setPaymentMethod('cash');
    }
    setCardDetails({ number: '', expiry: '', cvc: '' });
    setPaypalSession(null);
  }, [selected]);

  const statusNormalized = selected?.status?.toLowerCase() || '';
  const paymentStatusNormalized = selected?.paymentStatus?.toLowerCase() || '';
  // Only allow Pay Now when the backend still reports Pending + Unpaid.
  const canPayStrict = statusNormalized === 'pending' && paymentStatusNormalized === 'unpaid';
  const isPaid = paymentStatusNormalized === 'paid';
  const isCashConfirmedUnpaid = selected?.paymentMethod === 'cash' && paymentStatusNormalized === 'unpaid' && statusNormalized === 'confirmed';
  const paymentOptions = ['cash', 'card', 'paypal'];
  const showDebug = import.meta.env?.DEV;
  const paidAtLabel = selected?.paidAt ? new Date(selected.paidAt).toLocaleString() : '';

  const Wrapper = ({ children }) => embed ? <div className="space-y-4">{children}</div> : (
    <section className="main-section min-h-screen py-10 px-4">
      <div className="max-w-5xl mx-auto">
        {children}
      </div>
    </section>
  );

  const subtotalGross = selected?.subtotalGross ?? selected?.total ?? 0;
  const vatCalc = computeVat({ gross: subtotalGross });
  const subtotalNet = selected?.subtotalNet ?? vatCalc.net;
  const subtotalVat = selected?.subtotalVat ?? vatCalc.vat;

  const content = (
    <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 bg-[var(--n)] text-[var(--nc)] p-4 rounded-2xl shadow border border-[var(--border-color)]">
          <h2 className="text-xl font-serif font-semibold mb-3">My Orders</h2>
          {loading && orders.length === 0 ? (
            <div className="flex justify-center py-6">
              <span className="loading loading-spinner text-[var(--bc)]" />
            </div>
          ) : orders.length === 0 ? (
            <p className="opacity-70">No orders yet.</p>
          ) : (
            <div className="space-y-2">
              {orders.map((order) => (
                <button
                  key={order.id}
                  className={`w-full text-left p-3 rounded-lg border ${selected?.id === order.id ? 'border-[var(--p)] bg-[var(--b1)]' : 'border-[var(--border-color)]'}`}
                  onClick={() => fetchOne(order.id)}
                >
                  <p className="font-semibold">Order #{order.id}</p>
                  <p className="text-sm opacity-70">
                    {`${order.status} • ${order.paymentStatus} • $${order.total?.toFixed(2)}`}
                  </p>
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="lg:col-span-2 bg-[var(--n)] text-[var(--nc)] p-6 rounded-2xl shadow border border-[var(--border-color)] min-h-[300px]">
          {loading && !selected ? (
            <div className="flex justify-center py-10">
              <span className="loading loading-spinner text-[var(--bc)]" />
            </div>
          ) : selected ? (
            <div className="space-y-4">
              <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                <h3 className="text-2xl font-serif font-semibold">Order #{selected.id}</h3>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="badge badge-lg">{selected.status}</span>
                  {isPaid && <span className="badge badge-success badge-outline">Paid</span>}
                </div>
              </div>
              {showDebug && (
                <div className="rounded-lg border border-dashed border-[var(--border-color)] bg-[var(--b2)] p-3 text-xs font-mono">
                  <p>status: {String(selected.status)}</p>
                  <p>paymentStatus: {String(selected.paymentStatus)}</p>
                  <p>paymentMethod: {String(selected.paymentMethod)}</p>
                </div>
              )}
              <p className="opacity-80">{selected.customerName} • {selected.customerEmail} • {selected.customerPhone}</p>
              {selected.note && <p className="text-sm opacity-80">Note: {selected.note}</p>}
              {!canPayStrict && (
                <div className="flex flex-wrap gap-2">
                  <span className="badge">Payment: {selected.paymentStatus || 'Unknown'}</span>
                  <span className="badge">Method: {selected.paymentMethod || '—'}</span>
                  {paidAtLabel && (
                    <span className="badge badge-outline">
                      Paid at {paidAtLabel}
                    </span>
                  )}
                </div>
              )}
              {isCashConfirmedUnpaid && (
                <p className="text-sm opacity-80">
                  You chose to pay in cash when you receive your order.
                </p>
              )}
              <div className="border-t border-[var(--border-color)] pt-3 space-y-2">
                {selected.items?.map((item) => (
                  <div key={item.id} className="flex justify-between">
                    <span>{item.name} x {item.quantity}</span>
                    <span>${(item.lineTotalGross ?? item.lineTotal ?? 0).toFixed(2)}</span>
                  </div>
                ))}
              </div>
              <div className="space-y-1 text-sm border-t border-[var(--border-color)] pt-3">
                <div className="flex justify-between font-bold text-lg">
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
              {canPayStrict && (
                <div className="space-y-3 rounded-xl border border-[var(--border-color)] bg-[var(--b2)] p-4">
                  <div className="space-y-1">
                    <label className="text-sm font-medium" htmlFor="payment-method-select">
                      Payment Method
                    </label>
                    <select
                      id="payment-method-select"
                      className="select select-bordered select-sm w-full sm:max-w-xs"
                      value={paymentMethod}
                      onChange={(e) => {
                        setPaymentMethod(e.target.value);
                        setPaypalSession(null);
                      }}
                    >
                      {paymentOptions.map((m) => (
                        <option key={m} value={m}>{m}</option>
                      ))}
                    </select>
                  </div>

                  {paymentMethod === 'cash' && (
                    <div className="space-y-2">
                      <p className="text-sm opacity-80">Pay in cash when you receive your order.</p>
                      <button
                        className="btn btn-primary"
                        type="button"
                        onClick={() => handleCashPayment(selected.id)}
                        disabled={
                          paying ||
                          statusNormalized !== 'pending' ||
                          paymentStatusNormalized !== 'unpaid'
                        }
                      >
                        {paying ? 'Saving...' : 'Confirm cash on delivery'}
                      </button>
                    </div>
                  )}

                  {paymentMethod === 'card' && (
                    <div className="space-y-3">
                      <div className="grid sm:grid-cols-2 gap-2">
                        <input
                          className="input input-bordered input-sm w-full"
                          placeholder="Card number"
                          value={cardDetails.number}
                          onChange={(e) => setCardDetails((prev) => ({ ...prev, number: e.target.value }))}
                        />
                        <input
                          className="input input-bordered input-sm w-full"
                          placeholder="MM/YY"
                          value={cardDetails.expiry}
                          onChange={(e) => setCardDetails((prev) => ({ ...prev, expiry: e.target.value }))}
                        />
                        <input
                          className="input input-bordered input-sm w-full sm:w-auto"
                          placeholder="CVC"
                          value={cardDetails.cvc}
                          onChange={(e) => setCardDetails((prev) => ({ ...prev, cvc: e.target.value }))}
                        />
                      </div>
                      <button
                        className="btn btn-primary"
                        onClick={() => handleCardPay(selected.id)}
                        disabled={paying}
                      >
                        {paying ? 'Processing...' : 'Pay with Card'}
                      </button>
                      <p className="text-xs opacity-70">Card payments are simulated now and will auto-confirm once approved.</p>
                    </div>
                  )}

                  {paymentMethod === 'paypal' && (
                    <div className="space-y-2">
                      <p className="text-sm opacity-80">Simulated PayPal approval flow.</p>
                      {paypalSession ? (
                        <>
                          <div className="rounded-md border border-[var(--border-color)] bg-[var(--b1)] p-3 text-xs break-words">
                            <p className="font-semibold">Approval URL</p>
                            <p className="font-mono">{paypalSession.approvalUrl}</p>
                          </div>
                          <button
                            className="btn btn-primary"
                            onClick={() => handlePaypalCapture(selected.id)}
                            disabled={paying}
                          >
                            {paying ? 'Capturing...' : 'Approve payment'}
                          </button>
                        </>
                      ) : (
                        <button
                          className="btn btn-primary"
                          onClick={() => handlePaypalCreate(selected.id)}
                          disabled={paying}
                        >
                          {paying ? 'Processing...' : 'Pay with PayPal'}
                        </button>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          ) : (
            <p className="opacity-70">Select an order to view details.</p>
          )}
        </div>
    </div>
  );

  return <Wrapper>{content}</Wrapper>;
};

export default OrdersPage;
