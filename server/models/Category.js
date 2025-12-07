import { DataTypes } from 'sequelize';
import sequelize from '../db/index.js';

const Category = sequelize.define('Category', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  nameTranslations: {
    type: DataTypes.JSONB,
    allowNull: true,
    defaultValue: null,
  },
});

export default Category;
