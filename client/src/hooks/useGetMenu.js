import { useEffect, useState } from 'react';
import { getMenu, getCategories } from '@/data';
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
      const [items, rawCategories] = await Promise.all([getMenu(), getCategories()]);

      const categories = Array.isArray(rawCategories) ? rawCategories : [];

      const transformedItems = items.map(item => ({
        ...item,
        image: getFullImageUrl(item.image),
      }));

      const grouped = categories.map((cat) => ({
        title: cat.name,
        items: transformedItems.filter((item) => item.categoryId === cat.id),
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
