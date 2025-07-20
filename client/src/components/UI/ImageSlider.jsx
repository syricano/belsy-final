import React from 'react';

// Automatically import all images from the slider folder
const imageModules = import.meta.glob('/src/assets/slider/*.{jpg,jpeg,png,webp}', {
  eager: true,
});
const images = Object.values(imageModules).map((mod) => mod.default);

const ImageSlider = () => {
  return (
    <section className="py-8 bg-[var(--main-bg-color)] text-[var(--main-text-color)]">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-3xl font-serif text-center mb-6 text-[var(--bc)]">
          A Glimpse of Our Atmosphere
        </h2>

        <div className="carousel w-full rounded-3xl shadow-2xl overflow-hidden h-[80vh]">
          {images.map((src, index) => {
            const prevIndex = (index - 1 + images.length) % images.length;
            const nextIndex = (index + 1) % images.length;

            return (
              <div
                id={`slide${index + 1}`}
                key={index}
                className="carousel-item relative w-full"
              >
                <img
                  src={src}
                  alt={`slide-${index}`}
                  className="w-full h-full object-cover"
                />
                <div className="absolute left-5 right-5 top-1/2 flex -translate-y-1/2 transform justify-between">
                  <a
                    href={`#slide${prevIndex + 1}`}
                    className="btn btn-circle bg-amber-800 text-white hover:bg-amber-600 border-none"
                  >
                    ❮
                  </a>
                  <a
                    href={`#slide${nextIndex + 1}`}
                    className="btn btn-circle bg-amber-800 text-white hover:bg-amber-600 border-none"
                  >
                    ❯
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ImageSlider;
