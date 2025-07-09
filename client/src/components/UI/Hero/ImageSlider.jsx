// src/components/ImageSlider.jsx

import React, { useRef } from 'react';

const images = [
  './public/images/chicken.jpg',
  './public/images/falafel.jpg',
  './public/images/fish.jpg',
  './public/images/kabab.jpg',
  './public/images/yaprak.jpg'
];

const ImageSlider = () => {
  const scrollRef = useRef(null);

  const handleScrollLeft = () => {
    scrollRef.current.scrollBy({ left: -300, behavior: 'smooth' });
  };

  const handleScrollRight = () => {
    scrollRef.current.scrollBy({ left: 300, behavior: 'smooth' });
  };

  return (
    <section className="relative h-[55vh] py-8 px-4 bg-[var(--main-bg-color)] text-[var(--text-color)]">
      <h2 className="text-3xl font-serif text-center mb-6">A Glimpse of Our Atmosphere</h2>

      {/* Left Arrow Button */}
      <button
        onClick={handleScrollLeft}
        className="
          absolute left-4 top-1/2 transform -translate-y-1/2
          flex items-center justify-center
          h-16 w-16
          rounded-xl shadow-2xl
          bg-amber-800 text-white text-3xl font-bold
          cursor-pointer
          transition-all duration-300
          hover:bg-amber-600 hover:-translate-y-1
          z-10
        "
        aria-label="Scroll Left"
      >
        ({'<'})
      </button>

      {/* Right Arrow Button */}
      <button
        onClick={handleScrollRight}
        className="
          absolute right-4 top-1/2 transform -translate-y-1/2
          flex items-center justify-center
          h-16 w-16
          rounded-xl shadow-2xl
          bg-amber-800 text-white text-3xl font-bold
          cursor-pointer
          transition-all duration-300
          hover:bg-amber-600 hover:-translate-y-1
          z-10
        "
        aria-label="Scroll Right"
      >
        {'>'})
      </button>

      {/* Image Container */}
      <div
        ref={scrollRef}
        className="flex space-x-4 overflow-x-auto scrollbar-hide scroll-smooth px-20"
      >
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
