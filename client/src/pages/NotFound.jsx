const NotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-primary-color to-secondary-color text-white">
      <h1 className="text-8xl lg:text-9xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-primary-color to-accent-color">
        404
      </h1>
      <p className="text-xl lg:text-2xl font-semibold text-text-color-dark mt-4">
        Oops! The page you're looking for could not be found{' '}
        <span role="img" aria-label="crying face">
          😢
        </span>
      </p>
      <div className="mt-6">
        <a
          href="/"
          className="text-lg lg:text-xl text-secondary-color hover:text-accent-color font-semibold border-b-2 border-secondary-color hover:border-transparent transition duration-300"
        >
          Go Back to Home
        </a>
      </div>
    </div>
  );
};

export default NotFound;
