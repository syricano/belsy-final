import { z } from 'zod';

const validateZod = (zodSchema) => (req, res, next) => {
  const result = zodSchema.safeParse(req.body);
  if (!result.success) {
    return next(new Error(JSON.stringify(result.error.format()), { cause: 400 }));
  }
  req.sanitizedBody = result.data;
  next();
};
export default validateZod;