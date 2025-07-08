// src/components/ImageSlider.jsx
import React from 'react';

const images = [
  '/images/slide1.jpg',
  '/images/slide2.jpg',
  '/images/slide3.jpg',
  '/images/slide4.jpg',
];

const ImageSlider = () => {
  return (
    <section className="py-8 px-4 bg-amber-700">
      <h2 className="text-3xl font-serif text-center mb-6">A Glimpse of Our Atmosphere</h2>
      <div className="flex space-x-4 overflow-x-auto scrollbar-hide">
        {images.map((src, index) => (
          <img
            key={index}
            src={src}
            alt={`slide-${index}`}
            className="h-[350px] w-auto rounded-xl flex-shrink-0 shadow-lg"
          />
        ))}
      </div>
    </section>
  );
};

export default ImageSlider;
