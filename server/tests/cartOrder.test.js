import { test, beforeEach } from 'node:test';
import { strictEqual, deepStrictEqual } from 'node:assert';
import { addItemToCart } from '../controllers/cartController.js';
import { checkout, adminUpdatePayment, userUpdatePayment } from '../controllers/orderController.js';
import {
  createStripeIntent,
  confirmStripePayment,
  createPaypalOrder,
  capturePaypalOrder
} from '../controllers/paymentController.js';
import Cart from '../models/Cart.js';
import CartItem from '../models/CartItem.js';
import Menu from '../models/Menu.js';
import Order from '../models/Order.js';
import OrderItem from '../models/OrderItem.js';
import sequelize from '../db/index.js';

const memory = {
  cart: { id: 1, userId: null, guestId: 'guest', CartItems: [] },
  orders: [],
};

const createRes = () => {
  const res = {};
  res.cookies = {};
  res.cookie = (name, value) => { res.cookies[name] = value; };
  res.statusCode = 200;
  res.status = (code) => { res.statusCode = code; return res; };
  res.json = (data) => { res.data = data; return res; };
  return res;
};

beforeEach(() => {
  memory.cart = { id: 1, userId: null, guestId: 'guest', CartItems: [] };
  memory.orders = [];

  Cart.findOne = async () => memory.cart;
  Cart.create = async () => memory.cart;
  Cart.findByPk = async () => memory.cart;

  const attachMutators = (item) => ({
    ...item,
    save: async function () { return this; },
    destroy: async function () {
      memory.cart.CartItems = memory.cart.CartItems.filter((i) => i.id !== this.id);
    }
  });

  CartItem.findOne = async ({ where }) => {
    const found = memory.cart.CartItems.find((i) => {
      const menuMatch = where.menuId ? i.menuId === where.menuId : true;
      const cartMatch = where.cartId ? i.cartId === where.cartId : true;
      const idMatch = where.id ? i.id === where.id : true;
      return menuMatch && cartMatch && idMatch;
    });
    return found ? attachMutators(found) : null;
  };
  CartItem.create = async (payload) => {
    const item = attachMutators({ ...payload, id: memory.cart.CartItems.length + 1 });
    memory.cart.CartItems.push(item);
    return item;
  };
  CartItem.destroy = async ({ where }) => {
    memory.cart.CartItems = memory.cart.CartItems.filter((i) => !(where.cartId && i.cartId === where.cartId) && !(where.id && i.id === where.id));
  };

  Menu.findByPk = async (id) => ({ id, name: `Item ${id}`, price: 10 });

  const attachOrderMutators = (order) => ({
    ...order,
    save: async function () {
      const idx = memory.orders.findIndex((o) => o.id === this.id);
      if (idx >= 0) memory.orders[idx] = { ...memory.orders[idx], ...this };
      return this;
    },
  });

  Order.create = async (payload) => {
    const order = attachOrderMutators({ ...payload, id: memory.orders.length + 1 });
    memory.orders.push(order);
    return order;
  };
  Order.findByPk = async (id) => {
    const base = memory.orders.find((o) => o.id === id);
    if (!base) return null;
    return attachOrderMutators({ ...base, OrderItems: memory.orderItems?.filter((oi) => oi.orderId === id) || [] });
  };
  Order.findAll = async () => memory.orders;

  memory.orderItems = [];
  OrderItem.create = async (payload) => {
    const item = { ...payload, id: memory.orderItems.length + 1 };
    memory.orderItems.push(item);
    return item;
  };

  sequelize.transaction = async (cb) => cb({});
});

test('addItemToCart adds new item and computes totals', async () => {
  const req = { body: { menuId: 1, quantity: 2 }, cookies: {} };
  const res = createRes();

  await addItemToCart(req, res, (err) => { if (err) throw err; });

  strictEqual(res.statusCode, 201);
  strictEqual(memory.cart.CartItems.length, 1);
  deepStrictEqual(res.data.total, 20);
  strictEqual(res.data.subtotalGross, 20);
  strictEqual(res.data.items[0].priceGross, 10);
  strictEqual(res.data.items[0].priceNet < res.data.items[0].priceGross, true);
  strictEqual(res.data.subtotalVat > 0, true);
  strictEqual(Math.abs(res.data.subtotalGross - (res.data.subtotalNet + res.data.subtotalVat)) < 0.02, true);
});

test('checkout creates order and clears cart', async () => {
  memory.cart.CartItems = [{ id: 1, cartId: 1, menuId: 1, quantity: 1, name: 'Item', price: 10, destroy: async function(){ memory.cart.CartItems=[]; } }];
  const req = { body: { name: 'Guest', email: 'guest@example.com', phone: '123' }, cookies: {} };
  const res = createRes();

  await checkout(req, res, (err) => { if (err) throw err; });

  strictEqual(res.statusCode, 201);
  strictEqual(memory.orders.length, 1);
  strictEqual(memory.cart.CartItems.length, 0);
  strictEqual(res.data.total, 10);
  strictEqual(res.data.subtotalGross, 10);
  strictEqual(res.data.subtotalVat > 0, true);
  strictEqual(Math.abs(res.data.subtotalGross - (res.data.subtotalNet + res.data.subtotalVat)) < 0.02, true);
});

