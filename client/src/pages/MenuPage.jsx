import React, { useState, useEffect } from 'react';
import MenuCategory from '@/components/Menus/MenuCategory';
import useGetMenu from '@/hooks/useGetMenu';
import { useLang } from '@/context';

const MenuPage = () => {
  const { language, t } = useLang();
  const { groupedMenu, loading } = useGetMenu(language);
  const [expandedCategory, setExpandedCategory] = useState(null);

  useEffect(() => {
    if (groupedMenu.length > 0 && !expandedCategory) {
      setExpandedCategory(groupedMenu[0].title);
    }
  }, [groupedMenu]);

  const handleCategoryClick = (category) => {
    setExpandedCategory(expandedCategory === category ? null : category);
  };

  if (loading) {
    return (
      <div className="w-full flex justify-center py-10">
        <span className="loading loading-spinner text-[var(--bc)] w-10 h-10" />
      </div>
    );
  }

  if (!groupedMenu.length) {
    return (
      <div className="w-full flex justify-center py-20 text-[var(--bc)] text-xl font-medium">
        {t('menu.no_items')}
      </div>
    );
  }

  return (
    <section className="min-h-screen max-w-full flex justify-center">
      <div className="py-16 max-w-7xl mx-auto w-full animate-fade-in-up">
        <div className="h-20">
          <h1 className="px-6 text-4xl font-serif text-center font-semibold text-[var(--bc)] bg-clip-text bg-gradient-to-r from-yellow-400 via-orange-500 to-black">
            {t('menu.title')}
          </h1>
        </div>

        {/* Category Tiles */}
        <div className="flex flex-wrap justify-center gap-6 mb-12 px-6">
          {groupedMenu.map(({ title }) => (
            <div
              key={title}
              className={`w-24 h-24 rounded-xl shadow-xl flex items-center justify-center cursor-pointer transition-all duration-300 transform
                text-white text-center text-sm font-semibold leading-tight
                hover:scale-105 hover:shadow-2xl
                ${expandedCategory === title ? 'bg-amber-600' : 'bg-amber-800'}`}
              onClick={() => handleCategoryClick(title)}
            >
              {title}
            </div>
          ))}
        </div>

        {/* Expandable MenuCategory */}
        {expandedCategory && (
          <div className="transition-all duration-500 ease-in-out animate-fade-in-up">
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
