import React, { useEffect, useState } from 'react';
import axiosInstance from '@/config/axiosConfig';

const OverviewCards = () => {
  const [stats, setStats] = useState({
    reservations: 0,
    tables: 0,
    menuItems: 0,
  });
  const [loading, setLoading] = useState(true);
  const [showMore, setShowMore] = useState(false);

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
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return (
    <section className="w-full mb-8 px-2">
      <div className="flex justify-center items-center gap-4 mb-4 px-2">
        <h2 className="text-xl font-semibold text-[var(--bc)]">Statistics</h2>
        <button
          className="text-sm text-[var(--bc)] hover:underline"
          onClick={() => setShowMore((prev) => !prev)}
        >
          {showMore ? 'Hide <<' : 'Show more >>'}
        </button>
      </div>

      {loading ? (
        <div className="w-full flex justify-center py-10">
          <span className="loading loading-spinner text-[var(--bc)] w-10 h-10" />
        </div>
      ) : showMore ? (
        <>
          <div className="flex flex-wrap justify-center gap-4 sm:gap-6">
            {[
              { label: 'Reservations', value: stats.reservations },
              { label: 'Tables', value: stats.tables },
              { label: 'Menu Items', value: stats.menuItems },
              { label: 'Feedback', value: 'Add' },
            ].map(({ label, value }, idx) => (
              <div
                key={idx}
                className="text-center sm:max-w-[140px] md:max-w-[180px] lg:w-[240px] bg-[var(--b1)] text-[var(--bc)] border border-[var(--border-color)] shadow-md rounded-xl p-4 transition hover:shadow-lg sm:block hidden"
              >
                <h3 className="text-lg font-semibold tracking-wide font-serif mb-1">
                  {label}
                </h3>
                <p className="text-3xl font-extrabold mt-1">{value}</p>
              </div>
            ))}

            {/* Mobile layout */}
            <div className="flex flex-col items-start gap-2 sm:hidden text-[var(--bc)]">
              <p>
                <span className="font-semibold">Reservations:</span> {stats.reservations}
              </p>
              <p>
                <span className="font-semibold">Tables:</span> {stats.tables}
              </p>
              <p>
                <span className="font-semibold">Menu Items:</span> {stats.menuItems}
              </p>
              <p>
                <span className="font-semibold">Feedback:</span> Add
              </p>
            </div>
          </div>
        </>
      ) : null}
    </section>
  );
};

export default OverviewCards;
