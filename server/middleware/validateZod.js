import { z } from 'zod';

const validateZod = (zodSchema) => (req, res, next) => {
  const result = zodSchema.safeParse(req.body);
  if (!result.success) {
    const formatted = result.error.format();
    const error = new Error(JSON.stringify(formatted));
    error.statusCode = 400;
    return next(error);
  }
  req.sanitizedBody = result.data;
  next();
};
export default validateZod;