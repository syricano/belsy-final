import React from 'react';

const MenuItem = ({ name, description, price, image }) => {
  return (
    <div>
      <h3 className="font-serif text-xl font-semibold mb-1 text-[var(--bc)]">{name}</h3>
      <p className="text-sm opacity-80 mb-2">{description}</p>
      <p className="text-[var(--accent-color)] font-bold text-lg">${parseFloat(price).toFixed(2)}</p>      
    </div>
  );
};

export default MenuItem;
