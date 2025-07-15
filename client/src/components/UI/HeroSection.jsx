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
        <div className="container mx-auto px-4 text-[var--(main-text-color)] max-w-3xl flex flex-col items-center justify-center text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4 text-white bg-black/50 px-4 py-2 rounded-xl">
            Welcome to Belsy Restaurant
          </h1>

          <p className="text-base md:text-lg text-white bg-black/30 px-4 py-2 rounded-md font-light tracking-wide max-w-xl mx-auto mb-6">
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
