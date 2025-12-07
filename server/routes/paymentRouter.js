import express from 'express';
import verifyToken from '../middleware/verifyToken.js';
import validateZod from '../middleware/validateZod.js';
import {
  confirmStripePayment,
  createPaypalOrder,
  createStripeIntent,
  capturePaypalOrder,
} from '../controllers/paymentController.js';
import {
  stripeIntentSchema,
  stripeConfirmSchema,
  paypalCreateSchema,
  paypalCaptureSchema,
} from '../zod/Schemas.js';

const paymentRouter = express.Router();

paymentRouter.use(verifyToken);

paymentRouter.post('/stripe/intent', validateZod(stripeIntentSchema), createStripeIntent);
paymentRouter.post('/stripe/confirm', validateZod(stripeConfirmSchema), confirmStripePayment);
paymentRouter.post('/paypal/create', validateZod(paypalCreateSchema), createPaypalOrder);
paymentRouter.post('/paypal/capture', validateZod(paypalCaptureSchema), capturePaypalOrder);

export default paymentRouter;
