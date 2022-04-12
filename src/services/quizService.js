const { Quizzes } = require("../models");

const getQuizByPK = async (id) => Quizzes.findByPk(id);

module.exports = {
  getQuizByPK,
};
