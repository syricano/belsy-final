import { useNavigate } from 'react-router';
import { useCart } from '@/context';
import ActionButton from '@/components/UI/ActionButton';
import { computeVat } from '@/utils';
import { useLang } from '@/context';

const CartPage = () => {
  const { cart, loading, updateItem, removeItem } = useCart();
  const navigate = useNavigate();
  const { t } = useLang();
  const subtotalGross = cart.subtotalGross ?? cart.total ?? 0;
  const computed = computeVat({ gross: subtotalGross });
  const subtotalNet = cart.subtotalNet ?? computed.net;
  const subtotalVat = cart.subtotalVat ?? computed.vat;

  if (loading) {
    return (
      <div className="w-full flex justify-center py-10">
        <span className="loading loading-spinner text-[var(--bc)] w-10 h-10" />
      </div>
    );
  }

  return (
    <section className="main-section min-h-screen py-10 px-4">
      <div className="max-w-5xl mx-auto space-y-8 bg-[var(--n)] text-[var(--nc)] p-6 rounded-2xl shadow-lg border border-[var(--border-color)]">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-serif font-semibold">{t('cart.title')}</h1>
          <button className="btn btn-primary" disabled={!cart.items?.length} onClick={() => navigate('/checkout')}>
            {t('cart.proceed_checkout')}
          </button>
        </div>

        {(!cart.items || cart.items.length === 0) ? (
          <p className="text-center opacity-70">{t('cart.empty')}</p>
        ) : (
          <div className="space-y-4">
            {cart.items.map((item) => (
              <div key={item.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[var(--b1)] text-[var(--bc)] p-4 rounded-lg border border-[var(--border-color)]">
                <div>
                  <p className="font-semibold text-lg">{item.name}</p>
                  <p className="text-sm opacity-80">${(item.priceGross ?? item.price ?? 0).toFixed(2)} {t('cart.each_with_vat')}</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    <button className="btn btn-sm" onClick={() => updateItem(item.id, Math.max(item.quantity - 1, 0))}>-</button>
                    <span>{item.quantity}</span>
                    <button className="btn btn-sm" onClick={() => updateItem(item.id, item.quantity + 1)}>+</button>
                  </div>
                  <p className="font-semibold min-w-[80px] text-right">${(item.lineTotalGross ?? item.lineTotal ?? 0).toFixed(2)}</p>
                  <ActionButton type="delete" label={t('cart.remove')} onClick={() => removeItem(item.id)} />
                </div>
              </div>
            ))}

            <div className="flex flex-col items-end text-sm gap-1 border-t border-[var(--border-color)] pt-3">
              <div className="flex justify-between w-full sm:w-auto sm:gap-8 font-semibold text-lg">
                <span>{t('cart.subtotal_label')}</span>
                <span>${subtotalGross.toFixed(2)}</span>
              </div>
              <div className="flex justify-between w-full sm:w-auto sm:gap-8">
                <span>{t('cart.vat_label')}</span>
                <span>${subtotalVat.toFixed(2)}</span>
              </div>
              <div className="flex justify-between w-full sm:w-auto sm:gap-8">
                <span>{t('cart.net_label')}</span>
                <span>${subtotalNet.toFixed(2)}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default CartPage;
