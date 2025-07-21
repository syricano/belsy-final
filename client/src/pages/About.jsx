import { useEffect, useState } from 'react';
import { getContactInfo } from '@/data/contact';
import { errorHandler } from '@/utils';

const About = () => {
  const [info, setInfo] = useState(null);
  const [mapLoaded, setMapLoaded] = useState(false); // ✅ track iframe loading

  useEffect(() => {
    getContactInfo()
      .then(setInfo)
      .catch((err) => errorHandler(err, 'Failed to load contact info'));
  }, []);

  return (
    <section className="main-section min-h-screen px-6 md:px-20 py-12 space-y-16">
      
      {/* Intro Section */}
      <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-center gap-10">
        {/* Text */}
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

        {/* Image */}
        <div className="flex-1 max-w-sm w-full">
          <div className="w-full aspect-[4/5] rounded-2xl overflow-hidden shadow-lg">
            <img
              src="images/belsy-restaurant.jpg"
              alt="Belsy Interior"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>

      {/* Contact Info Section */}
      {info && (
        <div className="max-w-4xl mx-auto bg-[var(--b1)] text-[var(--bc)] p-6 rounded-xl shadow border border-[var(--border-color)]">
          <h3 className="text-2xl font-serif font-semibold mb-4 text-center">Address & Contact Info</h3>
          <div className="space-y-2 text-center text-lg">
            <p><strong>📞 Phone:</strong> {info.phone}</p>
            <p><strong>📧 Email:</strong> {info.email}</p>
            <p><strong>📍 Address:</strong> {info.address}</p>
          </div>

          <div className="max-w-4xl mx-auto mt-8 rounded-xl overflow-hidden shadow-lg border border-[var(--border-color)] relative h-[300px]">
            {!mapLoaded && (
              <div className="absolute inset-0 flex justify-center items-center bg-[var(--b1)] z-10">
                <span className="loading loading-spinner text-[var(--bc)] w-10 h-10" />
              </div>
            )}
            <iframe
              title="Belsy Location"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d6284.232127867992!2d3.3881076769434193!3d50.6056295761779!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47c2e0744996fc73%3A0x4d06c63cf123443f!2sBel'sy!5e1!3m2!1sen!2sde!4v1752972756791!5m2!1sen!2sde"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              onLoad={() => setMapLoaded(true)}
            ></iframe>
          </div>
        </div>
      )}
    </section>
  );
};

export default About;
