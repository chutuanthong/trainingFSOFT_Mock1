const { DataTypes } = require("sequelize");
const now = require("moment");
const sequelize = require("./configDB");
const logger = require("../config/logger");
const { Users } = require("./index");

const Tokens = sequelize.define("Tokens", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  refreshToken: {
    type: DataTypes.TEXT,
    defaultValue: null,
  },
  expires: {
    type: DataTypes.DATE,
    defaultValue: null,
  },
  forgotPassToken: {
    type: DataTypes.TEXT,
    defaultValue: null,
  },
  verifyEmailToken: {
    type: DataTypes.TEXT,
    defaultValue: null,
  },
  resetPassToken: {
    type: DataTypes.TEXT,
    defaultValue: null,
  },
  deviceId: {
    type: DataTypes.TEXT,
    defaultValue: null,
  },
  createdAt: DataTypes.DATE(now()),
  updatedAt: DataTypes.DATE(now()),
});

Users.hasMany(Tokens, { foreignKey: "userId" });
Tokens.belongsTo(Users, { foreignKey: "userId", targetKey: "id" });

sequelize
  .sync({ alter: false }) // alter to edit DB after run server
  .then(() => logger.info("Sync Tokens Table success!"))
  .catch(() => logger.error("Sync Tokens Table fail")); // create database table with name 'Tokens'

module.exports = Tokens;
