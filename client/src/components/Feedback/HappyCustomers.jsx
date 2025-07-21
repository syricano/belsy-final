import React from 'react';
import useFeedback from '@/hooks/useFeedback';

const HappyCustomers = () => {
  const { feedbacks, loading } = useFeedback();

  if (loading || !feedbacks.length) return null;

  return (
    <section className="w-full bg-[var(--b1)] text-[var(--bc)] py-16 px-6">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-serif font-bold text-center mb-10">
          💬 Happy Customers
        </h2>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {feedbacks.map((review) => (
            <div
              key={review.id}
              className="bg-[var(--n)] text-[var(--nc)] border border-[var(--border-color)] rounded-xl p-6 shadow-lg transition hover:shadow-xl"
            >
              <p className="text-md italic mb-4">“{review.message}”</p>
              
              <div className="flex justify-between items-center text-sm opacity-70">
                <span>— {review.name || 'Anonymous'}</span>
                {review.rating && <span className="text-yellow-400 font-bold">★ {review.rating}</span>}
              </div>

              {review.adminReply && (
                <div className="mt-4 p-3 bg-[var(--b1)] text-[var(--bc)] rounded border border-[var(--border-color)]">
                  <p className="text-sm italic mb-1">Admin Reply:</p>
                  <p className="text-sm">{review.adminReply}</p>
                </div>
              )}
            </div>
          ))}

        </div>
      </div>
    </section>
  );
};

export default HappyCustomers;
