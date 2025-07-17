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
        const [res1, res2, res3] = await Promise.all([
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

  const cardClass =
    'bg-[var(--b1)] text-[var(--bc)] shadow-md rounded-xl p-6 text-center border border-[var(--border-color)] transition hover:shadow-lg';

  const cardTitle =
    'text-xl font-semibold tracking-wide font-serif mb-1';

  const cardValue =
    'text-4xl font-extrabold mt-1';

  return (
    <section className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <div className={cardClass}>
        <h3 className={cardTitle}>Reservations</h3>
        <p className={cardValue}>{stats.reservations}</p>
      </div>
      <div className={cardClass}>
        <h3 className={cardTitle}>Tables</h3>
        <p className={cardValue}>{stats.tables}</p>
      </div>
      <div className={cardClass}>
        <h3 className={cardTitle}>Menu Items</h3>
        <p className={cardValue}>{stats.menuItems}</p>
      </div>
    </section>
  );
};

export default OverviewCards;
