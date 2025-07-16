import { DataTypes } from "sequelize";
import sequelize from "../db/index.js";

const User = sequelize.define("User", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  firstName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  lastName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  phone: {
    type: DataTypes.STRING,
    allowNull: false,
  }
  ,
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  role: {
    type: DataTypes.ENUM("User", "Admin"),
    defaultValue: "User",
  },
  resetToken: {
  type: DataTypes.STRING,
  allowNull: true,
  },
  resetTokenExpires: {
  type: DataTypes.DATE,
  allowNull: true,
  },
  
});

export default User;
