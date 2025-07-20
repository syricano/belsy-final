import React from 'react';
import HeroSection from '../components/UI/HeroSection';
import ImageSlider from '../components/UI/ImageSlider';
import HappyCustomers from '@/components/UI/HappyCustomers';

const HomePage = () => {
  return (
    <div className="main-section min-h-screen flex flex-col items-center justify-center gap-12 py-12 px-4">
      <HeroSection />
      <ImageSlider />
      <HappyCustomers />
    </div>
  );
};

export default HomePage;
