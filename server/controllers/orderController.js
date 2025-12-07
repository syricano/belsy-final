import sequelize from '../db/index.js';
import Order from '../models/Order.js';
import OrderItem from '../models/OrderItem.js';
import CartItem from '../models/CartItem.js';
import Menu from '../models/Menu.js';
import ErrorResponse from '../utils/errorResponse.js';
import { _internal as cartInternal } from './cartController.js';
import { computeVat, roundPrice } from '../utils/vat.js';

export const buildOrderResponse = (order) => {
  const items = order.OrderItems?.map((item) => {
    const unitGross = Number(item.price) || 0;
    const pricing = computeVat({ gross: unitGross });
    const quantity = item.quantity || 0;
    const lineTotalGross = roundPrice(unitGross * quantity);
    const lineTotalNet = roundPrice(pricing.net * quantity);
    const lineTotalVat = roundPrice(pricing.vat * quantity);

    return {
      id: item.id,
      menuId: item.menuId,
      name: item.name,
      price: pricing.gross,
      priceGross: pricing.gross,
      priceNet: pricing.net,
      vatAmount: pricing.vat,
      vatRate: pricing.rate,
      quantity,
      lineTotal: lineTotalGross,
      lineTotalGross,
      lineTotalNet,
      lineTotalVat,
    };
  }) || [];

  const subtotalGross = items.length
    ? roundPrice(items.reduce((sum, i) => sum + i.lineTotalGross, 0))
    : roundPrice(Number(order.total) || 0);
  const subtotalNet = items.length
    ? roundPrice(items.reduce((sum, i) => sum + i.lineTotalNet, 0))
    : computeVat({ gross: subtotalGross }).net;
  const subtotalVat = items.length
    ? roundPrice(items.reduce((sum, i) => sum + i.lineTotalVat, 0))
    : roundPrice(subtotalGross - subtotalNet);

  const total = order.total != null ? roundPrice(order.total) : subtotalGross;

  return {
    id: order.id,
    status: order.status,
    paymentStatus: order.paymentStatus,
    paymentMethod: order.paymentMethod,
    paidAt: order.paidAt,
    total,
    subtotalGross,
    subtotalNet,
    subtotalVat,
    customerName: order.customerName,
    customerEmail: order.customerEmail,
    customerPhone: order.customerPhone,
    note: order.note,
    createdAt: order.createdAt,
    items,
  };
};

export const checkout = async (req, res, next) => {
  const { name, email, phone, note } = req.body;
  const paymentMethod = req.body.paymentMethod || 'cash';
  try {
    const baseCart = await cartInternal.findOrCreateCart(req, res);
    const cart = await baseCart.reload({ include: [CartItem] });

    if (!cart.CartItems || cart.CartItems.length === 0) {
      throw new ErrorResponse('Cart is empty', 400);
    }

    const userId = req.user?.id || req.userId || null;
    const guestId = userId ? null : cart.guestId;

    const requiredName = name || req.user?.firstName || req.user?.lastName;
    const requiredEmail = email || req.user?.email;
    const requiredPhone = phone || req.user?.phone;

    if (!requiredName || !requiredEmail || !requiredPhone) {
      throw new ErrorResponse('Name, email, and phone are required for checkout', 400);
    }

    const itemsWithPricing = [];
    for (const item of cart.CartItems) {
      const menu = await Menu.findByPk(item.menuId);
      if (!menu) throw new ErrorResponse(`Menu item ${item.menuId} is no longer available`, 404);
      const price = roundPrice(menu.price);
      itemsWithPricing.push({
        menuId: item.menuId,
        name: menu.name,
        price,
        quantity: item.quantity,
        lineTotal: roundPrice(price * item.quantity),
      });
    }

    const total = roundPrice(itemsWithPricing.reduce((sum, i) => sum + i.lineTotal, 0));

    const order = await sequelize.transaction(async (t) => {
      const createdOrder = await Order.create({
        userId,
        guestId,
        customerName: requiredName,
        customerEmail: requiredEmail,
        customerPhone: requiredPhone,
        note,
        total,
        status: 'Pending',
        paymentMethod,
        paymentStatus: 'Unpaid',
        paidAt: null,
      }, { transaction: t });

      for (const item of itemsWithPricing) {
        await OrderItem.create({
          orderId: createdOrder.id,
          menuId: item.menuId,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          lineTotal: item.lineTotal,
        }, { transaction: t });
      }

      await CartItem.destroy({ where: { cartId: cart.id }, transaction: t });
      return createdOrder;
    });

    const fullOrder = await Order.findByPk(order.id, { include: [OrderItem] });
    res.status(201).json(buildOrderResponse(fullOrder));
  } catch (err) {
    next(err);
  }
};

