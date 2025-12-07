import { useEffect, useState } from 'react';
import { getMenu } from '@/data';
import { errorHandler } from '@/utils';

const getFullImageUrl = (image) => {
  if (!image) return '';
  const base = import.meta.env.PROD
    ? 'https://belsy-final.onrender.com'
    : 'http://localhost:3000';
  return image.startsWith('/uploads/') ? `${base}${image}` : image;
};

const useGetMenu = () => {
  const [groupedMenu, setGroupedMenu] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchMenuData = async () => {
    try {
      const items = await getMenu();

      const transformedItems = items.map(item => ({
        ...item,
        image: getFullImageUrl(item.image),
      }));

      const categoriesMap = new Map();
      transformedItems.forEach((item) => {
        const categoryName = item.Category?.name || 'Uncategorized';
        if (!categoriesMap.has(categoryName)) {
          categoriesMap.set(categoryName, []);
        }
        categoriesMap.get(categoryName).push(item);
      });

      const grouped = Array.from(categoriesMap.entries()).map(([title, items]) => ({
        title,
        items,
      }));

      setGroupedMenu(grouped);
    } catch (err) {
      errorHandler(err, 'Failed to load menu');
      setGroupedMenu([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMenuData();
  }, []);

  return { groupedMenu, loading };
};

export default useGetMenu;
