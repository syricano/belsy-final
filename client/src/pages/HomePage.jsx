import React from 'react';
import HeroSection from '../components/UI/HeroSection';
import ImageSlider from '../components/UI/ImageSlider';

const HomePage = () => {
  return (
    <div className="flex flex-col items-center justify-center gap-12">
      <HeroSection />
      <ImageSlider />
    </div>
  );
};

export default HomePage;
