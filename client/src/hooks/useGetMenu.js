import { useEffect, useState } from 'react';
import { getMenu, getCategories } from '@/data';
import { errorHandler } from '@/utils';

const useGetMenu = () => {
  const [groupedMenu, setGroupedMenu] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchMenuData = async () => {
    try {
      const [items, rawCategories] = await Promise.all([getMenu(), getCategories()]);

      const categories = Array.isArray(rawCategories) ? rawCategories : [];

      const grouped = categories.map((cat) => ({
        title: cat.name,
        items: items.filter((item) => item.categoryId === cat.id),
      }));

      setGroupedMenu(grouped);
    } catch (err) {
      errorHandler(err, 'Failed to load menu');
      setGroupedMenu([]); // optional: fallback to empty state
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
