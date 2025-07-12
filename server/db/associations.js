// db/associations.js

import User from '../models/User.js';
import Table from '../models/Table.js';
import Reservation from '../models/Reservation.js';

export default function applyAssociations() {
  // User ↔ Reservations
  User.hasMany(Reservation, { foreignKey: 'userId', onDelete: 'CASCADE' });
  Reservation.belongsTo(User, { foreignKey: 'userId' });

  // Table ↔ Reservations
  Table.hasMany(Reservation, { foreignKey: 'tableId', onDelete: 'CASCADE' });
  Reservation.belongsTo(Table, { foreignKey: 'tableId' });
}
