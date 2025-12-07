import crypto from 'crypto';
import Cart from '../models/Cart.js';
import CartItem from '../models/CartItem.js';
import Menu from '../models/Menu.js';
import ErrorResponse from '../utils/errorResponse.js';
import { computeVat, roundPrice } from '../utils/vat.js';
import { pickTranslation } from '../utils/localization.js';

const isProduction = process.env.NODE_ENV === 'production';

const cartCookieOptions = {
  httpOnly: true,
  secure: isProduction,
  sameSite: isProduction ? 'none' : 'lax',
  maxAge: 7 * 24 * 60 * 60 * 1000,
};

const attachGuestCart = (res, guestId) => {
  res.cookie('cartId', guestId, cartCookieOptions);
};

const findOrCreateCart = async (req, res) => {
  const userId = req.user?.id || req.userId || null;
  const guestId = !userId ? req.cookies?.cartId || crypto.randomUUID() : null;

  const whereClause = userId ? { userId } : { guestId };
  let cart = await Cart.findOne({ where: whereClause });

  if (!cart) {
    cart = await Cart.create({ userId, guestId });
  }

  if (!userId && guestId) {
    attachGuestCart(res, guestId);
  }

  return cart;
};

const serializeCart = (cart, lang = 'en') => {
  const items = cart.CartItems?.map((item) => {
    const unitGross = Number(item.price) || 0;
    const pricing = computeVat({ gross: unitGross });
    const lineTotalGross = roundPrice(unitGross * item.quantity);
    const lineTotalNet = roundPrice(pricing.net * item.quantity);
    const lineTotalVat = roundPrice(pricing.vat * item.quantity);
    const displayName = pickTranslation(
      item.Menu?.nameTranslations,
      lang,
      item.Menu?.name || item.name,
    );

    return {
      id: item.id,
      menuId: item.menuId,
      name: displayName,
      price: pricing.gross,
      priceGross: pricing.gross,
      priceNet: pricing.net,
      vatAmount: pricing.vat,
      vatRate: pricing.rate,
      quantity: item.quantity,
      lineTotal: lineTotalGross,
      lineTotalGross,
      lineTotalNet,
      lineTotalVat,
    };
  }) || [];

  const subtotalGross = roundPrice(items.reduce((sum, item) => sum + item.lineTotalGross, 0));
  const subtotalNet = roundPrice(items.reduce((sum, item) => sum + item.lineTotalNet, 0));
  const subtotalVat = roundPrice(items.reduce((sum, item) => sum + item.lineTotalVat, 0));
  const total = subtotalGross;

  return { id: cart.id, items, total, subtotalGross, subtotalNet, subtotalVat };
};

export const getCart = async (req, res, next) => {
  try {
    const cart = await findOrCreateCart(req, res);
    const withItems = await Cart.findByPk(cart.id, { include: [{ model: CartItem, include: [Menu] }] });
    res.json(serializeCart(withItems, req.lang));
  } catch (err) {
    next(err);
  }
};

export const addItemToCart = async (req, res, next) => {
  try {
    const { menuId, quantity } = req.body;
    const menu = await Menu.findByPk(menuId);
    if (!menu) throw new ErrorResponse('Menu item not found', 404);
    const lang = req.lang;
    const localizedName = pickTranslation(menu.nameTranslations, lang, menu.name);

    const cart = await findOrCreateCart(req, res);
    const existing = await CartItem.findOne({ where: { cartId: cart.id, menuId } });

    if (existing) {
      existing.quantity += quantity;
      await existing.save();
    } else {
      await CartItem.create({
        cartId: cart.id,
        menuId,
        name: localizedName,
        price: menu.price,
        quantity,
      });
    }

    const withItems = await Cart.findByPk(cart.id, { include: [{ model: CartItem, include: [Menu] }] });
    res.status(201).json(serializeCart(withItems, lang));
  } catch (err) {
    next(err);
  }
};

export const updateCartItem = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { quantity } = req.body;
    const cart = await findOrCreateCart(req, res);

    const item = await CartItem.findOne({ where: { id, cartId: cart.id } });
    if (!item) throw new ErrorResponse('Item not found in cart', 404);

    if (quantity <= 0) {
      await item.destroy();
    } else {
      item.quantity = quantity;
      await item.save();
    }

    const withItems = await Cart.findByPk(cart.id, { include: [{ model: CartItem, include: [Menu] }] });
    res.json(serializeCart(withItems, req.lang));
  } catch (err) {
    next(err);
  }
};

export const removeCartItem = async (req, res, next) => {
  try {
    const { id } = req.params;
    const cart = await findOrCreateCart(req, res);
    const item = await CartItem.findOne({ where: { id, cartId: cart.id } });
    if (!item) throw new ErrorResponse('Item not found in cart', 404);
    await item.destroy();

    const withItems = await Cart.findByPk(cart.id, { include: [{ model: CartItem, include: [Menu] }] });
    res.json(serializeCart(withItems, req.lang));
  } catch (err) {
    next(err);
  }
};

export const clearCart = async (req, res, next) => {
  try {
    const cart = await findOrCreateCart(req, res);
    await CartItem.destroy({ where: { cartId: cart.id } });
    res.json({ message: 'Cart cleared' });
  } catch (err) {
    next(err);
  }
};

export const _internal = { findOrCreateCart, serializeCart }; // for testing/checkout reuse
