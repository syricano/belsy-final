import React from 'react'

const MenuItem = ({ name, description, price }) => {
  return (
    <div className="p-4">
      <h2 className="font-serif text-gray-800 text-xl font-semibold mb-1">{name}</h2>
      <p className="text-sm text-gray-800 mb-2">{description}</p>
      <img src={Image} alt="" />
      <p className="text-accent font-bold text-lg">${price.toFixed(2)}</p>
    </div>
  );
};

export default MenuItem;
