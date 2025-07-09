import React from 'react';
import { Link } from 'react-router';

const HeroSection = () => {
  return (
    <section className="relative h-[500px] sm:h-[550px] md:h-[600px] overflow-hidden w-full">
      <video
        autoPlay
        muted
        loop
        playsInline
        className="w-full h-full object-cover absolute inset-0 z-0"
        src="./src/assets/belsy_hero_silent_video.mp4"
      />

      <div className="absolute inset-0 z-10 flex items-center justify-center text-center px-4">
        <div className="text-white max-w-3xl">
          <h1 className="text-4xl font-extrabold text-[var(--text-color)] mb-4 shadow-xl">
            Welcome to Belsy Restaurant
          </h1>

          <p className="text-lg font-light tracking-wide max-w-xl mx-auto mb-4">
            Explore our delicious menu and reserve a table today.
          </p>

          <Link to="/menu" className="inline-block">
            <button
              className="
                flex items-center justify-center
                px-6 py-3
                rounded-xl shadow-2xl
                bg-amber-800 text-white text-lg font-bold
                cursor-pointer
                transition-all duration-300
                hover:bg-amber-600 hover:-translate-y-1
              "
            >
              View Menu
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
