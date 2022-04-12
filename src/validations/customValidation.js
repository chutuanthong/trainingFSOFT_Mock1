// const { statusDelivery }  = require('../config/statusDelivery');
const { categoryService } = require("../services");

// object chi bao gom tu 0-9 a-f A-F va 24 ky tu
const objectId = (value, helpers) => {
  if (!value.match(/^[0-9a-fA-F]{24}$/)) {
    return helpers.message('"{{#label}}" must be a valid mongo id');
  }
  return value;
};

const password = (value, helpers) => {
  if (value.length < 8) {
    return helpers.message("password must be at least 8 characters");
  }
  if (!value.match(/\d/) || !value.match(/[a-zA-Z]/)) {
    return helpers.message(
      "password must contain at least 1 letter and 1 number"
    );
  }
  return value;
};

const numberPhone = (value, helpers) => {
  if (value[0] !== "+" && value.length !== 10) {
    return helpers.message("Must be syntax of number phone");
  }
  if (value.length === 10) {
    const isOnlyNumber = /^\d+$/.test(value);
    if (!isOnlyNumber) {
      return helpers.message("Must be syntax of number phone");
    }
  }
  if (value[0] === "+") {
    //ex. +84855513569
    const strCheck = value.substr(1); //84855513569
    const isOnlyNumber = /^\d+$/.test(strCheck);
    if (!isOnlyNumber) {
      return helpers.message("Must be syntax of number phone");
    }
    if (strCheck.length !== 11) {
      return helpers.message("Must be syntax of number phone");
    }
  }
  return value;
};

const AnswerValidate = (obj, helpers) => {
  const { answer, correctAnswer } = obj;
  if (answer.length !== 4) {
    return helpers.message("answers must contain 4 answer");
  }
  const findDuplicates = answer.filter(
    (item, index) => answer.indexOf(item) !== index
  );

  if (findDuplicates.length !== 0) {
    return helpers.message("answer duplicate");
  }

  const findCorrectAnswer = answer.filter((item) => item === correctAnswer);

  if (findCorrectAnswer.length === 0) {
    return helpers.message("answer must contain correct answer");
  }

  return obj;
};

const CategoriesValidate = async (value, helpers) => {
  const category = await categoryService.findByName(value);
  if (!category) {
    return helpers.message("Can't find this category in database");
  }
  value.categoryId = category.id;
  return value;
};

module.exports = {
  objectId,
  password,
  numberPhone,
  AnswerValidate,
  CategoriesValidate,
};
