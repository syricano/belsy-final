import express from 'express';
import optionalAuth from '../middleware/optionalAuth.js';
import validateZod from '../middleware/validateZod.js';
import {
  addItemToCart,
  clearCart,
  getCart,
  removeCartItem,
  updateCartItem
} from '../controllers/cartController.js';
import { addCartItemSchema, updateCartItemSchema } from '../zod/Schemas.js';

const cartRouter = express.Router();

cartRouter.get('/', optionalAuth, getCart);
cartRouter.post('/items', optionalAuth, validateZod(addCartItemSchema), addItemToCart);
cartRouter.patch('/items/:id', optionalAuth, validateZod(updateCartItemSchema), updateCartItem);
cartRouter.delete('/items/:id', optionalAuth, removeCartItem);
cartRouter.delete('/', optionalAuth, clearCart);

export default cartRouter;
