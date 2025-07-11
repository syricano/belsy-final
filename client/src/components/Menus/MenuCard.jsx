import React from 'react';
import MenuItem from "./MenuItem";

const MenuCard = ({ item }) => {
  return (
    <div className="card border-b-amber-800 shadow-2xl rounded-xl  overflow-hidden hover:scale-105 transition-transform duration-300 p-4 py-5">
      {/* Ensure the image is responsive and nicely contained */}
      <img src={item.image} alt={item.name} className="h-48  object-cover mb-4 rounded-xl" />
      
      {/* MenuItem Component to display name, description, and price */}
      <MenuItem name={item.name} description={item.description} price={item.price} />
    </div>
  );
};

export default MenuCard;
