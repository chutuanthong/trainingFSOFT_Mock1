const { DataTypes } = require("sequelize");
const now = require("moment");
const sequelize = require("./configDB");
const logger = require("../config/logger");

const Category = sequelize.define("Category", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },

  categoryName: {
    type: DataTypes.TEXT,
    allowNull: false,
    unique: true,
  },
  createdAt: DataTypes.DATE(now()),
  updatedAt: DataTypes.DATE(now()),
});

sequelize
  .sync({ alter: false })
  .then(() => logger.info("Sync Category Table success!"))
  .catch(() => logger.error("Sync Category Table fail")); // create database table with name 'Category'

module.exports = Category;
