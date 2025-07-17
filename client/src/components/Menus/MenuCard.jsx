import React from 'react';
import MenuItem from './MenuItem';

const MenuCard = ({ item }) => {
  return (
    <div className="bg-[var(--b1)] text-[var(--bc)] shadow-xl rounded-xl overflow-hidden transition-transform duration-300 hover:scale-105">
      <img
        src={item.image}
        alt={item.name}
        className="h-48 w-full object-cover rounded-t-xl"
        onError={(e) => (e.target.src = '/images/fallback.jpg')}
      />
      <div className="p-4">
        <MenuItem name={item.name} description={item.description} price={item.price} />
      </div>
    </div>
  );
};

export default MenuCard;
