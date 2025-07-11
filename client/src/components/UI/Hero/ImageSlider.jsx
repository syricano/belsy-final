import React from 'react';

const images = [
  '/images/chicken.jpg',
  '/images/falafel.jpg',
  '/images/fish.jpg',
  '/images/kabab.jpg',
  '/images/yaprak.jpg',
  '/images/rose-drink.jpg',
  '/images/maqluba.jpg',
  '/images/veg-soup.jpg',
  '/images/shocolate.jpg',
];

const ImageSlider = () => {
  return (
    <section className="py-8 bg-[var(--main-bg-color)] text-[var(--main-text-color)]">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-serif text-center mb-6">
          A Glimpse of Our Atmosphere
        </h2>

        <div className="carousel w-full rounded-xl shadow-lg overflow-hidden">
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
                  className="w-full h-[300px] sm:h-[350px] object-cover"
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
