const NotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-purple-500 to-pink-500 text-white">
      <h1 className="text-8xl lg:text-9xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-pink-600">
        404
      </h1>
      <p className="text-xl lg:text-2xl font-semibold text-gray-100 mt-4">
        Oops! The page you're looking for could not be found{' '}
        <span role="img" aria-label="crying face">
          😢
        </span>
      </p>
      <div className="mt-6">
        <a href="/" className="text-lg lg:text-xl text-gray-200 hover:text-white font-semibold border-b-2 border-gray-200 hover:border-transparent transition duration-300">
          Go Back to Home
        </a>
      </div>
    </div>
  );
};

export default NotFound;
