import Order from '../models/Order.js';
import OrderItem from '../models/OrderItem.js';
import ErrorResponse from '../utils/errorResponse.js';
import { buildOrderResponse } from './orderController.js';

const requireOwnedOrder = async (orderId, userId) => {
  const order = await Order.findByPk(orderId, { include: [OrderItem] });
  if (!order) throw new ErrorResponse('Order not found', 404);
  const isOwner = order.userId && order.userId === userId;
  if (!isOwner) throw new ErrorResponse('Not authorized to update this order', 403);
  if (order.status?.toLowerCase() === 'cancelled') {
    throw new ErrorResponse('Cannot pay for a cancelled order', 400);
  }
  return order;
};

const ensurePendingUnpaid = (order) => {
  if (order.status?.toLowerCase() !== 'pending') {
    throw new ErrorResponse('Order is not pending', 400);
  }
  if (order.paymentStatus?.toLowerCase() !== 'unpaid') {
    throw new ErrorResponse('Order payment already processed', 400);
  }
};

export const createStripeIntent = async (req, res, next) => {
  try {
    const { orderId } = req.body;
    const userId = req.user?.id || req.userId;
    const order = await requireOwnedOrder(orderId, userId);
    ensurePendingUnpaid(order);

    const paymentIntentId = `pi_${order.id}_${Date.now()}`;
    const clientSecret = `secret_${paymentIntentId}`;

    res.json({
      orderId: order.id,
      amount: Number(order.total || 0),
      currency: 'usd',
      status: 'requires_confirmation',
      paymentIntentId,
      clientSecret,
    });
  } catch (err) {
    next(err);
  }
};

export const confirmStripePayment = async (req, res, next) => {
  try {
    const { orderId, paymentIntentId } = req.body;
    if (!paymentIntentId) {
      throw new ErrorResponse('paymentIntentId is required', 400);
    }
    const userId = req.user?.id || req.userId;
    const order = await requireOwnedOrder(orderId, userId);
    ensurePendingUnpaid(order);

    order.paymentMethod = 'card';
    order.paymentStatus = 'Paid';
    order.paidAt = new Date();
    if (order.status?.toLowerCase() === 'pending') {
      order.status = 'Confirmed';
    }
    await order.save();

    const withItems = await Order.findByPk(order.id, { include: [OrderItem] });
    res.json(buildOrderResponse(withItems));
  } catch (err) {
    next(err);
  }
};

export const createPaypalOrder = async (req, res, next) => {
  try {
    const { orderId } = req.body;
    const userId = req.user?.id || req.userId;
    const order = await requireOwnedOrder(orderId, userId);
    ensurePendingUnpaid(order);

    const paypalOrderId = `po_${order.id}_${Date.now()}`;
    const approvalUrl = `https://paypal.example.com/checkout?token=${paypalOrderId}`;

    res.json({
      orderId: order.id,
      amount: Number(order.total || 0),
      currency: 'usd',
      status: 'requires_capture',
      approvalUrl,
      paypalOrderId,
    });
  } catch (err) {
    next(err);
  }
};

export const capturePaypalOrder = async (req, res, next) => {
  try {
    const { orderId, paypalOrderId } = req.body;
    if (!paypalOrderId) {
      throw new ErrorResponse('paypalOrderId is required', 400);
    }
    const userId = req.user?.id || req.userId;
    const order = await requireOwnedOrder(orderId, userId);
    ensurePendingUnpaid(order);

    order.paymentMethod = 'paypal';
    order.paymentStatus = 'Paid';
    order.paidAt = new Date();
    if (order.status?.toLowerCase() === 'pending') {
      order.status = 'Confirmed';
    }
    await order.save();

    const withItems = await Order.findByPk(order.id, { include: [OrderItem] });
    res.json(buildOrderResponse(withItems));
  } catch (err) {
    next(err);
  }
};
