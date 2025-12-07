import { useCart, useLang } from '@/context';
import ActionButton from '../UI/ActionButton';
import { useNavigate } from 'react-router';
import { computeVat } from '@/utils';

const CartDrawer = ({ open, onClose }) => {
  const { cart, updateItem, removeItem } = useCart();
  const navigate = useNavigate();
  const { t } = useLang();

  const handleCheckout = () => {
    onClose?.();
    navigate('/checkout');
  };

  const handleViewCart = () => {
    onClose?.();
    navigate('/cart');
  };

  const subtotalGross = cart.subtotalGross ?? cart.total ?? 0;
  const computed = computeVat({ gross: subtotalGross });
  const subtotalNet = cart.subtotalNet ?? computed.net;
  const subtotalVat = cart.subtotalVat ?? computed.vat;

  return (
    <>
      <div
        className={`fixed inset-0 bg-black/40 transition-opacity duration-200 z-40 ${open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
      />
      <div
        className={`fixed right-0 top-0 h-full w-full max-w-md bg-[var(--n)] text-[var(--nc)] shadow-2xl border-l border-[var(--border-color)] transform transition-transform duration-200 z-50 ${open ? 'translate-x-0' : 'translate-x-full'}`}
      >
        <div className="p-4 flex justify-between items-center border-b border-[var(--border-color)]">
          <h2 className="text-xl font-serif font-semibold">{t('cart.title')}</h2>
          <button className="btn btn-sm" onClick={onClose}>{t('common.close')}</button>
        </div>

        <div className="p-4 pt-6 pb-2 space-y-3 overflow-y-auto max-h-[60vh]">
          {(!cart.items || cart.items.length === 0) ? (
            <p className="opacity-70">{t('cart.empty')}</p>
          ) : (
            cart.items.map((item) => (
              <div key={item.id} className="bg-[var(--b1)] text-[var(--bc)] p-3 rounded-lg border border-[var(--border-color)] space-y-2">
                <div className="flex justify-between">
                  <p className="font-semibold">{item.name}</p>
                  <p className="font-semibold">${(item.lineTotalGross ?? item.lineTotal ?? 0).toFixed(2)}</p>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <button className="btn btn-xs" onClick={() => updateItem(item.id, Math.max(item.quantity - 1, 0))}>-</button>
                    <span>{item.quantity}</span>
                    <button className="btn btn-xs" onClick={() => updateItem(item.id, item.quantity + 1)}>+</button>
                  </div>
                  <ActionButton type="delete" label={t('cart.remove')} onClick={() => removeItem(item.id)} />
                </div>
                <p className="text-sm opacity-70">${(item.priceGross ?? item.price ?? 0).toFixed(2)} {t('cart.each_with_vat')}</p>
              </div>
            ))
          )}
        </div>

        <div className="p-4 border-t border-[var(--border-color)] space-y-3">
          <div className="space-y-1 text-sm">
            <div className="flex justify-between font-semibold text-lg">
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
          <div className="flex gap-2">
            <button className="btn btn-outline flex-1" onClick={handleViewCart} disabled={!cart.items?.length}>{t('cart.view_cart')}</button>
            <button className="btn btn-primary flex-1" onClick={handleCheckout} disabled={!cart.items?.length}>{t('cart.checkout')}</button>
          </div>
        </div>
      </div>
    </>
  );
};

export default CartDrawer;
