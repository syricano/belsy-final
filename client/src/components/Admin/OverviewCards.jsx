import React, { useEffect, useState } from 'react';
import axiosInstance from '@/config/axiosConfig';

const OverviewCards = () => {
  const [stats, setStats] = useState({
    reservations: 0,
    tables: 0,
    menuItems: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [res1, res2, res3, res4] = await Promise.all([
          axiosInstance.get('/reservations/admin'),
          axiosInstance.get('/tables'),
          axiosInstance.get('/menu'),
        ]);
        setStats({
          reservations: res1.data.length,
          tables: res2.data.length,
          menuItems: res3.data.length,
        });
      } catch (err) {
        console.error('Failed to fetch dashboard stats');
      }
    };

    fetchStats();
  }, []);

  const cardClass = 'bg-white dark:bg-base-100 shadow-xl rounded-lg p-6 text-center flex-1';

  return (
    <section className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <div className={cardClass}>
        <h3 className="text-2xl font-semibold text-amber-800">Reservations</h3>
        <p className="text-3xl font-bold mt-2">{stats.reservations}</p>
      </div>
      <div className={cardClass}>
        <h3 className="text-2xl font-semibold text-amber-800">Tables</h3>
        <p className="text-3xl font-bold mt-2">{stats.tables}</p>
      </div>
      <div className={cardClass}>
        <h3 className="text-2xl font-semibold text-amber-800">Menu Items</h3>
        <p className="text-3xl font-bold mt-2">{stats.menuItems}</p>
      </div>
      
    </section>
  );
};

export default OverviewCards;
