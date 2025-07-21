import React from 'react';
import HeroSection from '../components/UI/HeroSection';
import ImageSlider from '../components/UI/ImageSlider';
import HappyCustomers from '@/components/Feedback/HappyCustomers';
import FeedbackForm from '@/components/Feedback/feedbackForm';

const HomePage = () => {
  return (
    <div className="main-section min-h-screen flex flex-col items-center justify-center gap-12 py-12 px-4">
      <HeroSection />
      <ImageSlider />
      <HappyCustomers />
      <FeedbackForm />
    </div>
  );
};

export default HomePage;
