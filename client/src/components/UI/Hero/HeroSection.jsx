import React from 'react';
import { Link } from 'react-router';

const HeroSection = () => {
  return (
    <section className="relative h-[600px] overflow-hidden">
      <video
        autoPlay
        muted
        loop
        playsInline
        className="w-full h-full object-cover absolute inset-0 z-0"
        src=".../public/assets/belsy_hero_silent_video.mp4" //
      />
      
      {/* Overlay using dynamic background color */}
      <div className="absolute bg-amber-300 inset-0 z-10 flex items-center justify-center text-center px-4">
        <div className="text-white max-w-3xl">
          <h1 className="hero-header text-4xl font-extrabold text-center mb-6 transition-all shadow-xl">
            Welcome to Belsy Restaurant
          </h1>
          <Link to="/menu">
            <button className="bg-[var(--primary-color)] text-white px-6 py-3 text-lg rounded-lg hover:bg-[var(--accent-color)] transition">
              View Menu
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
