import React from 'react';

const testimonials = [
  {
    name: 'Sarah M.',
    message: 'Absolutely loved the food! Warm atmosphere and fantastic service.',
  },
  {
    name: 'Ali H.',
    message: 'The falafel reminded me of home. Belsy is now my favorite spot.',
  },
  {
    name: 'Leila A.',
    message: 'Best kibbeh I’ve had in Germany. Thank you for the hospitality!',
  },
  {
    name: 'Jamal K.',
    message: 'Friendly staff, quick service, and authentic Syrian dishes!',
  },
  {
    name: 'Nora T.',
    message: 'Belsy is a hidden gem. Cozy interior and rich flavors!',
  },
];

const HappyCustomers = () => {
  return (
    <section className="w-full bg-[var(--b1)] text-[var(--bc)] py-16 px-6">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-serif font-bold text-center mb-10">
          💬 Happy Customers
        </h2>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((review, idx) => (
            <div
              key={idx}
              className="bg-[var(--n)] text-[var(--nc)] border border-[var(--border-color)] rounded-xl p-6 shadow-lg transition hover:shadow-xl"
            >
              <p className="text-md italic mb-4">“{review.message}”</p>
              <p className="text-right font-semibold opacity-80">— {review.name}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HappyCustomers;