test('checkout with cash stays unpaid and pending', async () => {
  memory.cart.CartItems = [{ id: 1, cartId: 1, menuId: 1, quantity: 1, name: 'Item', price: 10, destroy: async function(){ memory.cart.CartItems=[]; } }];
  const req = { body: { name: 'Guest', email: 'guest@example.com', phone: '123', paymentMethod: 'cash' }, cookies: {} };
  const res = createRes();

  await checkout(req, res, (err) => { if (err) throw err; });

  strictEqual(res.data.paymentMethod, 'cash');
  strictEqual(res.data.paymentStatus, 'Unpaid');
  strictEqual(res.data.status, 'Pending');
  strictEqual(res.data.paidAt, null);
});

test('checkout captures payment method and defaults payment status', async () => {
  memory.cart.CartItems = [{ id: 1, cartId: 1, menuId: 1, quantity: 1, name: 'Item', price: 10, destroy: async function(){ memory.cart.CartItems=[]; } }];
  const req = { body: { name: 'Guest', email: 'guest@example.com', phone: '123', paymentMethod: 'card' }, cookies: {} };
  const res = createRes();

  await checkout(req, res, (err) => { if (err) throw err; });

  strictEqual(res.data.paymentMethod, 'card');
  strictEqual(res.data.paymentStatus, 'Unpaid');
});

test('admin can update payment status', async () => {
  memory.orders.push({ id: 1, paymentStatus: 'Unpaid', paymentMethod: 'cash' });
  const req = { params: { id: 1 }, body: { paymentStatus: 'Paid', paymentMethod: 'card' } };
  const res = createRes();

  await adminUpdatePayment(req, res, (err) => { if (err) throw err; });
  strictEqual(res.data.paymentStatus, 'Paid');
});

test('user cannot update payment for someone else', async () => {
  memory.orders.push({ id: 1, userId: 2, status: 'Pending', paymentStatus: 'Unpaid', paymentMethod: 'cash' });
  const req = { params: { id: 1 }, body: { paymentMethod: 'cash' }, user: { id: 3 } };
  const res = createRes();

  await userUpdatePayment(req, res, (err) => { if (err) res.status(err.statusCode || 500).json({ error: err.message }); });
  strictEqual(res.statusCode, 403);
});

test('cash payment update confirms order but stays unpaid', async () => {
  const order = { id: 1, userId: 5, status: 'Pending', paymentStatus: 'Unpaid', paymentMethod: 'card' };
  memory.orders.push(order);
  const req = { params: { id: 1 }, body: { paymentMethod: 'cash', paymentStatus: 'Paid' }, user: { id: 5 } };
  const res = createRes();

  await userUpdatePayment(req, res, (err) => { if (err) throw err; });

  strictEqual(res.data.paymentStatus, 'Unpaid');
  strictEqual(res.data.status, 'Confirmed');
  strictEqual(res.data.paymentMethod, 'cash');
  strictEqual(res.data.paidAt, null);
});

test('card payment flow creates intent then confirms payment', async () => {
  const order = { id: 1, userId: 7, status: 'Pending', paymentStatus: 'Unpaid', paymentMethod: 'cash', total: 30 };
  memory.orders.push(order);

  const intentReq = { body: { orderId: 1 }, user: { id: 7 } };
  const intentRes = createRes();
  await createStripeIntent(intentReq, intentRes, (err) => { if (err) throw err; });
  strictEqual(intentRes.data.status, 'requires_confirmation');
  strictEqual(intentRes.data.amount, 30);

  const confirmReq = { body: { orderId: 1, paymentIntentId: intentRes.data.paymentIntentId }, user: { id: 7 } };
  const confirmRes = createRes();
  await confirmStripePayment(confirmReq, confirmRes, (err) => { if (err) throw err; });

  strictEqual(confirmRes.data.paymentStatus, 'Paid');
  strictEqual(confirmRes.data.status, 'Confirmed');
  strictEqual(confirmRes.data.paymentMethod, 'card');
  strictEqual(confirmRes.data.paidAt !== null && confirmRes.data.paidAt !== undefined, true);
});

test('paypal payment flow creates approval then captures', async () => {
  const order = { id: 1, userId: 8, status: 'Pending', paymentStatus: 'Unpaid', paymentMethod: 'cash', total: 45 };
  memory.orders.push(order);

  const createReq = { body: { orderId: 1 }, user: { id: 8 } };
  const createResObj = createRes();
  await createPaypalOrder(createReq, createResObj, (err) => { if (err) throw err; });
  strictEqual(createResObj.data.status, 'requires_capture');
  strictEqual(createResObj.data.amount, 45);

  const captureReq = { body: { orderId: 1, paypalOrderId: createResObj.data.paypalOrderId }, user: { id: 8 } };
  const captureRes = createRes();
  await capturePaypalOrder(captureReq, captureRes, (err) => { if (err) throw err; });

  strictEqual(captureRes.data.paymentStatus, 'Paid');
  strictEqual(captureRes.data.status, 'Confirmed');
  strictEqual(captureRes.data.paymentMethod, 'paypal');
  strictEqual(captureRes.data.paidAt !== null && captureRes.data.paidAt !== undefined, true);
});

test('cannot confirm payment for already paid order', async () => {
  const order = { id: 1, userId: 9, status: 'Confirmed', paymentStatus: 'Paid', paymentMethod: 'card', paidAt: new Date(), total: 20 };
  memory.orders.push(order);

  const confirmReq = { body: { orderId: 1, paymentIntentId: 'pi_test' }, user: { id: 9 } };
  const res = createRes();
  await confirmStripePayment(confirmReq, res, (err) => { if (err) res.status(err.statusCode || 500).json({ error: err.message }); });

  strictEqual(res.statusCode >= 400, true);
});
