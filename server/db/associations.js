// db/associations.js

import User from '../models/User.js';
import Table from '../models/Table.js';
import Reservation from '../models/Reservation.js';
import Menu from '../models/Menu.js';
import Category from '../models/Category.js';
import Feedback from '../models/Feedback.js';
import Cart from '../models/Cart.js';
import CartItem from '../models/CartItem.js';
import Order from '../models/Order.js';
import OrderItem from '../models/OrderItem.js';

export default function applyAssociations() {
  // User ↔ Reservations
  User.hasMany(Reservation, { foreignKey: 'userId', onDelete: 'CASCADE' });
  Reservation.belongsTo(User, { foreignKey: 'userId' });

  // Table ↔ Reservations
  Table.hasMany(Reservation, { foreignKey: 'tableId', onDelete: 'CASCADE' });
  Reservation.belongsTo(Table, { foreignKey: 'tableId' });

  // Category ↔ Menu
  Category.hasMany(Menu, { foreignKey: 'categoryId', onDelete: 'SET NULL' });
  Menu.belongsTo(Category, { foreignKey: 'categoryId' });

  // User ↔ Feedback
  User.hasMany(Feedback, { foreignKey: 'userId' , onDelete: 'CASCADE' });
  Feedback.belongsTo(User, { foreignKey: 'userId' });

  // Cart ↔ CartItem
  Cart.hasMany(CartItem, { foreignKey: 'cartId', onDelete: 'CASCADE' });
  CartItem.belongsTo(Cart, { foreignKey: 'cartId' });
  Menu.hasMany(CartItem, { foreignKey: 'menuId', onDelete: 'CASCADE' });
  CartItem.belongsTo(Menu, { foreignKey: 'menuId' });

  // Order ↔ OrderItem
  Order.hasMany(OrderItem, { foreignKey: 'orderId', onDelete: 'CASCADE' });
  OrderItem.belongsTo(Order, { foreignKey: 'orderId' });
  Menu.hasMany(OrderItem, { foreignKey: 'menuId', onDelete: 'SET NULL' });
  OrderItem.belongsTo(Menu, { foreignKey: 'menuId' });
}
