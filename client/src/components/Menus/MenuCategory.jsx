import React from 'react';
import MenuCard from './MenuCard';

const MenuCategory = ({ title, items }) => {
  return (
    <section className="mb-16 px-4">
      <h2 className="text-3xl font-serif text-[var(--bc)] mb-6 border-b border-[var(--border-color)] pb-2">
        {title}
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {items.map((item) => (
          <MenuCard key={item.id} item={item} />
        ))}
      </div>
    </section>
  );
};

export default MenuCategory;
