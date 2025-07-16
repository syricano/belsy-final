import React from 'react';
import { useModal } from '@/context/ModalContext';

const HeroSection = () => {
  const { setOpen } = useModal();

  return (
    <section className="relative h-[500px] sm:h-[550px] md:h-[600px] overflow-hidden w-full">
      <div className="hero bg-base-200 min-h-screen">
        <div className="hero-content text-center">
          <div className="max-w-md">
            <h1 className="text-5xl font-bold">Taste The Oriental Food</h1>
            <p className="py-6">
              Provident cupiditate voluptatem et in. Quaerat fugiat ut assumenda excepturi exercitationem
              quasi. In deleniti eaque aut repudiandae et a id nisi.
            </p>
            <button
              onClick={() => setOpen(true)}
              className="btn btn-primary"
            >
              Book Your Table Now
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
