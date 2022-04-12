const { Category } = require("../models");
/**
 * Create an user
 * @param {Object} userBody
 * @returns {Promise<User>}
 */
const findByName = async (categoryName) =>
  Category.findOne({ where: { categoryName } });

module.exports = {
  findByName,
};
