import React, { useState } from 'react';
import MenuCategory from '@/components/Menus/MenuCategory';
import useGetMenu from '@/hooks/useGetMenu';

const MenuPage = () => {
  const { groupedMenu, loading } = useGetMenu();
  const [expandedCategory, setExpandedCategory] = useState(null);

  const handleCategoryClick = (category) => {
    setExpandedCategory(expandedCategory === category ? null : category);
  };

  if (loading) return <p className="text-center py-10 text-[var(--bc)]">Loading menu...</p>;

  return (
    <section className="min-h-screen max-w-full flex justify-center">
      <div className="py-16 max-w-7xl mx-auto w-full">
        <div className="h-20">
          <h1 className="px-6 text-4xl font-serif text-center font-semibold text-[var(--bc)] bg-clip-text bg-gradient-to-r from-yellow-400 via-orange-500 to-black">
            Discover Our Menu
          </h1>
        </div>

        {/* Category Tiles */}
        <div className="flex flex-wrap justify-center gap-6 mb-12 px-6">
          {groupedMenu.map(({ title }) => (
            <div
              key={title}
              className={`w-24 h-24 rounded-xl shadow-2xl flex items-center justify-center cursor-pointer transition-all duration-300
                text-white text-center text-sm font-semibold leading-tight
                ${expandedCategory === title ? 'bg-amber-600' : 'bg-amber-800'}`}
              onClick={() => handleCategoryClick(title)}
            >
              {title}
            </div>
          ))}
        </div>

        {/* Expandable MenuCategory */}
        {expandedCategory && (
          <div className="transition-all duration-500 ease-in-out">
            {groupedMenu
              .filter((group) => group.title === expandedCategory)
              .map((group) => (
                <MenuCategory key={group.title} title={group.title} items={group.items} />
              ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default MenuPage;
