import { useEffect, useState } from 'react';
import { getAddress } from '@/data/address';
import { errorHandler } from '@/utils';
import { useLang } from '@/context';

const About = () => {
  const [info, setInfo] = useState(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const { t } = useLang();

  useEffect(() => {
    getAddress()
      .then(setInfo)
      .catch((err) => errorHandler(err, t('contact.load_error')));
  }, []);

  return (
    <section className="main-section min-h-screen px-6 md:px-20 py-12 space-y-16 animate-fade-in-up">
      {/* Intro Section */}
      <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-center gap-10">
        {/* Text */}
        <div className="flex-1">
          <h2 className="text-4xl md:text-5xl font-serif font-bold mb-6 text-[var(--bc)]">
            {t('about.title')}
          </h2>
          <p className="text-lg mb-4 text-[var(--bc)]">
            {t('about.body1')}
          </p>
          <p className="text-md text-[var(--bc)]">
            {t('about.body2')}
          </p>
        </div>

        {/* Image */}
        <div className="flex-1 max-w-sm w-full">
          <div className="w-full aspect-[4/5] rounded-2xl overflow-hidden shadow-lg">
            <img
              src="images/belsy-restaurant.jpg"
              alt="Belsy Interior"
              className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
            />
          </div>
        </div>
      </div>

      {/* Address Section */}
      {info && (
        <div className="max-w-4xl mx-auto bg-[var(--n)] text-[var(--nc)] p-6 rounded-xl shadow-md border border-[var(--border-color)]">
          <h3 className="text-2xl font-serif font-semibold mb-4 text-center">{t('about.location')}</h3>
          <div className="space-y-2 text-center text-lg">
            <p><strong>📞 {t('contact.phone')}:</strong> {info.phone}</p>
            <p><strong>📧 {t('contact.email')}:</strong> {info.email}</p>
            <p><strong>📍 {t('contact.address')}:</strong> {info.address}</p>
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
