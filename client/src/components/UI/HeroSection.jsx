import React from 'react';
import { useModal } from '@/context/ModalContext';

const HeroSection = () => {
  const { setOpen } = useModal();

  return (
    <section className="relative w-full py-12 px-4">
      <div className="flex flex-col items-center justify-center text-center min-h-[500px] sm:min-h-[550px] md:min-h-[600px]">
        <div className="max-w-2xl">
          <h1 className="text-5xl font-bold text-[var(--bc)]">
            Taste The Oriental Food
          </h1>
          <p className="py-6 text-lg text-[var(--bc)]">
            Experience the richness of authentic Syrian flavors in every dish.
            From cozy evenings to grand celebrations, we serve tradition with elegance.
          </p>
          <button
            onClick={() => setOpen(true)}
            className="btn btn-primary"
          >
            Book Your Table Now
          </button>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
