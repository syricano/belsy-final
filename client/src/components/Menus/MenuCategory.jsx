import React from 'react';
import MenuCard from "./MenuCard";

const MenuCategory = ({ title, items }) => {
  return (
    <div className="block 5 mb-12 px-6  "> {/* Added padding-x for overall container spacing */}
      <h2 className="text-3xl text-[var(--main-text-color)] font-serif shadow-2xl
       mb-6 border-b border-primary/30 pb-2 px-4">
        {title}
      </h2>
      {/* Use grid for responsiveness */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 px-6"> {/* Updated grid for more responsive behavior */}
        {items.map((item) => (
          <div key={item.id} className="px-4"> {/* Add padding to individual cards for spacing */}
            <MenuCard item={item} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default MenuCategory;
