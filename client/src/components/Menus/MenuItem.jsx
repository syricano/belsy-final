import React from 'react';
import { useLang } from '@/context';

const MenuItem = ({ name, description, price, category }) => {
  const { t } = useLang();

  return (
    <div>
      <h3 className="font-serif text-xl font-semibold mb-1 text-[var(--bc)]">{name}</h3>
      {category && <p className="text-xs uppercase tracking-wide opacity-70 mb-1">{category}</p>}
      <p className="text-sm opacity-80 mb-2">{description}</p>
      <p className="text-[var(--accent-color)] font-bold text-lg">${parseFloat(price).toFixed(2)}</p>
      <p className="text-xs opacity-70">{t('menu.vat_notice')}</p>
    </div>
  );
};

export default MenuItem;
