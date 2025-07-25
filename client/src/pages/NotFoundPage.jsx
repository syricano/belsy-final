import { Link } from 'react-router';

const NotFound = () => {
  return (
    <section className="main-section min-h-screen flex flex-col items-center justify-center px-6 py-16 text-center animate-fade-in-up">
      <div className="text-[80px] sm:text-[100px] mb-4 animate-bounce">
        🚧
      </div>
      <h1 className="text-[120px] sm:text-[160px] font-extrabold leading-none bg-gradient-to-r from-yellow-400 via-orange-500 to-black text-transparent bg-clip-text">
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