export const getMyOrders = async (req, res, next) => {
  try {
    const userId = req.user?.id || req.userId;
    const orders = await Order.findAll({
      where: { userId },
      include: [OrderItem],
      order: [['createdAt', 'DESC']],
    });
    res.json(orders.map(buildOrderResponse));
  } catch (err) {
    next(err);
  }
};

export const getOrderById = async (req, res, next) => {
  try {
    const order = await Order.findByPk(req.params.id, { include: [OrderItem] });
    if (!order) throw new ErrorResponse('Order not found', 404);

    const isAdmin = req.user?.role === 'Admin';
    const isOwner = order.userId && order.userId === (req.user?.id || req.userId);

    if (!isAdmin && !isOwner) {
      throw new ErrorResponse('Not authorized to view this order', 403);
    }

    res.json(buildOrderResponse(order));
  } catch (err) {
    next(err);
  }
};

export const adminListOrders = async (req, res, next) => {
  try {
    const orders = await Order.findAll({ include: [OrderItem], order: [['createdAt', 'DESC']] });
    res.json(orders.map(buildOrderResponse));
  } catch (err) {
    next(err);
  }
};

export const adminUpdateStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const order = await Order.findByPk(req.params.id);
    if (!order) throw new ErrorResponse('Order not found', 404);

    order.status = status;
    await order.save();

    const withItems = await Order.findByPk(order.id, { include: [OrderItem] });
    res.json(buildOrderResponse(withItems));
  } catch (err) {
    next(err);
  }
};

export const adminUpdatePayment = async (req, res, next) => {
  try {
    const { paymentStatus, paymentMethod, paidAt } = req.body;
    const order = await Order.findByPk(req.params.id);
    if (!order) throw new ErrorResponse('Order not found', 404);

    order.paymentStatus = paymentStatus;
    if (paymentMethod) order.paymentMethod = paymentMethod;
    order.paidAt = paidAt || (paymentStatus === 'Paid' ? new Date() : null);
    await order.save();

    const withItems = await Order.findByPk(order.id, { include: [OrderItem] });
    res.json(buildOrderResponse(withItems));
  } catch (err) {
    next(err);
  }
};

export const userUpdatePayment = async (req, res, next) => {
  try {
    const order = await Order.findByPk(req.params.id);
    if (!order) throw new ErrorResponse('Order not found', 404);

    const isOwner = order.userId && order.userId === (req.user?.id || req.userId);
    if (!isOwner) throw new ErrorResponse('Not authorized to update this order', 403);

    const statusNormalized = order.status?.toLowerCase();
    const paymentStatusNormalized = order.paymentStatus?.toLowerCase();

    if (statusNormalized === 'cancelled') {
      throw new ErrorResponse('Cannot update a cancelled order', 400);
    }

    if (paymentStatusNormalized !== 'unpaid') {
      throw new ErrorResponse('Payment cannot be updated in current state', 400);
    }

    const { paymentMethod } = req.body;
    if (!paymentMethod) {
      throw new ErrorResponse('Payment method is required', 400);
    }

    if (paymentMethod === 'cash') {
      order.paymentMethod = 'cash';
      order.paymentStatus = 'Unpaid';
      order.paidAt = null;
      if (statusNormalized !== 'pending') {
        throw new ErrorResponse('Cash confirmation only available for pending orders', 400);
      }
      order.status = 'Confirmed';
      await order.save();
      const withItems = await Order.findByPk(order.id, { include: [OrderItem] });
      res.json(buildOrderResponse(withItems));
      return;
    }

    if (paymentMethod === 'card' || paymentMethod === 'paypal') {
      throw new ErrorResponse('Use the dedicated payment flow for this method', 400);
    }

    throw new ErrorResponse('Unsupported payment method', 400);
  } catch (err) {
    next(err);
  }
};
