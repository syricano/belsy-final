import React from 'react';
import HeroSection from '../components/UI/Hero/HeroSection';
import ImageSlider from '../components/UI/Hero/ImageSlider';

const HomePage = () => {
  return (
    <main className="min-h-screen bg-[var(--main-bg-color)] text-[var(--text-color)] flex flex-col items-center px-4 py-6 gap-8 lg:gap-12">
      <HeroSection />
      <ImageSlider />
    </main>
  );
};

export default HomePage;
