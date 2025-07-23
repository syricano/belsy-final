const errorHandler = (err, req, res, next) => {
  process.env.NODE_ENV !== 'production' && console.error(err.stack);

  // ✅ Handle Zod validation errors (from validateZod)
  try {
    const parsed = JSON.parse(err.message);
    if (typeof parsed === 'object' && parsed !== null) {
      const firstField = Object.keys(parsed).find(
        (key) => parsed[key]?._errors?.length
      );
      const message = parsed[firstField]?._errors?.[0] || 'Invalid input';
      return res.status(400).json({ error: message });
    }
  } catch (_) {
    // Not a JSON Zod error — continue below
  }

  // ✅ Handle standard ErrorResponse or others
  res.status(err.statusCode || 500).json({
    error: err.message || 'Something went wrong',
  });
};

export default errorHandler;
