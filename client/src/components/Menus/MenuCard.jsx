import React, { useState } from 'react';
import MenuItem from './MenuItem';
import { useCart, useLang } from '@/context';
import { toast } from 'react-hot-toast';

const MenuCard = ({ item }) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageFailed, setImageFailed] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const { addItem } = useCart();
  const { t } = useLang();

  const handleAdd = async () => {
    if (quantity <= 0) return;
    await addItem(item.id, quantity);
    toast.success(`${item.name} ${t('cart.added')}`);
    setQuantity(1);
  };

  return (
    <div className="group bg-[var(--b1)] text-[var(--bc)] shadow-xl rounded-xl overflow-hidden transition-transform duration-300 hover:scale-105">
      <div className="relative aspect-[4/3] w-full overflow-hidden">
        {!imageLoaded && !imageFailed && (
          <div className="absolute inset-0 flex justify-center items-center bg-[var(--b1)]">
            <span className="loading loading-spinner text-[var(--bc)] w-8 h-8" />
          </div>
        )}
        <img
          src={item.image}
          alt={item.name}
          className={`w-full h-full object-cover rounded-t-xl transition-transform duration-500 group-hover:scale-105 ${
            imageLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          onLoad={() => setImageLoaded(true)}
          onError={(e) => {
            e.target.src = '/images/fallback.jpg';
            setImageFailed(true);
            setImageLoaded(true);
          }}
        />
      </div>

      <div className="p-4 space-y-3">
        <MenuItem
          name={item.name}
          description={item.description}
          price={item.price}
          category={item.Category?.name}
        />
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
          <button className="btn btn-sm" onClick={() => setQuantity((q) => Math.max(q - 1, 1))}>-</button>
          <span>{quantity}</span>
          <button className="btn btn-sm" onClick={() => setQuantity((q) => q + 1)}>+</button>
        </div>
        <button className="btn btn-primary" onClick={handleAdd}>
            {t('cart.add_to_cart')}
          </button>
      </div>
    </div>
  </div>
);
};

export default MenuCard;
