import React from 'react';

const About = () => {
  return (
    <section className="main-section min-h-screen flex items-center justify-center px-6 md:px-20 py-12">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-10 h-full">
        
        {/* Text Content */}
        <div className="flex-1">
          <h2 className="text-4xl md:text-5xl font-serif font-bold mb-6 text-[var(--bc)]">
            Welcome to Belsy Restaurant
          </h2>
          <p className="text-lg mb-4 text-[var(--bc)]">
            At Belsy, we bring authentic Syrian flavors to your table in a warm and elegant setting.
            Our cuisine blends tradition with creativity, using only the freshest ingredients.
          </p>
          <p className="text-md text-[var(--bc)]">
            Whether you're planning a cozy dinner, a family gathering, or a special celebration,
            Belsy offers an unforgettable experience – from the first bite to the last sip.
          </p>
        </div>

        {/* Image Section */}
        <div className="flex-1">
          <img
            src="./src/assets/belsy-restaurant.jpg"
            alt="Belsy Restaurant Interior"
            className="rounded-2xl shadow-lg"
          />
        </div>
      </div>
    </section>
  );
};

export default About;
