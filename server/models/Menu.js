import { DataTypes } from 'sequelize';
import sequelize from '../db/index.js';

const Menu = sequelize.define('Menu', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  nameTranslations: {
    type: DataTypes.JSONB,
    allowNull: true,
    defaultValue: null,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  descriptionTranslations: {
    type: DataTypes.JSONB,
    allowNull: true,
    defaultValue: null,
  },
  price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  image: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  categoryId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
});

export default Menu;
