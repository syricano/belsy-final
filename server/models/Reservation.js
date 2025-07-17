import { DataTypes } from 'sequelize';
import sequelize from '../db/index.js';
import User from './User.js';
import Table from './Table.js';


const Reservation = sequelize.define('Reservation', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  reservationTime: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  status: {
    type: DataTypes.ENUM('Pending', 'Approved', 'Declined', 'Cancelled'),
    defaultValue: 'Pending',
  },
  note: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  adminResponse: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  userId: {
    type: DataTypes.INTEGER,
    references: {
      model: User,
      key: 'id',
    },
    allowNull: false,
  },
  guestName: {
    type: DataTypes.STRING,
    allowNull: true
  },
  guestPhone: {
  type: DataTypes.STRING,
  allowNull: true
  },
  guestEmail: {
  type: DataTypes.STRING,
  allowNull: true
  }
});

export default Reservation;