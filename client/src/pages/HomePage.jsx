import React from 'react';
import HeroSection from '../components/UI/Hero/HeroSection';
import ImageSlider from '../components/UI/Hero/ImageSlider';


const HomePage = () => {
  return (
    <div className="hero-section text-center my-10">      
      <HeroSection />
      <ImageSlider />
      <p className="hero-description text-xl ">Explore our delicious menu and reserve a table today.</p>
    </div>
  );
};

export default HomePage;
