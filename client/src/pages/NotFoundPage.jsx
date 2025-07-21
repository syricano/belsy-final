import { Link } from 'react-router';

const NotFound = () => {
  return (
    <section className="main-section min-h-screen flex flex-col items-center justify-center px-6 py-16 text-center">
      <h1 className="text-[120px] sm:text-[160px] font-extrabold text-[var(--bc)] leading-none">
        404
      </h1>
      <p className="text-xl md:text-2xl text-[var(--bc)] font-serif mb-6">
        Oops! The page you're looking for could not be found 😢
      </p>
      <Link
        to="/"
        className="btn btn-primary px-6 py-3 text-lg font-semibold rounded-xl transition duration-300"
      >
        Back to Home
      </Link>
    </section>
  );
};

export default NotFound;
