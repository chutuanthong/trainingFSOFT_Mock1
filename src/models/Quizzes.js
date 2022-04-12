const { DataTypes } = require("sequelize");
const now = require("moment");
const sequelize = require("./configDB");
const logger = require("../config/logger");
const { Category } = require("./index");

const Quizzes = sequelize.define("Quizzes", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  level: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  categoryId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  query: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  answer: {
    type: DataTypes.ARRAY(DataTypes.TEXT),
    allowNull: false,
  },
  correctAnswer: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  createdAt: DataTypes.DATE(now()),
  updatedAt: DataTypes.DATE(now()),
});

Category.hasMany(Quizzes, { foreignKey: "categoryId" });
Quizzes.belongsTo(Category, { foreignKey: "categoryId", targetKey: "id" });

sequelize
  .sync({ alter: false })
  .then(() => logger.info("Sync Quizzes Table success!"))
  .catch(() => logger.error("Sync Quizzes Table fail")); // create database table with name 'Quizzes'

module.exports = Quizzes;
