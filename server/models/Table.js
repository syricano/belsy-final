import { DataTypes } from 'sequelize';
import sequelize from '../db/index.js';

const Table = sequelize.define('Table', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  number: {
    type: DataTypes.INTEGER,
    unique: true,
    allowNull: false,
  },
  seats: {
    type: DataTypes.INTEGER,
    defaultValue: 2,
  },
  isAvailable: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
  location: {
    type: DataTypes.ENUM('inRestaurant', 'inHall'),
    allowNull: false,
  },
});

export default Table;
