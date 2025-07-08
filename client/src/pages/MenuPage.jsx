import React, { useState } from 'react';
import MenuCategory from "../components/Menus/MenuCategory";
import sampleMenu from "../data/sampleMenu";

// Group items by category
const groupByCategory = (menu) => {
  return menu.reduce((acc, item) => {
    acc[item.category] = acc[item.category] || [];
    acc[item.category].push(item);
    return acc;
  }, {});
};

const MenuPage = () => {
  const groupedMenu = groupByCategory(sampleMenu);
  const categories = Object.keys(groupedMenu);

  // State to track the currently expanded category
  const [expandedCategory, setExpandedCategory] = useState(null);

  // Toggle expand/collapse of categories
  const handleCategoryClick = (category) => {
    setExpandedCategory(expandedCategory === category ? null : category);
  };

  return (
    <section className=" min-h-screen max-w-full flex justify-center">
      <div className="px-6 py-16 max-w-7xl mx-auto ">
        <div className='h-20'>
          <h1 className="px-6 text-4xl font-serif text-center text-primary  font-semibold bg-clip-text bg-gradient-to-r from-yellow-400 via-orange-500 to-black">
            Discover Our Menu
          </h1>
        </div>

        {/* Circular Menu Categories */}
        <div className="flex flex-wrap justify-center gap-6 mb-12 px-6">
          {categories.map((category) => (
            <div
              key={category}
              className={`w-24 h-24 rounded-xl shadow-2xl flex items-center justify-center cursor-pointer transition-all duration-300 
                ${expandedCategory === category ? 'bg-amber-600' : 'bg-amber-800'}`}
              onClick={() => handleCategoryClick(category)}
            >
              <span className="text-lg font-bold">{category}</span>
            </div>
          ))}
        </div>

        {/* Show the content of the expanded category */}
        {expandedCategory && (
          <div className="transition-all duration-500 ease-in-out">
            <MenuCategory title={expandedCategory} items={groupedMenu[expandedCategory]} />
          </div>
        )}
      </div>
    </section>
  );
};

export default MenuPage;
