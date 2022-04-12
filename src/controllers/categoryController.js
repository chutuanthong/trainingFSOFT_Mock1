const Factory = require("./factoryController");
const { Category } = require("../models");

const createCategory = Factory.createOne(Category);

const getCategories = Factory.getAll(Category, ["categoryName"], ["password"]);

const getCategory = Factory.getOne(Category);

const updateCategory = Factory.updateOne(Category);

const deleteCategory = Factory.deleteOne(Category);

module.exports = {
  createCategory,
  getCategories,
  getCategory,
  updateCategory,
  deleteCategory,
  // getMyProfile,
  // changeContact,
  // changeEmail,
  // changePassword,
  // changeUsername,
  // changeAvatar,
  // getOwnTokens,
};
