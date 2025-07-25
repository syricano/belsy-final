import React, { useEffect, useState } from 'react';

const imageModules = import.meta.glob('/src/assets/slider/*.{jpg,jpeg,png,webp}', {
  eager: true,
});
const images = Object.values(imageModules).map((mod) => mod.default);

const ImageSlider = () => {
  const [loading, setLoading] = useState(true);
  const [loadedImages, setLoadedImages] = useState([]);

  useEffect(() => {
    let loaded = [];

    images.forEach((src) => {
      const img = new Image();
      img.src = src;

      const markLoaded = () => {
        loaded.push(src);
        if (loaded.length === images.length) {
          setLoadedImages(loaded);
          setLoading(false);
        }
      };

      img.onload = markLoaded;
      img.onerror = markLoaded;
    });
  }, []);

  return (
    <section className="py-8 bg-[var(--main-bg-color)] text-[var(--main-text-color)]">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-3xl font-serif text-center mb-6 text-[var(--bc)]">
          A Glimpse of Our Atmosphere
        </h2>

        {loading ? (
          <div className="w-full flex justify-center py-10">
            <span className="loading loading-spinner text-[var(--bc)] w-10 h-10" />
          </div>
        ) : (
          <div className="carousel w-full rounded-3xl shadow-2xl overflow-hidden h-[50vh] sm:h-[70vh] md:h-[80vh]">
            {loadedImages.map((src, index) => {
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
                    className="w-full h-full object-contain sm:object-cover transition-opacity duration-500"
                  />
                  <div className="absolute left-5 right-5 top-1/2 flex -translate-y-1/2 transform justify-between">
                    <a
                      href={`#slide${prevIndex + 1}`}
                      className="btn btn-circle bg-amber-800 text-white hover:bg-amber-600 border-none shadow-md"
                    >
                      ❮
                    </a>
                    <a
                      href={`#slide${nextIndex + 1}`}
                      className="btn btn-circle bg-amber-800 text-white hover:bg-amber-600 border-none shadow-md"
                    >
                      ❯
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};

export default ImageSlider;
