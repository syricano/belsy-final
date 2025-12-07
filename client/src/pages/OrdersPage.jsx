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
import { useLang } from '@/context';

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
  const { t } = useLang();

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const data = await getMyOrders();
      setOrders(data);
      if (!id) {
        setSelected(data[0] || null);
      }
    } catch (err) {
      errorHandler(err, t('common.error'));
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
      errorHandler(err, t('common.error'));
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
      toast.success(t('orders.toast_cash'));
      syncOrder(updated);
    } catch (err) {
      errorHandler(err, t('orders.toast_payment_failed'));
    } finally {
      setPaying(false);
    }
  };

  const handleCardPay = async (orderId) => {
    if (!cardDetails.number || !cardDetails.expiry || !cardDetails.cvc) {
      toast.error(t('orders.toast_card_required'));
      return;
    }
    setPaying(true);
    try {
      const intent = await createStripePaymentIntent(orderId);
      const updated = await confirmStripePayment(orderId, intent.paymentIntentId);
      toast.success(t('orders.toast_card_confirmed'));
      syncOrder(updated);
    } catch (err) {
      errorHandler(err, t('orders.toast_card_failed'));
    } finally {
      setPaying(false);
    }
  };

  const handlePaypalCreate = async (orderId) => {
    setPaying(true);
    try {
      const session = await createPaypalPayment(orderId);
      setPaypalSession(session);
      toast.success(t('orders.toast_paypal_created'));
    } catch (err) {
      errorHandler(err, t('orders.toast_paypal_failed'));
    } finally {
      setPaying(false);
    }
  };

  const handlePaypalCapture = async (orderId) => {
    if (!paypalSession?.paypalOrderId) {
      toast.error(t('orders.toast_paypal_needs_order'));
      return;
    }
    setPaying(true);
    try {
      const updated = await capturePaypalPayment(orderId, paypalSession.paypalOrderId);
      toast.success(t('orders.toast_paypal_captured'));
      syncOrder(updated);
    } catch (err) {
      errorHandler(err, t('orders.toast_paypal_capture_failed'));
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

  const formatStatus = (status) => {
    if (!status) return status;
    const translated = t(`orders.status.${(status || '').toLowerCase()}`);
    return translated && !translated.startsWith('orders.status.') ? translated : status;
  };
  const formatPaymentStatus = (status) => {
    if (!status) return status;
    const translated = t(`orders.payment_status.${(status || '').toLowerCase()}`);
    return translated && !translated.startsWith('orders.payment_status.') ? translated : status;
  };
  const formatPaymentMethod = (method) => {
    if (!method) return method;
    const translated = t(`payment.${method}`);
    return translated && !translated.startsWith('payment.') ? translated : method;
  };

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
          <h2 className="text-xl font-serif font-semibold mb-3">{t('orders.title')}</h2>
          {loading && orders.length === 0 ? (
            <div className="flex justify-center py-6">
              <span className="loading loading-spinner text-[var(--bc)]" />
            </div>
          ) : orders.length === 0 ? (
            <p className="opacity-70">{t('orders.none')}</p>
          ) : (
            <div className="space-y-2">
              {orders.map((order) => (
                <button
                  key={order.id}
                  className={`w-full text-left p-3 rounded-lg border ${selected?.id === order.id ? 'border-[var(--p)] bg-[var(--b1)]' : 'border-[var(--border-color)]'}`}
                  onClick={() => fetchOne(order.id)}
                >
                  <p className="font-semibold">{t('orders.order_label')} #{order.id}</p>
                  <p className="text-sm opacity-70">
                    {`${formatStatus(order.status) || order.status} • ${formatPaymentStatus(order.paymentStatus) || order.paymentStatus} • $${order.total?.toFixed(2)}`}
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
                <h3 className="text-2xl font-serif font-semibold">{t('orders.order_label')} #{selected.id}</h3>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="badge badge-lg">{formatStatus(selected.status) || selected.status}</span>
                  {isPaid && <span className="badge badge-success badge-outline">{t('orders.paid_badge')}</span>}
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
              {selected.note && <p className="text-sm opacity-80">{t('checkout.note')}: {selected.note}</p>}
              {!canPayStrict && (
                <div className="flex flex-wrap gap-2">
                  <span className="badge">{t('orders.payment')}: {formatPaymentStatus(selected.paymentStatus) || selected.paymentStatus || '—'}</span>
                  <span className="badge">{t('orders.method')}: {formatPaymentMethod(selected.paymentMethod) || selected.paymentMethod || '—'}</span>
                  {paidAtLabel && (
                    <span className="badge badge-outline">
                      {t('orders.paid_at')} {paidAtLabel}
                    </span>
                  )}
                </div>
              )}
              {isCashConfirmedUnpaid && (
                <p className="text-sm opacity-80">
                  {t('orders.cash_note')}
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
                  <span>{t('cart.subtotal_label')}</span>
                  <span>${subtotalGross.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>{t('cart.vat_label')}</span>
                  <span>${subtotalVat.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>{t('cart.net_label')}</span>
                  <span>${subtotalNet.toFixed(2)}</span>
                </div>
              </div>
              {canPayStrict && (
                <div className="space-y-3 rounded-xl border border-[var(--border-color)] bg-[var(--b2)] p-4">
                  <div className="space-y-1">
                    <label className="text-sm font-medium" htmlFor="payment-method-select">
                      {t('orders.payment_method_label')}
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
                        <option key={m} value={m}>{formatPaymentMethod(m)}</option>
                      ))}
                    </select>
                  </div>

                  {paymentMethod === 'cash' && (
                    <div className="space-y-2">
                      <p className="text-sm opacity-80">{t('orders.cash_help')}</p>
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
                        {paying ? t('orders.saving') : t('orders.cash_confirm')}
                      </button>
                    </div>
                  )}

                  {paymentMethod === 'card' && (
                    <div className="space-y-3">
                      <div className="grid sm:grid-cols-2 gap-2">
                        <input
                          className="input input-bordered input-sm w-full"
                          placeholder={t('orders.card_number')}
                          value={cardDetails.number}
                          onChange={(e) => setCardDetails((prev) => ({ ...prev, number: e.target.value }))}
                        />
                        <input
                          className="input input-bordered input-sm w-full"
                          placeholder={t('orders.card_expiry')}
                          value={cardDetails.expiry}
                          onChange={(e) => setCardDetails((prev) => ({ ...prev, expiry: e.target.value }))}
                        />
                        <input
                          className="input input-bordered input-sm w-full sm:w-auto"
                          placeholder={t('orders.card_cvc')}
                          value={cardDetails.cvc}
                          onChange={(e) => setCardDetails((prev) => ({ ...prev, cvc: e.target.value }))}
                        />
                      </div>
                      <button
                        className="btn btn-primary"
                        onClick={() => handleCardPay(selected.id)}
                        disabled={paying}
                      >
                        {paying ? t('orders.processing') : t('orders.pay_with_card')}
                      </button>
                      <p className="text-xs opacity-70">{t('orders.card_note')}</p>
                    </div>
                  )}

                  {paymentMethod === 'paypal' && (
                    <div className="space-y-2">
                      <p className="text-sm opacity-80">{t('orders.paypal_help')}</p>
                      {paypalSession ? (
                        <>
                          <div className="rounded-md border border-[var(--border-color)] bg-[var(--b1)] p-3 text-xs break-words">
                            <p className="font-semibold">{t('orders.approval_url')}</p>
                            <p className="font-mono">{paypalSession.approvalUrl}</p>
                          </div>
                          <button
                            className="btn btn-primary"
                            onClick={() => handlePaypalCapture(selected.id)}
                            disabled={paying}
                          >
                            {paying ? t('orders.capturing') : t('orders.approve_payment')}
                          </button>
                        </>
                      ) : (
                        <button
                          className="btn btn-primary"
                          onClick={() => handlePaypalCreate(selected.id)}
                          disabled={paying}
                        >
                          {paying ? t('orders.processing') : t('orders.pay_with_paypal')}
                        </button>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          ) : (
            <p className="opacity-70">{t('orders.select_prompt')}</p>
          )}
        </div>
    </div>
  );

  return <Wrapper>{content}</Wrapper>;
};

export default OrdersPage;
