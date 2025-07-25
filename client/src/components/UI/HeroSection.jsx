import React from 'react';
import { useModal } from '@/context/ModalContext';

const HeroSection = () => {
  const { setOpen } = useModal();

  return (
    <section className="relative w-full h-[90vh] md:h-screen overflow-hidden rounded-3xl">
      {/* Hero Background Image */}
      <img
        src="/images/hero.jpg"
        alt="Syrian cuisine table setup"
        className="absolute inset-0 w-full h-full object-cover rounded-3xl object-center"
      />

      {/* Soft gradient for contrast */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/40 to-black/70" />

      {/* Centered Content with Animation */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full text-center text-white px-4 animate-fade-in-up">
        <h1 className="text-5xl md:text-6xl font-bold font-serif drop-shadow-md">
          Taste The Oriental Food
        </h1>
        <p className="mt-6 text-lg md:text-xl max-w-2xl drop-shadow-sm">
          Experience the richness of authentic Syrian flavors in every dish. Elegant ambiance, unforgettable taste.
        </p>
        <button
          onClick={() => setOpen(true)}
          className="mt-10 px-8 py-3 text-lg font-semibold rounded-full bg-[var(--p)] text-[var(--pc)] shadow-lg hover:bg-opacity-80 focus:ring-4 focus:ring-[var(--p)] transition-all"
        >
          Book Your Table Now
        </button>
      </div>
    </section>
  );
};

export default HeroSection;
